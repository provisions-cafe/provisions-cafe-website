"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBookingSettings, getClosures } from "@/lib/booking.server";
import {
  addDaysISO,
  effectiveHoursForDate,
  effectiveMaxParty,
  minDateTimeLocal,
  todayISO,
} from "@/lib/booking";

export type AvailabilityResult = {
  slots?: string[];
  closed?: boolean;
  error?: string;
};

export type CreateResult = {
  ok?: boolean;
  reference?: string;
  status?: string;
  tableName?: string | null;
  error?: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/**
 * Available start times for a party on a date. Runs the constrained
 * `booking_availability` RPC (SECURITY DEFINER) so we never expose the bookings
 * table to anonymous visitors.
 */
export async function getAvailability(
  dateISO: string,
  partySize: number,
): Promise<AvailabilityResult> {
  if (!DATE_RE.test(dateISO)) return { error: "Please choose a valid date." };

  const settings = await getBookingSettings();
  if (!settings.enabled) return { error: "Online booking is currently closed." };

  const party = Math.floor(Number(partySize));
  const maxParty = effectiveMaxParty(settings);
  if (!Number.isFinite(party) || party < settings.minPartySize) {
    return { error: "Please choose a valid party size." };
  }
  if (party > maxParty) {
    return { error: `We seat up to ${maxParty} online — please call us for larger groups.` };
  }

  const today = todayISO(settings.timezone);
  if (dateISO < today) return { slots: [] };
  if (dateISO > addDaysISO(today, settings.maxAdvanceDays)) {
    return { error: "That date is too far ahead." };
  }

  const closures = await getClosures(dateISO);
  const eff = effectiveHoursForDate(dateISO, settings, closures);
  if (eff.closed) return { closed: true, slots: [] };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("booking_availability", {
      p_date: dateISO,
      p_party: party,
      p_tables: settings.tables,
      p_open: eff.open,
      p_close: eff.close,
      p_slot: settings.slotIntervalMinutes,
      p_turnaround: settings.turnaroundMinutes,
      p_min_datetime: minDateTimeLocal(settings.timezone, settings.minLeadMinutes),
    });
    if (error) return { error: "Couldn't load available times — please try again." };
    return { slots: (data ?? []) as string[] };
  } catch {
    return { error: "Couldn't load available times — please try again." };
  }
}

const createSchema = z.object({
  date: z.string().regex(DATE_RE, "Please choose a valid date."),
  time: z.string().regex(TIME_RE, "Please choose a time."),
  partySize: z.coerce.number().int().min(1).max(50),
  name: z.string().trim().min(1, "Please enter a name.").max(120),
  phone: z.string().trim().max(40).optional().default(""),
  email: z.string().trim().max(160).optional().default(""),
  notes: z.string().trim().max(600).optional().default(""),
});

export type CreateBookingInput = z.input<typeof createSchema>;

/**
 * Create a booking. Re-validates everything server-side, then hands off to the
 * `create_booking` RPC which allocates a table + inserts atomically under an
 * advisory lock (race-safe against double-booking the last table).
 */
export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateResult> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const b = parsed.data;

  const settings = await getBookingSettings();
  if (!settings.enabled) return { error: "Online booking is currently closed." };

  if (settings.requirePhone && !b.phone) {
    return { error: "A phone number is required." };
  }
  if (settings.requireEmail && !b.email) {
    return { error: "An email address is required." };
  }
  if (b.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email)) {
    return { error: "That email address doesn't look right." };
  }

  const maxParty = effectiveMaxParty(settings);
  if (b.partySize < settings.minPartySize || b.partySize > maxParty) {
    return {
      error: `Party size must be between ${settings.minPartySize} and ${maxParty}.`,
    };
  }

  const today = todayISO(settings.timezone);
  const maxDate = addDaysISO(today, settings.maxAdvanceDays);
  if (b.date < today || b.date > maxDate) {
    return { error: "Please choose a valid date." };
  }

  const closures = await getClosures(b.date);
  const eff = effectiveHoursForDate(b.date, settings, closures);
  if (eff.closed) return { error: "We're closed that day — please pick another." };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_booking", {
      p_date: b.date,
      p_time: b.time,
      p_party: b.partySize,
      p_name: b.name,
      p_phone: b.phone,
      p_email: b.email,
      p_notes: b.notes,
      p_tables: settings.tables,
      p_open: eff.open,
      p_close: eff.close,
      p_slot: settings.slotIntervalMinutes,
      p_turnaround: settings.turnaroundMinutes,
      p_min_datetime: minDateTimeLocal(settings.timezone, settings.minLeadMinutes),
      p_max_date: maxDate,
      p_auto_confirm: settings.autoConfirm,
    });
    if (error) {
      return { error: "Something went wrong — please try again, or call us." };
    }

    const res = (data ?? {}) as CreateResult;
    if (res.error) return { error: res.error };

    // Surface the new booking in the admin list on next load.
    revalidatePath("/admin/bookings");
    return {
      ok: true,
      reference: res.reference,
      status: res.status,
      tableName: res.tableName ?? null,
    };
  } catch {
    return { error: "Something went wrong — please try again, or call us." };
  }
}
