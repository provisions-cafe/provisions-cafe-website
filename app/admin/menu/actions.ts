"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export type ActionResult = { error?: string; ok?: boolean };

// Public menu + home highlights both derive from these tables.
function revalidateMenu() {
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/", "layout");
}

/** Server client, but only if there's an authenticated user (defence in depth over RLS). */
async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

const categoryInput = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  column_group: z.coerce.number().int().min(1).max(3),
  display_order: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});

const itemInput = z.object({
  category_id: z.string().uuid("Pick a category"),
  name: z.string().trim().min(1, "Name is required"),
  price: z.string().trim(),
  description: z.string().trim().optional(),
  sub: z.string().trim().optional(),
  tags: z.array(z.string().trim()).default([]),
  is_highlight: z.boolean(),
  highlight_group: z.string().trim().optional(),
  highlight_order: z.coerce.number().int().min(0),
  display_order: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});

export type CategoryInput = z.infer<typeof categoryInput>;
export type ItemInput = z.infer<typeof itemInput>;

function firstError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Invalid input";
}

// ---------------------------------------------------------------- categories

export async function createCategory(input: CategoryInput): Promise<ActionResult> {
  const parsed = categoryInput.safeParse(input);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase.from("menu_categories").insert(parsed.data);
  if (error) return { error: error.message };

  await logActivity("create", "menu_categories", `Category: ${parsed.data.name}`);
  revalidateMenu();
  return { ok: true };
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<ActionResult> {
  const parsed = categoryInput.safeParse(input);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("menu_categories")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "menu_categories", `Category: ${parsed.data.name}`, id);
  revalidateMenu();
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  // Items cascade-delete via the FK.
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity("delete", "menu_categories", "Deleted category", id);
  revalidateMenu();
  return { ok: true };
}

// --------------------------------------------------------------------- items

export async function createItem(input: ItemInput): Promise<ActionResult> {
  const parsed = itemInput.safeParse(input);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase.from("menu_items").insert(parsed.data);
  if (error) return { error: error.message };

  await logActivity("create", "menu_items", `Item: ${parsed.data.name}`);
  revalidateMenu();
  return { ok: true };
}

export async function updateItem(
  id: string,
  input: ItemInput,
): Promise<ActionResult> {
  const parsed = itemInput.safeParse(input);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("menu_items")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "menu_items", `Item: ${parsed.data.name}`, id);
  revalidateMenu();
  return { ok: true };
}

export async function deleteItem(id: string): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity("delete", "menu_items", "Deleted item", id);
  revalidateMenu();
  return { ok: true };
}

/** Quick publish/unpublish without opening the full editor. */
export async function setItemPublished(
  id: string,
  is_published: boolean,
): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("menu_items")
    .update({ is_published })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "menu_items", `Set published=${is_published}`, id);
  revalidateMenu();
  return { ok: true };
}
