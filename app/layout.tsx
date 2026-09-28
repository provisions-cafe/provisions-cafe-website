import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import RevealController from "@/components/RevealController";
import StructuredData from "@/components/StructuredData";
import TopProgressBar from "@/components/TopProgressBar";
import { SITE_URL } from "@/components/site-data";

const DESCRIPTION =
  "Coffee, breakfast and lunch two streets back from the water on Ferguson St, Williamstown. Open 7am–3pm, seven days.";
const OG_DESCRIPTION =
  "All day, by the bay. Coffee, breakfast and lunch on Ferguson St, Williamstown.";

// Google Fonts stylesheet. Loaded non-render-blocking (preload + media="print"
// swap) so it never blocks first paint — worth ~1.7s on mobile. The literal
// "Petrona"/"Karla" family names it defines keep every inline fontFamily working.
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Petrona:ital,wght@0,400;0,500;0,600;1,400&family=Karla:wght@400;500;600&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Provisions Cafe — Williamstown",
    template: "%s · Provisions Cafe",
  },
  description: DESCRIPTION,
  applicationName: "Provisions Cafe",
  keywords: [
    "Provisions Cafe",
    "Williamstown cafe",
    "Ferguson St",
    "breakfast Williamstown",
    "brunch Williamstown",
    "coffee",
    "lunch",
  ],
  authors: [{ name: "Provisions Cafe" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "Provisions Cafe",
    locale: "en_AU",
    url: SITE_URL,
    title: "Provisions Cafe — Williamstown",
    description: OG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Provisions Cafe — Williamstown",
    description: OG_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1E4359",
  colorScheme: "light",
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
        {/* Non-render-blocking font load: preload the CSS, attach it as
            media="print" (so it downloads without blocking paint), then flip to
            media="all" once it has loaded. */}
        <link rel="preload" as="style" href={FONT_HREF} />
        <link rel="stylesheet" href={FONT_HREF} media="print" data-font="" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.querySelector('link[data-font]');if(!l)return;function a(){l.media='all'}if(l.sheet)a();else l.addEventListener('load',a)})();",
          }}
        />
        <noscript>
          {/* eslint-disable-next-line react/no-danger */}
          <link rel="stylesheet" href={FONT_HREF} />
        </noscript>
        {/* If JS is unavailable, reveal-tagged sections must still be visible. */}
        <noscript>
          {/* eslint-disable-next-line react/no-danger */}
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <TopProgressBar />
        <StructuredData />
        <RevealController />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
