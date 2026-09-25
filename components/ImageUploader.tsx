"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { convertToWebp } from "@/lib/convertToWebp";
import { COLORS, btnGhost } from "@/app/admin/ui";

/**
 * Admin-only: pick an image → convert to WebP → upload to the public `media`
 * bucket via the browser client (authenticated as the logged-in admin) → hand
 * the public URL back through `onUploaded`. The parent persists it.
 */
export default function ImageUploader({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const webp = await convertToWebp(file);
      const supabase = createClient();
      const path = `${crypto.randomUUID()}.webp`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, webp, { contentType: "image/webp", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onUploaded(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        style={{ ...btnGhost, minHeight: 36, padding: "6px 14px", fontSize: 13.5, opacity: busy ? 0.6 : 1 }}
      >
        {busy ? "Uploading…" : "Upload photo"}
      </button>
      {error && (
        <span style={{ marginLeft: 10, fontSize: 13, color: COLORS.danger }}>
          {error}
        </span>
      )}
    </div>
  );
}
