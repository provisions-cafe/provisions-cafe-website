import { ImageResponse } from "next/og";

// Apple touch icon (home-screen icon on iOS/iPadOS). iOS ignores the SVG
// favicon, so this 180×180 PNG mirrors the brand: navy field, gold monogram.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E4359",
          color: "#E9C98E",
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
