"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition, type CSSProperties } from "react";
import { canAccess, type PermissionKey, type UserProfile } from "@/lib/rbac";
import { signOut } from "./actions";
import { COLORS, serif } from "./ui";

type NavItem = { href: string; label: string; perm: PermissionKey | null };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", perm: null },
  { href: "/admin/menu", label: "Menu", perm: "menu" },
  { href: "/admin/info", label: "Business info", perm: "info" },
  { href: "/admin/media", label: "Photos", perm: "media" },
];

export default function AdminNav({
  profile,
  email,
}: {
  profile: UserProfile;
  email: string;
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const items = NAV.filter((item) => canAccess(profile, item.href));

  const linkStyle = (href: string): CSSProperties => {
    const active =
      href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return {
      display: "inline-flex",
      alignItems: "center",
      minHeight: 38,
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 14.5,
      fontWeight: active ? 600 : 500,
      textDecoration: "none",
      color: active ? COLORS.cream : COLORS.bay,
      background: active ? COLORS.bay : "transparent",
    };
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(247,241,230,.94)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${COLORS.line}`,
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px 14px",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "10px clamp(16px, 3vw, 28px)",
        }}
      >
        <span
          style={{
            fontFamily: serif,
            fontSize: 19,
            fontWeight: 600,
            color: COLORS.bay,
            marginRight: 6,
          }}
        >
          Provisions
          <span style={{ color: COLORS.gold }}> · Admin</span>
        </span>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: "1 1 auto" }}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} style={linkStyle(item.href)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{ fontSize: 13, color: COLORS.muted, whiteSpace: "nowrap" }}
            title={email}
          >
            {email}
          </span>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => signOut())}
            style={{
              minHeight: 38,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1.5px solid rgba(30,67,89,.35)`,
              background: "transparent",
              color: COLORS.bay,
              fontSize: 14,
              fontWeight: 600,
              cursor: pending ? "default" : "pointer",
              opacity: pending ? 0.6 : 1,
            }}
          >
            {pending ? "…" : "Sign out"}
          </button>
        </div>
      </nav>
    </header>
  );
}
