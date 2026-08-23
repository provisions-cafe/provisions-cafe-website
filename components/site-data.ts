// Shared, single-source-of-truth data for the whole site.

export const BOOK_URL =
  "https://www.google.com/maps/reserve/v/dine/c/PiDGJ7vEPco";
export const ORDER_URL =
  "https://www.doordash.com/store/provisions-williamstown-29945064/38552548/";
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=62-64+Ferguson+St+Williamstown+VIC+3016";
export const REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Provisions+Cafe+62-64+Ferguson+St+Williamstown+VIC+3016";
export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=62-64%20Ferguson%20St%20Williamstown%20VIC%203016&z=16&output=embed";

export const PHONE_DISPLAY = "03 9399 9955";
export const PHONE_HREF = "tel:+61393999955";
export const ADDRESS_LINE1 = "62–64 Ferguson St";
export const ADDRESS_LINE2 = "Williamstown VIC 3016";

export type NavItem = { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "Menu", href: "/menu" },
  { label: "Our story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Functions", href: "/functions" },
  { label: "Contact", href: "/contact" },
];

// Opening hours: [getDay() value, label]. Ordered Monday-first for display.
export const HOURS: Array<[number, string]> = [
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
  [0, "Sunday"],
];
export const HOURS_TIME = "7am – 3pm";
