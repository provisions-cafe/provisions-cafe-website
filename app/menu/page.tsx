import type { Metadata } from "next";
import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import { MenuHeading, MenuItem, DietTag, CoffeeSteam } from "@/components/menu";
import { BOOK_URL, ORDER_URL } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Full menu",
  description:
    "Breakfast all morning, lunch through to close. Kitchen and takeaway orders until 2:30pm, seven days.",
};

const eyebrow: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#A9762B",
};
const legendItem: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 15,
  color: "#55433A",
};
const noteText: CSSProperties = { fontSize: 15, lineHeight: 1.5, color: "#8A5F22" };
const ctaBay: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "14px 24px",
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
  padding: "14px 24px",
  borderRadius: 999,
  border: "1.5px solid rgba(30,67,89,.35)",
  color: "#1E4359",
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none",
};

export default function MenuPage() {
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
            padding: "clamp(34px, 6vw, 68px) clamp(18px, 4vw, 40px) clamp(10px, 2vw, 18px)",
          }}
        >
          <GullImg
            src="/assets/gull-glide.png"
            style={{ right: -40, top: -30, width: "min(40vw, 350px)", opacity: 0.32, transform: "rotate(5deg)" }}
          />
          <p data-anim="1" style={{ ...eyebrow, animation: "rise-in .7s cubic-bezier(.22,.7,.3,1) .05s both" }}>
            Ferguson St, Williamstown
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
            Full menu
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
            Breakfast all morning, lunch through to close. Kitchen and takeaway orders until 2:30pm, seven days.
          </p>
        </section>

        <WaveDivider />

        <section
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 clamp(18px, 4vw, 40px) clamp(48px, 8vw, 96px)",
          }}
        >
          <GullImg
            src="/assets/gull-wide.png"
            style={{ zIndex: -1, left: -80, bottom: -70, width: "min(36vw, 320px)", opacity: 0.32, transform: "rotate(-5deg)" }}
          />

          <div
            data-reveal="true"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px 22px",
              paddingBottom: 24,
              marginBottom: "clamp(28px, 4vw, 40px)",
              borderBottom: "1px solid rgba(58,43,34,.15)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "#A9762B" }}>
              Dietary
            </span>
            <span style={legendItem}>
              <DietTag>V</DietTag> Vegetarian
            </span>
            <span style={legendItem}>
              <DietTag>VG</DietTag> Vegan
            </span>
            <span style={legendItem}>
              <DietTag>GF</DietTag> Gluten free
            </span>
            <span style={legendItem}>
              <DietTag>GFO</DietTag> Gluten-free option
            </span>
          </div>

          <p
            data-reveal="true"
            style={{
              margin: "0 0 clamp(30px, 4vw, 44px)",
              padding: "14px 16px",
              border: "1px dashed rgba(169,118,43,.6)",
              borderRadius: 4,
              background: "rgba(169,118,43,.07)",
              fontSize: 15.5,
              lineHeight: 1.6,
              color: "#8A5F22",
              maxWidth: "74ch",
            }}
          >
            <strong style={{ letterSpacing: ".1em", fontSize: 12.5 }}>TO FILL</strong>
            <br />
            The nine items below are the current highlights. Send the complete menu and it drops straight into these categories. Vegan and gluten-free markers still need confirming with the kitchen — only vegetarian is marked so far.
          </p>

          <div
            style={{
              display: "grid",
              gap: "clamp(30px, 4vw, 52px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Breakfast</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Poached or fried eggs on toast" tag="V" price="$10.00" />
                  <MenuItem
                    name="Big breaky"
                    price="$26.00"
                    desc="Eggs, bacon, sausage, mushrooms, spinach, grilled tomato, sourdough toast"
                  />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">All day</MenuHeading>
                <div style={{ display: "grid", gap: 14 }}>
                  <MenuItem name="Calamari & chips" price="$11.50" />
                  <MenuItem name="Mush burger" price="$24.00" />
                  <MenuItem name="Grilled salmon" price="$28.00" />
                  <p style={{ margin: "2px 0 0", fontSize: 14.5, color: "#8A5F22" }}>
                    Salmon price to be confirmed.
                  </p>
                </div>
              </div>
            </div>

            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Sweet</MenuHeading>
                <MenuItem name="Fruit salad pancakes" sub="short stack" tag="V" price="$17.50" />
              </div>

              <div>
                <MenuHeading as="h2">Little ones</MenuHeading>
                <MenuItem name="Babyccino" tag="V" price="$3.50" />
                <p style={{ ...noteText, margin: "10px 0 0" }}>Rest of the kids&apos; menu to come.</p>
              </div>

              <div>
                <MenuHeading as="h2">
                  Coffee &amp; drinks
                  <CoffeeSteam />
                </MenuHeading>
                <div style={{ display: "grid", gap: 14 }}>
                  <MenuItem name="Chai latte" sub="powdered" tag="V" price="$5.00" />
                  <MenuItem name="Iced coffee" tag="V" price="$9.00" />
                  <p style={{ ...noteText, margin: "2px 0 0" }}>
                    Full coffee list, teas and cold drinks to come.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            data-reveal="true"
            style={{
              marginTop: "clamp(34px, 5vw, 54px)",
              paddingTop: 28,
              borderTop: "1px solid rgba(58,43,34,.15)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#6B564A", maxWidth: "40ch" }}>
              Takeaway and delivery run until 2:30pm.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={ORDER_URL} target="_blank" rel="noopener" className="hv-bay" style={ctaBay}>
                Order online
              </a>
              <a href={BOOK_URL} target="_blank" rel="noopener" className="hv-ghost-dark" style={ctaGhost}>
                Book a table
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
