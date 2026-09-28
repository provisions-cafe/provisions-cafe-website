import type { CSSProperties } from "react";

/** Decorative corner gull illustration. Always aria-hidden. */
export default function GullImg({
  src,
  style,
}: {
  src: string;
  style: CSSProperties;
}) {
  // Decorative assets are shipped as WebP (~85% smaller than the PNGs) and never
  // block: lazy-loaded, async-decoded, low fetch priority.
  const webp = src.replace(/\.png$/, ".webp");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={webp}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      style={{ pointerEvents: "none", position: "absolute", ...style }}
    />
  );
}
