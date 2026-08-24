import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/menu", priority: 0.9 },
    { path: "/our-story", priority: 0.7 },
    { path: "/gallery", priority: 0.6 },
    { path: "/functions", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
