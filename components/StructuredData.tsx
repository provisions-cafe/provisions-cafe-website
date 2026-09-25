import { SITE_URL } from "./site-data";
import { getSettings } from "@/lib/settings.server";

/**
 * schema.org LocalBusiness (CafeOrCoffeeShop) JSON-LD. Feeds Google's rich
 * results / local pack: address, geo, hours, price, rating, menu, reservations.
 * Business facts + booking URL come from getSettings() (DB-editable); openingHours
 * stays static (the visible per-day hours live in the footer / HoursTable).
 */
export default async function StructuredData() {
  const settings = await getSettings();
  const BUSINESS = settings.business;
  const BOOK_URL = settings.urls.book;
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${SITE_URL}/#cafe`,
    name: BUSINESS.name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: BUSINESS.telephoneE164,
    priceRange: BUSINESS.priceRange,
    servesCuisine: ["Breakfast", "Brunch", "Coffee", "Cafe"],
    acceptsReservations: true,
    hasMenu: `${SITE_URL}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "15:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.ratingValue,
      reviewCount: BUSINESS.reviewCount,
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: BOOK_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
