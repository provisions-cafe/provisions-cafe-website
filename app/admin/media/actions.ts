"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";
import { IMAGE_DEFAULTS } from "@/lib/images";

export type ActionResult = { error?: string; ok?: boolean };

const setInput = z.object({
  slot: z.string().min(1),
  url: z.string().trim().url("Enter a valid image URL"),
});

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

// Photos appear across the whole site, so revalidate everything.
function revalidateAll() {
  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
}

export async function setImageOverride(
  slot: string,
  url: string,
): Promise<ActionResult> {
  const parsed = setInput.safeParse({ slot, url });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  if (!(parsed.data.slot in IMAGE_DEFAULTS)) {
    return { error: "Unknown image slot." };
  }

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("image_overrides")
    .upsert(
      { slot: parsed.data.slot, url: parsed.data.url },
      { onConflict: "slot" },
    );
  if (error) return { error: error.message };

  await logActivity("update", "image_overrides", `Set image: ${parsed.data.slot}`);
  revalidateAll();
  return { ok: true };
}

export async function resetImageOverride(slot: string): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("image_overrides")
    .delete()
    .eq("slot", slot);
  if (error) return { error: error.message };

  await logActivity("delete", "image_overrides", `Reset image: ${slot}`);
  revalidateAll();
  return { ok: true };
}
