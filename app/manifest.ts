import type { MetadataRoute } from "next";

// Web app manifest: name, theme colour and icons for browser tabs, the "Add to
// Home Screen" prompt and search results. theme_color matches the viewport
// themeColor in app/layout.tsx and the OG card's navy.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Provisions Cafe — Williamstown",
    short_name: "Provisions",
    description:
      "Coffee, breakfast and lunch on Ferguson St, Williamstown. Open 7am–3pm, seven days.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7EF",
    theme_color: "#1E4359",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
