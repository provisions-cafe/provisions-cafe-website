import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WaveDivider from "@/components/WaveDivider";
import GullImg from "@/components/GullImg";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The place, the food, the walk home — photos of Provisions Cafe in Williamstown.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
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
            src="/assets/gull-soar.png"
            style={{ right: -40, top: -40, width: "min(40vw, 350px)", opacity: 0.32, transform: "rotate(6deg)" }}
          />
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
            Gallery
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
            The place, the food,
            <br />
            the walk home.
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
            Drop photos straight onto any frame below. Tap Enlarge to see one full size.
          </p>
        </section>

        <WaveDivider />

        <GalleryGrid />
      </main>

      <SiteFooter />
    </div>
  );
}
