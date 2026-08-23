import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import HoursTable from "@/components/HoursTable";
import EnquiryForm from "@/components/EnquiryForm";
import {
  BOOK_URL,
  DIRECTIONS_URL,
  MAP_EMBED_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/components/site-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "62–64 Ferguson St, Williamstown. Open 7am–3pm, seven days. Walk in, call 03 9399 9955, or leave us a note.",
};

const blueEyebrow: CSSProperties = {
  margin: "0 0 6px",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#C79A4E",
};
const sectionH2: CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "Petrona, Georgia, serif",
  fontWeight: 500,
  fontSize: "clamp(28px, 3.8vw, 42px)",
  lineHeight: 1.08,
  letterSpacing: "-.02em",
  color: "#1E4359",
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "clip" }}>
      <SiteHeader variant="solid" />

      <main>
        <section
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "clamp(34px, 6vw, 68px) clamp(18px, 4vw, 40px) clamp(10px, 2vw, 18px)",
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
            Contact
          </p>
          <h1
            data-anim="1"
            style={{
              margin: "0 0 16px",
              fontFamily: "Petrona, Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(38px, 6.5vw, 66px)",
              lineHeight: 1.03,
              letterSpacing: "-.025em",
              color: "#1E4359",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .16s both",
            }}
          >
            Come and see us.
          </h1>
          <p
            data-anim="1"
            style={{
              margin: 0,
              maxWidth: "52ch",
              fontSize: "clamp(17px, 1.5vw, 19px)",
              lineHeight: 1.6,
              color: "#55433A",
              textWrap: "pretty",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .28s both",
            }}
          >
            62–64 Ferguson St, Williamstown. Open 7am to 3pm, seven days. Walk in, call, or leave us a note below.
          </p>
        </section>

        <WaveDivider />

        <section style={{ position: "relative", background: "#1E4359", color: "#F1E9DA", overflow: "hidden" }}>
          <GullImg
            src="/assets/gull-soar.png"
            style={{ right: "3%", top: "8%", width: "min(34vw, 300px)", opacity: 0.32, transform: "rotate(6deg)" }}
          />
          {/* Little fish swimming along the base */}
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, pointerEvents: "none", overflow: "hidden" }}
          >
            <div data-anim="1" style={{ position: "absolute", bottom: 22, left: 0, width: 50, animation: "swim-r 56s linear 5s infinite" }}>
              <div data-anim="1" style={{ animation: "bob-y 7s ease-in-out infinite" }}>
                <svg width="50" height="26" viewBox="0 0 66 34" fill="none" style={{ opacity: 0.28 }}>
                  <g data-anim="1" style={{ animation: "undulate 3.8s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "62% 50%" }}>
                    <g data-anim="1" style={{ animation: "tail-flick 1.4s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "100% 50%" }}>
                      <path d="M14 17C11 14 6.5 10.5 2 8.5c2.2 3 3.3 6 3.3 8.5S4.2 22.5 2 25.5c4.5-2 9-5.5 12-8.5Z" fill="#8FB8C9" />
                    </g>
                    <path d="M32 6.6c3-3.6 9-4.6 13-3.6-4 1.2-7.6 3.4-10.2 5.7Z" fill="#8FB8C9" />
                    <path d="M14 17c3-9 15-13 28-11 8 1.4 15.6 6 21 11-5.4 5-13 9.6-21 11-13 2-25-2-28-11Z" fill="#A7CBD8" />
                    <circle cx="58.6" cy="14" r="1.9" fill="#33566B" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(44px, 7vw, 84px) clamp(18px, 4vw, 40px) clamp(110px, 12vw, 128px)",
              display: "grid",
              gap: "clamp(32px, 5vw, 64px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true">
              <p style={blueEyebrow}>Address</p>
              <p style={{ margin: "0 0 8px", fontSize: 19, lineHeight: 1.5, color: "#F1E9DA" }}>
                62–64 Ferguson St
                <br />
                Williamstown VIC 3016
              </p>
              <p style={{ margin: "0 0 22px" }}>
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 16, color: "#E9C98E" }}>
                  Get directions
                </a>
              </p>

              <p style={blueEyebrow}>Phone</p>
              <p style={{ margin: "0 0 22px", fontSize: 19 }}>
                <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "#F1E9DA" }}>
                  {PHONE_DISPLAY}
                </a>
              </p>

              <p style={blueEyebrow}>Bookings</p>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener"
                className="hv-gold"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  padding: "15px 26px",
                  borderRadius: 999,
                  background: "#C79A4E",
                  color: "#24170F",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Book a table
              </a>
            </div>

            <div data-reveal="true">
              <p style={{ ...blueEyebrow, margin: "0 0 14px" }}>Opening hours</p>
              <HoursTable />
              <p style={{ margin: "18px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "rgba(241,233,218,.72)", maxWidth: "40ch" }}>
                Kitchen, takeaway and online orders until 2:30pm.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "clamp(44px, 7vw, 84px) clamp(18px, 4vw, 40px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "clamp(26px, 4vw, 44px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true">
              <h2 style={sectionH2}>Getting here</h2>
              <p style={{ margin: "0 0 20px", fontSize: 17.5, lineHeight: 1.65, color: "#55433A", maxWidth: "46ch" }}>
                We are on the Ferguson Street strip, a few minutes&apos; walk up from the Williamstown foreshore.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  color: "#8A5F22",
                  border: "1px dashed rgba(169,118,43,.6)",
                  borderRadius: 4,
                  background: "rgba(169,118,43,.07)",
                  padding: "14px 16px",
                  maxWidth: "48ch",
                }}
              >
                <strong style={{ letterSpacing: ".1em", fontSize: 12.5 }}>TO FILL · PARKING</strong>
                <br />
                The parking situation in your own words — street parking on Ferguson St, time limits, the nearest side streets, and where to go on a busy weekend.
              </p>
            </div>
            <div
              data-reveal="true"
              style={{ borderRadius: 6, overflow: "hidden", border: "1px solid rgba(58,43,34,.15)", background: "#EDE4D4" }}
            >
              <iframe
                title="Map of Provisions Cafe, 62–64 Ferguson St, Williamstown"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ display: "block", width: "100%", height: "clamp(280px, 42vw, 400px)", border: 0 }}
              />
            </div>
          </div>
        </section>

        <section
          id="enquire"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#FBF7EF",
            borderTop: "1px solid rgba(58,43,34,.1)",
          }}
        >
          <GullImg
            src="/assets/gull-diag.png"
            style={{ left: -80, top: -60, width: "min(36vw, 320px)", opacity: 0.32, transform: "rotate(-6deg)" }}
          />
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(44px, 7vw, 84px) clamp(18px, 4vw, 40px)",
              display: "grid",
              gap: "clamp(30px, 5vw, 56px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true">
              <h2 style={sectionH2}>Send us a note</h2>
              <p style={{ margin: "0 0 22px", fontSize: 17.5, lineHeight: 1.65, color: "#55433A", maxWidth: "46ch" }}>
                A phone call between 7am and 3pm is quickest. Otherwise leave your details and we will come back to you.
              </p>
              <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.6, color: "#55433A", maxWidth: "46ch" }}>
                Planning a group booking or catering? The{" "}
                <Link href="/functions">functions page</Link> has what we can do.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "#8A5F22",
                  border: "1px dashed rgba(169,118,43,.6)",
                  borderRadius: 4,
                  background: "rgba(169,118,43,.07)",
                  padding: "14px 16px",
                  maxWidth: "46ch",
                }}
              >
                <strong style={{ letterSpacing: ".1em", fontSize: 12.5 }}>TO FILL · EMAIL</strong>
                <br />
                An enquiries email address. The form sends nowhere until it is wired up to one.
              </p>
            </div>

            <EnquiryForm variant="contact" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
