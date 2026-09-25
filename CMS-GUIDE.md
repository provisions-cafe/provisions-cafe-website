# Koolacube Custom CMS — Full Guide & Migration Reference

Everything you need to understand this custom CMS and re-create it on another
website. There is **no third-party CMS** here (no Sanity/Strapi/WordPress). The
"CMS" is a set of conventions on top of **Next.js 15 (App Router)** + **Supabase**
(Postgres + Auth + Storage). Copying it to a new site = copy the patterns in this
doc, run the SQL, wire the env vars, and rename the domain-specific bits.

---

## 1. The big picture (how it actually works)

```
                    ┌─────────────────────────── Supabase ───────────────────────────┐
  Public visitor →  │  Postgres tables (RLS) · Auth (users) · Storage bucket "media"  │
        │           └─────────────────────────────────────────────────────────────────┘
        │                    ▲ read (anon)           ▲ read/write (authed)   ▲ bypass RLS (service role)
        ▼                    │                       │                       │
  Next.js public pages ──────┘                Admin panel (/admin) ──────────┘
  (Server Components,                         (Server Components + Server
   render DB-over-defaults)                    Actions, gated by middleware)
```

Two mental models power the whole thing:

1. **Collections** (`units`, `industries`, `faqs`, `posts`, `messages`) — normal
   database tables with full create/read/update/delete in the admin. Public pages
   query the published rows.
2. **Overrides over code defaults** (`page_content`, `site_settings`) — the real
   copy/defaults live **in the code** (TypeScript). The database only stores an
   optional JSON override that is **merged over** the defaults at render time. If
   the DB row is missing/empty, the site renders 100% from code. This means the
   site never breaks if Supabase is unreachable — it just falls back to defaults.

Everything an admin does is:
- **Authenticated** (Supabase Auth email/password),
- **Authorized** (role + per-section permissions in `user_profiles`, enforced in
  `middleware.ts`),
- **Audited** (every write appends a row to `activity_logs`),
- **Executed via Server Actions** (`"use server"` files), never client-side DB writes for mutations.

---

## 2. Tech stack & dependencies

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React Server Components), React 19 |
| Language | TypeScript |
| Database / Auth / Storage | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css`) |
| Icons | `lucide-react` |
| Form validation | `zod` (+ `react-hook-form`, `@hookform/resolvers`) |
| Transactional email | `resend` (contact-form notifications) |
| Analytics | `@vercel/analytics` |

The CMS-relevant packages you must install on the new site:

```bash
npm install @supabase/supabase-js @supabase/ssr zod lucide-react resend
```

---

## 3. Environment variables

Create `.env.local` (gitignored). Copy from `.env.local.example`:

```bash
# Supabase — Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>       # safe in the browser
SUPABASE_SERVICE_ROLE_KEY=<service role key>          # SERVER ONLY — never expose

# Contact-form email notifications (optional — inbox still saves without these)
RESEND_API_KEY=<resend key>
RESEND_FROM_EMAIL=notifications@yourdomain.com        # a verified Resend sender
CONTACT_NOTIFY_EMAIL=enquiries@yourdomain.com         # optional; else falls back to Settings→email

# Google Ads gtag (optional; inert when blank)
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
```

**Critical rule:** `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row-Level Security. It
is only ever read in server-only modules (`src/lib/supabase/admin.ts` and
`middleware.ts`). Never import the admin client into a client component.

---

## 4. Database schema (Supabase)

Run these in the Supabase SQL editor. There's a bundled `supabase/all.sql` that
contains everything in one paste; or run the individual files. **Order matters —
`setup.sql` must run first** (it creates the `touch_updated_at()` trigger fn,
`is_admin()`, `user_profiles`, and `activity_logs` that others depend on).

| File | Creates | Notes |
| --- | --- | --- |
| `setup.sql` | `user_profiles`, `activity_logs`, `touch_updated_at()`, `is_admin()` | **Run first.** Foundation for auth/RBAC + audit. |
| `site_settings.sql` | `site_settings` (singleton row `id=1`) | Global NAP + footer/CTA copy override. |
| `page_content.sql` | `page_content` (keyed by route path) | Per-page copy override (merged over code defaults). |
| `faqs.sql` | `faqs` | Collection. |
| `units.sql` | `units` | Collection (product catalog). |
| `industries.sql` | `industries` | Collection. |
| `messages.sql` | `messages` | Contact-form inbox (insert via service role only). |
| `posts.sql` | `posts` (+ 4 seed articles) | Blog collection. |
| `storage.sql` | public `media` bucket + policies | Image uploads. |

### 4.1 Core tables (`setup.sql`)

```sql
-- Admin users: role + which sections they can access
create table public.user_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin', 'employee')),
  permissions text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Append-only audit trail
create table public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  user_email text,
  action     text not null check (action in ('create','update','delete','login','logout')),
  table_name text not null,
  record_id  text,
  details    text,
  created_at timestamptz not null default now()
);
```

Two important helpers in `setup.sql`:
- `public.touch_updated_at()` — a trigger function reused by every table to keep
  `updated_at` fresh on update.
- `public.is_admin()` — a `security definer` function used inside RLS policies on
  `user_profiles` so an admin can read/write all profiles **without RLS recursion**
  (a profile policy that queries `user_profiles` would otherwise recurse).

### 4.2 The RLS pattern (memorize this — every collection follows it)

Each collection table enables RLS and defines the same shape of policies:

```sql
alter table public.<table> enable row level security;

-- Public sees only published rows
create policy "<table>_public_select" on public.<table>
  for select using (is_published = true);

-- Any authenticated (admin) user has full access
create policy "<table>_admin_select" on public.<table> for select using (auth.uid() is not null);
create policy "<table>_admin_insert" on public.<table> for insert with check (auth.uid() is not null);
create policy "<table>_admin_update" on public.<table> for update using (auth.uid() is not null);
create policy "<table>_admin_delete" on public.<table> for delete using (auth.uid() is not null);

-- Keep updated_at fresh
create trigger <table>_touch before update on public.<table>
  for each row execute function public.touch_updated_at();
```

Variations:
- **`site_settings` / `page_content`**: public `select using (true)` (everyone can
  read copy), authed users can write. No `is_published`.
- **`messages`**: **no** public insert policy. Enquiries are written by the
  **service-role** client in the server action (RLS bypassed), and only authed
  users can read/update/delete. This keeps the inbox private and spam-resistant.
- **`activity_logs`**: only admins can `select` (via an `is_admin`-style subquery);
  no insert policy because writes come from the service role.

> ⚠️ **Auth model note:** RLS here treats *any authenticated user* as an admin at
> the database level. Fine-grained per-section permissions (below) are enforced in
> the **Next.js middleware/UI**, not in RLS. If you need DB-level enforcement of
> employee permissions, you'd tighten the policies to check `user_profiles.permissions`.

### 4.3 Collection column shapes (for re-creating on a new site)

- **`units`**: `slug`(unique), `category`(`cooler|freezer|dual`), `icon`,
  `name`, `tagline`, `intro`, `img`, `specs` jsonb `[{feature, value}]`,
  `applications` text[], `display_order`, `is_published`.
- **`industries`**: `slug`, `icon`, `name`, `tagline`, `intro`,
  `challenges` text[], `helps` text[], `display_order`, `is_published`.
- **`faqs`**: `question`, `answer`, `display_order`, `is_published`.
- **`posts`**: `slug`, `title`, `excerpt`, `category`, `cover_image`, `read_time`,
  `date`(display label), `body` jsonb `[{heading, paragraphs[]}]`,
  `related_links` jsonb `[{label, href}]`, `is_published`.
- **`messages`**: contact-form columns (`name`, `phone`, `email`, `suburb`, etc.) +
  `access` text[] + `status`(`new|read|archived`).

`icon` columns store a **lucide-react icon name** (e.g. `"Snowflake"`, `"ChefHat"`)
resolved at render time — see `src/lib/icons.ts`.

### 4.4 Storage (`storage.sql`)

One public bucket, `media`, holding all uploaded images. Public read; authed
insert/update/delete. Uploads happen **client-side** from the admin via the browser
Supabase client (`ImageUploader.tsx`), converting to WebP first, then storing the
returned `getPublicUrl()` string in the relevant row/field.

### 4.5 First admin user (bootstrap)

There's no public sign-up. After running the SQL:
1. Supabase Dashboard → **Authentication → Users → Add user** (set email + password,
   confirm email).
2. Copy the new user's UUID.
3. Run in SQL editor:
   ```sql
   insert into public.user_profiles (user_id, role, permissions)
   values ('<uuid>', 'admin', '{}');   -- admins ignore permissions; they see everything
   ```
4. Log in at `/admin/login`. From then on you can create more users from
   **Admin → Users** (which uses the service-role `auth.admin.createUser`).

---

## 5. The three Supabase clients (and when to use each)

This is the single most important thing to get right. There are **three** clients,
each in `src/lib/supabase/`:

| File | Function | Runs where | Key used | RLS | Use for |
| --- | --- | --- | --- | --- | --- |
| `client.ts` | `createClient()` | Browser (client components) | anon | ✅ enforced | Login form, image uploads, auth state listener |
| `server.ts` | `createClient()` (async, reads cookies) | Server Components / Server Actions | anon | ✅ enforced (as the logged-in user) | Most admin reads/writes done "as the user" |
| `admin.ts` | `createAdminClient()` | Server only | **service role** | ❌ bypassed | Contact-form insert, user management, reading any profile, writing logs |

```ts
// client.ts — browser
export function createClient() {
  return createBrowserClient(URL, ANON_KEY);
}

// server.ts — SSR, wires Supabase auth into Next cookies
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(URL, ANON_KEY, { cookies: { getAll, setAll } });
}

// admin.ts — service role, bypasses RLS (SERVER ONLY)
export function createAdminClient() {
  return createClient(URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
```

Rule of thumb: **default to `server.ts`** for admin actions (so writes run as the
authenticated user and are RLS-checked). Reach for `admin.ts` only when you
genuinely need to bypass RLS — public form inserts, creating/deleting auth users,
reading other users' profiles, and log writes.

---

## 6. Auth, middleware & route protection

`src/middleware.ts` runs on every non-asset request and is the security gate for
`/admin/*`. Flow:

1. Build an SSR Supabase client from request cookies; call `supabase.auth.getUser()`.
2. If the refresh token is gone, clear `sb-*` cookies (and redirect admin routes to
   login).
3. If the route isn't under `/admin`, let it pass.
4. If no user and not on `/admin/login` → redirect to `/admin/login`.
5. If there **is** a user:
   - Load their `user_profiles` row via the **service-role** client (so the lookup
     isn't itself blocked by RLS).
   - On `/admin/login`, bounce to their default landing page (`getDefaultPage`).
   - If no profile row exists, treat them as an `employee` with no permissions.
   - Otherwise call `canAccess(profile, pathname)` and redirect away if denied.

```ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
```

**Login** (`src/app/admin/login/page.tsx`) is a client component calling
`supabase.auth.signInWithPassword`, logging a `login` activity, then hard-redirecting
to `/admin`. **Logout** is a server action (`src/app/admin/actions.ts`) that logs
`logout` then `supabase.auth.signOut()`.

---

## 7. RBAC — roles & per-section permissions

All of this lives in `src/lib/rbac.ts` (pure, no DB) and is enforced in middleware +
the sidebar.

- **Roles**: `"admin"` (sees everything) or `"employee"` (limited to granted
  permissions).
- **Permission keys**: `home, pages, units, industries, faqs, blog, messages,
  settings, users, logs`. Stored as a `text[]` on `user_profiles.permissions`.
- **`PATH_PERMISSION_MAP`** maps each `/admin/*` route to the permission it requires.
  `/admin/users` is `"admin_only"` (employees can never reach it).
- **`PERMISSION_PRESETS`** — handy bundles (`content_editor`, `inbox_only`, `custom`)
  used by the Users editor UI.
- **`canAccess(profile, pathname)`** — the authorization check used by middleware.
- **`getDefaultPage(profile)`** — where to send a user after login / when redirected.

The sidebar (`AdminSidebar.tsx`) filters nav groups/items through `canSeeItem` so
employees only see what they can open. **UI hiding is convenience; middleware is the
real enforcement.**

---

## 8. Activity logging (audit trail)

`src/lib/supabase/logging.ts` exposes one server function:

```ts
logActivity(action, tableName, details, recordId?, emailOverride?)
```

- Resolves the current user (or uses `emailOverride`, e.g. on login before session
  is set), then inserts into `activity_logs` via the **service-role** client.
- Wrapped in try/catch that swallows errors — **logging must never break the main
  action**. Callers often `.catch(() => {})` too.
- Every create/update/delete server action calls it. Viewed at **Admin → Logs**.

---

## 9. Content model A — Collections (full CRUD)

Pattern used by `units`, `industries`, `faqs`, `posts`, `messages`. Take **units**
as the template. Each collection has:

1. **A types/data lib** — `src/lib/units.ts` (types + a public read helper).
2. **A server actions file** — `src/app/admin/units/actions.ts`.
3. **An admin page + client editor** — `src/app/admin/units/page.tsx` + `*Client.tsx`.
4. **A public render** — reads only `is_published = true` rows.

### The server-action recipe (copy this for any new collection)

```ts
"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

function revalidate() {
  revalidatePath("/admin/units");     // admin list
  revalidatePath("/available-units"); // public page
}

export async function createUnit(input: UnitInput) {
  const supabase = await createClient();          // acts as the logged-in user (RLS)
  // append to end of display_order
  const { data: last } = await supabase.from("units")
    .select("display_order").order("display_order", { ascending: false }).limit(1).single();
  const display_order = last ? last.display_order + 1 : 0;

  const { data, error } = await supabase.from("units")
    .insert({ ...input, display_order }).select("*").single();
  if (error) return { error: error.message };     // errors returned, not thrown

  await logActivity("create", "units", `Created unit: ${input.name}`, data.id);
  revalidate();
  return { unit: data };
}

export async function updateUnit(id: string, input: UnitInput) { /* update + log + revalidate */ }
export async function deleteUnit(id: string)                    { /* delete + log + revalidate */ }
export async function toggleUnitPublished(id, is_published)     { /* update is_published + log */ }
```

Conventions baked into every action:
- **`"use server"`** at the top of the file; each export is a Server Action.
- Return `{ error }` on failure and a plain object on success — **never throw** to
  the client. The client editors show `error` inline.
- **`display_order`** integer controls ordering; new rows append to the end.
- **`is_published`** boolean gates public visibility (RLS enforces it).
- Call **`logActivity`** then **`revalidatePath`** for both the admin and public routes.

**Public read helpers** live next to the types, e.g. `src/lib/units.ts` /
`faqs.ts` / `industries.ts`, and use the server client to fetch published rows for
the public pages.

---

## 10. Content model B — Overrides over code defaults

This is the clever part and the reason the site is resilient. Used by
**page copy** (`page_content`) and **global settings** (`site_settings`).

### 10.1 Per-page copy (`page_content` + the page registry)

- **`src/lib/content/registry.ts`** is the source of truth. It defines:
  - `PAGES[]` — every editable route (`key`, `path`, `label`, `group`, `template`).
  - Per-template TypeScript types (`ContentPageData`, `IntroPageData`,
    `LegalPageData`, etc.).
  - The **default content** maps (`CONTENT_DEFAULTS`, `INTRO_DEFAULTS`,
    `LEGAL_DEFAULTS`) keyed by path — the real copy lives here in code.
- **`src/lib/content/page-content.server.ts`** does the merge:

  ```ts
  export async function getPageContent<T>(path: string, defaults: T): Promise<T> {
    try {
      const { data } = await supabase.from("page_content").select("data").eq("path", path).single();
      if (!data?.data) return defaults;
      return { ...defaults, ...(data.data as Partial<T>) };  // DB override shallow-merged over defaults
    } catch { return defaults; }                              // never throws
  }
  ```

- **Public page** (e.g. `src/app/(site)/freezer-room-hire-brisbane/page.tsx`) is a
  thin wrapper: it declares its `PATH` and calls the shared
  `renderContentPage(PATH)` / `contentPageMetadata(PATH)` helpers, which pull
  `getPageContent(path, CONTENT_DEFAULTS[path])`.
- **Admin** (`/admin/pages` + `/admin/pages/[key]` editors like
  `ContentPageEditor.tsx`) edits the same typed shape and saves via
  `savePageContent(path, data)` → upsert into `page_content`. "Reset to default" =
  `resetPageContent(path)` → delete the row (site falls back to code defaults).

Templates supported: `content` (hero + bullets), `intro` (hero only; body comes
from a collection), `hire`, `buy`, `home`, `simple`, `legal` (long-form policy with
ordered sections). Each has its own default map + editor component.

### 10.2 Global settings (`site_settings`, singleton)

- **`src/lib/settings.ts`** — client-safe types + `SETTINGS_DEFAULTS` (NAP details,
  footer columns/links, CTA copy). Defaults mirror the static `SITE` constant in
  `src/lib/site.ts`.
- **`src/lib/settings.server.ts`** — `getSettings()` reads the single row (`id=1`),
  **deep-merges** `address` and shallow-merges the rest over the defaults, and is
  wrapped in React `cache()` so the layout, footer and CTA share one query per request.
- **Admin → Settings** saves via `updateSettings(data)` (upsert `id=1`) and
  `revalidatePath("/", "layout")` because settings appear in the header/footer/JSON-LD
  on every page.

### 10.3 Contact-form config (`contact-form.ts`)

The contact form's **field set is fixed** (it maps 1:1 to `messages` columns), but
labels, dropdown/checkbox options, which optional fields show, whether they're
required, and the surrounding copy are all admin-editable via a `ContactFormConfig`
(default in `CONTACT_FORM_DEFAULT`). Same override-over-default philosophy.

---

## 11. The public contact form → inbox → email flow

`src/app/(site)/contact/actions.ts`:

1. `submitEnquiry(input)` validates with a **zod** schema (server-side).
2. Inserts into `messages` using the **service-role** client (public has no insert
   RLS), with `status: "new"`.
3. `logActivity("create", "messages", …)`.
4. `sendNotification()` — if `RESEND_API_KEY` + `RESEND_FROM_EMAIL` are set, emails a
   formatted enquiry to `CONTACT_NOTIFY_EMAIL` (or `Settings → email`) via Resend,
   with `replyTo` = the enquirer. **The message is already saved, so email failure
   never surfaces to the visitor** — it's logged and swallowed.

Admins read/triage the inbox at **Admin → Messages** (`new / read / archived`).

---

## 12. Media uploads

`src/components/admin/ImageUploader.tsx` (client component):
- Converts the chosen JPG/PNG/WebP to **WebP** (`src/lib/convertToWebp.ts`).
- Uploads to the `media` bucket via the **browser** Supabase client under a random
  filename.
- Calls `getPublicUrl()` and returns the URL through `onChange`, which the editor
  stores in the row/field (e.g. `units.img`, `posts.cover_image`, `footerLogoUrl`).
- Also accepts a pasted URL/path as a fallback.

Because the bucket is public-read and authed-write, uploads work directly from the
browser without a server round-trip.

---

## 13. Admin UI structure

```
src/app/admin/
  layout.tsx            Loads user + profile; renders <AdminSidebar> + content shell.
                        (Standalone pages like /admin/login skip the shell.)
  AdminSidebar.tsx      Permission-filtered nav; sign-out; auth-state listener.
  login/page.tsx        Email/password sign-in.
  actions.ts            signOutAction (server action).
  home/                 Home-page content editor.
  pages/                Page registry list + [key]/ per-template editors.
  units/  industries/   Collection managers (page.tsx + *Client.tsx + actions.ts).
  faqs/   posts/
  messages/             Inbox.
  settings/             Global settings editor.
  users/                User + role/permission management (service-role actions).
  logs/                 Activity log viewer (admin only).
```

Each section = **server `page.tsx`** (fetches data) → **client `*Client.tsx`**
(interactive table/forms) → **`actions.ts`** (server actions for mutations). The
`layout.tsx` resolves the profile once and passes it to the sidebar for nav gating.

---

## 14. Migration checklist — copy this CMS to a new site

1. **Scaffold** a Next.js 15 App Router + TypeScript + Tailwind v4 project (or copy
   this repo and gut the marketing pages).
2. **Install deps**: `@supabase/supabase-js @supabase/ssr zod lucide-react resend`.
3. **Create a Supabase project.** Grab URL, anon key, service-role key.
4. **Set `.env.local`** (section 3).
5. **Run the SQL.** Paste `supabase/all.sql` (or run each file; `setup.sql` first).
   Then run `storage.sql` for the `media` bucket.
6. **Copy these files verbatim** (they're app-agnostic):
   - `src/lib/supabase/{client,server,admin,logging}.ts`
   - `src/lib/rbac.ts`
   - `src/middleware.ts`
   - `src/lib/content/page-content.server.ts` and the `getSettings` pattern.
   - `src/components/admin/ImageUploader.tsx` + `src/lib/convertToWebp.ts`.
7. **Copy the admin shell**: `src/app/admin/layout.tsx`, `AdminSidebar.tsx`,
   `login/page.tsx`, `actions.ts`.
8. **Re-model your collections.** For each content type on the new site, create:
   a table (+ RLS + trigger, section 4.2), a `src/lib/<name>.ts` (types + read
   helper), `src/app/admin/<name>/{page,*Client}.tsx`, and an `actions.ts`
   following the recipe in section 9.
9. **Rebuild the page registry** (`src/lib/content/registry.ts`) with *your* routes,
   templates, and default copy. Point each public page at
   `renderContentPage(PATH)` (or your equivalent).
10. **Update settings defaults** (`src/lib/settings.ts` + `src/lib/site.ts`) with the
    new brand's NAP, footer, and CTA copy.
11. **Bootstrap the first admin user** (section 4.5).
12. **Wire the contact form** to your `messages` columns + Resend sender.
13. **Deploy to Vercel** and add all env vars in Project → Settings → Environment
    Variables (including `SUPABASE_SERVICE_ROLE_KEY`).

---

## 15. Gotchas & things to change per-site (don't skip)

- **Rename all domain-specific bits**: brand name/logo (`public/…`,
  `AdminSidebar`, `login`), `metadataBase` in `src/app/layout.tsx`, `sitemap.ts`,
  `public/robots.txt`, and every default string in `registry.ts` / `settings.ts` /
  `contact-form.ts`. (The stale root `README.md` still says "no env vars required" —
  that predates the CMS; ignore it, this guide is current.)
- **`revalidatePath` targets are hard-coded** in each `actions.ts` (e.g.
  `/available-units`). Update them to the new site's public routes or the admin edit
  won't reflect on the live page until the cache expires.
- **Permissions are enforced in middleware/UI, not RLS.** At the DB level any logged-in
  user is effectively an admin. If you host untrusted employees, tighten the RLS
  policies to check `user_profiles.permissions`, or route all writes through
  service-role server actions that do their own permission checks.
- **Service-role key is nuclear.** Only in `admin.ts` + `middleware.ts`; never in a
  `"use client"` file or a `NEXT_PUBLIC_*` var.
- **`icon` fields are lucide names** — the new site must map the same strings in
  `src/lib/icons.ts`, or icons render blank.
- **Override tables can be empty.** `page_content` and `site_settings` are *optional*
  overrides; a fresh site renders entirely from code defaults, which is the intended,
  safe starting state.
- **`messages` has no public insert RLS by design** — inserts must go through the
  service-role server action, or the public form will silently fail.
- **Singleton settings**: `site_settings` is constrained to `id = 1`. Always upsert
  with `onConflict: "id"`.

---

## 16. File map (where each concept lives)

| Concept | File(s) |
| --- | --- |
| DB schema | `supabase/*.sql` (`all.sql` = everything) |
| Supabase clients | `src/lib/supabase/{client,server,admin}.ts` |
| Audit logging | `src/lib/supabase/logging.ts` |
| Auth gate | `src/middleware.ts` |
| Roles & permissions | `src/lib/rbac.ts` |
| Admin shell / nav | `src/app/admin/layout.tsx`, `src/app/admin/AdminSidebar.tsx` |
| Login / logout | `src/app/admin/login/page.tsx`, `src/app/admin/actions.ts` |
| Collections | `src/lib/{units,industries,faqs,posts}.ts` + `src/app/admin/<name>/` |
| Page-copy override | `src/lib/content/registry.ts`, `src/lib/content/page-content.server.ts`, `src/app/admin/pages/` |
| Global settings | `src/lib/settings.ts`, `src/lib/settings.server.ts`, `src/app/admin/settings/` |
| Contact form | `src/lib/content/contact-form.ts`, `src/app/(site)/contact/actions.ts` |
| Media upload | `src/components/admin/ImageUploader.tsx`, `src/lib/convertToWebp.ts` |
```
