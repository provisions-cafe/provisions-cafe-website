import { createClient } from "@/lib/supabase/server";
import MenuManagerClient, {
  type AdminCategory,
  type AdminItem,
} from "./MenuManagerClient";
import { h1, COLORS } from "../ui";

export default async function AdminMenuPage() {
  const supabase = await createClient();

  const [{ data: cats }, { data: items }] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("*")
      .order("column_group", { ascending: true })
      .order("display_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  const allItems = (items ?? []) as AdminItem[];
  const categories: AdminCategory[] = (cats ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    column_group: c.column_group,
    display_order: c.display_order,
    is_published: c.is_published,
    items: allItems.filter((i) => i.category_id === c.id),
  }));

  return (
    <div>
      <h1 style={h1}>Menu</h1>
      <p style={{ margin: "10px 0 24px", fontSize: 15, color: COLORS.muted, maxWidth: "62ch" }}>
        Edit categories and dishes. Unpublished rows are hidden from the public
        menu. Toggle <strong>Highlight</strong> to feature a dish in the
        home-page &ldquo;Menu highlights&rdquo; section.
      </p>
      <MenuManagerClient categories={categories} />
    </div>
  );
}
