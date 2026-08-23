import Link from "next/link";
import type { CSSProperties } from "react";
import {
  NAV_ITEMS,
  BOOK_URL,
  ORDER_URL,
  DIRECTIONS_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "./site-data";

const footerLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  fontSize: 15.5,
  color: "rgba(241,233,218,.85)",
};

function Wave({
  top,
  opacity,
  anim,
  d,
}: {
  top: number;
  opacity: number;
  anim: string;
  d: string;
}) {
  return (
    <svg
      data-anim="1"
      viewBox="0 0 1440 30"
      preserveAspectRatio="none"
      fill="none"
      style={{
        position: "absolute",
        left: 0,
        top,
        width: "200%",
        height: 30,
        opacity,
        animation: anim,
      }}
    >
      <path
        d={d}
        stroke="#E9C98E"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function SiteFooter({
  withAnchor = false,
}: {
  withAnchor?: boolean;
}) {
  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#16354A",
        color: "rgba(241,233,218,.8)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 46,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Wave
          top={8}
          opacity={0.3}
          anim="drift-l 40s linear infinite"
          d="M0 15q90-12 180 0t180 0 180 0 180 0 180 0 180 0 180 0 180 0"
        />
        <Wave
          top={20}
          opacity={0.18}
          anim="drift-r 56s linear infinite"
          d="M0 15q120-13 240 0t240 0 240 0 240 0 240 0 240 0"
        />
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "clamp(36px, 5vw, 56px) clamp(18px, 4vw, 40px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                margin: "0 0 10px",
                fontFamily: "Petrona, Georgia, serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#FBF7EF",
              }}
            >
              {withAnchor && (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="24"
                  viewBox="0 0 24 32"
                  fill="none"
                  data-anim="1"
                  style={{
                    flex: "none",
                    animation: "sway 7s ease-in-out infinite",
                    transformBox: "fill-box",
                    transformOrigin: "50% 12%",
                  }}
                >
                  <circle cx="12" cy="4.4" r="2.6" stroke="#E9C98E" strokeWidth="1.5" />
                  <path
                    d="M12 7v20.6M6.6 11.4h10.8M4 18.6c0 5.6 3.6 9 8 9s8-3.4 8-9"
                    stroke="#E9C98E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 18.6 1.7 20.2M4 18.6l1.9 1.9M20 18.6l2.3 1.6M20 18.6l-1.9 1.9"
                    stroke="#E9C98E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              Provisions Cafe
            </p>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6 }}>
              62–64 Ferguson St, Williamstown VIC 3016
              <br />
              <a href={PHONE_HREF} style={{ color: "#E9C98E" }}>
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>

          <nav style={{ display: "grid", gap: 2, justifyItems: "start" }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} style={footerLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "grid", gap: 2, justifyItems: "start" }}>
            <a href={BOOK_URL} target="_blank" rel="noopener" style={footerLink}>
              Book a table
            </a>
            <a href={ORDER_URL} target="_blank" rel="noopener" style={footerLink}>
              Order online
            </a>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener"
              style={footerLink}
            >
              Get directions
            </a>
          </div>
        </div>
        <p
          style={{
            margin: "34px 0 0",
            paddingTop: 20,
            borderTop: "1px solid rgba(241,233,218,.15)",
            fontSize: 14,
            color: "rgba(241,233,218,.6)",
          }}
        >
          © 2026 Provisions Cafe, Williamstown. Open 7 days, 7am – 3pm.
        </p>
      </div>
    </footer>
  );
}
