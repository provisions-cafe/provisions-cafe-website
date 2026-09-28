"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBookingSettings, getClosures } from "@/lib/booking.server";
import { getSettings } from "@/lib/settings.server";
import {
  sendEmail,
  escapeHtml,
  renderEmailShell,
} from "@/lib/email.server";
import {
  addDaysISO,
  effectiveHoursForDate,
  effectiveMaxParty,
  formatDateLabel,
  formatTimeLabel,
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

    // Notify the cafe (and the guest, if they left an email). The booking is
    // already saved — email is best-effort and must never turn success into an
    // error, so failures are swallowed and only logged.
    try {
      await sendBookingEmails({
        reference: res.reference ?? "",
        status: res.status ?? (settings.autoConfirm ? "confirmed" : "pending"),
        tableName: res.tableName ?? null,
        date: b.date,
        time: b.time,
        partySize: b.partySize,
        name: b.name,
        phone: b.phone,
        email: b.email,
        notes: b.notes,
        confirmationNote: settings.confirmationNote,
      });
    } catch (err) {
      console.error("[booking] notification email failed:", err);
    }

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

type BookingEmailData = {
  reference: string;
  status: string;
  tableName: string | null;
  date: string;
  time: string;
  partySize: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  confirmationNote: string;
};

const GUEST_EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Send the cafe a new-booking notification and, when the guest left an email, a
 * confirmation to them. Not exported (so it stays a plain helper, not a server
 * action). Each send is independent via allSettled; sendEmail never throws.
 */
async function sendBookingEmails(b: BookingEmailData): Promise<void> {
  const site = await getSettings();
  const cafeTo = process.env.EMAIL_TO || site.contact.email;
  const dateLabel = formatDateLabel(b.date);
  const timeLabel = formatTimeLabel(b.time);
  const guests = `${b.partySize} ${b.partySize === 1 ? "guest" : "guests"}`;
  const confirmed = b.status === "confirmed";

  const rows: Array<[string, string]> = [
    ["When", `${dateLabel} at ${timeLabel}`],
    ["Party", guests],
    ["Name", b.name],
  ];
  if (b.phone) rows.push(["Phone", b.phone]);
  if (b.email) rows.push(["Email", b.email]);
  if (b.tableName) rows.push(["Table", b.tableName]);
  rows.push(["Status", confirmed ? "Confirmed" : "Pending review"]);
  rows.push(["Reference", b.reference]);

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#8A5F22;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(
          k,
        )}</td><td style="padding:4px 0;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const notesHtml = b.notes
    ? `<p style="margin:18px 0 0;"><strong style="color:#8A5F22;">Notes</strong></p>
       <p style="margin:6px 0 0;white-space:pre-wrap;">${escapeHtml(b.notes)}</p>`
    : "";
  const detailsTable = `<table role="presentation" cellpadding="0" cellspacing="0">${rowsHtml}</table>${notesHtml}`;

  const textLines = rows.map(([k, v]) => `${k}: ${v}`);
  if (b.notes) textLines.push("", `Notes: ${b.notes}`);
  const detailsText = textLines.join("\n");

  const sends: Array<Promise<unknown>> = [];

  // 1) Cafe notification.
  sends.push(
    sendEmail({
      to: cafeTo,
      subject: `New booking - ${b.name}, ${dateLabel} ${timeLabel} (${guests})`,
      html: renderEmailShell({
        heading: confirmed ? "New booking" : "New booking request",
        preheader: `${b.name} · ${dateLabel} ${timeLabel} · ${guests}`,
        bodyHtml: detailsTable,
      }),
      text: `New booking\n\n${detailsText}`,
      replyTo:
        b.email && GUEST_EMAIL_RE.test(b.email) ? b.email : undefined,
    }),
  );

  // 2) Guest confirmation (only when they gave a valid email).
  if (b.email && GUEST_EMAIL_RE.test(b.email)) {
    const intro = confirmed
      ? `Thanks ${escapeHtml(b.name)} — your table is booked. Here are the details:`
      : `Thanks ${escapeHtml(b.name)} — we've received your booking request and will confirm shortly. Here's what you asked for:`;
    sends.push(
      sendEmail({
        to: b.email,
        subject: confirmed
          ? `Your booking at Provisions Cafe - ${dateLabel}`
          : `Booking request received - Provisions Cafe`,
        html: renderEmailShell({
          heading: confirmed ? "You're booked in" : "Request received",
          preheader: `${dateLabel} at ${timeLabel} · ${guests}`,
          bodyHtml: `<p style="margin:0 0 16px;">${intro}</p>${detailsTable}
            <p style="margin:18px 0 0;color:#55433A;">${escapeHtml(b.confirmationNote)}</p>`,
        }),
        text: `${confirmed ? "You're booked in" : "Request received"}\n\n${detailsText}\n\n${b.confirmationNote}`,
        replyTo: cafeTo,
      }),
    );
  }

  await Promise.allSettled(sends);
}
