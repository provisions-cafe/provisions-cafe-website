/**
 * The oat-coloured section divider: two drifting wave lines with a little
 * steaming coffee cup centred on top. Used between most page sections.
 */
export default function WaveDivider() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "relative", height: 74, overflow: "hidden" }}
    >
      <svg
        data-anim="1"
        viewBox="0 0 1440 30"
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: 20,
          width: "200%",
          height: 30,
          opacity: 0.5,
          animation: "drift-l 34s linear infinite",
        }}
      >
        <path
          d="M0 15q90-12 180 0t180 0 180 0 180 0 180 0 180 0 180 0 180 0"
          stroke="#1E4359"
          strokeWidth="1.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        data-anim="1"
        viewBox="0 0 1440 30"
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: 8,
          width: "200%",
          height: 30,
          opacity: 0.32,
          animation: "drift-r 46s linear infinite",
        }}
      >
        <path
          d="M0 15q120-13 240 0t240 0 240 0 240 0 240 0 240 0"
          stroke="#1E4359"
          strokeWidth="1.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 4,
          transform: "translateX(-50%)",
          padding: "0 20px",
          background: "#F7F1E6",
        }}
      >
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none" style={{ display: "block" }}>
          <path
            data-anim="1"
            d="M22 42c-6-5 6-9 0-14-4-4 1-8 1-8"
            stroke="#A9762B"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ animation: "steam-rise 4.2s ease-in-out infinite" }}
          />
          <path
            data-anim="1"
            d="M38 40c-6-6 6-10 0-15-4-4 1-8 1-8"
            stroke="#A9762B"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ animation: "steam-rise 4.2s ease-in-out .6s infinite" }}
          />
          <path
            data-anim="1"
            d="M54 42c-6-5 6-9 0-14-4-4 1-8 1-8"
            stroke="#A9762B"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ animation: "steam-rise 4.2s ease-in-out 1.2s infinite" }}
          />
        </svg>
      </div>
    </div>
  );
}
