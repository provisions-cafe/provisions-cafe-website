import type { Metadata } from "next";
import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSettings } from "@/lib/settings.server";
import { getBookingSettings, getClosures } from "@/lib/booking.server";
import { todayISO } from "@/lib/booking";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a table",
  description:
    "Reserve a table at Provisions Cafe, Williamstown. Pick your day, time and party size — walk-ins always welcome too.",
  alternates: { canonical: "/book" },
};

const eyebrow: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#A9762B",
};

const heading: CSSProperties = {
  margin: "0 0 14px",
  fontFamily: "Petrona, Georgia, serif",
  fontWeight: 500,
  fontSize: "clamp(30px, 5vw, 48px)",
  lineHeight: 1.05,
  letterSpacing: "-.02em",
  color: "#1E4359",
};

export default async function BookPage() {
  const [settings, bookingSettings] = await Promise.all([
    getSettings(),
    getBookingSettings(),
  ]);
  // Only load closures from today onward — they gate what the form offers.
  const closures = await getClosures(todayISO(bookingSettings.timezone));

  return (
    <div style={{ maxWidth: "100%", overflowX: "clip" }}>
      <SiteHeader variant="solid" bookUrl={settings.urls.book} />

      <main>
        <section
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding:
              "clamp(34px, 6vw, 68px) clamp(18px, 4vw, 40px) clamp(40px, 7vw, 90px)",
          }}
        >
          <p style={eyebrow}>Reservations</p>
          <h1 style={heading}>Book a table</h1>
          <p
            style={{
              margin: "0 0 30px",
              maxWidth: "58ch",
              fontSize: 17,
              lineHeight: 1.6,
              color: "#55433A",
            }}
          >
            {bookingSettings.intro}
          </p>

          {bookingSettings.enabled ? (
            <BookingForm settings={bookingSettings} closures={closures} />
          ) : (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(58,43,34,.16)",
                borderRadius: 10,
                padding: "clamp(20px, 4vw, 34px)",
              }}
            >
              <p style={{ margin: "0 0 12px", fontSize: 17, lineHeight: 1.6, color: "#3A2B22" }}>
                Online booking is taking a break right now. We&rsquo;d still love
                to have you — please give us a call and we&rsquo;ll sort a table.
              </p>
              <a
                href={settings.contact.phoneHref}
                className="hv-bay"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 48,
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "#1E4359",
                  color: "#FBF7EF",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Call {settings.contact.phoneDisplay}
              </a>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
