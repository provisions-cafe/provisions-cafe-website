"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "../actions";
import { COLORS, serif, card, label, input, btnPrimary } from "../ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signIn,
    undefined,
  );

  return (
    <form action={action} style={{ ...card, width: "min(100%, 380px)" }}>
      <p
        style={{
          margin: "0 0 4px",
          fontFamily: serif,
          fontSize: 26,
          fontWeight: 600,
          color: COLORS.bay,
        }}
      >
        Provisions Cafe
      </p>
      <p style={{ margin: "0 0 22px", fontSize: 14.5, color: COLORS.muted }}>
        Staff sign in
      </p>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor="email" style={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          style={input}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="password" style={label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          style={input}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          style={{
            margin: "0 0 16px",
            padding: "10px 12px",
            fontSize: 14,
            color: COLORS.danger,
            background: "rgba(166,54,43,.08)",
            border: "1px solid rgba(166,54,43,.3)",
            borderRadius: 6,
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          ...btnPrimary,
          width: "100%",
          opacity: pending ? 0.6 : 1,
          cursor: pending ? "default" : "pointer",
        }}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
