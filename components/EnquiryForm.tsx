"use client";

import { useState, useTransition, type CSSProperties } from "react";
import { sendEnquiry } from "./enquiry-actions";

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 14.5,
  fontWeight: 600,
  color: "#55433A",
};

/**
 * Enquiry form shared by the Functions and Contact pages. Submits through the
 * `sendEnquiry` server action, which emails the cafe via Resend. If sending
 * fails (or email isn't configured), it falls back to a pre-addressed mailto:
 * so an enquiry can always reach the cafe, alongside the phone option.
 */
export default function EnquiryForm({
  variant,
  email,
  phone,
}: {
  variant: "functions" | "contact";
  email: string;
  phone: string;
}) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formBg = variant === "functions" ? "#FBF7EF" : "#F7F1E6";
  const inputBg = variant === "functions" ? "#F7F1E6" : "#FBF7EF";

  const inputStyle: CSSProperties = {
    minHeight: 46,
    padding: "11px 13px",
    border: "1px solid rgba(58,43,34,.25)",
    borderRadius: 4,
    background: inputBg,
    fontSize: 16,
    fontWeight: 400,
    color: "#3A2B22",
  };

  // Build a mailto: fallback from the current field values, so a failed send
  // still gives the visitor a one-tap way to reach us.
  function mailtoFallback(fd: FormData): string {
    const name = String(fd.get("name") ?? "").trim();
    const contact = String(fd.get("contact") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();
    const lines = [`Name: ${name}`, `Phone or email: ${contact}`];
    if (variant === "functions") {
      const date = String(fd.get("date") ?? "").trim();
      const people = String(fd.get("people") ?? "").trim();
      if (date) lines.push(`Date: ${date}`);
      if (people) lines.push(`People: ${people}`);
    }
    if (notes) lines.push("", notes);
    const subject =
      variant === "functions"
        ? `Functions enquiry${name ? ` — ${name}` : ""}`
        : `Enquiry${name ? ` — ${name}` : ""}`;
    return `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  if (sent) {
    return (
      <div
        data-reveal="true"
        style={{
          padding: "clamp(24px, 3.5vw, 34px)",
          border: "1px solid rgba(58,43,34,.14)",
          borderRadius: 6,
          background: formBg,
        }}
      >
        <div style={{ fontSize: 34, lineHeight: 1, marginBottom: 10, color: "#4E7A4A" }} aria-hidden="true">
          ✓
        </div>
        <h3 style={{ margin: "0 0 8px", fontFamily: "Petrona, Georgia, serif", fontWeight: 500, fontSize: 24, color: "#1E4359" }}>
          Thanks — we&apos;ve got your note.
        </h3>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#55433A", maxWidth: "44ch" }}>
          We&apos;ll be in touch soon. If it&apos;s urgent, give us a call on {phone}.
        </p>
      </div>
    );
  }

  return (
    <form
      data-reveal="true"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        setError(null);
        startTransition(async () => {
          const res = await sendEnquiry({
            variant,
            name: String(fd.get("name") ?? ""),
            contact: String(fd.get("contact") ?? ""),
            notes: String(fd.get("notes") ?? ""),
            date: String(fd.get("date") ?? ""),
            people: String(fd.get("people") ?? ""),
            company: String(fd.get("company") ?? ""),
          });
          if (res.error) {
            setError(res.error);
            return;
          }
          setSent(true);
          form.reset();
        });
      }}
      style={{
        display: "grid",
        gap: 16,
        padding: "clamp(20px, 3vw, 30px)",
        border: "1px solid rgba(58,43,34,.14)",
        borderRadius: 6,
        background: formBg,
      }}
    >
      <label style={labelStyle}>
        Name
        <input type="text" name="name" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Phone or email
        <input type="text" name="contact" required style={inputStyle} />
      </label>

      {variant === "functions" ? (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          }}
        >
          <label style={labelStyle}>
            Date
            <input type="date" name="date" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            People
            <input type="number" name="people" min={1} style={inputStyle} />
          </label>
        </div>
      ) : null}

      <label style={labelStyle}>
        {variant === "functions" ? "What you have in mind" : "Your message"}
        <textarea
          name="notes"
          rows={variant === "functions" ? 4 : 5}
          style={{ ...inputStyle, minHeight: undefined, lineHeight: 1.5, resize: "vertical" }}
        />
      </label>

      {/* Honeypot: hidden from people, tempting to bots. Real submissions leave it empty. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <button
        type="submit"
        disabled={pending}
        className="hv-bay"
        style={{
          minHeight: 48,
          padding: "14px 24px",
          border: "none",
          borderRadius: 999,
          background: "#1E4359",
          color: "#FBF7EF",
          fontFamily: "Karla, sans-serif",
          fontSize: 16,
          fontWeight: 600,
          cursor: pending ? "default" : "pointer",
          opacity: pending ? 0.65 : 1,
          justifySelf: "start",
        }}
      >
        {pending ? "Sending…" : variant === "functions" ? "Send enquiry" : "Send"}
      </button>

      {error ? (
        <p role="alert" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: "#A6362B" }}>
          {error} You can also{" "}
          <a href={`mailto:${email}`} style={{ color: "#A6362B", fontWeight: 600 }}>
            email us
          </a>{" "}
          or call {phone}.
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#8A5F22" }}>
          We&apos;ll reply by email or phone. Prefer to talk? Call {phone}.
        </p>
      )}
    </form>
  );
}
