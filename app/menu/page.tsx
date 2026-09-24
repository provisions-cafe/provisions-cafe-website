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
            <span style={legendItem}>
              <DietTag>GFA</DietTag> Gluten free available
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
            {/* Column 1 — breakfast */}
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Breakfast</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Toast" price="$11.50" desc="Butter, Vegemite or jam on your choice of sourdough, multigrain, wholemeal or white (GF optional)" />
                  <MenuItem name="Eggs on Toast" price="$14.50" desc="Two eggs cooked your way on white sourdough or multigrain toast — add bacon +$3" />
                  <MenuItem name="Avocado Smash" tags={["V", "GFA"]} price="$22.50" desc="Smashed avocado, garlic sautéed mushroom & spinach, feta, medley tomatoes, poached eggs, dukkha, balsamic glaze on bread" />
                  <MenuItem name="Bruschetta" tags={["V", "GFA"]} price="$22.50" desc="Bocconcini, tomato, shallots, basil, garlic and herb toast" />
                  <MenuItem name="Provisions Big Breakfast" price="$27.50" desc="Bacon, spinach & mushroom, grilled tomato, hashbrown, sausage, avocado and eggs your way, on choice of bread" />
                  <MenuItem name="Beef Ragu Shakshuka" price="$24.50" desc="Chef's special oven-baked beefy shakshuka, bell pepper, two eggs in sauce, served with garlic pitta bread" />
                  <MenuItem name="Smoked Salmon" price="$25.90" desc="Seared asparagus with smoked salmon gribiche on sourdough, poached eggs, hollandaise" />
                  <MenuItem name="Provisions Breaksuka Burger" price="$24.50" desc="Homemade hashbrown, bacon, fried egg, caramelised onion, cheese, tomato relish, lettuce, in a brioche bun and fries" />
                  <MenuItem name="Zucchini & Corn Fritters" tag="V" price="$23.50" desc="Rocket, parmesan & pear salad, avocado, tomato salsa, poached egg, lemon wedge & romesco" />
                  <MenuItem name="Chilli Scrambled Eggs" price="$22.90" desc="Bacon, spring onions, fresh chilli, fried shallots, parmesan, on white toast" />
                  <MenuItem name="Hash Stack" price="$23.50" desc="Two homemade potato rosti, crispy bacon, poached eggs, hollandaise and alfalfa sprouts — add salmon +$4" />
                  <MenuItem name="Caesar Salad" price="$22.50" desc="Cos lettuce, crispy bacon, garlic croutons, poached egg, parmesan and Caesar dressing" />
                  <MenuItem name="Pancakes" price="$22.50" desc="Two pancakes with fresh fruit & berries, maple syrup, vanilla ice cream and lemon balm" />
                </div>
              </div>
            </div>

            {/* Column 2 — lunch: wraps, small plates, sandwiches & burgers */}
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Wraps &amp; Focaccia</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Chicken Wrap" price="$17.50" desc="Grilled chicken with lettuce, onion, tomato, tasty cheese and mayo" />
                  <MenuItem name="Lamb Wrap" price="$18.50" desc="Pulled lamb with lettuce, onion, tomato and tzatziki" />
                  <MenuItem name="Grilled Vegetable Focaccia" tag="V" price="$17.50" desc="Eggplant, capsicum, zucchini, caramelised onion, cheese and tomato relish" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Small Plates</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Beef Arancini" price="$16.50" desc="Slow-cooked beef ragu, mozzarella, with tomato sugo" />
                  <MenuItem name="Calamari Fritti" price="$18.50" desc="Served with rocket salad, lemon wedge and mayo" />
                  <MenuItem name="Crispy Fried Chicken Ribs" price="$21.50" desc="Crispy fried chicken with coleslaw, sesame seed and hot sauce" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Sandwiches &amp; Burgers</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Provisions Chicken Sandwich" price="$22.50" desc="Chicken, cheese, avocado, celery, spring onions and mayo" />
                  <MenuItem name="Provisions Steak Sandwich" price="$25.50" desc="Beef strip loin, caramelised onion, red pepper, cheese, tomato relish, mustard mayo, lettuce, in a Turkish roll with chips" />
                  <MenuItem name="Halloumi Burger" tag="V" price="$24.50" desc="Grilled halloumi, avocado, tomato, lettuce, caramelised onion, sweet chilli mayo, served with fries" />
                  <MenuItem name="Chicken Burger" price="$24.50" desc="Crispy fried chicken, coleslaw, cheddar, sriracha mayo and fries — swap to grilled chicken on request" />
                  <MenuItem name="Wagyu Cheeseburger" price="$24.50" desc="Beef patty, lettuce, tomato, pickled cucumber, caramelised onion, American cheese, burger sauce, chips" />
                </div>
              </div>
            </div>

            {/* Column 3 — mains, salads, sides, dessert, kids */}
            <div data-reveal="true" style={{ display: "grid", gap: "clamp(28px, 4vw, 40px)" }}>
              <div>
                <MenuHeading as="h2">Mains</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Grilled Pork Sausage" price="$22.50" desc="Served with homemade potato rosti, shallots and red wine jus" />
                  <MenuItem name="Chicken Parma" price="$22.50" desc="Homemade Napoli sauce, mozzarella, ham, side chips and garden salad" />
                  <MenuItem name="Market Fish" tag="GF" price="$25.90" desc="Fresh market fish with chips and garden salad" />
                  <MenuItem name="Butter Chicken" price="$25.50" desc="Butter-enriched tomato-creamy sauce with onion, almond and cashew nuts, served with rice and pita bread" />
                  <MenuItem name="Vegetarian Lasagne" tag="V" price="$21.50" desc="Pumpkin, zucchini, mushroom, spinach, onion, herbed béchamel and side salad" />
                  <MenuItem name="Beef Lasagne" price="$25.50" desc="Beef bolognese ragu with creamy béchamel and shaved parmesan on top" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Salads</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Pulled Lamb Salad" price="$23.50" desc="Rocket, spinach, lentils, cherry tomatoes, onion, feta, with lemon mustard dressing" />
                  <MenuItem name="Grilled Chicken Salad" price="$23.50" desc="Mixed leaf salad, tomato, onion, radish, croutons with lemon dressing" />
                  <MenuItem name="Calamari Salad" price="$23.50" desc="Mixed leaf, cherry tomatoes, cucumber, lemon wedge, with house-made dressing" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Sides</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Beer Battered Potato Wedges" price="$12.50" desc="Served with sour cream and sweet chilli sauce" />
                  <MenuItem name="Chips" price="$10.50" desc="With tomato ketchup" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Dessert</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Crème Brûlée" price="$16.50" />
                  <MenuItem name="Apple & Rhubarb Crumble" price="$16.50" desc="Served with vanilla ice cream" />
                </div>
              </div>

              <div>
                <MenuHeading as="h2">Kids Meal</MenuHeading>
                <div style={{ display: "grid", gap: 16 }}>
                  <MenuItem name="Cheese Toast" price="$9.50" />
                  <MenuItem name="Chicken Popcorn & Chips" price="$12.50" />
                  <MenuItem name="Pancake" price="$12.50" desc="Fresh seasonal fruits and berries, vanilla ice cream and maple syrup" />
                  <MenuItem name="Kids Burger" price="$14.50" desc="Beef patty with chips and tomato sauce" />
                  <MenuItem name="Fish & Chips" price="$14.50" desc="Beer battered fish with chips and tomato sauce" />
                  <MenuItem name="Kids Pasta" price="$14.50" desc="Spaghetti with beef bolognese and parmesan" />
                </div>
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
