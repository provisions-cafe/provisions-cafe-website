"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type CSSProperties } from "react";
import { HIGHLIGHT_GROUP_ORDER } from "@/lib/menu";
import ImageUploader from "@/components/ImageUploader";
import {
  COLORS,
  card,
  label,
  input,
  textarea,
  btnPrimary,
  btnGhost,
  btnDanger,
  h2,
} from "../ui";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
  setItemPublished,
  type ActionResult,
  type CategoryInput,
  type ItemInput,
} from "./actions";

export type AdminItem = {
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
  is_published: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  column_group: number;
  display_order: number;
  is_published: boolean;
  items: AdminItem[];
};

const badge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "1px 7px",
  borderRadius: 4,
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: ".03em",
};
const fieldRow: CSSProperties = { marginBottom: 12 };
const grid2: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
};

function checkbox(
  name: string,
  checked: boolean,
  onChange: (v: boolean) => void,
  text: string,
) {
  return (
    <label
      htmlFor={name}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, color: COLORS.ink }}
    >
      <input
        id={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 17, height: 17 }}
      />
      {text}
    </label>
  );
}

// ------------------------------------------------------------- category form

function CategoryForm({
  initial,
  onSave,
  onCancel,
  pending,
}: {
  initial?: AdminCategory;
  onSave: (input: CategoryInput) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [columnGroup, setColumnGroup] = useState(initial?.column_group ?? 1);
  const [displayOrder, setDisplayOrder] = useState(initial?.display_order ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);

  return (
    <div style={{ ...card, background: COLORS.cream, marginTop: 12 }}>
      <div style={grid2}>
        <div style={fieldRow}>
          <label style={label}>Name</label>
          <input
            style={input}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initial)
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, ""),
                );
            }}
          />
        </div>
        <div style={fieldRow}>
          <label style={label}>Slug</label>
          <input style={input} value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div style={fieldRow}>
          <label style={label}>Column</label>
          <select
            style={input}
            value={columnGroup}
            onChange={(e) => setColumnGroup(Number(e.target.value))}
          >
            <option value={1}>Column 1</option>
            <option value={2}>Column 2</option>
            <option value={3}>Column 3</option>
          </select>
        </div>
        <div style={fieldRow}>
          <label style={label}>Order</label>
          <input
            style={input}
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>
      </div>
      <div style={{ ...fieldRow, marginTop: 4 }}>
        {checkbox("cat-pub", isPublished, setIsPublished, "Published")}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          style={{ ...btnPrimary, opacity: pending ? 0.6 : 1 }}
          disabled={pending}
          onClick={() =>
            onSave({
              name,
              slug,
              column_group: columnGroup,
              display_order: displayOrder,
              is_published: isPublished,
            })
          }
        >
          Save
        </button>
        <button style={btnGhost} disabled={pending} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------- item form

function ItemForm({
  initial,
  categoryId,
  defaultOrder,
  onSave,
  onCancel,
  pending,
}: {
  initial?: AdminItem;
  categoryId: string;
  defaultOrder: number;
  onSave: (input: ItemInput) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sub, setSub] = useState(initial?.sub ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [displayOrder, setDisplayOrder] = useState(
    initial?.display_order ?? defaultOrder,
  );
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [isHighlight, setIsHighlight] = useState(initial?.is_highlight ?? false);
  const [highlightGroup, setHighlightGroup] = useState(initial?.highlight_group ?? "");
  const [highlightOrder, setHighlightOrder] = useState(initial?.highlight_order ?? 0);
  const [itemId] = useState(() => initial?.id ?? crypto.randomUUID());
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url ?? null);

  return (
    <div style={{ ...card, background: COLORS.cream, marginTop: 10 }}>
      <div style={grid2}>
        <div style={fieldRow}>
          <label style={label}>Name</label>
          <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={fieldRow}>
          <label style={label}>Price</label>
          <input
            style={input}
            value={price}
            placeholder="$0.00"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <div style={fieldRow}>
        <label style={label}>Description</label>
        <textarea
          style={textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div style={grid2}>
        <div style={fieldRow}>
          <label style={label}>Sub note (optional)</label>
          <input style={input} value={sub} onChange={(e) => setSub(e.target.value)} />
        </div>
        <div style={fieldRow}>
          <label style={label}>Tags (comma-separated)</label>
          <input
            style={input}
            value={tags}
            placeholder="V, GF, GFA"
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div style={fieldRow}>
          <label style={label}>Order</label>
          <input
            style={input}
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ ...fieldRow, display: "flex", flexWrap: "wrap", gap: 18, marginTop: 4 }}>
        {checkbox("item-pub", isPublished, setIsPublished, "Published")}
        {checkbox("item-hi", isHighlight, setIsHighlight, "Home highlight")}
      </div>

      {isHighlight && (
        <div style={grid2}>
          <div style={fieldRow}>
            <label style={label}>Highlight group</label>
            <input
              style={input}
              list="highlight-groups"
              value={highlightGroup}
              onChange={(e) => setHighlightGroup(e.target.value)}
            />
            <datalist id="highlight-groups">
              {HIGHLIGHT_GROUP_ORDER.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
          <div style={fieldRow}>
            <label style={label}>Highlight order</label>
            <input
              style={input}
              type="number"
              value={highlightOrder}
              onChange={(e) => setHighlightOrder(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div style={{ ...fieldRow, marginTop: 4 }}>
        <label style={label}>Photo (optional)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 6, border: `1px solid ${COLORS.line}` }}
            />
          ) : (
            <span style={{ fontSize: 13, color: COLORS.muted }}>No photo</span>
          )}
          <ImageUploader
            path={`menu/${itemId}.webp`}
            label={imageUrl ? "Replace photo" : "Upload photo"}
            onUploaded={(url) => setImageUrl(url)}
          />
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              style={{ ...btnGhost, minHeight: 36, padding: "6px 14px", fontSize: 13.5 }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          style={{ ...btnPrimary, opacity: pending ? 0.6 : 1 }}
          disabled={pending}
          onClick={() =>
            onSave({
              id: itemId,
              category_id: categoryId,
              name,
              price,
              description: description || undefined,
              sub: sub || undefined,
              image_url: imageUrl,
              tags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
              is_highlight: isHighlight,
              highlight_group: isHighlight ? highlightGroup || undefined : undefined,
              highlight_order: highlightOrder,
              display_order: displayOrder,
              is_published: isPublished,
            })
          }
        >
          Save
        </button>
        <button style={btnGhost} disabled={pending} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------- manager

export default function MenuManagerClient({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<string | "new" | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);

  function closeAll() {
    setEditingCat(null);
    setEditingItem(null);
    setAddingItemTo(null);
  }

  function run(thunk: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const res = await thunk();
      if (res?.error) {
        setError(res.error);
      } else {
        closeAll();
        router.refresh();
      }
    });
  }

  const nextOrder = (cat: AdminCategory) =>
    cat.items.reduce((m, i) => Math.max(m, i.display_order), -1) + 1;

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

      <div style={{ marginBottom: 18 }}>
        {editingCat === "new" ? (
          <CategoryForm
            pending={pending}
            onCancel={closeAll}
            onSave={(input) => run(() => createCategory(input))}
          />
        ) : (
          <button style={btnPrimary} onClick={() => { closeAll(); setEditingCat("new"); }}>
            + Add category
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {categories.map((cat) => (
          <section key={cat.id} style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <h2 style={{ ...h2, flex: "1 1 auto" }}>
                {cat.name}{" "}
                <span style={{ fontFamily: "inherit", fontSize: 13, color: COLORS.muted, fontWeight: 400 }}>
                  · col {cat.column_group}
                </span>
                {!cat.is_published && (
                  <span style={{ ...badge, marginLeft: 8, background: "rgba(166,54,43,.12)", color: COLORS.danger }}>
                    hidden
                  </span>
                )}
              </h2>
              <button style={btnGhost} onClick={() => { closeAll(); setEditingCat(cat.id); }}>
                Edit
              </button>
              <button
                style={btnDanger}
                disabled={pending}
                onClick={() => {
                  if (confirm(`Delete "${cat.name}" and all its items?`))
                    run(() => deleteCategory(cat.id));
                }}
              >
                Delete
              </button>
            </div>

            {editingCat === cat.id && (
              <CategoryForm
                initial={cat}
                pending={pending}
                onCancel={closeAll}
                onSave={(input) => run(() => updateCategory(cat.id, input))}
              />
            )}

            <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
              {cat.items.map((it) => (
                <div key={it.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                      padding: "8px 0",
                      borderTop: `1px solid ${COLORS.line}`,
                    }}
                  >
                    <span style={{ flex: "1 1 auto", fontSize: 15.5, color: COLORS.ink }}>
                      {it.name}
                      {it.price ? (
                        <span style={{ color: COLORS.bay }}> · {it.price}</span>
                      ) : null}
                      {(it.tags ?? []).map((t) => (
                        <span key={t} style={{ ...badge, marginLeft: 6, background: "rgba(169,118,43,.14)", color: COLORS.gold }}>
                          {t}
                        </span>
                      ))}
                      {it.is_highlight && (
                        <span style={{ ...badge, marginLeft: 6, background: "rgba(78,122,74,.15)", color: COLORS.ok }}>
                          ★ {it.highlight_group || "highlight"}
                        </span>
                      )}
                      {!it.is_published && (
                        <span style={{ ...badge, marginLeft: 6, background: "rgba(166,54,43,.12)", color: COLORS.danger }}>
                          hidden
                        </span>
                      )}
                    </span>
                    <button
                      style={{ ...btnGhost, minHeight: 34, padding: "5px 12px", fontSize: 13.5 }}
                      disabled={pending}
                      onClick={() => run(() => setItemPublished(it.id, !it.is_published))}
                    >
                      {it.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      style={{ ...btnGhost, minHeight: 34, padding: "5px 12px", fontSize: 13.5 }}
                      onClick={() => { closeAll(); setEditingItem(it.id); }}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...btnDanger, minHeight: 34, padding: "5px 12px", fontSize: 13.5 }}
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`Delete "${it.name}"?`)) run(() => deleteItem(it.id));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {editingItem === it.id && (
                    <ItemForm
                      initial={it}
                      categoryId={cat.id}
                      defaultOrder={it.display_order}
                      pending={pending}
                      onCancel={closeAll}
                      onSave={(input) => run(() => updateItem(it.id, input))}
                    />
                  )}
                </div>
              ))}
            </div>

            {addingItemTo === cat.id ? (
              <ItemForm
                categoryId={cat.id}
                defaultOrder={nextOrder(cat)}
                pending={pending}
                onCancel={closeAll}
                onSave={(input) => run(() => createItem(input))}
              />
            ) : (
              <button
                style={{ ...btnGhost, marginTop: 12 }}
                onClick={() => { closeAll(); setAddingItemTo(cat.id); }}
              >
                + Add item
              </button>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
