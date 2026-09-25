import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  canAccess,
  type PermissionKey,
  type Role,
  type UserProfile,
} from "@/lib/rbac";
import { card, h1, h2, COLORS } from "./ui";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row } = user
    ? await supabase
        .from("user_profiles")
        .select("user_id, role, permissions")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const profile: UserProfile = row
    ? {
        user_id: row.user_id as string,
        role: row.role as Role,
        permissions: (row.permissions ?? []) as PermissionKey[],
      }
    : { user_id: user?.id ?? "", role: "employee", permissions: [] };

  const [{ count: itemCount }, { count: catCount }] = await Promise.all([
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
    supabase.from("menu_categories").select("id", { count: "exact", head: true }),
  ]);

  const allTiles = [
    {
      href: "/admin/menu",
      title: "Menu",
      body: `${itemCount ?? 0} items across ${catCount ?? 0} categories. Edit dishes, prices, categories, and home-page highlights.`,
    },
    {
      href: "/admin/info",
      title: "Business info",
      body: "Phone, address, opening hours, booking & order links, and Google rating.",
    },
    {
      href: "/admin/media",
      title: "Photos",
      body: "Swap the hero, section, and gallery photos. Uploads auto-convert to WebP.",
    },
  ];

  const tiles = allTiles.filter((t) => canAccess(profile, t.href));

  return (
    <div>
      <h1 style={h1}>Dashboard</h1>
      <p style={{ margin: "10px 0 28px", fontSize: 16, color: COLORS.muted }}>
        Edit the live site here. Changes publish immediately.
      </p>

      {tiles.length === 0 ? (
        <div style={card}>
          <h2 style={h2}>No sections yet</h2>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: COLORS.muted }}>
            Your account doesn&rsquo;t have access to any editing sections. Ask an
            administrator to grant permissions (or set your role to{" "}
            <strong>admin</strong>).
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              style={{ ...card, textDecoration: "none", display: "block" }}
            >
              <h2 style={h2}>{t.title}</h2>
              <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: COLORS.muted }}>
                {t.body}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
