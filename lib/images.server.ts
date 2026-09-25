import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { IMAGE_DEFAULTS } from "@/lib/images";

/**
 * Merged slot→url map: DB overrides layered over the code defaults. Every known
 * slot always resolves to something. Cached per request; never throws (falls
 * back to defaults if Supabase is empty/unreachable).
 */
export const getImages = cache(async (): Promise<Record<string, string>> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("image_overrides").select("slot, url");
    const overrides: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.slot && row.url) overrides[row.slot as string] = row.url as string;
    }
    return { ...IMAGE_DEFAULTS, ...overrides };
  } catch {
    return { ...IMAGE_DEFAULTS };
  }
});
