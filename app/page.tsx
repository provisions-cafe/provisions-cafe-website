import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import ImageSlot from "@/components/ImageSlot";
import HoursTable from "@/components/HoursTable";
import Hero from "@/components/home/Hero";
import { MenuHeading, MenuItem, CoffeeSteam } from "@/components/menu";
import {
  BOOK_URL,
  ORDER_URL,
  DIRECTIONS_URL,
  REVIEWS_URL,
  MAP_EMBED_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/components/site-data";

const eyebrow: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#A9762B",
};
const bodyP: CSSProperties = {
  fontSize: 17.5,
  lineHeight: 1.68,
  color: "#55433A",
  maxWidth: "52ch",
  textWrap: "pretty",
};
const h2Bay: CSSProperties = {
  margin: "0 0 20px",
  fontFamily: "Petrona, Georgia, serif",
  fontWeight: 500,
  fontSize: "clamp(30px, 4vw, 44px)",
  lineHeight: 1.08,
  letterSpacing: "-.02em",
  color: "#1E4359",
};
const pill: CSSProperties = {
  padding: "8px 15px",
  border: "1px solid rgba(30,67,89,.25)",
  borderRadius: 999,
  fontSize: 14.5,
  color: "#1E4359",
  background: "#F7F1E6",
};
const toFillCard: CSSProperties = {
  padding: 22,
  border: "1px dashed rgba(169,118,43,.6)",
  borderRadius: 4,
  background: "rgba(169,118,43,.07)",
};
const infoCard: CSSProperties = {
  padding: 22,
  border: "1px solid rgba(58,43,34,.14)",
  borderRadius: 4,
  background: "#F7F1E6",
};
const infoCardH3: CSSProperties = {
  margin: "0 0 10px",
  fontFamily: "Petrona, Georgia, serif",
  fontSize: 22,
  fontWeight: 600,
  color: "#1E4359",
};
const blueEyebrow: CSSProperties = {
  margin: "0 0 6px",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#C79A4E",
};

export default function HomePage() {
  return (
    <div style={{ position: "relative", maxWidth: "100%", overflowX: "clip" }}>
      <SiteHeader variant="hero" />

      <main id="top">
        <Hero />

        <WaveDivider />

        {/* Our place -------------------------------------------------------- */}
        <section
          id="place"
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
            style={{ left: -70, top: -80, width: "min(42vw, 380px)", opacity: 0.32, transform: "rotate(-8deg)" }}
          />
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, pointerEvents: "none", overflow: "hidden" }}
          >
            <div data-anim="1" style={{ position: "absolute", bottom: 26, left: 0, width: 46, animation: "swim-r 62s linear 4s infinite" }}>
              <div data-anim="1" style={{ animation: "bob-y 8s ease-in-out infinite" }}>
                <svg width="46" height="24" viewBox="0 0 66 34" fill="none" style={{ opacity: 0.22 }}>
                  <g data-anim="1" style={{ animation: "undulate 4.2s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "62% 50%" }}>
                    <g data-anim="1" style={{ animation: "tail-flick 1.6s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "100% 50%" }}>
                      <path d="M14 17C11 14 6.5 10.5 2 8.5c2.2 3 3.3 6 3.3 8.5S4.2 22.5 2 25.5c4.5-2 9-5.5 12-8.5Z" fill="#1E4359" />
                    </g>
                    <path d="M32 6.6c3-3.6 9-4.6 13-3.6-4 1.2-7.6 3.4-10.2 5.7Z" fill="#1E4359" />
                    <path d="M14 17c3-9 15-13 28-11 8 1.4 15.6 6 21 11-5.4 5-13 9.6-21 11-13 2-25-2-28-11Z" fill="#2A5670" />
                    <circle cx="58.6" cy="14" r="1.7" fill="#FBF7EF" />
                  </g>
                </svg>
              </div>
            </div>
            <svg
              data-anim="1"
              viewBox="0 0 1440 30"
              preserveAspectRatio="none"
              fill="none"
              style={{ position: "absolute", left: 0, bottom: 10, width: "200%", height: 30, opacity: 0.28, animation: "drift-r 52s linear infinite" }}
            >
              <path d="M0 15q120-13 240 0t240 0 240 0 240 0 240 0 240 0" stroke="#1E4359" strokeWidth="1.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(44px, 7vw, 88px) clamp(18px, 4vw, 40px) clamp(116px, 12vw, 132px)",
              display: "grid",
              gap: "clamp(30px, 5vw, 60px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true" style={{ position: "relative", aspectRatio: "5 / 4", borderRadius: 6, overflow: "hidden", background: "#EDE4D4" }}>
              <ImageSlot src="/uploads/counter.webp" placeholder="The room — timber floors, wooden stools" />
            </div>
            <div data-reveal="true">
              <h2 style={h2Bay}>Our place</h2>
              <p style={{ ...bodyP, margin: "0 0 16px" }}>
                Provisions is a small cafe on Ferguson Street with soft blue walls, warm timber floors and a window bar made for watching the morning go by.
              </p>
              <p style={{ ...bodyP, margin: "0 0 16px" }}>
                We cook breakfast all morning and keep going through lunch — eggs how you like them, a proper big breaky, burgers and chips after midday. Coffee from 7am.
              </p>
              <p style={{ ...bodyP, margin: "0 0 28px" }}>
                Come with the kids, the paper, or the whole street. Sit inside, out the front, or take it down to the water.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 18px",
                  border: "1px solid rgba(169,118,43,.35)",
                  borderRadius: 4,
                  background: "rgba(169,118,43,.07)",
                  marginBottom: 26,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontFamily: "Petrona, Georgia, serif", fontSize: 24, fontWeight: 600, color: "#A9762B", lineHeight: 1 }}>
                  4.4★
                </span>
                <span style={{ fontSize: 15, color: "#55433A" }}>269 Google reviews</span>
                <span style={{ width: 1, height: 18, background: "rgba(58,43,34,.2)" }} />
                <span style={{ fontSize: 15, color: "#55433A" }}>$20–40 per person</span>
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <li style={pill}>Outdoor seating</li>
                <li style={pill}>Vegan options</li>
                <li style={pill}>Kids&apos; menu</li>
                <li style={pill}>Dine-in &amp; takeaway</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Reviews ---------------------------------------------------------- */}
        <section
          id="reviews"
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            maxWidth: 1120,
            margin: "0 auto",
            padding: "clamp(48px, 8vw, 90px) clamp(18px, 4vw, 40px) 0",
          }}
        >
          <div
            data-reveal="true"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: "clamp(26px, 4vw, 40px)",
            }}
          >
            <h2 style={{ ...h2Bay, margin: 0, fontSize: "clamp(30px, 4.2vw, 46px)" }}>4.4★ · 269 reviews</h2>
            <a href={REVIEWS_URL} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 16, color: "#1E4359" }}>
              Read them on Google
            </a>
            <GullImg
              src="/assets/gull-wide.png"
              style={{ zIndex: -1, right: -70, top: -70, width: "min(30vw, 260px)", opacity: 0.32, transform: "rotate(7deg)" }}
            />
          </div>
          <div data-reveal="true" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {[
              ["To fill · review 1", "Paste a real Google review here, with the reviewer's first name and their star rating."],
              ["To fill · review 2", "One about the food or the coffee works well in the middle spot."],
              ["To fill · review 3", "Something from a regular about the room or the service rounds it out."],
            ].map(([label, text]) => (
              <div key={label} style={toFillCard}>
                <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "#A9762B" }}>
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: "#8A5F22" }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Menu highlights -------------------------------------------------- */}
        <section
          id="menu"
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            maxWidth: 1120,
            margin: "0 auto",
            padding: "clamp(48px, 8vw, 96px) clamp(18px, 4vw, 40px)",
          }}
        >
          <GullImg
            src="/assets/gull-soar.png"
            style={{ zIndex: -1, right: -80, bottom: -90, width: "min(44vw, 400px)", opacity: 0.32, transform: "rotate(6deg)" }}
          />
          <div data-reveal="true" style={{ textAlign: "center", marginBottom: "clamp(34px, 5vw, 56px)" }}>
            <p style={{ ...eyebrow, margin: "0 0 10px" }}>A few favourites</p>
            <h2 style={{ margin: 0, fontFamily: "Petrona, Georgia, serif", fontWeight: 500, fontSize: "clamp(32px, 4.4vw, 48px)", lineHeight: 1.08, letterSpacing: "-.02em", color: "#1E4359" }}>
              Menu highlights
            </h2>
          </div>

          <div style={{ display: "grid", gap: "clamp(28px, 4vw, 48px)", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" }}>
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading>Breakfast</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Poached or fried eggs on toast" price="$10.00" />
                  <MenuItem
                    name="Big breaky"
                    price="$26.00"
                    desc="Eggs, bacon, sausage, mushrooms, spinach, grilled tomato, sourdough toast"
                  />
                </div>
              </div>
              <div>
                <MenuHeading>All day</MenuHeading>
                <div style={{ display: "grid", gap: 14 }}>
                  <MenuItem name="Calamari & chips" price="$11.50" />
                  <MenuItem name="Mush burger" price="$24.00" />
                  <MenuItem name="Grilled salmon" price="$28.00" />
                </div>
              </div>
            </div>

            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: 6, overflow: "hidden", background: "#EDE4D4" }}>
                <ImageSlot src="/uploads/counter.webp" placeholder="One dish — the big breaky" />
              </div>
              <div>
                <MenuHeading>Sweet</MenuHeading>
                <MenuItem name="Fruit salad pancakes" sub="short stack" price="$17.50" />
              </div>
              <div>
                <MenuHeading>Little ones</MenuHeading>
                <MenuItem name="Babyccino" price="$3.50" />
              </div>
              <div>
                <MenuHeading>
                  Coffee &amp; drinks
                  <CoffeeSteam />
                </MenuHeading>
                <div style={{ display: "grid", gap: 14 }}>
                  <MenuItem name="Chai latte" sub="powdered" price="$5.00" />
                  <MenuItem name="Iced coffee" price="$9.00" />
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
              This is a taste of it. The full menu is on the board in store.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a
                href={ORDER_URL}
                target="_blank"
                rel="noopener"
                className="hv-bay"
                style={{ display: "inline-block", padding: "14px 24px", borderRadius: 999, background: "#1E4359", color: "#FBF7EF", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
              >
                Order online
              </a>
              <a
                href={PHONE_HREF}
                className="hv-ghost-dark"
                style={{ display: "inline-block", padding: "14px 24px", borderRadius: 999, border: "1.5px solid rgba(30,67,89,.35)", color: "#1E4359", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* What's on -------------------------------------------------------- */}
        <section
          id="whats-on"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#FBF7EF",
            borderTop: "1px solid rgba(58,43,34,.1)",
            borderBottom: "1px solid rgba(58,43,34,.1)",
          }}
        >
          <GullImg
            src="/assets/gull-low.png"
            style={{ left: -60, bottom: -50, width: "min(34vw, 300px)", opacity: 0.32, transform: "rotate(-5deg)" }}
          />
          <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "clamp(44px, 7vw, 84px) clamp(18px, 4vw, 40px)" }}>
            <div data-reveal="true" style={{ marginBottom: "clamp(26px, 4vw, 38px)" }}>
              <p style={{ ...eyebrow, margin: "0 0 10px" }}>What&apos;s on</p>
              <h2 style={{ margin: "0 0 10px", fontFamily: "Petrona, Georgia, serif", fontWeight: 500, fontSize: "clamp(30px, 4.2vw, 46px)", lineHeight: 1.08, letterSpacing: "-.02em", color: "#1E4359" }}>
                This week at Provisions
              </h2>
              <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: "#6B564A", maxWidth: "54ch" }}>
                Three lines to keep current. Swap the text whenever the specials or the hours change.
              </p>
            </div>
            <div data-reveal="true" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {[
                ["Today's specials", "Placeholder — what the kitchen is running today, and the price."],
                ["Seasonal", "Placeholder — the dish or drink that only sticks around for a few weeks."],
                ["Public holidays", "Placeholder — any changed or closed days coming up. Normal hours are 7am to 3pm, seven days."],
              ].map(([title, text]) => (
                <div key={title} style={infoCard}>
                  <h3 style={infoCardH3}>{title}</h3>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#8A5F22" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Find us (underwater) --------------------------------------------- */}
        <section id="find" style={{ position: "relative", background: "#1E4359", color: "#F1E9DA", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 168, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 78, background: "#F7F1E6" }} />

            {/* Blue fish */}
            <div data-anim="1" style={{ position: "absolute", top: 100, left: 0, width: 62, animation: "swim-r 30s linear infinite" }}>
              <div data-anim="1" style={{ animation: "bob-y 5.5s ease-in-out infinite" }}>
                <svg width="62" height="32" viewBox="0 0 66 34" fill="none" style={{ opacity: 0.5 }}>
                  <g data-anim="1" style={{ animation: "undulate 3.2s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "62% 50%" }}>
                    <g data-anim="1" style={{ animation: "tail-flick 1.15s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "100% 50%" }}>
                      <path d="M14 17C11 14 6.5 10.5 2 8.5c2.2 3 3.3 6 3.3 8.5S4.2 22.5 2 25.5c4.5-2 9-5.5 12-8.5Z" fill="#5E90A8" />
                    </g>
                    <path d="M32 6.6c3-3.6 9-4.6 13-3.6-4 1.2-7.6 3.4-10.2 5.7Z" fill="#5E90A8" />
                    <path d="M14 17c3-9 15-13 28-11 8 1.4 15.6 6 21 11-5.4 5-13 9.6-21 11-13 2-25-2-28-11Z" fill="#78A7BD" />
                    <path d="M20 21.5c5 4.6 15.6 7.2 26 6.2-5.6 2.6-13.4 3.4-20.4 2.2-2.4-2-4.2-4.6-5.6-8.4Z" fill="#A7CBD8" opacity="0.7" />
                    <path d="M36.5 19.5c1.6 4 5 6.6 8.6 7-3.6-3-5.6-5-6.8-7Z" fill="#5E90A8" />
                    <path d="M55 9.6c-2.6 2.4-2.6 12 0 15" stroke="#3F7089" strokeWidth="1.2" />
                    <circle cx="58.6" cy="14" r="1.7" fill="#26414F" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Pale fish, swimming the other way */}
            <div data-anim="1" style={{ position: "absolute", top: 132, left: 0, width: 44, animation: "swim-l 46s linear 5s infinite" }}>
              <div data-anim="1" style={{ animation: "bob-y 7s ease-in-out infinite" }}>
                <svg width="44" height="23" viewBox="0 0 66 34" fill="none" style={{ opacity: 0.3 }}>
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

            {/* Gold leaping fish */}
            <div data-anim="1" style={{ position: "absolute", top: 60, left: 0, width: 68, animation: "swim-r 26s linear 3s infinite" }}>
              <div data-anim="1" style={{ animation: "fish-jump 26s ease-in-out 3s infinite" }}>
                <svg width="68" height="35" viewBox="0 0 66 34" fill="none">
                  <g data-anim="1" style={{ animation: "undulate 2.4s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "62% 50%" }}>
                    <g data-anim="1" style={{ animation: "tail-flick .82s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "100% 50%" }}>
                      <path d="M14 17C11 14 6.5 10.5 2 8.5c2.2 3 3.3 6 3.3 8.5S4.2 22.5 2 25.5c4.5-2 9-5.5 12-8.5Z" fill="#A9762B" />
                    </g>
                    <path d="M32 6.6c3-3.6 9-4.6 13-3.6-4 1.2-7.6 3.4-10.2 5.7Z" fill="#A9762B" />
                    <path d="M14 17c3-9 15-13 28-11 8 1.4 15.6 6 21 11-5.4 5-13 9.6-21 11-13 2-25-2-28-11Z" fill="#C79A4E" />
                    <path d="M20 21.5c5 4.6 15.6 7.2 26 6.2-5.6 2.6-13.4 3.4-20.4 2.2-2.4-2-4.2-4.6-5.6-8.4Z" fill="#E9C98E" opacity="0.8" />
                    <path d="M36.5 19.5c1.6 4 5 6.6 8.6 7-3.6-3-5.6-5-6.8-7Z" fill="#A9762B" />
                    <path d="M55 9.6c-2.6 2.4-2.6 12 0 15" stroke="#8A5F22" strokeWidth="1.2" />
                    <circle cx="58.6" cy="14" r="1.7" fill="#2C1C0B" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Bubbles */}
            <div data-anim="1" style={{ position: "absolute", left: "22%", top: 150, width: 6, height: 6, borderRadius: "50%", background: "rgba(220,234,240,.5)", animation: "bubble-up 7s ease-in .4s infinite" }} />
            <div data-anim="1" style={{ position: "absolute", left: "24%", top: 156, width: 4, height: 4, borderRadius: "50%", background: "rgba(220,234,240,.45)", animation: "bubble-up 6s ease-in 2.6s infinite" }} />
            <div data-anim="1" style={{ position: "absolute", left: "68%", top: 152, width: 5, height: 5, borderRadius: "50%", background: "rgba(220,234,240,.45)", animation: "bubble-up 8s ease-in 1.4s infinite" }} />
            <div data-anim="1" style={{ position: "absolute", left: "70.5%", top: 158, width: 3, height: 3, borderRadius: "50%", background: "rgba(220,234,240,.4)", animation: "bubble-up 6.5s ease-in 3.8s infinite" }} />

            <svg data-anim="1" viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "200%", height: 90, animation: "drift-r 26s linear infinite" }}>
              <path d="M0 44q90-18 180 0t180 0 180 0 180 0 180 0 180 0 180 0 180 0V90H0Z" fill="#2A5670" />
            </svg>
            <svg data-anim="1" viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "200%", height: 90, animation: "drift-l 17s linear infinite" }}>
              <path d="M0 56q120-22 240 0t240 0 240 0 240 0 240 0 240 0V90H0Z" fill="#1E4359" />
            </svg>
          </div>

          <svg aria-hidden="true" width="210" height="280" viewBox="0 0 24 32" fill="none" style={{ position: "absolute", right: "3%", bottom: -50, opacity: 0.07, pointerEvents: "none" }}>
            <circle cx="12" cy="4.4" r="2.6" stroke="#F1E9DA" strokeWidth="1.1" />
            <path d="M12 7v20.6M6.6 11.4h10.8M4 18.6c0 5.6 3.6 9 8 9s8-3.4 8-9" stroke="#F1E9DA" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M4 18.6 1.7 20.2M4 18.6l1.9 1.9M20 18.6l2.3 1.6M20 18.6l-1.9 1.9" stroke="#F1E9DA" strokeWidth="1.1" strokeLinecap="round" />
          </svg>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1120,
              margin: "0 auto",
              padding: "clamp(176px, 18vw, 210px) clamp(18px, 4vw, 40px) clamp(48px, 8vw, 92px)",
              display: "grid",
              gap: "clamp(32px, 5vw, 64px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              alignItems: "start",
            }}
          >
            <div data-reveal="true">
              <h2 style={{ margin: "0 0 26px", fontFamily: "Petrona, Georgia, serif", fontWeight: 500, fontSize: "clamp(32px, 4.4vw, 48px)", lineHeight: 1.08, letterSpacing: "-.02em", color: "#FBF7EF" }}>
                Find us
              </h2>
              <p style={blueEyebrow}>Address</p>
              <p style={{ margin: "0 0 10px", fontSize: 19, lineHeight: 1.5, color: "#F1E9DA" }}>
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
              <p style={{ margin: "0 0 24px", fontSize: 19 }}>
                <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "#F1E9DA" }}>
                  {PHONE_DISPLAY}
                </a>
              </p>

              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener"
                className="hv-gold"
                style={{ display: "inline-block", padding: "15px 26px", borderRadius: 999, background: "#C79A4E", color: "#24170F", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
              >
                Reserve a table
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

        {/* Map & parking ---------------------------------------------------- */}
        <section id="map" style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(44px, 7vw, 84px) clamp(18px, 4vw, 40px)" }}>
          <div style={{ display: "grid", gap: "clamp(26px, 4vw, 44px)", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "start" }}>
            <div data-reveal="true">
              <h2 style={{ margin: "0 0 16px", fontFamily: "Petrona, Georgia, serif", fontWeight: 500, fontSize: "clamp(28px, 3.8vw, 42px)", lineHeight: 1.08, letterSpacing: "-.02em", color: "#1E4359" }}>
                Map &amp; parking
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 17.5, lineHeight: 1.65, color: "#55433A", maxWidth: "46ch" }}>
                We are on the Ferguson Street strip, a few minutes&apos; walk up from the Williamstown foreshore.
              </p>
              <p
                style={{
                  margin: "0 0 20px",
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
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener"
                className="hv-bay"
                style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "14px 24px", borderRadius: 999, background: "#1E4359", color: "#FBF7EF", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
              >
                Get directions
              </a>
            </div>
            <div data-reveal="true" style={{ borderRadius: 6, overflow: "hidden", border: "1px solid rgba(58,43,34,.15)", background: "#EDE4D4" }}>
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
      </main>

      <SiteFooter withAnchor />
    </div>
  );
}
