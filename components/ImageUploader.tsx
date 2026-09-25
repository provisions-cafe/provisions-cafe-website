"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { convertToWebp } from "@/lib/convertToWebp";
import { COLORS, btnGhost } from "@/app/admin/ui";

/**
 * Admin-only: pick an image → convert to WebP → upload to the public `media`
 * bucket via the browser client (authenticated as the logged-in admin) → hand
 * the public URL back through `onUploaded`. The parent persists it.
 *
 * `path` (optional): a stable storage path (e.g. "menu/<id>.webp"). When given,
 * the upload OVERWRITES that path (upsert) so re-uploading supersedes the old
 * image instead of piling up files; the returned URL carries a `?v=` cache-bust.
 * Without `path`, each upload writes a new random file.
 */
export default function ImageUploader({
  onUploaded,
  path,
  label = "Upload photo",
}: {
  onUploaded: (url: string) => void;
  path?: string;
  label?: string;
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
      const target = path ?? `${crypto.randomUUID()}.webp`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(target, webp, {
          contentType: "image/webp",
          upsert: Boolean(path),
        });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("media").getPublicUrl(target);
      // With a stable path the URL is unchanged on overwrite, so bust the cache.
      onUploaded(path ? `${data.publicUrl}?v=${Date.now()}` : data.publicUrl);
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
        {busy ? "Uploading…" : label}
      </button>
      {error && (
        <span style={{ marginLeft: 10, fontSize: 13, color: COLORS.danger }}>
          {error}
        </span>
      )}
    </div>
  );
}
