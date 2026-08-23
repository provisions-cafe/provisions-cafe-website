# Provisions Cafe

Marketing site for Provisions Cafe, Williamstown — reworked from a Claude Design
export into a **Next.js (App Router) + TypeScript** project.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Structure

```
app/
  layout.tsx          Root layout: fonts, metadata, reveal controller
  globals.css         Base styles, keyframes, hover helpers, reveal system
  page.tsx            Home ("/")
  menu/page.tsx       "/menu"
  our-story/page.tsx  "/our-story"
  gallery/page.tsx    "/gallery"
  functions/page.tsx  "/functions"
  contact/page.tsx    "/contact"
components/
  SiteHeader.tsx      Sticky nav — solid, plus a transparent-over-hero variant
  SiteFooter.tsx      Shared footer with drifting waves
  WaveDivider.tsx     Section divider with the steaming-cup mark
  HoursTable.tsx      Opening hours, highlights today's row
  ImageSlot.tsx       Image, or a captioned placeholder frame
  GullImg.tsx         Decorative corner gull
  RevealController.tsx Scroll-reveal for [data-reveal] elements
  EnquiryForm.tsx     Shared Functions / Contact form
  menu.tsx            MenuHeading / MenuItem / DietTag / CoffeeSteam
  site-data.ts        Nav, hours, links, contact details (single source)
  home/Hero.tsx       Home hero: cross-fading photos, dots, flying gulls
  gallery/GalleryGrid.tsx  Gallery grid + lightbox
public/
  assets/             Decorative gull illustrations (PNG)
  uploads/            Cafe photos (WebP)
```

## Notes on the conversion

- The original design used a bespoke `<x-dc>` React runtime with inline styles.
  Behaviour from `site.js` / the per-page scripts (sticky-nav transitions, hero
  carousel, scroll reveal, today's-hours highlight, gallery lightbox, form
  submit state) is reimplemented with React hooks in client components. Purely
  presentational pages stay server components.
- Fonts (Petrona + Karla) load from Google Fonts, matching the original.
- Layout/spacing is preserved as inline style objects; repeated concerns
  (base styles, `@keyframes`, `:hover` states, the reveal transition) live in
  `globals.css`.
- **Images:** the design placeholders (`<image-slot>`) were drop-targets in the
  design tool. Here they render the photo when present, or a captioned frame
  when not. One source photo (`unnamed (1).webp`) exceeded the design import
  API's 256 KiB per-file cap and could not be retrieved intact, so the two
  remaining photos are reused where it appeared. Drop a replacement into
  `public/uploads/` and update the `src` in `components/home/Hero.tsx` /
  `app/page.tsx` to restore it.
- The "TO FILL" notes are intentional — they mark copy the cafe still needs to
  supply (reviews, functions pricing, parking, email, Instagram).
