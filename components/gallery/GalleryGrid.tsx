"use client";

import { useEffect, useState, type CSSProperties } from "react";
import ImageSlot from "@/components/ImageSlot";

type Tile = { id: string; placeholder: string; label: string };
type Group = { title: string; aspect: string; tiles: Tile[] };

const GROUPS: Group[] = [
  {
    title: "The space",
    aspect: "4 / 5",
    tiles: [
      { id: "gal-space-1", placeholder: "Window bar, morning light", label: "The space — window bar, morning light" },
      { id: "gal-space-2", placeholder: "Blue walls and timber floor", label: "The space — blue walls and timber floor" },
      { id: "gal-space-3", placeholder: "Out the front, Ferguson St", label: "The space — out the front on Ferguson St" },
    ],
  },
  {
    title: "The food",
    aspect: "1 / 1",
    tiles: [
      { id: "gal-food-1", placeholder: "Big breaky", label: "The food — big breaky" },
      { id: "gal-food-2", placeholder: "Pancakes, short stack", label: "The food — fruit salad pancakes" },
      { id: "gal-food-3", placeholder: "Coffee on the counter", label: "The food — coffee on the counter" },
    ],
  },
  {
    title: "The neighbourhood",
    aspect: "3 / 2",
    tiles: [
      { id: "gal-hood-1", placeholder: "Ferguson St", label: "The neighbourhood — Ferguson St" },
      { id: "gal-hood-2", placeholder: "Down at the water", label: "The neighbourhood — down at the water" },
      { id: "gal-hood-3", placeholder: "Storefront", label: "The neighbourhood — the storefront" },
    ],
  },
];

const groupHeading: CSSProperties = {
  margin: "0 0 18px",
  paddingBottom: 8,
  borderBottom: "1.5px solid rgba(30,67,89,.3)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#1E4359",
};

const enlargeBtn: CSSProperties = {
  position: "absolute",
  right: 6,
  bottom: 6,
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "8px 16px",
  border: "none",
  borderRadius: 999,
  background: "rgba(30,67,89,.86)",
  color: "#FBF7EF",
  fontFamily: "Karla, sans-serif",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
};

export default function GalleryGrid() {
  const [open, setOpen] = useState<{ placeholder: string; label: string } | null>(
    null,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <section
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 clamp(18px, 4vw, 40px) clamp(48px, 8vw, 90px)",
          display: "grid",
          gap: "clamp(40px, 6vw, 72px)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/gull-diag.png"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", zIndex: -1, left: -90, bottom: "4%", width: "min(34vw, 300px)", opacity: 0.32, transform: "rotate(-7deg)", pointerEvents: "none" }}
        />

        {GROUPS.map((group) => (
          <div key={group.title} data-reveal="true">
            <h2 style={groupHeading}>{group.title}</h2>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {group.tiles.map((tile) => (
                <div
                  key={tile.id}
                  style={{
                    position: "relative",
                    aspectRatio: group.aspect,
                    borderRadius: 6,
                    overflow: "hidden",
                    background: "#EDE4D4",
                  }}
                >
                  <ImageSlot placeholder={tile.placeholder} />
                  <button
                    type="button"
                    className="hv-enlarge"
                    onClick={() => setOpen({ placeholder: tile.placeholder, label: tile.label })}
                    style={enlargeBtn}
                  >
                    Enlarge
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          data-reveal="true"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 16,
            padding: "18px 20px",
            border: "1px dashed rgba(169,118,43,.6)",
            borderRadius: 4,
            background: "rgba(169,118,43,.07)",
          }}
        >
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "#8A5F22", maxWidth: "62ch" }}>
            <strong style={{ letterSpacing: ".1em", fontSize: 12.5 }}>TO FILL · INSTAGRAM</strong>
            <br />
            No Instagram yet as far as we know. Send the handle and this becomes a live &ldquo;Follow along&rdquo; link here and in the footer.
          </p>
        </div>
      </section>

      {open && (
        <div
          data-anim="1"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo"
          onClick={() => setOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 4vw, 48px)",
            background: "rgba(18,42,58,.93)",
            animation: "fade-in .25s ease both",
          }}
        >
          <div style={{ position: "relative", width: "min(1000px, 100%)", maxHeight: "100%", display: "grid", gap: 12 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", borderRadius: 6, overflow: "hidden", background: "#2A5670" }}>
              <ImageSlot fit="contain" placeholder="Drop a photo here" />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontSize: 15.5, color: "rgba(241,233,218,.85)" }}>{open.label}</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="hv-ghost-light"
                style={{
                  minHeight: 44,
                  padding: "10px 22px",
                  border: "1.5px solid rgba(241,233,218,.45)",
                  borderRadius: 999,
                  background: "transparent",
                  color: "#F1E9DA",
                  fontFamily: "Karla, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
