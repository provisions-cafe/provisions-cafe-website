"use client";

import { useState, type CSSProperties } from "react";

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 14.5,
  fontWeight: 600,
  color: "#55433A",
};

/**
 * Enquiry form shared by the Functions and Contact pages. It has no backend
 * yet (matching the design's "to fill" state) — submitting just shows a note
 * pointing people to the phone.
 */
export default function EnquiryForm({
  variant,
}: {
  variant: "functions" | "contact";
}) {
  const [sent, setSent] = useState(false);

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

  const note = sent
    ? "Not sent — this form has no address behind it yet. Please call 03 9399 9955 in the meantime."
    : "Needs an enquiries email address before it can send.";

  return (
    <form
      data-reveal="true"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
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

      <button
        type="submit"
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
          cursor: "pointer",
          justifySelf: "start",
        }}
      >
        {variant === "functions" ? "Send enquiry" : "Send"}
      </button>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#8A5F22" }}>
        {note}
      </p>
    </form>
  );
}
