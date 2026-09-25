"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { SiteSettings } from "@/lib/settings";
import { updateSettings } from "./actions";
import { COLORS, card, label, input, btnPrimary, h2 } from "../ui";

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
}: {
  initial: SiteSettings;
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
