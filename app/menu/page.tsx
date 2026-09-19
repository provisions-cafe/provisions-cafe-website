import type { Metadata } from "next";
import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import { MenuHeading, MenuItem, DietTag } from "@/components/menu";
import { BOOK_URL, ORDER_URL } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Full menu",
  description:
    "Breakfast all morning, lunch through to close. Kitchen and takeaway orders until 2:30pm, seven days.",
  alternates: { canonical: "/menu" },
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
              <DietTag>GF</DietTag> Gluten free
            </span>
            <span style={{ ...legendItem, color: "#6B564A" }}>
              Burgers, wraps &amp; tacos all served with chips
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gap: "clamp(30px, 4vw, 52px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              alignItems: "start",
            }}
          >
            {/* Column 1 — morning */}
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Breakfast</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Brekky Roll" price="$15" desc="Streaky bacon, fried egg, American cheese, BBQ or tomato relish" />
                  <MenuItem name="Provisions Big Breaky" tag="V" price="$28.50" desc="Eggs your way on sourdough, hash brown, tomato, avo, mushroom, spinach, sausage, bacon or halloumi — house favourite" />
                  <MenuItem name="Avocado Smash" price="$25.50" desc="Sourdough, poached egg, sautéed mushroom & spinach, feta, chilli oil, avocado, tomato" />
                  <MenuItem name="Salmon Benny" price="$22.50" desc="Smoked salmon on sourdough, avocado, poached eggs, hollandaise, capers, dill cream cheese" />
                  <MenuItem name="Charcoal Crackle Benny" price="$24.50" desc="Crispy pork, charcoal hollandaise, poached eggs, house potato hash, pork crackling dust" />
                  <MenuItem name="Heaven on Hash" price="$22" desc="Homemade hash, double bacon, poached eggs, hollandaise" />
                  <MenuItem name="Chilli Scrambled Eggs" tag="V" price="$25.50" desc="Bacon or mushroom, spring onion, sriracha, shallots, parmesan, on toast" />
                  <MenuItem name="Toast" price="$11.50" desc="Butter, vegemite or jam, on multigrain, sourdough or white — GF or fruit toast +$1.50, eggs your own way (GF)" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Brunch &amp; Sweets</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Zucchini & Corn Fritters" price="$24.50" desc="Smashed avo, poached egg and salsa on top" />
                  <MenuItem name="Pancakes" price="$21.50" desc="Berry compote, icing sugar, vanilla ice cream, maple syrup — add bacon +$6.50" />
                  <MenuItem name="Bruschetta" price="$23.50" desc="Fresh tomato, onion, avocado, basil, feta, pesto, sourdough, fig & olive tapenade" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Focaccia &amp; Toasties</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Ham & Cheese" price="$16.50" desc="Ham, cheese, sourdough" />
                  <MenuItem name="Chicken & Avo" price="$16.50" desc="Chicken, cheese, avo, mayo, celery and spring onion" />
                  <MenuItem name="Grilled Veggie" tag="V" price="$16.50" desc="Grilled eggplant, roasted capsicum, tomato, cheese, provisions mayo" />
                </div>
              </div>
            </div>

            {/* Column 2 — lunch & evening */}
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Lunch &amp; Evening</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Chicken Parmigiana" price="$26" desc="Classic — house napoli, ham, mozzarella · Meatrix — ham, bacon, napoli, mozzarella. With garden salad & chips" />
                  <MenuItem name="Tomato Pasta" price="$24.50" desc="Chicken, spinach, capsicum and cherry tomato" />
                  <MenuItem name="Creamy Truffle Mushroom Pasta" price="$24.50" desc="Egg pappardelle, wild mushroom, truffle cream, parmesan" />
                  <MenuItem name="Grilled Fish" tag="GF" price="$26.50" desc="Fish of the day, lemon wedge, salad and chips, tartare" />
                  <MenuItem name="Butter Chicken" price="$25.50" desc="Curry, served with rice and pita bread" />
                  <MenuItem name="Steak Sandwich" price="$30" desc="Grilled porterhouse, caramelised onion, lettuce, tomato, egg, chips" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Salads &amp; Light</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Vegetarian Lasagne" tag="V" price="$21.50" desc="Pumpkin, zucchini, mushroom, spinach, onion, herbed bechamel, side salad" />
                  <MenuItem name="Falafel Salad" tags={["V", "GF"]} price="$25.50" desc="Halloumi, salad, hummus, avocado" />
                  <MenuItem name="Garden Salad" price="$20.50" desc="Lettuce, tomato, onion, cucumber, olive, carrot, double-cooked bacon, lemon dressing — add chicken +$6.50" />
                </div>
              </div>
            </div>

            {/* Column 3 — burgers, sides, sauces, kids */}
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Burgers, Wraps &amp; Tacos</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Provisions Ham Burger" price="$28.50" desc="Provisions mayo, lettuce, double bacon, double patty, pickle" />
                  <MenuItem name="The Aussie Heatwave" price="$28.50" desc="Beef patty, egg, bacon, ketchup, cheese, lettuce" />
                  <MenuItem name="The Cluckstore" price="$26.50" desc="Grilled chicken, lettuce, tomato, provisions mayo, onion" />
                  <MenuItem name="Spicy Chick" price="$26.50" desc="Grilled chicken, sriracha mayo, tomato, cheese, lettuce" />
                  <MenuItem name="Veggie Supreme" tag="V" price="$26.50" desc="Veggie patty, lettuce, tomato, cheese, onion, provisions mayo" />
                </div>

                <p style={{ ...eyebrow, textAlign: "center", margin: "22px 0 14px" }}>· Wraps ·</p>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Falafel Fusion" tag="V" price="$26.50" desc="Mayo, falafel, rocket, onion, capsicum, cheese, hummus" />
                  <MenuItem name="Spicy Mex-Chick" price="$26.50" desc="Chicken, lettuce, tomato, cheese, salsa, sriracha mayo" />
                  <MenuItem name="Leaf Me Alone" tag="V" price="$26.50" desc="Mayo, guacamole, tomato, lettuce, capsicum, feta" />
                </div>

                <p style={{ ...eyebrow, textAlign: "center", margin: "22px 0 14px" }}>· Tacos — serve of three ·</p>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Falafel" tag="V" price="$22.50" desc="Salsa, mayo, lettuce" />
                  <MenuItem name="Chicken" price="$22.50" desc="Salsa, mayo, lettuce" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Sides</MenuHeading>
                <div style={{ display: "grid", gap: 11 }}>
                  <MenuItem name="Calamari & Chips" price="$14.50" />
                  <MenuItem name="Halloumi" price="$6" />
                  <MenuItem name="Avocado" price="$6" />
                  <MenuItem name="Bacon (2pc)" price="$8" />
                  <MenuItem name="Smoked Salmon" price="$8" />
                  <MenuItem name="Choice of Egg" price="$6" />
                  <MenuItem name="Hashbrown" price="$4" />
                  <MenuItem name="Onion Rings" price="$12" />
                  <MenuItem name="Mushroom / Spinach / Tomato" price="$4" />
                  <MenuItem name="Fries Bowl" price="$10" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Sauces</MenuHeading>
                <div style={{ display: "grid", gap: 11 }}>
                  <MenuItem name="Pesto" price="$2.50" />
                  <MenuItem name="Hollandaise" price="$2.50" />
                  <MenuItem name="Provisions Mayo" price="$2.50" />
                  <MenuItem name="Mayo" price="$2.50" />
                  <MenuItem name="Barbeque" price="$2.50" />
                  <MenuItem name="Ketchup" price="$2.50" />
                  <MenuItem name="Hot Sauce" price="$2.50" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Kids Menu</MenuHeading>
                <div style={{ display: "grid", gap: 11 }}>
                  <MenuItem name="Kids Scramble" price="$10" />
                  <MenuItem name="Cheeseburger & Chips" price="$15" />
                  <MenuItem name="Nuggets & Chips" price="$12.50" />
                  <MenuItem name="Pancakes & Maple Syrup" price="$15" />
                </div>
                <p style={{ ...noteText, fontStyle: "italic", margin: "12px 0 0" }}>Add jam or fruit to any kids pancake.</p>
              </div>
            </div>
          </div>

          <p
            data-reveal="true"
            style={{
              margin: "clamp(30px, 4vw, 44px) auto 0",
              maxWidth: "70ch",
              textAlign: "center",
              fontStyle: "italic",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#6B564A",
            }}
          >
            Please let our team know of any allergies or dietary requirements. While
            all care is taken, we can&apos;t guarantee our food is 100% allergen free.
          </p>

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
