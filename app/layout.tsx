import type { Metadata } from "next";
import "./globals.css";
import RevealController from "@/components/RevealController";

export const metadata: Metadata = {
  metadataBase: new URL("https://provisionscafe.example"),
  title: {
    default: "Provisions Cafe — Williamstown",
    template: "%s · Provisions Cafe",
  },
  description:
    "Coffee, breakfast and lunch two streets back from the water on Ferguson St, Williamstown. Open 7am–3pm, seven days.",
  openGraph: {
    title: "Provisions Cafe — Williamstown",
    description:
      "All day, by the bay. Coffee, breakfast and lunch on Ferguson St, Williamstown.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Petrona:ital,wght@0,400;0,500;0,600;1,400&family=Karla:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* If JS is unavailable, reveal-tagged sections must still be visible. */}
        <noscript>
          {/* eslint-disable-next-line react/no-danger */}
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <RevealController />
        {children}
      </body>
    </html>
  );
}
