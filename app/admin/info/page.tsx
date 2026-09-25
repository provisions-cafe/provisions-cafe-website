import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings.server";
import InfoEditorClient, { type MenuGroup } from "./InfoEditorClient";
import { h1, COLORS } from "../ui";

export default async function AdminInfoPage() {
  const supabase = await createClient();

  const [settings, catsRes, itemsRes] = await Promise.all([
    getSettings(),
    supabase
      .from("menu_categories")
      .select("id, name, column_group, display_order")
      .order("column_group", { ascending: true })
      .order("display_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("id, name, category_id, display_order")
      .order("display_order", { ascending: true }),
  ]);

  const items = itemsRes.data ?? [];
  const menuGroups: MenuGroup[] = (catsRes.data ?? []).map((c) => ({
    category: c.name as string,
    items: items
      .filter((i) => i.category_id === c.id)
      .map((i) => ({ id: i.id as string, name: i.name as string })),
  }));

  return (
    <div>
      <h1 style={h1}>Business info</h1>
      <p style={{ margin: "10px 0 24px", fontSize: 15, color: COLORS.muted, maxWidth: "62ch" }}>
        Phone, address, opening hours, action links, and Google rating. These
        appear across the site — header, footer, contact page, and search
        listings. Saving publishes immediately.
      </p>
      <InfoEditorClient initial={settings} menuGroups={menuGroups} />
    </div>
  );
}
