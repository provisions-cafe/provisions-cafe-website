import type { CSSProperties } from "react";

/** Decorative corner gull illustration. Always aria-hidden. */
export default function GullImg({
  src,
  style,
}: {
  src: string;
  style: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{ pointerEvents: "none", position: "absolute", ...style }}
    />
  );
}
