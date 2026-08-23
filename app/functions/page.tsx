import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import ImageSlot from "@/components/ImageSlot";
import EnquiryForm from "@/components/EnquiryForm";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Functions & catering",
  description:
    "Long tables, small crowds. Group bookings, exclusive use and catering to go from Provisions Cafe, Williamstown.",
};

const sectionH2: CSSProperties = {
  margin: "0 0 18px",
  fontFamily: "Petrona, Georgia, serif",
  fontWeight: 500,
  fontSize: "clamp(28px, 3.6vw, 40px)",
  lineHeight: 1.1,
  letterSpacing: "-.02em",
  color: "#1E4359",
};

function FnCard({
  title,
  body,
  toFill,
}: {
  title: string;
  body: string;
  toFill: ReactNode;
}) {
  return (
    <div
      style={{
        padding: 22,
        border: "1px solid rgba(58,43,34,.14)",
        borderRadius: 4,
        background: "#F7F1E6",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px",
          fontFamily: "Petrona, Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
          color: "#1E4359",
        }}
      >
        {title}
      </h3>
      <p style={{ margin: "0 0 14px", fontSize: 16, lineHeight: 1.6, color: "#55433A" }}>
        {body}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.55,
          color: "#8A5F22",
          borderTop: "1px dashed rgba(169,118,43,.5)",
          paddingTop: 12,
        }}
      >
        {toFill}
      </p>
    </div>
  );
}

const btnBay: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "15px 26px",
  borderRadius: 999,
  background: "#1E4359",
  color: "#FBF7EF",
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none",
};
const btnGhostDark: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "15px 26px",
  borderRadius: 999,
  border: "1.5px solid rgba(30,67,89,.35)",
  color: "#1E4359",
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none",
};

export default function FunctionsPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "clip" }}>
      <SiteHeader variant="solid" />

      <main>
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            maxWidth: 1120,
            margin: "0 auto",
            padding: "clamp(34px, 6vw, 68px) clamp(18px, 4vw, 40px) clamp(28px, 5vw, 52px)",
            display: "grid",
            gap: "clamp(28px, 5vw, 56px)",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            alignItems: "center",
          }}
        >
          <div>
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
              Functions &amp; catering
            </p>
            <h1
              data-anim="1"
              style={{
                margin: "0 0 18px",
                fontFamily: "Petrona, Georgia, serif",
                fontWeight: 500,
                fontSize: "clamp(38px, 6.5vw, 66px)",
                lineHeight: 1.03,
                letterSpacing: "-.025em",
                color: "#1E4359",
                animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .16s both",
              }}
            >
              Long tables,
              <br />
              small crowds.
            </h1>
            <p
              data-anim="1"
              style={{
                margin: "0 0 28px",
                maxWidth: "50ch",
                fontSize: "clamp(17px, 1.5vw, 19px)",
                lineHeight: 1.65,
                color: "#55433A",
                textWrap: "pretty",
                animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .28s both",
              }}
            >
              Birthdays, christenings, book clubs, team breakfasts and the morning after the wedding. We can put the tables together for a group, or send the food to you.
            </p>
            <div
              data-anim="1"
              style={{ display: "flex", flexWrap: "wrap", gap: 12, animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .4s both" }}
            >
              <a href={PHONE_HREF} className="hv-bay" style={btnBay}>
                Call {PHONE_DISPLAY}
              </a>
              <a href="#enquire" className="hv-ghost-dark" style={btnGhostDark}>
                Send an enquiry
              </a>
            </div>
          </div>
          <div data-anim="1" style={{ position: "relative", animation: "rise-in 1s cubic-bezier(.22,.7,.3,1) .34s both" }}>
            <GullImg
              src="/assets/gull-wide.png"
              style={{ left: -70, bottom: -40, width: "min(30vw, 250px)", opacity: 0.32, transform: "rotate(-6deg)" }}
            />
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: 6,
                overflow: "hidden",
                background: "#EDE4D4",
                boxShadow: "0 18px 40px -28px rgba(58,43,34,.5)",
              }}
            >
              <ImageSlot placeholder="A long table set up for a group" />
            </div>
          </div>
        </section>

        <WaveDivider />

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#FBF7EF",
            borderTop: "1px solid rgba(58,43,34,.1)",
            borderBottom: "1px solid rgba(58,43,34,.1)",
          }}
        >
          <GullImg
            src="/assets/gull-glide.png"
            style={{ right: -50, top: -60, width: "min(40vw, 350px)", opacity: 0.32, transform: "rotate(5deg)" }}
          />
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(44px, 7vw, 84px) clamp(18px, 4vw, 40px)",
            }}
          >
            <h2 data-reveal="true" style={{ ...sectionH2, margin: "0 0 8px" }}>
              What we can do
            </h2>
            <p
              data-reveal="true"
              style={{
                margin: "0 0 clamp(26px, 4vw, 38px)",
                fontSize: 16.5,
                lineHeight: 1.6,
                color: "#6B564A",
                maxWidth: "54ch",
              }}
            >
              The shape of it, with the specifics still to confirm.
            </p>
            <div
              data-reveal="true"
              style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}
            >
              <FnCard
                title="Group bookings"
                body="Tables joined for a group, in the middle of a normal trading day. Best before the weekend rush or after 1pm."
                toFill={
                  <>
                    <strong style={{ letterSpacing: ".1em", fontSize: 12 }}>TO FILL</strong> — maximum group size, notice needed, any minimum spend.
                  </>
                }
              />
              <FnCard
                title="Exclusive use"
                body="The whole room to yourselves for a morning event, with a set menu out of the kitchen."
                toFill={
                  <>
                    <strong style={{ letterSpacing: ".1em", fontSize: 12 }}>TO FILL</strong> — whether this is offered, which days, hire fee and per-head pricing.
                  </>
                }
              />
              <FnCard
                title="Catering to go"
                body="Breakfast and lunch platters, sandwiches, slices and coffee, packed for pick-up in Williamstown."
                toFill={
                  <>
                    <strong style={{ letterSpacing: ".1em", fontSize: 12 }}>TO FILL</strong> — platter options and prices, minimum order, lead time, delivery radius.
                  </>
                }
              />
            </div>
          </div>
        </section>

        <section
          id="enquire"
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
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
            <h2 style={sectionH2}>Make an enquiry</h2>
            <p style={{ margin: "0 0 22px", fontSize: 17.5, lineHeight: 1.65, color: "#55433A", maxWidth: "46ch" }}>
              Easiest is a phone call between 7am and 3pm — ask for whoever is on the floor. Otherwise leave the details here and we will come back to you.
            </p>
            <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "#A9762B" }}>
              Phone
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 19 }}>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "#1E4359" }}>
                {PHONE_DISPLAY}
              </a>
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
              An enquiries email address, and who looks after functions. The form sends nowhere until it is wired up to one.
            </p>
          </div>

          <EnquiryForm variant="functions" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
