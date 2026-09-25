"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type CSSProperties } from "react";
import type { ImageSlot } from "@/lib/images";
import ImageUploader from "@/components/ImageUploader";
import { COLORS, card, btnGhost, h2 } from "../ui";
import { setImageOverride, resetImageOverride, type ActionResult } from "./actions";

const thumb: CSSProperties = {
  width: 96,
  height: 72,
  objectFit: "cover",
  borderRadius: 6,
  border: `1px solid ${COLORS.line}`,
  background: "#EDE4D4",
  flex: "0 0 auto",
};
const badge: CSSProperties = {
  display: "inline-flex",
  padding: "1px 7px",
  borderRadius: 4,
  fontSize: 11.5,
  fontWeight: 600,
};

export default function MediaManagerClient({
  slots,
  overrides,
}: {
  slots: ImageSlot[];
  overrides: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => {
    const order: string[] = [];
    for (const s of slots) if (!order.includes(s.group)) order.push(s.group);
    return order;
  }, [slots]);

  function run(thunk: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const res = await thunk();
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      {error && (
        <p
          role="alert"
          style={{
            margin: "0 0 16px",
            padding: "10px 12px",
            fontSize: 14,
            color: COLORS.danger,
            background: "rgba(166,54,43,.08)",
            border: "1px solid rgba(166,54,43,.3)",
            borderRadius: 6,
          }}
        >
          {error}
        </p>
      )}

      <div style={{ display: "grid", gap: 18 }}>
        {groups.map((group) => (
          <section key={group} style={card}>
            <h2 style={{ ...h2, marginBottom: 14 }}>{group}</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {slots
                .filter((s) => s.group === group)
                .map((slot) => {
                  const overridden = Boolean(overrides[slot.id]);
                  const current = overrides[slot.id] ?? slot.defaultSrc;
                  return (
                    <div
                      key={slot.id}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "center",
                        flexWrap: "wrap",
                        paddingTop: 12,
                        borderTop: `1px solid ${COLORS.line}`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={current} alt="" style={thumb} />
                      <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, color: COLORS.ink }}>
                          {slot.label}
                        </div>
                        <span
                          style={{
                            ...badge,
                            marginTop: 4,
                            background: overridden ? "rgba(78,122,74,.15)" : "rgba(58,43,34,.08)",
                            color: overridden ? COLORS.ok : COLORS.muted,
                          }}
                        >
                          {overridden ? "custom" : "default"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <ImageUploader
                          path={`slots/${slot.id.replace(/[^a-z0-9]+/gi, "-")}.webp`}
                          label={overridden ? "Replace" : "Upload"}
                          onUploaded={(url) => run(() => setImageOverride(slot.id, url))}
                        />
                        {overridden && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => run(() => resetImageOverride(slot.id))}
                            style={{ ...btnGhost, minHeight: 36, padding: "6px 14px", fontSize: 13.5 }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
