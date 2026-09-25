import { createClient } from "@/lib/supabase/server";
import { IMAGE_SLOTS } from "@/lib/images";
import MediaManagerClient from "./MediaManagerClient";
import { h1, COLORS } from "../ui";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("image_overrides").select("slot, url");

  const overrides: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.slot && row.url) overrides[row.slot as string] = row.url as string;
  }

  return (
    <div>
      <h1 style={h1}>Photos</h1>
      <p style={{ margin: "10px 0 24px", fontSize: 15, color: COLORS.muted, maxWidth: "62ch" }}>
        Swap any photo on the site. Upload a new image (auto-converted to WebP) to
        replace a slot; &ldquo;Reset&rdquo; returns it to the original. Originals
        are the photos shipped with the site.
      </p>
      <MediaManagerClient slots={IMAGE_SLOTS} overrides={overrides} />
    </div>
  );
}
