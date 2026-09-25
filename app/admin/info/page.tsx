import { getSettings } from "@/lib/settings.server";
import InfoEditorClient from "./InfoEditorClient";
import { h1, COLORS } from "../ui";

export default async function AdminInfoPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 style={h1}>Business info</h1>
      <p style={{ margin: "10px 0 24px", fontSize: 15, color: COLORS.muted, maxWidth: "62ch" }}>
        Phone, address, opening hours, action links, and Google rating. These
        appear across the site — header, footer, contact page, and search
        listings. Saving publishes immediately.
      </p>
      <InfoEditorClient initial={settings} />
    </div>
  );
}
