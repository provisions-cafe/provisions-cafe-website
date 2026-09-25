// Image slot registry — the single source of truth for every swappable photo.
// Each slot has a stable id, a human label, a group (for the admin listing), and
// a code default (a /uploads/*.webp already in the repo). The DB table
// `image_overrides` stores optional slot→url rows; getImages() (server) merges
// them over these defaults. No row / Supabase down → the code default renders.

export type ImageSlot = {
  id: string;
  label: string;
  group: string;
  defaultSrc: string;
};

export const HERO_SLIDES: ImageSlot[] = [
  { id: "home.hero.slide.1", group: "Home — hero slideshow", label: "The dining room — blue walls and warm timber floors", defaultSrc: "/uploads/dining-room.webp" },
  { id: "home.hero.slide.2", group: "Home — hero slideshow", label: "Provisions Cafe storefront on Ferguson St", defaultSrc: "/uploads/storefront.webp" },
  { id: "home.hero.slide.3", group: "Home — hero slideshow", label: "Coffee with latte art", defaultSrc: "/uploads/coffee.webp" },
  { id: "home.hero.slide.4", group: "Home — hero slideshow", label: "Toasties and cake on the table", defaultSrc: "/uploads/food-plates.webp" },
  { id: "home.hero.slide.5", group: "Home — hero slideshow", label: "The counter, mid-morning", defaultSrc: "/uploads/counter.webp" },
  { id: "home.hero.slide.6", group: "Home — hero slideshow", label: "The dining room and counter", defaultSrc: "/uploads/bar.webp" },
];

export const HERO_TILES: ImageSlot[] = [
  { id: "home.hero.tile.1", group: "Home — hero tiles", label: "Coffee on the table", defaultSrc: "/uploads/coffee-table.webp" },
  { id: "home.hero.tile.2", group: "Home — hero tiles", label: "The dining room", defaultSrc: "/uploads/dining-hall.webp" },
  { id: "home.hero.tile.3", group: "Home — hero tiles", label: "The counter — coffee and cabinet", defaultSrc: "/uploads/counter.webp" },
  { id: "home.hero.tile.4", group: "Home — hero tiles", label: "Cakes in the cabinet", defaultSrc: "/uploads/display-cabinet.webp" },
];

export const SECTION_SLOTS: ImageSlot[] = [
  { id: "home.section.dining", group: "Home — sections", label: "Home “our story” section image", defaultSrc: "/uploads/dining-room.webp" },
  { id: "home.section.menu", group: "Home — sections", label: "Home “menu highlights” section image", defaultSrc: "/uploads/lunch.webp" },
  { id: "functions.feature", group: "Functions", label: "Functions feature image", defaultSrc: "/uploads/dining-prints.webp" },
  { id: "our-story.feature", group: "Our story", label: "Our story feature image", defaultSrc: "/uploads/mural.webp" },
];

// Gallery groups double as the render source for GalleryGrid AND the slot source.
export type GalleryTile = {
  id: string;
  defaultSrc: string;
  placeholder: string;
  label: string;
};
export type GalleryGroup = { title: string; aspect: string; tiles: GalleryTile[] };

export const GALLERY_GROUPS: GalleryGroup[] = [
  {
    title: "The space",
    aspect: "3 / 2",
    tiles: [
      { id: "gal-space-1", defaultSrc: "/uploads/mural.webp", placeholder: "The Provisions mural", label: "The space — the Provisions seagull mural" },
      { id: "gal-space-2", defaultSrc: "/uploads/dining-hall.webp", placeholder: "The dining room", label: "The space — the dining room and mural" },
      { id: "gal-space-3", defaultSrc: "/uploads/bar.webp", placeholder: "The room and counter", label: "The space — the room looking to the counter" },
      { id: "gal-space-4", defaultSrc: "/uploads/dining-prints.webp", placeholder: "Coastal prints on the wall", label: "The space — coastal prints along the wall" },
      { id: "gal-space-5", defaultSrc: "/uploads/corner-nook.webp", placeholder: "The window bar", label: "The space — the window bar and stools" },
      { id: "gal-space-6", defaultSrc: "/uploads/sign.webp", placeholder: "The Provisions sign", label: "The space — the Provisions sign" },
    ],
  },
  {
    title: "The food & coffee",
    aspect: "1 / 1",
    tiles: [
      { id: "gal-food-1", defaultSrc: "/uploads/coffee.webp", placeholder: "Coffee, latte art", label: "The food — coffee with latte art" },
      { id: "gal-food-2", defaultSrc: "/uploads/coffee-table.webp", placeholder: "Coffee on the table", label: "The food — coffee on the table" },
      { id: "gal-food-3", defaultSrc: "/uploads/brunch.webp", placeholder: "Coffee and toasties", label: "The food — coffee and toasties" },
      { id: "gal-food-4", defaultSrc: "/uploads/food-plates.webp", placeholder: "Toasties and cake", label: "The food — toasties and cake" },
      { id: "gal-food-5", defaultSrc: "/uploads/lunch.webp", placeholder: "Lunch on the table", label: "The food — lunch on the table" },
      { id: "gal-food-6", defaultSrc: "/uploads/display-cabinet.webp", placeholder: "The cabinet", label: "The food — the display cabinet" },
    ],
  },
  {
    title: "The team & the street",
    aspect: "3 / 2",
    tiles: [
      { id: "gal-hood-1", defaultSrc: "/uploads/storefront.webp", placeholder: "Storefront, Ferguson St", label: "The street — the storefront on Ferguson St" },
      { id: "gal-hood-2", defaultSrc: "/uploads/outdoor.webp", placeholder: "Out the front", label: "The street — seating out the front" },
      { id: "gal-hood-3", defaultSrc: "/uploads/barista.webp", placeholder: "On the machine", label: "The team — coffee on the machine" },
      { id: "gal-hood-4", defaultSrc: "/uploads/team.webp", placeholder: "Behind the counter", label: "The team — behind the counter" },
    ],
  },
];

const GALLERY_SLOTS: ImageSlot[] = GALLERY_GROUPS.flatMap((g) =>
  g.tiles.map((t) => ({
    id: t.id,
    label: t.label,
    group: `Gallery — ${g.title}`,
    defaultSrc: t.defaultSrc,
  })),
);

/** Every swappable slot, in admin-listing order. */
export const IMAGE_SLOTS: ImageSlot[] = [
  ...HERO_SLIDES,
  ...HERO_TILES,
  ...SECTION_SLOTS,
  ...GALLERY_SLOTS,
];

/** slot id → code-default src. */
export const IMAGE_DEFAULTS: Record<string, string> = Object.fromEntries(
  IMAGE_SLOTS.map((s) => [s.id, s.defaultSrc]),
);

/** Resolve a slot from a merged overrides map, falling back to the code default. */
export function img(images: Record<string, string>, id: string): string {
  return images[id] ?? IMAGE_DEFAULTS[id] ?? "";
}
