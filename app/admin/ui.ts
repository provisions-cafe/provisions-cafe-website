import type { CSSProperties } from "react";

// Shared inline-style tokens for the admin panel. Plain constants (no server or
// client imports) so both server and client admin components can use them.
// Palette matches the public site: bay blue #1E4359, cream #FBF7EF, gold #C79A4E.

export const COLORS = {
  bay: "#1E4359",
  bayDark: "#16354A",
  cream: "#FBF7EF",
  paper: "#FFFFFF",
  ink: "#3A2B22",
  muted: "#6B564A",
  gold: "#A9762B",
  goldBtn: "#C79A4E",
  line: "rgba(58,43,34,.15)",
  danger: "#A6362B",
  ok: "#4E7A4A",
};

export const serif = "Petrona, Georgia, serif";

export const card: CSSProperties = {
  background: COLORS.paper,
  border: `1px solid ${COLORS.line}`,
  borderRadius: 8,
  padding: "clamp(16px, 3vw, 24px)",
};

export const label: CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: ".04em",
  textTransform: "uppercase",
  color: COLORS.gold,
  marginBottom: 6,
};

export const input: CSSProperties = {
  width: "100%",
  minHeight: 42,
  padding: "9px 12px",
  fontSize: 15,
  color: COLORS.ink,
  background: COLORS.cream,
  border: `1px solid ${COLORS.line}`,
  borderRadius: 6,
  outline: "none",
  boxSizing: "border-box",
};

export const textarea: CSSProperties = {
  ...input,
  minHeight: 80,
  lineHeight: 1.5,
  resize: "vertical",
  fontFamily: "inherit",
};

export const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "10px 20px",
  borderRadius: 999,
  border: "none",
  background: COLORS.bay,
  color: COLORS.cream,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
};

export const btnGhost: CSSProperties = {
  ...btnPrimary,
  background: "transparent",
  color: COLORS.bay,
  border: `1.5px solid rgba(30,67,89,.35)`,
};

export const btnDanger: CSSProperties = {
  ...btnGhost,
  color: COLORS.danger,
  border: `1.5px solid rgba(166,54,43,.4)`,
};

export const h1: CSSProperties = {
  margin: 0,
  fontFamily: serif,
  fontWeight: 500,
  fontSize: "clamp(26px, 3.6vw, 34px)",
  letterSpacing: "-.02em",
  color: COLORS.bay,
};

export const h2: CSSProperties = {
  margin: 0,
  fontFamily: serif,
  fontWeight: 500,
  fontSize: 21,
  color: COLORS.bay,
};
