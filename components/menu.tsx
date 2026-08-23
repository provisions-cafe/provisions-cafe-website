import type { CSSProperties, ReactNode } from "react";

const nameStyle: CSSProperties = {
  fontFamily: "Petrona, Georgia, serif",
  fontSize: 20,
  color: "#3A2B22",
};
const priceStyle: CSSProperties = {
  fontFamily: "Petrona, Georgia, serif",
  fontSize: 20,
  color: "#1E4359",
};
const leaderStyle: CSSProperties = {
  flex: 1,
  borderBottom: "1.5px dotted rgba(58,43,34,.35)",
  transform: "translateY(-4px)",
};
const subStyle: CSSProperties = { fontSize: 15.5, color: "#6B564A" };

/** Little bordered dietary code, e.g. V / VG / GF / GFO. */
export function DietTag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "Karla, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: ".08em",
        color: "#A9762B",
        border: "1px solid rgba(169,118,43,.5)",
        borderRadius: 3,
        padding: "1px 5px",
      }}
    >
      {children}
    </span>
  );
}

/** Small steaming-cup mark used beside the "Coffee & drinks" heading. */
export function CoffeeSteam() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="16"
      viewBox="0 0 36 16"
      fill="none"
      style={{ marginLeft: 9, verticalAlign: -3 }}
    >
      <path data-anim="1" d="M5 14c-4-3 4-5 0-8-2-2 .6-4 .6-4" stroke="#A9762B" strokeWidth="1.3" strokeLinecap="round" style={{ animation: "steam-rise 4.2s ease-in-out infinite" }} />
      <path data-anim="1" d="M16 14c-4-3 4-5 0-8-2-2 .6-4 .6-4" stroke="#A9762B" strokeWidth="1.3" strokeLinecap="round" style={{ animation: "steam-rise 4.2s ease-in-out .6s infinite" }} />
      <path data-anim="1" d="M27 14c-4-3 4-5 0-8-2-2 .6-4 .6-4" stroke="#A9762B" strokeWidth="1.3" strokeLinecap="round" style={{ animation: "steam-rise 4.2s ease-in-out 1.2s infinite" }} />
    </svg>
  );
}

export function MenuHeading({
  as = "h3",
  children,
}: {
  as?: "h2" | "h3";
  children: ReactNode;
}) {
  const Tag = as;
  return (
    <Tag
      style={{
        margin: "0 0 16px",
        paddingBottom: 8,
        borderBottom: "1.5px solid rgba(30,67,89,.3)",
        fontFamily: "Karla, sans-serif",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: ".2em",
        textTransform: "uppercase",
        color: "#1E4359",
      }}
    >
      {children}
    </Tag>
  );
}

export function MenuItem({
  name,
  price,
  desc,
  sub,
  tag,
}: {
  name: string;
  price: string;
  desc?: string;
  sub?: string;
  tag?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={nameStyle}>
          {name}
          {sub ? (
            <>
              {" "}
              <span style={subStyle}>({sub})</span>
            </>
          ) : null}
          {tag ? (
            <>
              {" "}
              <DietTag>{tag}</DietTag>
            </>
          ) : null}
        </span>
        <span style={leaderStyle} />
        <span style={priceStyle}>{price}</span>
      </div>
      {desc ? (
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 15,
            lineHeight: 1.5,
            color: "#6B564A",
            maxWidth: "42ch",
          }}
        >
          {desc}
        </p>
      ) : null}
    </div>
  );
}
