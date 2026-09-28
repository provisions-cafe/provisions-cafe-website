import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TEMPORARY diagnostic — proves whether the app's runtime Supabase client can
// read the DB. Delete after debugging.
export async function GET() {
  const env = {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasSecret: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    urlHost: (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^https?:\/\//, "").slice(0, 30),
  };
  try {
    const supabase = await createClient();
    const cats = await supabase
      .from("menu_categories")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);
    const items = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);
    const settings = await supabase
      .from("site_settings")
      .select("id")
      .eq("id", 1)
      .maybeSingle();
    return NextResponse.json({
      env,
      catCount: cats.count,
      catErr: cats.error?.message ?? null,
      itemCount: items.count,
      itemErr: items.error?.message ?? null,
      hasSettingsRow: Boolean(settings.data),
      settingsErr: settings.error?.message ?? null,
    });
  } catch (e) {
    return NextResponse.json({ env, threw: String(e) });
  }
}
