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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant !== "hero") return;
    const onScroll = () => setScrolled((window.scrollY || 0) > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  // While the mobile menu is open: lock background scroll and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // On the home hero the nav rides transparent over the photo, then settles
  // into oat once scrolled. Inner pages are always solid. An open mobile menu
  // also forces the solid treatment so the bar reads against the dropdown.
  const solid = variant === "solid" || scrolled || menuOpen;

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
    <>
      <header style={headerStyle}>
      <nav style={{ ...navContainer, position: "relative", zIndex: 2, transition: "color .3s ease" }}>
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

        {/* Desktop links */}
        <div className="nav-desktop" style={linksWrap}>
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

        {/* Mobile hamburger */}
        <button
          type="button"
          className="nav-mobile-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            padding: 0,
            border: "none",
            background: "transparent",
            color: brandColor,
            cursor: "pointer",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>
      </header>

      {/* Full-screen mobile menu overlay */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="nav-mobile-panel"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            flexDirection: "column",
            background: "#F7F1E6",
          }}
        >
          {/* Overlay top bar mirrors the header: brand + close */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flex: "none",
              padding: "8px clamp(18px, 4vw, 40px)",
              borderBottom: "1px solid rgba(58,43,34,.12)",
            }}
          >
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "Petrona, Georgia, serif",
                fontSize: "clamp(19px, 2.4vw, 23px)",
                fontWeight: 600,
                letterSpacing: "-.01em",
                color: "#1E4359",
                textDecoration: "none",
              }}
            >
              Provisions Cafe
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#1E4359",
                cursor: "pointer",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Links fill the rest of the screen */}
          <nav
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "12px clamp(18px, 4vw, 40px) calc(28px + env(safe-area-inset-bottom))",
              overflowY: "auto",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 56,
                    padding: "4px 2px",
                    fontFamily: "Petrona, Georgia, serif",
                    fontSize: 26,
                    textDecoration: "none",
                    color: active ? "#A9762B" : "#3A2B22",
                    fontWeight: active ? 600 : 400,
                    borderBottom: "1px solid rgba(58,43,34,.1)",
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
              onClick={() => setMenuOpen(false)}
              className="hv-bay"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 54,
                marginTop: 22,
                padding: "14px 20px",
                borderRadius: 999,
                background: "#1E4359",
                color: "#FBF7EF",
                fontSize: 17,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Book a table
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
