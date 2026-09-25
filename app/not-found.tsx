import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GullImg from "@/components/GullImg";
import { NAV_ITEMS } from "@/components/site-data";
import { getSettings } from "@/lib/settings.server";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page has drifted off. Head back to the Provisions Cafe home page, or find the menu, hours and directions.",
  robots: { index: false, follow: true },
};

const ctaBay: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "14px 26px",
  borderRadius: 999,
  background: "#1E4359",
  color: "#FBF7EF",
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none",
};
const ctaGhost: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "14px 26px",
  borderRadius: 999,
  border: "1.5px solid rgba(30,67,89,.35)",
  color: "#1E4359",
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none",
};
const navPill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "8px 18px",
  border: "1px solid rgba(30,67,89,.25)",
  borderRadius: 999,
  fontSize: 15,
  color: "#1E4359",
  background: "#F7F1E6",
  textDecoration: "none",
};

export default async function NotFound() {
  const settings = await getSettings();
  return (
    <div style={{ position: "relative", maxWidth: "100%", overflowX: "clip" }}>
      <SiteHeader variant="solid" bookUrl={settings.urls.book} />

      <main
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <GullImg
          src="/assets/gull-soar.png"
          style={{ right: -70, top: -60, width: "min(40vw, 360px)", opacity: 0.32, transform: "rotate(7deg)" }}
        />
        <GullImg
          src="/assets/gull-low.png"
          style={{ left: -60, bottom: -50, width: "min(32vw, 280px)", opacity: 0.28, transform: "rotate(-6deg)" }}
        />

        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 720,
            margin: "0 auto",
            padding: "clamp(56px, 10vw, 120px) clamp(18px, 4vw, 40px)",
            textAlign: "center",
          }}
        >
          <p
            data-anim="1"
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "#A9762B",
              animation: "rise-in .7s cubic-bezier(.22,.7,.3,1) .05s both",
            }}
          >
            Lost at sea
          </p>

          <p
            data-anim="1"
            aria-hidden="true"
            style={{
              margin: "0 0 8px",
              fontFamily: "Petrona, Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(84px, 20vw, 168px)",
              lineHeight: 0.9,
              letterSpacing: "-.03em",
              color: "#1E4359",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .12s both",
            }}
          >
            404
          </p>

          <h1
            data-anim="1"
            style={{
              margin: "0 0 16px",
              fontFamily: "Petrona, Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-.02em",
              color: "#1E4359",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .2s both",
            }}
          >
            This page has drifted off.
          </h1>

          <p
            data-anim="1"
            style={{
              margin: "0 auto clamp(28px, 5vw, 40px)",
              maxWidth: "46ch",
              fontSize: "clamp(16.5px, 1.5vw, 18px)",
              lineHeight: 1.65,
              color: "#55433A",
              textWrap: "pretty",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .28s both",
            }}
          >
            The page you were after isn&apos;t here — maybe the link&apos;s gone stale, or it swam off. Head back home, or find your way with the links below.
          </p>

          <div
            data-anim="1"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginBottom: "clamp(28px, 5vw, 40px)",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .36s both",
            }}
          >
            <Link href="/" className="hv-bay" style={ctaBay}>
              Back to home
            </Link>
            <Link href="/menu" className="hv-ghost-dark" style={ctaGhost}>
              See the menu
            </Link>
          </div>

          <nav
            data-anim="1"
            aria-label="Site pages"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .44s both",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} style={navPill}>
                {item.label}
              </Link>
            ))}
          </nav>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
