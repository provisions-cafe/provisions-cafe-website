import Image from "next/image";

/**
 * Port of the design's `<image-slot>` placeholder. Renders the image when a
 * `src` is supplied (via next/image so it's resized to the displayed size and
 * served as AVIF/WebP), or a captioned placeholder frame when it isn't. Always
 * fills its (already sized, position:relative) parent.
 *
 * `sizes` should describe how wide the image renders so the optimizer can pick
 * the right resolution — pass a context-specific value from each caller.
 * Remote override URLs (http…) pass through un-optimized (no host allow-list
 * needed); local /uploads paths are optimized.
 */
export default function ImageSlot({
  src,
  placeholder,
  alt,
  fit = "cover",
  sizes = "100vw",
  priority = false,
}: {
  src?: string;
  placeholder?: string;
  alt?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    const remote = /^https?:\/\//.test(src);
    return (
      <Image
        src={src}
        alt={alt ?? placeholder ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={remote}
        style={{ objectFit: fit, display: "block" }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
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
