"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";
import type { SiteSettings } from "@/lib/settings";

export type ActionResult = { error?: string; ok?: boolean };

const hour = z.object({
  day: z.coerce.number().int().min(0).max(6),
  label: z.string().trim().min(1),
  time: z.string().trim(),
  closed: z.boolean(),
});

const settingsSchema = z.object({
  urls: z.object({
    book: z.string().trim(),
    order: z.string().trim(),
    directions: z.string().trim(),
    reviews: z.string().trim(),
    mapEmbed: z.string().trim(),
  }),
  contact: z.object({
    phoneDisplay: z.string().trim(),
    phoneHref: z.string().trim(),
    addressLine1: z.string().trim(),
    addressLine2: z.string().trim(),
  }),
  business: z.object({
    name: z.string().trim().min(1, "Business name is required"),
    streetAddress: z.string().trim(),
    locality: z.string().trim(),
    region: z.string().trim(),
    postalCode: z.string().trim(),
    country: z.string().trim(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    priceRange: z.string().trim(),
    ratingValue: z.coerce.number().min(0).max(5),
    reviewCount: z.coerce.number().int().min(0),
    telephoneE164: z.string().trim(),
  }),
  hours: z.array(hour).length(7, "Expected 7 days of hours"),
});

export async function updateSettings(input: SiteSettings): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, data: parsed.data }, { onConflict: "id" });
  if (error) return { error: error.message };

  await logActivity("update", "site_settings", "Updated business info");
  // Settings appear on every page (header/footer/JSON-LD/contact/menu).
  revalidatePath("/", "layout");
  return { ok: true };
}
