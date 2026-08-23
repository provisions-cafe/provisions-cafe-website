"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import ImageSlot from "@/components/ImageSlot";
import { BOOK_URL, ORDER_URL } from "@/components/site-data";

// Only two source photos survived import, so the hero cross-fades between them.
const SLIDES = [
  { src: "/uploads/dining-room.webp", alt: "The dining room" },
  { src: "/uploads/counter.webp", alt: "The counter, mid-morning" },
];

const GULLS = [
  { top: "5%", cross: "52s", delay: "0s", glide: "12s", w: 64, h: 29, opacity: 0.5, wing: "3.4s" },
  { top: "26%", cross: "38s", delay: "4s", glide: "9s", w: 48, h: 22, opacity: 0.42, wing: "2.9s" },
  { top: "8%", cross: "62s", delay: "22s", glide: "14s", w: 34, h: 15, opacity: 0.34, wing: "5.2s" },
  { top: "34%", cross: "88s", delay: "34s", glide: "18s", w: 72, h: 32, opacity: 0.28, wing: "3.9s" },
  { top: "13%", cross: "74s", delay: "9s", glide: "16s", w: 42, h: 19, opacity: 0.26, wing: "4.6s" },
];

function Gull({ g }: { g: (typeof GULLS)[number] }) {
  return (
    <div
      data-anim="1"
      style={{
        position: "absolute",
        top: g.top,
        left: "-12%",
        animation: `gull-cross ${g.cross} linear ${g.delay} infinite`,
      }}
    >
      <div data-anim="1" style={{ animation: `glide-y ${g.glide} ease-in-out infinite` }}>
        <svg width={g.w} height={g.h} viewBox="0 0 40 18" fill="none" style={{ opacity: g.opacity }}>
          <g
            data-anim="1"
            style={{ animation: `wing-l ${g.wing} ease-in-out infinite`, transformBox: "fill-box", transformOrigin: "100% 100%" }}
          >
            <path d="M20 11C13.5 4.2 8 3.4 2 7.2" stroke="#F1E9DA" strokeWidth="1.7" strokeLinecap="round" fill="none" />
          </g>
          <g
            data-anim="1"
            style={{ animation: `wing-r ${g.wing} ease-in-out infinite`, transformBox: "fill-box", transformOrigin: "0% 100%" }}
          >
            <path d="M20 11c6.5-6.8 12-7.6 18-3.8" stroke="#F1E9DA" strokeWidth="1.7" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}

const tileBase: CSSProperties = {
  position: "relative",
  aspectRatio: "1 / 1",
  borderRadius: 6,
  overflow: "hidden",
  border: "1px solid rgba(241,233,218,.35)",
  boxShadow: "0 24px 44px -28px rgba(10,24,34,.85)",
  background: "rgba(20,40,55,.3)",
};

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const pauseUntil = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setSlide((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const pickSlide = (i: number) => {
    pauseUntil.current = Date.now() + 15000;
    setSlide(i);
  };

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        minHeight: "clamp(560px, 80vh, 840px)",
        background: "#1E4359",
      }}
    >
      {/* Cross-fading background photos + tint */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === slide ? 1 : 0,
              pointerEvents: i === slide ? "auto" : "none",
              transition: "opacity 1.4s ease",
            }}
          >
            <ImageSlot src={s.src} placeholder={s.alt} />
          </div>
        ))}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(16,34,48,.72) 0%, rgba(23,55,74,.76) 45%, rgba(13,28,40,.88) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(28px, 4vw, 52px)",
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "clamp(104px, 11vw, 142px) clamp(18px, 4vw, 40px) clamp(56px, 9vw, 100px)",
        }}
      >
        {/* Flying gulls */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: "100vw",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {GULLS.map((g, i) => (
            <Gull key={i} g={g} />
          ))}
        </div>

        {/* Copy */}
        <div style={{ position: "relative", zIndex: 1, flex: "1 1 320px", order: 1 }}>
          <div
            data-anim="1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "7px 14px 7px 11px",
              border: "1px solid rgba(241,233,218,.42)",
              borderRadius: 999,
              background: "rgba(20,40,55,.42)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              fontSize: 13.5,
              letterSpacing: ".02em",
              color: "#F1E9DA",
              marginBottom: 22,
              animation: "rise-in .7s cubic-bezier(.22,.7,.3,1) .05s both",
            }}
          >
            <span
              data-anim="1"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4E7A4A",
                boxShadow: "0 0 0 3px rgba(78,122,74,.18)",
                animation: "glow-dot 3.4s ease-in-out infinite",
              }}
            />
            Open today · until 3pm
          </div>
          <p
            data-anim="1"
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "#E9C98E",
              animation: "rise-in .7s cubic-bezier(.22,.7,.3,1) .16s both",
            }}
          >
            Williamstown · Ferguson St
          </p>
          <h1
            style={{
              margin: "0 0 14px",
              fontFamily: "Petrona, Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(42px, 7.5vw, 76px)",
              lineHeight: 1.02,
              letterSpacing: "-.025em",
              color: "#FBF7EF",
              textShadow: "0 2px 18px rgba(14,30,42,.35)",
              textWrap: "balance",
            }}
          >
            <span data-anim="1" style={{ display: "block", animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .26s both" }}>
              All day,
            </span>
            <span data-anim="1" style={{ display: "block", animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .4s both" }}>
              by the bay.
            </span>
          </h1>
          <div
            data-anim="1"
            aria-hidden="true"
            style={{
              position: "relative",
              width: "clamp(150px, 22vw, 210px)",
              height: 16,
              overflow: "hidden",
              margin: "0 0 22px",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .52s both",
            }}
          >
            <svg
              data-anim="1"
              viewBox="0 0 400 16"
              preserveAspectRatio="none"
              fill="none"
              style={{ position: "absolute", left: 0, top: 0, width: "200%", height: 16, opacity: 0.6, animation: "drift-l 12s linear infinite" }}
            >
              <path d="M0 8q25-7 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" stroke="#E9C98E" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <p
            data-anim="1"
            style={{
              margin: "0 0 30px",
              maxWidth: "44ch",
              fontSize: "clamp(17px, 1.5vw, 19px)",
              lineHeight: 1.6,
              color: "rgba(241,233,218,.92)",
              textWrap: "pretty",
              animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .58s both",
            }}
          >
            Coffee, breakfast and lunch two streets back from the water — open from 7am, seven days.
          </p>
          <div
            data-anim="1"
            style={{ display: "flex", flexWrap: "wrap", gap: 12, animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .7s both" }}
          >
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
            <a
              href={ORDER_URL}
              target="_blank"
              rel="noopener"
              className="hv-ghost-light"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                padding: "15px 26px",
                borderRadius: 999,
                background: "rgba(20,40,55,.35)",
                border: "1.5px solid rgba(241,233,218,.5)",
                color: "#F1E9DA",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Order online
            </a>
          </div>
        </div>

        {/* Slide dots */}
        <div
          data-anim="1"
          style={{
            flex: "1 1 100%",
            order: 3,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
            animation: "rise-in .8s cubic-bezier(.22,.7,.3,1) .82s both",
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Show hero photo ${i + 1}`}
              aria-current={i === slide}
              onClick={() => pickSlide(i)}
              style={{
                display: "grid",
                placeItems: "center",
                width: 44,
                height: 44,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 28,
                  height: 3,
                  borderRadius: 2,
                  background: i === slide ? "#E9C98E" : "rgba(241,233,218,.4)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Floating photo tiles */}
        <div
          data-anim="1"
          style={{
            flex: "0 1 430px",
            order: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(10px, 1.4vw, 14px)",
            animation: "rise-in 1s cubic-bezier(.22,.7,.3,1) .46s both",
          }}
        >
          <div data-anim="1" style={{ ...tileBase, animation: "tile-float 9s ease-in-out infinite" }}>
            <ImageSlot src="/uploads/counter.webp" placeholder="Coffee on the bar" />
          </div>
          <div data-anim="1" style={{ ...tileBase, transform: "translateY(20px)", animation: "tile-float-off 12s ease-in-out .8s infinite" }}>
            <ImageSlot src="/uploads/dining-room.webp" placeholder="The dining room" />
          </div>
          <div data-anim="1" style={{ ...tileBase, animation: "tile-float 11s ease-in-out 1.6s infinite" }}>
            <ImageSlot src="/uploads/counter.webp" placeholder="The counter, mid-morning" />
          </div>
          <div data-anim="1" style={{ ...tileBase, transform: "translateY(20px)", animation: "tile-float-off 10s ease-in-out 2.4s infinite" }}>
            <ImageSlot placeholder="Out the front on Ferguson St" />
          </div>
          <p style={{ gridColumn: "1 / -1", margin: "26px 0 0", fontSize: 14, lineHeight: 1.5, color: "rgba(241,233,218,.75)" }}>
            Drop your photos onto any frame.{" "}
            <Link href="/gallery" style={{ color: "#E9C98E" }}>
              See the gallery
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
