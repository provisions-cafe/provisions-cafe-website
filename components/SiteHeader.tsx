"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { NAV_ITEMS, BOOK_URL } from "./site-data";

const navContainer: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 10,
  maxWidth: 1120,
  margin: "0 auto",
  padding: "8px clamp(18px, 4vw, 40px)",
};

const linksWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexWrap: "wrap",
  columnGap: "clamp(10px, 1.6vw, 22px)",
  rowGap: 2,
  flex: "1 1 auto",
};

const linkBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  fontSize: 15,
  textDecoration: "none",
};

const ctaBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "10px 20px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
  whiteSpace: "nowrap",
};

export default function SiteHeader({
  variant = "solid",
}: {
  variant?: "solid" | "hero";
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "hero") return;
    const onScroll = () => setScrolled((window.scrollY || 0) > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // On the home hero the nav rides transparent over the photo, then settles
  // into oat once scrolled. Inner pages are always solid.
  const solid = variant === "solid" || scrolled;

  const headerStyle: CSSProperties =
    variant === "hero"
      ? {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition:
            "box-shadow .3s ease, background .3s ease, border-color .3s ease",
          background: solid ? "rgba(247,241,230,.94)" : "transparent",
          backdropFilter: solid ? "blur(8px)" : "none",
          WebkitBackdropFilter: solid ? "blur(8px)" : "none",
          borderBottom: `1px solid ${solid ? "rgba(58,43,34,.12)" : "transparent"}`,
          boxShadow: solid ? "0 6px 24px -14px rgba(30,67,89,.55)" : "none",
        }
      : {
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(247,241,230,.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(58,43,34,.12)",
        };

  const brandColor = solid ? "#1E4359" : "#FBF7EF";
  const inactiveLink = solid ? "#3A2B22" : "rgba(241,233,218,.92)";
  const textShadow =
    variant === "hero" && !solid ? "0 1px 12px rgba(12,26,38,.45)" : "none";

  return (
    <header style={headerStyle}>
      <nav style={{ ...navContainer, transition: "color .3s ease" }}>
        <Link
          href="/"
          style={{
            fontFamily: "Petrona, Georgia, serif",
            fontSize: "clamp(19px, 2.4vw, 23px)",
            fontWeight: 600,
            letterSpacing: "-.01em",
            color: brandColor,
            textDecoration: "none",
            transition: "color .3s ease",
            textShadow,
          }}
        >
          Provisions Cafe
        </Link>
        <div style={linksWrap}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...linkBase,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#A9762B" : inactiveLink,
                  transition: "color .3s ease",
                  textShadow,
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener"
            className={solid ? "hv-bay" : "hv-gold"}
            style={{
              ...ctaBase,
              background: solid ? "#1E4359" : "#C79A4E",
              color: solid ? "#FBF7EF" : "#24170F",
              transition: "background .3s ease, color .3s ease",
            }}
          >
            Book a table
          </a>
        </div>
      </nav>
    </header>
  );
}
