"use client";

import { useRouter } from "next/navigation";
import {
  useMemo,
  useState,
  useTransition,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  WEEKDAY_LABELS,
  formatDateLabel,
  formatTimeLabel,
  isoDayOfWeek,
  type Booking,
  type BookingClosure,
  type BookingSettings,
  type BookingStatus,
} from "@/lib/booking";
import {
  COLORS,
  card,
  label,
  input,
  textarea,
  btnPrimary,
  btnGhost,
  btnDanger,
  h2,
} from "../ui";
import {
  deleteBooking,
  deleteClosure,
  getMonthBookings,
  saveClosure,
  setBookingStatus,
  updateBookingSettings,
} from "./actions";

const grid2: CSSProperties = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
};

const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ ...card, marginBottom: 18 }}>
      <h2 style={{ ...h2, marginBottom: 16 }}>{title}</h2>
      {children}
    </section>
  );
}

function Toggle({
  labelText,
  checked,
  onChange,
  hint,
}: {
  labelText: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        fontSize: 14.5,
        color: COLORS.ink,
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, marginTop: 2, flex: "none" }}
      />
      <span>
        <strong style={{ fontWeight: 600 }}>{labelText}</strong>
        {hint ? (
          <span style={{ display: "block", fontSize: 13, color: COLORS.muted }}>
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function NumField({
  labelText,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  labelText: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label style={label}>{labelText}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          style={{ ...input, maxWidth: 120 }}
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix ? (
          <span style={{ fontSize: 13.5, color: COLORS.muted }}>{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<BookingStatus, CSSProperties> = {
  confirmed: { color: COLORS.ok, background: "rgba(78,122,74,.12)" },
  pending: { color: COLORS.gold, background: "rgba(169,118,43,.12)" },
  cancelled: { color: COLORS.danger, background: "rgba(166,54,43,.1)" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      style={{
        ...STATUS_STYLE[status],
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".04em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

function ErrorBar({ text }: { text: string }) {
  return (
    <p
      role="alert"
      style={{
        margin: "0 0 14px",
        padding: "10px 12px",
        fontSize: 14,
        color: COLORS.danger,
        background: "rgba(166,54,43,.08)",
        border: "1px solid rgba(166,54,43,.3)",
        borderRadius: 6,
      }}
    >
      {text}
    </p>
  );
}

export default function BookingsAdminClient({
  initialSettings,
  initialClosures,
  initialBookings,
  initialYear,
  initialMonth,
  today,
}: {
  initialSettings: BookingSettings;
  initialClosures: BookingClosure[];
  initialBookings: Booking[];
  initialYear: number;
  initialMonth: number;
  today: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"calendar" | "settings">("calendar");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(
          [
            ["calendar", "Calendar"],
            ["settings", "Settings"],
          ] as const
        ).map(([key, text]) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                minHeight: 40,
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 14.5,
                fontWeight: 600,
                cursor: "pointer",
                border: active ? "none" : `1.5px solid rgba(30,67,89,.35)`,
                background: active ? COLORS.bay : "transparent",
                color: active ? COLORS.cream : COLORS.bay,
              }}
            >
              {text}
            </button>
          );
        })}
      </div>

      {tab === "calendar" ? (
        <BookingsCalendar
          initialBookings={initialBookings}
          initialYear={initialYear}
          initialMonth={initialMonth}
          today={today}
        />
      ) : (
        <SettingsEditor
          initialSettings={initialSettings}
          initialClosures={initialClosures}
          onChanged={() => router.refresh()}
        />
      )}
    </div>
  );
}

// ============================================================ Booking card

function BookingCard({
  b,
  pending,
  onAct,
}: {
  b: Booking;
  pending: boolean;
  onAct: (fn: () => Promise<{ error?: string }>) => void;
}) {
  return (
    <div style={{ ...card, padding: 16, opacity: b.status === "cancelled" ? 0.6 : 1 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "4px 12px",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>
          {formatTimeLabel(b.booking_time)}
        </span>
        <span style={{ fontSize: 15, color: COLORS.ink }}>
          {b.party_size} {b.party_size === 1 ? "guest" : "guests"}
        </span>
        {b.table_name ? (
          <span style={{ fontSize: 14, color: COLORS.muted }}>· {b.table_name}</span>
        ) : null}
        <span style={{ marginLeft: "auto" }}>
          <StatusBadge status={b.status} />
        </span>
      </div>

      <div style={{ fontSize: 14.5, color: COLORS.ink, lineHeight: 1.5 }}>
        <strong>{b.name}</strong>
        {b.phone ? <> · {b.phone}</> : null}
        {b.email ? <> · {b.email}</> : null}
      </div>
      {b.notes ? (
        <p style={{ margin: "6px 0 0", fontSize: 14, color: COLORS.muted }}>
          “{b.notes}”
        </p>
      ) : null}
      <p style={{ margin: "6px 0 0", fontSize: 12.5, color: COLORS.muted }}>
        Ref {b.reference}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {b.status !== "confirmed" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => onAct(() => setBookingStatus(b.id, "confirmed"))}
            style={{ ...btnPrimary, minHeight: 36, padding: "7px 16px", fontSize: 13.5 }}
          >
            Confirm
          </button>
        )}
        {b.status !== "cancelled" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => onAct(() => setBookingStatus(b.id, "cancelled"))}
            style={{ ...btnGhost, minHeight: 36, padding: "7px 16px", fontSize: 13.5 }}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this booking permanently?"))
              onAct(() => deleteBooking(b.id));
          }}
          style={{ ...btnDanger, minHeight: 36, padding: "7px 16px", fontSize: 13.5 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ============================================================ Calendar

function BookingsCalendar({
  initialBookings,
  initialYear,
  initialMonth,
  today,
}: {
  initialBookings: Booking[];
  initialYear: number;
  initialMonth: number;
  today: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth); // 1-12
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selected, setSelected] = useState<string | null>(
    today.startsWith(`${initialYear}-${pad(initialMonth)}`) ? today : null,
  );

  // Bookings grouped by date, with a non-cancelled count + pending flag per day.
  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const list = map.get(b.booking_date) ?? [];
      list.push(b);
      map.set(b.booking_date, list);
    }
    return map;
  }, [bookings]);

  function loadMonth(y: number, m: number) {
    setError(null);
    startTransition(async () => {
      const res = await getMonthBookings(y, m);
      if (res.error) setError(res.error);
      else setBookings(res.bookings ?? []);
    });
  }

  function go(delta: number) {
    let y = year;
    let m = month + delta;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setYear(y);
    setMonth(m);
    setSelected(today.startsWith(`${y}-${pad(m)}`) ? today : null);
    loadMonth(y, m);
  }

  function act(fn: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) {
        setError(res.error);
        return;
      }
      // Refresh the month currently in view so counts + detail stay in sync.
      const refreshed = await getMonthBookings(year, month);
      if (refreshed.error) setError(refreshed.error);
      else setBookings(refreshed.bookings ?? []);
    });
  }

  // Build the month grid (Monday-first).
  const firstIso = isoOf(year, month, 1);
  const leadingBlanks = (isoDayOfWeek(firstIso) + 6) % 7; // Mon=0 … Sun=6
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => isoOf(year, month, i + 1)),
  ];

  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    "en-AU",
    { month: "long", year: "numeric", timeZone: "UTC" },
  );

  const selectedList = selected ? (byDate.get(selected) ?? []) : [];

  const navBtn: CSSProperties = {
    minHeight: 38,
    minWidth: 40,
    padding: "6px 12px",
    borderRadius: 999,
    border: `1.5px solid rgba(30,67,89,.35)`,
    background: "transparent",
    color: COLORS.bay,
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
    lineHeight: 1,
  };

  return (
    <div>
      {error && <ErrorBar text={error} />}

      <div style={card}>
        {/* Month header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <button type="button" onClick={() => go(-1)} style={navBtn} aria-label="Previous month">
            ‹
          </button>
          <h2 style={{ ...h2, opacity: pending ? 0.5 : 1 }}>{monthLabel}</h2>
          <button type="button" onClick={() => go(1)} style={navBtn} aria-label="Next month">
            ›
          </button>
        </div>

        {/* Weekday labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 6,
            marginBottom: 6,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                color: COLORS.muted,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 6,
          }}
        >
          {cells.map((iso, idx) => {
            if (!iso) return <div key={`b${idx}`} />;
            const day = Number(iso.slice(8, 10));
            const list = byDate.get(iso) ?? [];
            const active = list.filter((b) => b.status !== "cancelled");
            const count = active.length;
            const anyPending = active.some((b) => b.status === "pending");
            const isToday = iso === today;
            const isSelected = iso === selected;

            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                style={{
                  position: "relative",
                  minHeight: 62,
                  padding: "6px 6px 8px",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 8,
                  border: isSelected
                    ? `2px solid ${COLORS.bay}`
                    : `1px solid ${COLORS.line}`,
                  background: isToday ? "rgba(30,67,89,.06)" : COLORS.paper,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? COLORS.cream : COLORS.ink,
                    background: isToday ? COLORS.bay : "transparent",
                  }}
                >
                  {day}
                </span>
                {count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: 6,
                      bottom: 6,
                      minWidth: 20,
                      height: 20,
                      padding: "0 6px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORS.cream,
                      background: anyPending ? COLORS.gold : COLORS.bay,
                    }}
                    title={`${count} booking${count === 1 ? "" : "s"}${anyPending ? " (some pending)" : ""}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      <div style={{ marginTop: 20 }}>
        {selected ? (
          <>
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.bay,
              }}
            >
              {formatDateLabel(selected)}
            </h3>
            {selectedList.length === 0 ? (
              <div style={card}>
                <p style={{ margin: 0, fontSize: 15, color: COLORS.muted }}>
                  No bookings this day.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {selectedList.map((b) => (
                  <BookingCard key={b.id} b={b} pending={pending} onAct={act} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={card}>
            <p style={{ margin: 0, fontSize: 15, color: COLORS.muted }}>
              Pick a day above to see its bookings. Days with a badge have
              reservations (gold = some still pending).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================ Settings editor

function SettingsEditor({
  initialSettings,
  initialClosures,
  onChanged,
}: {
  initialSettings: BookingSettings;
  initialClosures: BookingClosure[];
  onChanged: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [s, setS] = useState<BookingSettings>(initialSettings);

  const set = <K extends keyof BookingSettings>(k: K, v: BookingSettings[K]) =>
    setS((p) => ({ ...p, [k]: v }));

  // ---- tables
  const setTable = (i: number, k: "name" | "seats", v: string | number) =>
    setS((p) => ({
      ...p,
      tables: p.tables.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)),
    }));
  const addTable = () =>
    setS((p) => ({
      ...p,
      tables: [
        ...p.tables,
        {
          id: `t-${Math.random().toString(36).slice(2, 8)}`,
          name: `Table ${p.tables.length + 1}`,
          seats: 2,
        },
      ],
    }));
  const removeTable = (i: number) =>
    setS((p) => ({ ...p, tables: p.tables.filter((_, idx) => idx !== i) }));

  // ---- weekly hours
  const setHour = (
    i: number,
    k: "open" | "close" | "closed",
    v: string | boolean,
  ) =>
    setS((p) => ({
      ...p,
      weeklyHours: p.weeklyHours.map((h, idx) =>
        idx === i ? { ...h, [k]: v } : h,
      ),
    }));

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateBookingSettings(s);
      if (res?.error) setError(res.error);
      else {
        setSaved(true);
        onChanged();
      }
    });
  }

  return (
    <div>
      <Section title="Online booking">
        <div style={{ display: "grid", gap: 14 }}>
          <Toggle
            labelText="Accept bookings online"
            checked={s.enabled}
            onChange={(v) => set("enabled", v)}
            hint="Turn off to show a 'call us' message on the booking page instead."
          />
          <Toggle
            labelText="Auto-confirm bookings"
            checked={s.autoConfirm}
            onChange={(v) => set("autoConfirm", v)}
            hint="On: guests are booked instantly. Off: bookings arrive as 'pending' for you to confirm."
          />
          <div>
            <label style={label}>Intro text (shown on the booking page)</label>
            <textarea
              style={textarea}
              value={s.intro}
              onChange={(e) => set("intro", e.target.value)}
            />
          </div>
          <div>
            <label style={label}>Confirmation message (shown after booking)</label>
            <textarea
              style={textarea}
              value={s.confirmationNote}
              onChange={(e) => set("confirmationNote", e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title="Tables">
        <p style={{ margin: "0 0 14px", fontSize: 14, color: COLORS.muted }}>
          Add each bookable table and how many it seats. A party is given the
          smallest free table that fits — bigger groups are pointed to the phone.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {s.tables.map((t, i) => (
            <div
              key={t.id}
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}
            >
              <input
                style={{ ...input, flex: "1 1 180px" }}
                value={t.name}
                placeholder="Table name"
                onChange={(e) => setTable(i, "name", e.target.value)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  style={{ ...input, width: 90 }}
                  type="number"
                  min={1}
                  value={t.seats}
                  onChange={(e) => setTable(i, "seats", Number(e.target.value))}
                />
                <span style={{ fontSize: 13.5, color: COLORS.muted }}>seats</span>
              </div>
              <button
                type="button"
                onClick={() => removeTable(i)}
                style={{ ...btnDanger, minHeight: 40, padding: "7px 14px", fontSize: 13.5 }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTable}
          style={{ ...btnGhost, marginTop: 14, minHeight: 40, padding: "8px 18px", fontSize: 14 }}
        >
          + Add table
        </button>
      </Section>

      <Section title="Opening hours">
        <p style={{ margin: "0 0 14px", fontSize: 14, color: COLORS.muted }}>
          The days and times tables can be booked. Untick a day to close it, or
          use “Special dates” below for one-off changes.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {s.weeklyHours.map((h, i) => (
            <div
              key={h.day}
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}
            >
              <span
                style={{ flex: "0 0 96px", fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}
              >
                {WEEKDAY_LABELS[h.day]}
              </span>
              <label
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.ink }}
              >
                <input
                  type="checkbox"
                  checked={!h.closed}
                  onChange={(e) => setHour(i, "closed", !e.target.checked)}
                  style={{ width: 17, height: 17 }}
                />
                Open
              </label>
              <input
                type="time"
                value={h.open}
                disabled={h.closed}
                onChange={(e) => setHour(i, "open", e.target.value)}
                style={{ ...input, width: 130, opacity: h.closed ? 0.5 : 1 }}
              />
              <span style={{ color: COLORS.muted }}>to</span>
              <input
                type="time"
                value={h.close}
                disabled={h.closed}
                onChange={(e) => setHour(i, "close", e.target.value)}
                style={{ ...input, width: 130, opacity: h.closed ? 0.5 : 1 }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Booking rules">
        <div style={grid2}>
          <NumField
            labelText="Time between slots"
            value={s.slotIntervalMinutes}
            onChange={(v) => set("slotIntervalMinutes", v)}
            min={5}
            suffix="min"
          />
          <NumField
            labelText="Table held for"
            value={s.turnaroundMinutes}
            onChange={(v) => set("turnaroundMinutes", v)}
            min={15}
            suffix="min"
          />
          <NumField
            labelText="Smallest party"
            value={s.minPartySize}
            onChange={(v) => set("minPartySize", v)}
            min={1}
            suffix="guests"
          />
          <NumField
            labelText="Largest party (online)"
            value={s.maxPartySize}
            onChange={(v) => set("maxPartySize", v)}
            min={1}
            suffix="guests"
          />
          <NumField
            labelText="Minimum notice"
            value={s.minLeadMinutes}
            onChange={(v) => set("minLeadMinutes", v)}
            min={0}
            suffix="min"
          />
          <NumField
            labelText="Book up to"
            value={s.maxAdvanceDays}
            onChange={(v) => set("maxAdvanceDays", v)}
            min={1}
            suffix="days ahead"
          />
          <div>
            <label style={label}>Timezone</label>
            <input
              style={input}
              value={s.timezone}
              onChange={(e) => set("timezone", e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 16 }}>
          <Toggle
            labelText="Require a phone number"
            checked={s.requirePhone}
            onChange={(v) => set("requirePhone", v)}
          />
          <Toggle
            labelText="Require an email address"
            checked={s.requireEmail}
            onChange={(v) => set("requireEmail", v)}
          />
        </div>
      </Section>

      {error && <ErrorBar text={error} />}

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
        <button
          style={{ ...btnPrimary, opacity: pending ? 0.6 : 1 }}
          disabled={pending}
          onClick={save}
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
        {saved && !pending && (
          <span style={{ fontSize: 14, color: COLORS.ok, fontWeight: 600 }}>
            Saved ✓
          </span>
        )}
      </div>

      <ClosuresEditor initialClosures={initialClosures} onChanged={onChanged} />
    </div>
  );
}

// ============================================================ Closures editor

function ClosuresEditor({
  initialClosures,
  onChanged,
}: {
  initialClosures: BookingClosure[];
  onChanged: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [mode, setMode] = useState<"closed" | "hours">("closed");
  const [open, setOpen] = useState("07:00");
  const [close, setClose] = useState("15:00");
  const [note, setNote] = useState("");

  function act(fn: () => Promise<{ error?: string }>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) setError(res.error);
      else {
        after?.();
        onChanged();
      }
    });
  }

  function add() {
    if (!date) {
      setError("Pick a date first.");
      return;
    }
    act(
      () =>
        saveClosure({
          date,
          is_closed: mode === "closed",
          open_time: mode === "hours" ? open : null,
          close_time: mode === "hours" ? close : null,
          note: note.trim() || null,
        }),
      () => {
        setDate("");
        setNote("");
      },
    );
  }

  return (
    <Section title="Special dates">
      <p style={{ margin: "0 0 16px", fontSize: 14, color: COLORS.muted }}>
        Override a single date — close entirely (e.g. a public holiday) or run
        special hours. These beat the weekly schedule.
      </p>

      {initialClosures.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {initialClosures.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                border: `1px solid ${COLORS.line}`,
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>
                {formatDateLabel(c.date)}
              </span>
              <span style={{ fontSize: 14, color: COLORS.muted }}>
                {c.is_closed
                  ? "Closed all day"
                  : `Open ${formatTimeLabel(c.open_time ?? "")} – ${formatTimeLabel(c.close_time ?? "")}`}
                {c.note ? ` · ${c.note}` : ""}
              </span>
              <button
                type="button"
                disabled={pending}
                onClick={() => act(() => deleteClosure(c.id))}
                style={{
                  ...btnDanger,
                  marginLeft: "auto",
                  minHeight: 34,
                  padding: "5px 14px",
                  fontSize: 13,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        <div style={grid2}>
          <div>
            <label style={label}>Date</label>
            <input
              type="date"
              style={input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label style={label}>What happens</label>
            <select
              style={input}
              value={mode}
              onChange={(e) => setMode(e.target.value as "closed" | "hours")}
            >
              <option value="closed">Closed all day</option>
              <option value="hours">Special hours</option>
            </select>
          </div>
        </div>

        {mode === "hours" && (
          <div style={grid2}>
            <div>
              <label style={label}>Open</label>
              <input
                type="time"
                style={input}
                value={open}
                onChange={(e) => setOpen(e.target.value)}
              />
            </div>
            <div>
              <label style={label}>Close</label>
              <input
                type="time"
                style={input}
                value={close}
                onChange={(e) => setClose(e.target.value)}
              />
            </div>
          </div>
        )}

        <div>
          <label style={label}>Note (optional)</label>
          <input
            style={input}
            value={note}
            placeholder="e.g. Christmas Day, Private event"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {error && <ErrorBar text={error} />}

        <button
          type="button"
          onClick={add}
          disabled={pending}
          style={{ ...btnPrimary, justifySelf: "start", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Saving…" : "Add special date"}
        </button>
      </div>
    </Section>
  );
}
