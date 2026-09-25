"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { SiteSettings } from "@/lib/settings";
import ImageUploader from "@/components/ImageUploader";
import { updateSettings } from "./actions";
import { COLORS, card, label, input, textarea, btnPrimary, btnGhost, h2 } from "../ui";

export type MenuGroup = {
  category: string;
  items: { id: string; name: string }[];
};

const grid2: CSSProperties = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ ...card, marginBottom: 18 }}>
      <h2 style={{ ...h2, marginBottom: 16 }}>{title}</h2>
      {children}
    </section>
  );
}

function Field({
  labelText,
  value,
  onChange,
  type = "text",
  step,
}: {
  labelText: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label style={label}>{labelText}</label>
      <input
        style={input}
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function InfoEditorClient({
  initial,
  menuGroups,
}: {
  initial: SiteSettings;
  menuGroups: MenuGroup[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [s, setS] = useState<SiteSettings>(initial);

  const setUrls = (k: keyof SiteSettings["urls"], v: string) =>
    setS((p) => ({ ...p, urls: { ...p.urls, [k]: v } }));
  const setContact = (k: keyof SiteSettings["contact"], v: string) =>
    setS((p) => ({ ...p, contact: { ...p.contact, [k]: v } }));
  const setBiz = (k: keyof SiteSettings["business"], v: string | number) =>
    setS((p) => ({ ...p, business: { ...p.business, [k]: v } }));
  const setHour = (
    i: number,
    k: "label" | "time" | "closed",
    v: string | boolean,
  ) =>
    setS((p) => ({
      ...p,
      hours: p.hours.map((h, idx) => (idx === i ? { ...h, [k]: v } : h)),
    }));

  const setWhatsOnIntro = (v: string) =>
    setS((p) => ({ ...p, whatsOn: { ...p.whatsOn, intro: v } }));
  const setWhatsOnCard = (
    i: number,
    k: "title" | "text" | "menuItemId" | "imageUrl",
    v: string | null,
  ) =>
    setS((p) => ({
      ...p,
      whatsOn: {
        ...p.whatsOn,
        cards: p.whatsOn.cards.map((c, idx) =>
          idx === i ? { ...c, [k]: v } : c,
        ),
      },
    }));
  const setWhatsOnMode = (i: number, mode: "menu" | "custom") =>
    setS((p) => ({
      ...p,
      whatsOn: {
        ...p.whatsOn,
        cards: p.whatsOn.cards.map((c, idx) =>
          idx === i ? { ...c, mode } : c,
        ),
      },
    }));

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateSettings(s);
      if (res?.error) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <Section title="Action links">
        <div style={grid2}>
          <Field labelText="Book a table URL" value={s.urls.book} onChange={(v) => setUrls("book", v)} />
          <Field labelText="Order online URL" value={s.urls.order} onChange={(v) => setUrls("order", v)} />
          <Field labelText="Directions URL" value={s.urls.directions} onChange={(v) => setUrls("directions", v)} />
          <Field labelText="Reviews URL" value={s.urls.reviews} onChange={(v) => setUrls("reviews", v)} />
          <Field labelText="Map embed URL" value={s.urls.mapEmbed} onChange={(v) => setUrls("mapEmbed", v)} />
        </div>
      </Section>

      <Section title="Contact">
        <div style={grid2}>
          <Field labelText="Phone (display)" value={s.contact.phoneDisplay} onChange={(v) => setContact("phoneDisplay", v)} />
          <Field labelText="Phone (tel: link)" value={s.contact.phoneHref} onChange={(v) => setContact("phoneHref", v)} />
          <Field labelText="Address line 1" value={s.contact.addressLine1} onChange={(v) => setContact("addressLine1", v)} />
          <Field labelText="Address line 2" value={s.contact.addressLine2} onChange={(v) => setContact("addressLine2", v)} />
        </div>
      </Section>

      <Section title="Business & search listing">
        <div style={grid2}>
          <Field labelText="Name" value={s.business.name} onChange={(v) => setBiz("name", v)} />
          <Field labelText="Street address" value={s.business.streetAddress} onChange={(v) => setBiz("streetAddress", v)} />
          <Field labelText="Locality" value={s.business.locality} onChange={(v) => setBiz("locality", v)} />
          <Field labelText="Region" value={s.business.region} onChange={(v) => setBiz("region", v)} />
          <Field labelText="Postal code" value={s.business.postalCode} onChange={(v) => setBiz("postalCode", v)} />
          <Field labelText="Country" value={s.business.country} onChange={(v) => setBiz("country", v)} />
          <Field labelText="Telephone (E.164)" value={s.business.telephoneE164} onChange={(v) => setBiz("telephoneE164", v)} />
          <Field labelText="Price range" value={s.business.priceRange} onChange={(v) => setBiz("priceRange", v)} />
          <Field labelText="Latitude" type="number" step="0.0001" value={s.business.latitude} onChange={(v) => setBiz("latitude", Number(v))} />
          <Field labelText="Longitude" type="number" step="0.0001" value={s.business.longitude} onChange={(v) => setBiz("longitude", Number(v))} />
          <Field labelText="Rating value" type="number" step="0.1" value={s.business.ratingValue} onChange={(v) => setBiz("ratingValue", Number(v))} />
          <Field labelText="Review count" type="number" value={s.business.reviewCount} onChange={(v) => setBiz("reviewCount", Number(v))} />
        </div>
      </Section>

      <Section title="Opening hours">
        <div style={{ display: "grid", gap: 10 }}>
          {s.hours.map((h, i) => (
            <div
              key={h.day}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <input
                style={{ ...input, flex: "0 0 130px" }}
                value={h.label}
                onChange={(e) => setHour(i, "label", e.target.value)}
              />
              <input
                style={{ ...input, flex: "1 1 160px", opacity: h.closed ? 0.5 : 1 }}
                value={h.time}
                disabled={h.closed}
                placeholder="7am – 3pm"
                onChange={(e) => setHour(i, "time", e.target.value)}
              />
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, color: COLORS.ink }}>
                <input
                  type="checkbox"
                  checked={h.closed}
                  onChange={(e) => setHour(i, "closed", e.target.checked)}
                  style={{ width: 17, height: 17 }}
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What’s on (home page)">
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Intro line</label>
          <input
            style={input}
            value={s.whatsOn.intro}
            onChange={(e) => setWhatsOnIntro(e.target.value)}
          />
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {s.whatsOn.cards.map((c, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gap: 10,
                padding: 14,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 6,
              }}
            >
              <label style={label}>Card {i + 1}</label>
              <input
                style={input}
                value={c.title}
                placeholder="Title (e.g. Today's specials)"
                onChange={(e) => setWhatsOnCard(i, "title", e.target.value)}
              />

              <div style={{ display: "flex", gap: 8 }}>
                {(["menu", "custom"] as const).map((m) => {
                  const active = (c.mode ?? "custom") === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWhatsOnMode(i, m)}
                      style={{
                        minHeight: 34,
                        padding: "5px 14px",
                        borderRadius: 999,
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: active ? "none" : "1.5px solid rgba(30,67,89,.35)",
                        background: active ? COLORS.bay : "transparent",
                        color: active ? COLORS.cream : COLORS.bay,
                      }}
                    >
                      {m === "menu" ? "From the menu" : "Custom"}
                    </button>
                  );
                })}
              </div>

              {(c.mode ?? "custom") === "menu" ? (
                <>
                  <div>
                    <label style={label}>Menu item — its photo, name & price will show</label>
                    <select
                      style={input}
                      value={c.menuItemId ?? ""}
                      onChange={(e) => setWhatsOnCard(i, "menuItemId", e.target.value || null)}
                    >
                      <option value="">— Pick a dish —</option>
                      {menuGroups.map((g) => (
                        <optgroup key={g.category} label={g.category}>
                          {g.items.map((it) => (
                            <option key={it.id} value={it.id}>
                              {it.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <textarea
                    style={textarea}
                    value={c.text}
                    placeholder="Optional note under the dish"
                    onChange={(e) => setWhatsOnCard(i, "text", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <textarea
                    style={textarea}
                    value={c.text}
                    placeholder="Text"
                    onChange={(e) => setWhatsOnCard(i, "text", e.target.value)}
                  />
                  <div>
                    <label style={label}>Photo (optional)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      {c.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.imageUrl}
                          alt=""
                          style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 6, border: `1px solid ${COLORS.line}` }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: COLORS.muted }}>No photo</span>
                      )}
                      <ImageUploader
                        path={`whatson/card-${i}.webp`}
                        label={c.imageUrl ? "Replace photo" : "Upload photo"}
                        onUploaded={(url) => setWhatsOnCard(i, "imageUrl", url)}
                      />
                      {c.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setWhatsOnCard(i, "imageUrl", null)}
                          style={{ ...btnGhost, minHeight: 36, padding: "6px 14px", fontSize: 13.5 }}
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Section>

      {error && (
        <p
          role="alert"
          style={{
            margin: "0 0 14px",
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

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          style={{ ...btnPrimary, opacity: pending ? 0.6 : 1 }}
          disabled={pending}
          onClick={save}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && !pending && (
          <span style={{ fontSize: 14, color: COLORS.ok, fontWeight: 600 }}>
            Saved ✓
          </span>
        )}
      </div>
    </div>
  );
}
