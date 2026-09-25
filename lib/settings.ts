// Client-safe settings types + code defaults. The DB (`site_settings.data`)
// stores an optional partial override that getSettings() (server) deep-merges
// over these. If the row is missing/empty or Supabase is down, the site renders
// entirely from these defaults. Mirrors components/site-data.ts + the shape
// seeded in supabase/seed.sql — KEEP THEM IN SYNC.

export type BusinessHour = {
  day: number; // JS getDay(): 0=Sun … 6=Sat
  label: string;
  time: string; // display string, e.g. "7am – 3pm"
  closed: boolean;
};

export type SiteSettings = {
  urls: {
    book: string;
    order: string;
    directions: string;
    reviews: string;
    mapEmbed: string;
  };
  contact: {
    phoneDisplay: string;
    phoneHref: string;
    addressLine1: string;
    addressLine2: string;
  };
  business: {
    name: string;
    streetAddress: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    priceRange: string;
    ratingValue: number;
    reviewCount: number;
    telephoneE164: string;
  };
  hours: BusinessHour[];
};

export const SETTINGS_DEFAULTS: SiteSettings = {
  urls: {
    book: "https://www.google.com/maps/reserve/v/dine/c/PiDGJ7vEPco",
    order:
      "https://www.doordash.com/store/provisions-williamstown-29945064/38552548/",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=62-64+Ferguson+St+Williamstown+VIC+3016",
    reviews:
      "https://www.google.com/maps/search/?api=1&query=Provisions+Cafe+62-64+Ferguson+St+Williamstown+VIC+3016",
    mapEmbed:
      "https://maps.google.com/maps?q=62-64%20Ferguson%20St%20Williamstown%20VIC%203016&z=16&output=embed",
  },
  contact: {
    phoneDisplay: "03 9399 9955",
    phoneHref: "tel:+61393999955",
    addressLine1: "62–64 Ferguson St",
    addressLine2: "Williamstown VIC 3016",
  },
  business: {
    name: "Provisions Cafe",
    streetAddress: "62-64 Ferguson St",
    locality: "Williamstown",
    region: "VIC",
    postalCode: "3016",
    country: "AU",
    latitude: -37.8631,
    longitude: 144.8969,
    priceRange: "$$",
    ratingValue: 4.4,
    reviewCount: 269,
    telephoneE164: "+61393999955",
  },
  hours: [
    { day: 1, label: "Monday", time: "7am – 3pm", closed: false },
    { day: 2, label: "Tuesday", time: "7am – 3pm", closed: false },
    { day: 3, label: "Wednesday", time: "7am – 3pm", closed: false },
    { day: 4, label: "Thursday", time: "7am – 3pm", closed: false },
    { day: 5, label: "Friday", time: "7am – 3pm", closed: false },
    { day: 6, label: "Saturday", time: "7am – 3pm", closed: false },
    { day: 0, label: "Sunday", time: "7am – 3pm", closed: false },
  ],
};
