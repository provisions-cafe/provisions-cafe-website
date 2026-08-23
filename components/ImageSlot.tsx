import type { CSSProperties } from "react";

/**
 * Port of the design's `<image-slot>` placeholder. In the design tool it was a
 * drop-target that persisted a user image; here it simply renders the image
 * when a `src` is supplied, or a captioned placeholder frame when it isn't.
 * Always fills its (already sized) parent.
 */
export default function ImageSlot({
  src,
  placeholder,
  alt,
  fit = "cover",
}: {
  src?: string;
  placeholder?: string;
  alt?: string;
  fit?: "cover" | "contain";
}) {
  const fill: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? placeholder ?? ""}
        loading="lazy"
        style={{ ...fill, objectFit: fit, display: "block" }}
      />
    );
  }

  return (
    <div
      style={{
        ...fill,
        display: "grid",
        placeItems: "center",
        padding: 18,
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          maxWidth: "32ch",
          fontSize: 13.5,
          lineHeight: 1.5,
          color: "#9A8877",
        }}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flex: "none", opacity: 0.7 }}
        >
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="#9A8877" strokeWidth="1.5" />
          <circle cx="8.5" cy="9.5" r="1.8" stroke="#9A8877" strokeWidth="1.5" />
          <path d="M4 17l5-4 4 3 3-2.5 4 3.5" stroke="#9A8877" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {placeholder}
      </span>
    </div>
  );
}
