// Client-safe booking types, code defaults, and pure helpers. The DB
// (`booking_settings.data`) stores a partial override that getBookingSettings()
// deep-merges over BOOKING_DEFAULTS. If the row is missing/empty or Supabase is
// down, the booking page still renders from these defaults. NO server imports
// here — this file is shared by both the public form and the admin editor.

export type BookingTable = {
  /** Stable id used to match existing bookings to a table. */
  id: string;
  name: string;
  seats: number;
};

/** Weekly opening hours. `open`/`close` are "HH:MM" 24h strings. */
export type BookingDayHours = {
  day: number; // JS getDay(): 0=Sun … 6=Sat
  closed: boolean;
  open: string;
  close: string;
};

export type BookingSettings = {
  /** Master switch — when false the /book page shows a "call us" fallback. */
  enabled: boolean;
  /** IANA timezone the venue runs on; drives "today" and lead-time maths. */
  timezone: string;
  /** Blurb shown at the top of the booking page. */
  intro: string;
  /** The tables that can be reserved, each with its seat capacity. */
  tables: BookingTable[];
  /** Exactly 7 entries (day 0..6). */
  weeklyHours: BookingDayHours[];
  /** Minutes between offered start times, e.g. 30. */
  slotIntervalMinutes: number;
  /** How long a booking holds its table, e.g. 90. Also sets the last seating. */
  turnaroundMinutes: number;
  minPartySize: number;
  maxPartySize: number;
  /** Minimum notice before a booking, in minutes. */
  minLeadMinutes: number;
  /** How many days ahead bookings are accepted. */
  maxAdvanceDays: number;
  requirePhone: boolean;
  requireEmail: boolean;
  /** true → new bookings are "confirmed" instantly; false → "pending" review. */
  autoConfirm: boolean;
  /** Message shown after a successful booking. */
  confirmationNote: string;
};

/** A date-specific override: a full closure, or special hours for that date. */
export type BookingClosure = {
  id: string;
  date: string; // "YYYY-MM-DD"
  is_closed: boolean;
  open_time: string | null; // "HH:MM" when giving special hours
  close_time: string | null;
  note: string | null;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  reference: string;
  booking_date: string; // "YYYY-MM-DD"
  booking_time: string; // "HH:MM[:SS]"
  party_size: number;
  table_id: string | null;
  table_name: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const BOOKING_DEFAULTS: BookingSettings = {
  enabled: true,
  timezone: "Australia/Melbourne",
  intro:
    "Book a table with us. Walk-ins are always welcome too — for groups larger than we seat online, give us a call.",
  tables: [
    { id: "t1", name: "Table 1", seats: 2 },
    { id: "t2", name: "Table 2", seats: 2 },
    { id: "t3", name: "Table 3", seats: 4 },
    { id: "t4", name: "Table 4", seats: 4 },
    { id: "t5", name: "Table 5", seats: 6 },
  ],
  weeklyHours: [
    { day: 0, closed: false, open: "07:00", close: "15:00" },
    { day: 1, closed: false, open: "07:00", close: "15:00" },
    { day: 2, closed: false, open: "07:00", close: "15:00" },
    { day: 3, closed: false, open: "07:00", close: "15:00" },
    { day: 4, closed: false, open: "07:00", close: "15:00" },
    { day: 5, closed: false, open: "07:00", close: "15:00" },
    { day: 6, closed: false, open: "07:00", close: "15:00" },
  ],
  slotIntervalMinutes: 30,
  turnaroundMinutes: 90,
  minPartySize: 1,
  maxPartySize: 10,
  minLeadMinutes: 60,
  maxAdvanceDays: 60,
  requirePhone: true,
  requireEmail: false,
  autoConfirm: true,
  confirmationNote:
    "See you then! Please call us if your plans change. Walk-ins welcome any time during opening hours.",
};

/** Merge a partial DB override over the code defaults. Never throws. */
export function mergeBookingSettings(
  override: Partial<BookingSettings> | null | undefined,
): BookingSettings {
  const o = override ?? {};
  return {
    ...BOOKING_DEFAULTS,
    ...o,
    tables:
      Array.isArray(o.tables) && o.tables.length > 0
        ? o.tables
        : BOOKING_DEFAULTS.tables,
    weeklyHours:
      Array.isArray(o.weeklyHours) && o.weeklyHours.length === 7
        ? o.weeklyHours
        : BOOKING_DEFAULTS.weeklyHours,
  };
}

// --------------------------------------------------------------- time helpers

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Wall-clock parts of `at` in the given IANA timezone. */
function tzParts(tz: string, at: Date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(at)) {
    if (part.type !== "literal") p[part.type] = part.value;
  }
  const h = Number(p.hour) % 24; // some engines render midnight as "24"
  return {
    y: Number(p.year),
    mo: Number(p.month),
    d: Number(p.day),
    h,
    mi: Number(p.minute),
    s: Number(p.second),
  };
}

/** Today's date ("YYYY-MM-DD") in the venue's timezone. */
export function todayISO(tz: string): string {
  const p = tzParts(tz);
  return `${p.y}-${pad(p.mo)}-${pad(p.d)}`;
}

/** Add whole days to a "YYYY-MM-DD" string (UTC maths, so DST-safe). */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d) + days * 86400000);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/**
 * The earliest bookable wall-clock instant, as "YYYY-MM-DD HH:MM:SS" in the
 * venue timezone (now + lead time). Passed to SQL as a plain timestamp so all
 * timezone reasoning stays here in TS.
 */
export function minDateTimeLocal(tz: string, leadMinutes: number): string {
  const p = tzParts(tz);
  // Treat the wall-clock parts as a UTC instant purely to do the arithmetic,
  // then read them back with UTC getters — this keeps it timezone-agnostic.
  const dt = new Date(
    Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) + leadMinutes * 60000,
  );
  return (
    `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())} ` +
    `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:${pad(dt.getUTCSeconds())}`
  );
}

/** Current wall-clock time ("HH:MM") in the venue's timezone. */
export function nowTimeHM(tz: string): string {
  const p = tzParts(tz);
  return `${pad(p.h)}:${pad(p.mi)}`;
}

/** Day of week (0=Sun..6=Sat) for a "YYYY-MM-DD" string, timezone-independent. */
export function isoDayOfWeek(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export type EffectiveHours = {
  closed: boolean;
  open: string; // "HH:MM"
  close: string;
  note?: string | null;
};

/**
 * Resolve the opening window for a specific date: a matching closure wins
 * (either a full closure or special hours), otherwise the weekly schedule.
 */
export function effectiveHoursForDate(
  iso: string,
  settings: BookingSettings,
  closures: BookingClosure[],
): EffectiveHours {
  const c = closures.find((x) => x.date === iso);
  if (c) {
    if (c.is_closed) return { closed: true, open: "", close: "", note: c.note };
    if (c.open_time && c.close_time)
      return { closed: false, open: c.open_time, close: c.close_time, note: c.note };
  }
  const wh = settings.weeklyHours.find((h) => h.day === isoDayOfWeek(iso));
  if (!wh || wh.closed) return { closed: true, open: "", close: "" };
  return { closed: false, open: wh.open, close: wh.close };
}

/** Largest single-table capacity (we don't combine tables online). */
export function maxTableSeats(s: BookingSettings): number {
  return s.tables.reduce((mx, t) => Math.max(mx, t.seats || 0), 0);
}

/** The biggest party the site will actually accept online. */
export function effectiveMaxParty(s: BookingSettings): number {
  const seats = maxTableSeats(s);
  return seats > 0 ? Math.min(s.maxPartySize, seats) : s.maxPartySize;
}

/** "07:00" / "07:00:00" → "7:00 am". */
export function formatTimeLabel(hm: string): string {
  const [hRaw, mRaw] = hm.split(":");
  const h = Number(hRaw);
  const m = Number(mRaw);
  const ampm = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${ampm}`;
}

/** "2026-09-30" → "Wed 30 Sep 2026" (display only). */
export function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
