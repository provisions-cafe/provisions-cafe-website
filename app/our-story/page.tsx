import type { Metadata } from "next";
import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import ImageSlot from "@/components/ImageSlot";
import { BOOK_URL } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Soft blue walls, timber underfoot, a window bar for one and long tables for six. A small cafe two streets back from the Williamstown foreshore.",
};

const bodyP: CSSProperties = {
  fontSize: 17.5,
  lineHeight: 1.68,
  color: "#55433A",
  maxWidth: "52ch",
  textWrap: "pretty",
};
const sectionH2: CSSProperties = {
  margin: "0 0 20px",
  fontFamily: "Petrona, Georgia, serif",
  fontWeight: 500,
  fontSize: "clamp(28px, 3.6vw, 40px)",
  lineHeight: 1.1,
  letterSpacing: "-.02em",
  color: "#1E4359",
};
const toFillCard: CSSProperties = {
  padding: 20,
  border: "1px dashed rgba(169,118,43,.6)",
  borderRadius: 4,
  background: "rgba(169,118,43,.07)",
};
const toFillLabel: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "#A9762B",
};
const toFillBody: CSSProperties = {
  margin: 0,
  fontSize: 16.5,
  lineHeight: 1.6,
  color: "#8A5F22",
};
const ctaGold: CSSProperties = {
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
};
const ctaGhostLight: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "15px 26px",
  borderRadius: 999,
  border: "1.5px solid rgba(241,233,218,.4)",
  color: "#F1E9DA",
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none",
};

export default function OurStoryPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "clip" }}>
      <SiteHeader variant="solid" />

      <main>
        <section
          style={{
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
              Our story
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
              A corner of
              <br />
              Ferguson Street.
            </h1>
            <p
              data-anim="1"
              style={{
                margin: 0,
                maxWidth: "50ch",
                fontSize: "clamp(17px, 1.5vw, 19px)",
                lineHeight: 1.65,
                color: "#55433A",
                textWrap: "pretty",
                animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .28s both",
              }}
            >
              Soft blue walls, timber underfoot, a window bar for one and long tables for six. Coffee from 7am, breakfast until the kitchen closes.
            </p>
          </div>
          <div data-anim="1" style={{ animation: "rise-in 1s cubic-bezier(.22,.7,.3,1) .34s both" }}>
            <div
              data-anim="1"
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: "6px 6px 140px 6px",
                overflow: "hidden",
                background: "#EDE4D4",
                boxShadow: "0 18px 40px -28px rgba(58,43,34,.5)",
                animation: "float-y 13s ease-in-out 1.4s infinite",
              }}
            >
              <ImageSlot placeholder="The room — blue walls, timber, window bar" />
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
            src="/assets/gull-diag.png"
            style={{ left: -70, top: -70, width: "min(40vw, 360px)", opacity: 0.32, transform: "rotate(-6deg)" }}
          />
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(44px, 7vw, 88px) clamp(18px, 4vw, 40px)",
              display: "grid",
              gap: "clamp(30px, 5vw, 60px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true">
              <h2 style={sectionH2}>The space</h2>
              <p style={{ ...bodyP, margin: "0 0 16px" }}>
                Provisions sits two streets back from the water, where Williamstown slows down. The walls are a soft bay blue, the floors are warm timber, and the stools at the window are the first seats taken most mornings.
              </p>
              <p style={{ ...bodyP, margin: "0 0 16px" }}>
                It is a small room, and that is the point. Prams fit, dogs wait out the front, regulars get their order started before they reach the counter.
              </p>
              <p style={{ ...bodyP, margin: 0 }}>
                On clear days the light comes straight down Ferguson Street and the whole place goes gold for about an hour.
              </p>
            </div>
            <div data-reveal="true">
              <h2 style={sectionH2}>How we cook</h2>
              <p style={{ ...bodyP, margin: "0 0 16px" }}>
                Made from scratch, in a kitchen you can hear from your table. Eggs cooked to order, chips cut for the lunch rush, cakes out on the counter until they are gone.
              </p>
              <p style={{ ...bodyP, margin: "0 0 16px" }}>
                We buy close to home wherever we can and keep the menu short enough to cook it properly. Vegan and kids&apos; options sit on the same menu as everything else, not tacked on the end.
              </p>
              <p style={{ ...bodyP, margin: 0 }}>
                Nothing here is complicated. It is breakfast and lunch, done carefully, seven days a week.
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
          <h2 data-reveal="true" style={{ ...sectionH2, margin: "0 0 8px" }}>
            The details
          </h2>
          <p
            data-reveal="true"
            style={{
              margin: "0 0 clamp(24px, 4vw, 36px)",
              fontSize: 16,
              lineHeight: 1.6,
              color: "#6B564A",
              maxWidth: "52ch",
            }}
          >
            Three things worth saying properly. Send them over and they go straight in.
          </p>
          <div
            data-reveal="true"
            style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
          >
            <div style={toFillCard}>
              <p style={toFillLabel}>To fill · year opened</p>
              <p style={toFillBody}>
                The year Provisions opened on Ferguson Street, and anything that came before it in the same room.
              </p>
            </div>
            <div style={toFillCard}>
              <p style={toFillLabel}>To fill · who&apos;s behind it</p>
              <p style={toFillBody}>
                Names of the owners and the head chef, and how they came to Williamstown.
              </p>
            </div>
            <div style={toFillCard}>
              <p style={toFillLabel}>To fill · coffee roaster</p>
              <p style={toFillBody}>
                Which roaster the beans come from, the blend on the machine, and whether there is a filter or single origin.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{ position: "relative", overflow: "hidden", background: "#1E4359", color: "#F1E9DA" }}
        >
          <GullImg
            src="/assets/gull-soar.png"
            style={{ right: "3%", bottom: -50, width: "min(38vw, 330px)", opacity: 0.32, transform: "rotate(7deg)" }}
          />
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(48px, 7vw, 84px) clamp(18px, 4vw, 40px)",
              display: "grid",
              gap: 26,
              justifyItems: "start",
            }}
          >
            <h2
              data-reveal="true"
              style={{
                margin: 0,
                fontFamily: "Petrona, Georgia, serif",
                fontWeight: 500,
                fontSize: "clamp(30px, 4.4vw, 48px)",
                lineHeight: 1.08,
                letterSpacing: "-.02em",
                color: "#FBF7EF",
              }}
            >
              Come visit
            </h2>
            <p data-reveal="true" style={{ margin: 0, maxWidth: "46ch", fontSize: 18, lineHeight: 1.6, color: "rgba(241,233,218,.85)" }}>
              62–64 Ferguson St, Williamstown. Open 7am to 3pm, seven days. Walk in, or book ahead for the weekend.
            </p>
            <div data-reveal="true" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={BOOK_URL} target="_blank" rel="noopener" className="hv-gold" style={ctaGold}>
                Book a table
              </a>
              <a href="/#find" className="hv-ghost-light" style={ctaGhostLight}>
                Find us
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
