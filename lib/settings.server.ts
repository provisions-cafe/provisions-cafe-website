import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { SETTINGS_DEFAULTS, type SiteSettings } from "@/lib/settings";

/**
 * Read the singleton `site_settings` row and merge its JSON override over the
 * code defaults. Wrapped in React `cache()` so header/footer/JSON-LD share one
 * query per request. Never throws — falls back to defaults if Supabase is
 * empty/unreachable, so the public site always renders.
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const override = (data?.data ?? {}) as Partial<SiteSettings>;

    return {
      urls: { ...SETTINGS_DEFAULTS.urls, ...(override.urls ?? {}) },
      contact: { ...SETTINGS_DEFAULTS.contact, ...(override.contact ?? {}) },
      business: { ...SETTINGS_DEFAULTS.business, ...(override.business ?? {}) },
      hours:
        override.hours && override.hours.length > 0
          ? override.hours
          : SETTINGS_DEFAULTS.hours,
      whatsOn: {
        intro: override.whatsOn?.intro ?? SETTINGS_DEFAULTS.whatsOn.intro,
        cards:
          override.whatsOn?.cards && override.whatsOn.cards.length > 0
            ? override.whatsOn.cards
            : SETTINGS_DEFAULTS.whatsOn.cards,
      },
    };
  } catch {
    return SETTINGS_DEFAULTS;
  }
});
