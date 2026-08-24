import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Provisions Cafe — Williamstown. All day, by the bay.";

/** Branded 1200×630 share card, rendered with next/og. */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #1E4359 0%, #16354A 60%, #12293a 100%)",
          color: "#FBF7EF",
          padding: "84px 90px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#E9C98E",
            marginBottom: 24,
          }}
        >
          Williamstown · Ferguson St
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 116,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          Provisions Cafe
        </div>
        <div
          style={{
            display: "flex",
            width: 190,
            height: 7,
            background: "#C79A4E",
            borderRadius: 4,
            margin: "34px 0",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 52,
            color: "rgba(241,233,218,.92)",
          }}
        >
          All day, by the bay.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(241,233,218,.7)",
            marginTop: 30,
          }}
        >
          62–64 Ferguson St · Coffee, breakfast &amp; lunch · 7am–3pm, 7 days
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
