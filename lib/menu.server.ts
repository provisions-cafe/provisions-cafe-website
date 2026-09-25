import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  MENU_DEFAULTS,
  HIGHLIGHT_GROUP_ORDER,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu";

type ItemRow = {
  id: string;
  category_id: string;
  name: string;
  price: string | null;
  description: string | null;
  sub: string | null;
  image_url: string | null;
  tags: string[] | null;
  is_highlight: boolean;
  highlight_group: string | null;
  highlight_order: number;
  display_order: number;
};

function mapItem(row: ItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    price: row.price ?? "",
    desc: row.description ?? undefined,
    sub: row.sub ?? undefined,
    imageUrl: row.image_url ?? undefined,
    tags: row.tags ?? [],
    isHighlight: row.is_highlight,
    highlightGroup: row.highlight_group ?? undefined,
    highlightOrder: row.highlight_order,
  };
}

/**
 * Published menu, grouped into categories (ordered by column_group then
 * display_order). Falls back to MENU_DEFAULTS on any error or empty result, so
 * the public /menu page always renders. Cached per request.
 */
export const getMenu = cache(async (): Promise<MenuCategory[]> => {
  try {
    const supabase = await createClient();

    const { data: cats, error: catErr } = await supabase
      .from("menu_categories")
      .select("id, name, slug, column_group, display_order")
      .eq("is_published", true)
      .order("column_group", { ascending: true })
      .order("display_order", { ascending: true });

    if (catErr || !cats || cats.length === 0) return MENU_DEFAULTS;

    const { data: items, error: itemErr } = await supabase
      .from("menu_items")
      .select(
        "id, category_id, name, price, description, sub, image_url, tags, is_highlight, highlight_group, highlight_order, display_order",
      )
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (itemErr || !items) return MENU_DEFAULTS;

    return cats.map((c) => ({
      name: c.name as string,
      slug: c.slug as string,
      columnGroup: c.column_group as number,
      displayOrder: c.display_order as number,
      items: (items as ItemRow[])
        .filter((i) => i.category_id === c.id)
        .map(mapItem),
    }));
  } catch {
    return MENU_DEFAULTS;
  }
});

export type Highlight = { group: string; items: MenuItem[] };

/**
 * Home-page "Menu highlights" — the highlighted items grouped by
 * highlight_group, in HIGHLIGHT_GROUP_ORDER, each sorted by highlight_order.
 * Derived from getMenu() so it shares the same cached read + defaults fallback.
 */
export const getHighlights = cache(async (): Promise<Highlight[]> => {
  const menu = await getMenu();
  const all = menu.flatMap((c) => c.items).filter((i) => i.isHighlight);

  const groups = new Map<string, MenuItem[]>();
  for (const it of all) {
    const key = it.highlightGroup ?? "Highlights";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(it);
  }

  const ordered: Highlight[] = [];
  const seen = new Set<string>();
  for (const group of HIGHLIGHT_GROUP_ORDER) {
    const items = groups.get(group);
    if (items && items.length) {
      ordered.push({ group, items: items.sort((a, b) => a.highlightOrder - b.highlightOrder) });
      seen.add(group);
    }
  }
  // Any highlight groups not in the known order list, appended alphabetically.
  for (const [group, items] of [...groups.entries()].sort()) {
    if (!seen.has(group)) {
      ordered.push({ group, items: items.sort((a, b) => a.highlightOrder - b.highlightOrder) });
    }
  }
  return ordered;
});
