"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";
import type { Booking, BookingSettings } from "@/lib/booking";

export type ActionResult = { error?: string; ok?: boolean };

function revalidateBookings() {
  revalidatePath("/admin/bookings");
  revalidatePath("/book");
}

/** Server client, but only when there's an authenticated user (defence over RLS). */
async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function firstError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Invalid input";
}

const HM_RE = /^\d{2}:\d{2}$/;

// ------------------------------------------------------------------- settings

const tableSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Every table needs a name"),
  seats: z.coerce.number().int().min(1, "Seats must be at least 1").max(100),
});

const dayHoursSchema = z.object({
  day: z.coerce.number().int().min(0).max(6),
  closed: z.boolean(),
  open: z.string().regex(HM_RE, "Open time must be HH:MM"),
  close: z.string().regex(HM_RE, "Close time must be HH:MM"),
});

const settingsSchema = z
  .object({
    enabled: z.boolean(),
    timezone: z.string().trim().min(1, "Timezone is required"),
    intro: z.string().trim().max(600),
    tables: z.array(tableSchema).min(1, "Add at least one table").max(60),
    weeklyHours: z.array(dayHoursSchema).length(7, "Expected 7 days of hours"),
    slotIntervalMinutes: z.coerce.number().int().min(5).max(240),
    turnaroundMinutes: z.coerce.number().int().min(15).max(480),
    minPartySize: z.coerce.number().int().min(1).max(50),
    maxPartySize: z.coerce.number().int().min(1).max(100),
    minLeadMinutes: z.coerce.number().int().min(0).max(20160),
    maxAdvanceDays: z.coerce.number().int().min(1).max(365),
    requirePhone: z.boolean(),
    requireEmail: z.boolean(),
    autoConfirm: z.boolean(),
    confirmationNote: z.string().trim().max(600),
  })
  .refine((s) => s.maxPartySize >= s.minPartySize, {
    message: "Max party size must be at least the minimum",
  })
  .refine(
    (s) => new Set(s.tables.map((t) => t.id)).size === s.tables.length,
    { message: "Table ids must be unique" },
  );

export async function updateBookingSettings(
  input: BookingSettings,
): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("booking_settings")
    .upsert({ id: 1, data: parsed.data }, { onConflict: "id" });
  if (error) return { error: error.message };

  await logActivity("update", "booking_settings", "Updated booking settings");
  revalidateBookings();
  return { ok: true };
}

// ------------------------------------------------------------------- closures

const closureSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    is_closed: z.boolean(),
    open_time: z.string().regex(HM_RE).nullable().optional(),
    close_time: z.string().regex(HM_RE).nullable().optional(),
    note: z.string().trim().max(200).nullable().optional(),
  })
  .refine((c) => c.is_closed || (c.open_time && c.close_time), {
    message: "Special hours need both an open and close time",
  });

export async function saveClosure(input: unknown): Promise<ActionResult> {
  const parsed = closureSchema.safeParse(input);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const row = {
    date: parsed.data.date,
    is_closed: parsed.data.is_closed,
    open_time: parsed.data.is_closed ? null : (parsed.data.open_time ?? null),
    close_time: parsed.data.is_closed ? null : (parsed.data.close_time ?? null),
    note: parsed.data.note ?? null,
  };

  // One override per date — upsert keyed on the unique date column.
  const { error } = await supabase
    .from("booking_closures")
    .upsert(row, { onConflict: "date" });
  if (error) return { error: error.message };

  await logActivity("update", "booking_closures", `Date override: ${row.date}`);
  revalidateBookings();
  return { ok: true };
}

export async function deleteClosure(id: string): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase.from("booking_closures").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity("delete", "booking_closures", "Removed date override", id);
  revalidateBookings();
  return { ok: true };
}

// ------------------------------------------------------------------- bookings

/** All bookings in a calendar month (1-12), for the admin calendar view. */
export async function getMonthBookings(
  year: number,
  month: number,
): Promise<{ bookings?: Booking[]; error?: string }> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const y = Math.floor(year);
  const m = Math.floor(month);
  if (!Number.isFinite(y) || m < 1 || m > 12) return { error: "Invalid month" };

  const pad = (n: number) => String(n).padStart(2, "0");
  const from = `${y}-${pad(m)}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const to = `${y}-${pad(m)}-${pad(lastDay)}`;

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("booking_date", from)
    .lte("booking_date", to)
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });
  if (error) return { error: error.message };

  return { bookings: (data ?? []) as Booking[] };
}

const statusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export async function setBookingStatus(
  id: string,
  status: z.infer<typeof statusSchema>,
): Promise<ActionResult> {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: "Invalid status" };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "bookings", `Status → ${parsed.data}`, id);
  revalidateBookings();
  return { ok: true };
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity("delete", "bookings", "Deleted booking", id);
  revalidateBookings();
  return { ok: true };
}
