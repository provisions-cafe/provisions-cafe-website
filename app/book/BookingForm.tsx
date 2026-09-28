"use client";

import { useState, useTransition, type CSSProperties } from "react";
import {
  addDaysISO,
  effectiveHoursForDate,
  effectiveMaxParty,
  formatDateLabel,
  formatTimeLabel,
  todayISO,
  type BookingClosure,
  type BookingSettings,
} from "@/lib/booking";
import { createBooking, getAvailability, type CreateResult } from "./actions";

// Public-site palette (cream / bay / gold), matching EnquiryForm & the pages.
const BAY = "#1E4359";
const CREAM = "#FBF7EF";
const PAPER = "#FFFFFF";
const INK = "#3A2B22";
const MUTED = "#6B564A";
const GOLD = "#A9762B";
const LINE = "rgba(58,43,34,.16)";
const DANGER = "#A6362B";
const OK = "#4E7A4A";

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: ".04em",
  textTransform: "uppercase",
  color: GOLD,
  marginBottom: 7,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  fontSize: 16,
  color: INK,
  background: CREAM,
  border: `1px solid ${LINE}`,
  borderRadius: 6,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const stepLabel: CSSProperties = {
  fontFamily: "Petrona, Georgia, serif",
  fontSize: 20,
  fontWeight: 500,
  color: BAY,
  margin: "0 0 12px",
};

function pill(active: boolean, disabled = false): CSSProperties {
  return {
    minHeight: 44,
    padding: "9px 16px",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    border: active ? "none" : `1.5px solid rgba(30,67,89,.35)`,
    background: active ? BAY : "transparent",
    color: active ? CREAM : BAY,
    opacity: disabled ? 0.5 : 1,
    transition: "background .15s ease, color .15s ease",
  };
}

export default function BookingForm({
  settings,
  closures,
}: {
  settings: BookingSettings;
  closures: BookingClosure[];
}) {
  const maxParty = effectiveMaxParty(settings);
  const today = todayISO(settings.timezone);
  const maxDate = addDaysISO(today, settings.maxAdvanceDays);

  const [pending, startTransition] = useTransition();

  const [party, setParty] = useState<number>(
    Math.min(2, maxParty) || settings.minPartySize,
  );
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsMsg, setSlotsMsg] = useState<string | null>(null);
  const [time, setTime] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<CreateResult | null>(null);

  const partyOptions = Array.from(
    { length: Math.max(0, maxParty - settings.minPartySize + 1) },
    (_, i) => settings.minPartySize + i,
  );

  function loadSlots(nextDate: string, nextParty: number) {
    setTime("");
    setSlots(null);
    setSlotsMsg(null);
    setError(null);
    if (!nextDate) return;

    const eff = effectiveHoursForDate(nextDate, settings, closures);
    if (eff.closed) {
      setSlotsMsg("We're closed that day — please pick another date.");
      return;
    }

    startTransition(async () => {
      const res = await getAvailability(nextDate, nextParty);
      if (res.error) {
        setSlotsMsg(res.error);
        return;
      }
      if (res.closed) {
        setSlotsMsg("We're closed that day — please pick another date.");
        return;
      }
      const found = res.slots ?? [];
      setSlots(found);
      if (found.length === 0) {
        setSlotsMsg(
          "No tables free for that day and party size. Try another date, or call us.",
        );
      }
    });
  }

  function onParty(next: number) {
    setParty(next);
    if (date) loadSlots(date, next);
  }

  function onDate(next: string) {
    setDate(next);
    loadSlots(next, party);
  }

  function submit() {
    setError(null);
    if (!date || !time) {
      setError("Please choose a date and time.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter a name for the booking.");
      return;
    }
    if (settings.requirePhone && !phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }
    if (settings.requireEmail && !email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    startTransition(async () => {
      const res = await createBooking({
        date,
        time,
        partySize: party,
        name,
        phone,
        email,
        notes,
      });
      if (res.error) {
        setError(res.error);
        // The slot may have just been taken — refresh availability.
        if (date) loadSlots(date, party);
        return;
      }
      setDone(res);
    });
  }

  // ---- Success screen -------------------------------------------------------
  if (done?.ok) {
    const pendingReview = done.status === "pending";
    return (
      <div
        style={{
          background: PAPER,
          border: `1px solid ${LINE}`,
          borderRadius: 10,
          padding: "clamp(24px, 4vw, 40px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 40,
            lineHeight: 1,
            marginBottom: 12,
            color: pendingReview ? GOLD : OK,
          }}
          aria-hidden="true"
        >
          {pendingReview ? "✽" : "✓"}
        </div>
        <h2 style={{ ...stepLabel, fontSize: 26, margin: "0 0 10px" }}>
          {pendingReview ? "Request received" : "You're booked in"}
        </h2>
        <p style={{ margin: "0 auto 6px", maxWidth: "44ch", fontSize: 16, lineHeight: 1.55, color: INK }}>
          {formatDateLabel(date)} at {formatTimeLabel(time)} · {party}{" "}
          {party === 1 ? "guest" : "guests"}
        </p>
        <p style={{ margin: "0 0 18px", fontSize: 14.5, color: MUTED }}>
          Reference <strong style={{ color: BAY }}>{done.reference}</strong>
          {pendingReview
            ? " — we'll be in touch to confirm."
            : done.tableName
              ? ` · ${done.tableName}`
              : ""}
        </p>
        <p style={{ margin: "0 auto 22px", maxWidth: "48ch", fontSize: 15, lineHeight: 1.6, color: MUTED }}>
          {settings.confirmationNote}
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(null);
            setTime("");
            setName("");
            setPhone("");
            setEmail("");
            setNotes("");
            setSlots(null);
            setSlotsMsg(null);
            setDate("");
          }}
          className="hv-bay"
          style={{
            minHeight: 48,
            padding: "12px 24px",
            border: "none",
            borderRadius: 999,
            background: BAY,
            color: CREAM,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Make another booking
        </button>
      </div>
    );
  }

  // ---- Booking flow ---------------------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gap: 26,
        background: PAPER,
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        padding: "clamp(20px, 4vw, 36px)",
      }}
    >
      {/* Step 1 — party size */}
      <div>
        <p style={stepLabel}>How many guests?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {partyOptions.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onParty(n)}
              style={pill(party === n)}
              aria-pressed={party === n}
            >
              {n}
            </button>
          ))}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 13.5, color: MUTED }}>
          Larger group? Give us a call or use the{" "}
          <a href="/functions" style={{ color: GOLD, fontWeight: 600 }}>
            functions
          </a>{" "}
          page.
        </p>
      </div>

      {/* Step 2 — date */}
      <div>
        <p style={stepLabel}>Which day?</p>
        <label style={labelStyle} htmlFor="booking-date">
          Date
        </label>
        <input
          id="booking-date"
          type="date"
          value={date}
          min={today}
          max={maxDate}
          onChange={(e) => onDate(e.target.value)}
          style={{ ...inputStyle, maxWidth: 260 }}
        />
      </div>

      {/* Step 3 — time */}
      {date && (
        <div>
          <p style={stepLabel}>Pick a time</p>
          {pending && slots === null ? (
            <p style={{ margin: 0, fontSize: 15, color: MUTED }}>
              Checking availability…
            </p>
          ) : slotsMsg ? (
            <p style={{ margin: 0, fontSize: 15, color: MUTED }}>{slotsMsg}</p>
          ) : slots && slots.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setTime(s);
                    setError(null);
                  }}
                  style={pill(time === s)}
                  aria-pressed={time === s}
                >
                  {formatTimeLabel(s)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Step 4 — details */}
      {time && (
        <div style={{ display: "grid", gap: 16 }}>
          <p style={stepLabel}>Your details</p>
          <div>
            <label style={labelStyle} htmlFor="booking-name">
              Name
            </label>
            <input
              id="booking-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              style={inputStyle}
            />
          </div>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            <div>
              <label style={labelStyle} htmlFor="booking-phone">
                Phone{settings.requirePhone ? "" : " (optional)"}
              </label>
              <input
                id="booking-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="booking-email">
                Email{settings.requireEmail ? "" : " (optional)"}
              </label>
              <input
                id="booking-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle} htmlFor="booking-notes">
              Anything we should know? (optional)
            </label>
            <textarea
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="High chair, accessibility, a birthday…"
              style={{ ...inputStyle, minHeight: 88, lineHeight: 1.5, resize: "vertical" }}
            />
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: 6,
              background: CREAM,
              fontSize: 14.5,
              color: INK,
            }}
          >
            <strong>{formatDateLabel(date)}</strong> at{" "}
            <strong>{formatTimeLabel(time)}</strong> for{" "}
            <strong>
              {party} {party === 1 ? "guest" : "guests"}
            </strong>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          style={{
            margin: 0,
            padding: "11px 13px",
            fontSize: 14.5,
            color: DANGER,
            background: "rgba(166,54,43,.08)",
            border: "1px solid rgba(166,54,43,.3)",
            borderRadius: 6,
          }}
        >
          {error}
        </p>
      )}

      {time && (
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="hv-bay"
          style={{
            minHeight: 52,
            padding: "14px 26px",
            border: "none",
            borderRadius: 999,
            background: BAY,
            color: CREAM,
            fontFamily: "Karla, sans-serif",
            fontSize: 16.5,
            fontWeight: 600,
            cursor: pending ? "default" : "pointer",
            opacity: pending ? 0.65 : 1,
            justifySelf: "start",
          }}
        >
          {pending
            ? "Booking…"
            : settings.autoConfirm
              ? "Confirm booking"
              : "Request booking"}
        </button>
      )}
    </div>
  );
}
