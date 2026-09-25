-- ===========================================================================
-- menu.sql  —  two collections: menu_categories + menu_items.
-- Public reads published rows; any authed user has full access. Requires
-- setup.sql. Follows the standard RLS pattern (CMS-GUIDE §4.2).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- menu_categories
--   column_group (1-3) preserves the public menu page's 3-column layout.
-- ---------------------------------------------------------------------------
create table if not exists public.menu_categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  column_group  int not null default 1 check (column_group between 1 and 3),
  display_order int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.menu_categories enable row level security;

drop policy if exists menu_categories_public_select on public.menu_categories;
create policy menu_categories_public_select on public.menu_categories
  for select using (is_published = true);

drop policy if exists menu_categories_admin_select on public.menu_categories;
create policy menu_categories_admin_select on public.menu_categories
  for select using (auth.uid() is not null);
drop policy if exists menu_categories_admin_insert on public.menu_categories;
create policy menu_categories_admin_insert on public.menu_categories
  for insert with check (auth.uid() is not null);
drop policy if exists menu_categories_admin_update on public.menu_categories;
create policy menu_categories_admin_update on public.menu_categories
  for update using (auth.uid() is not null);
drop policy if exists menu_categories_admin_delete on public.menu_categories;
create policy menu_categories_admin_delete on public.menu_categories
  for delete using (auth.uid() is not null);

drop trigger if exists menu_categories_touch on public.menu_categories;
create trigger menu_categories_touch before update on public.menu_categories
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- menu_items
--   price is TEXT on purpose — prices carry the "$" and are edited verbatim.
--   is_highlight + highlight_group + highlight_order drive the home page's
--   curated "Menu highlights" section (groups don't map 1:1 to categories).
-- ---------------------------------------------------------------------------
create table if not exists public.menu_items (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references public.menu_categories(id) on delete cascade,
  name            text not null,
  price           text,
  description     text,
  sub             text,
  image_url       text,
  tags            text[] not null default '{}',
  is_highlight    boolean not null default false,
  highlight_group text,
  highlight_order int not null default 0,
  display_order   int not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists menu_items_category_idx
  on public.menu_items (category_id);
create index if not exists menu_items_highlight_idx
  on public.menu_items (is_highlight) where is_highlight = true;

alter table public.menu_items enable row level security;

drop policy if exists menu_items_public_select on public.menu_items;
create policy menu_items_public_select on public.menu_items
  for select using (is_published = true);

drop policy if exists menu_items_admin_select on public.menu_items;
create policy menu_items_admin_select on public.menu_items
  for select using (auth.uid() is not null);
drop policy if exists menu_items_admin_insert on public.menu_items;
create policy menu_items_admin_insert on public.menu_items
  for insert with check (auth.uid() is not null);
drop policy if exists menu_items_admin_update on public.menu_items;
create policy menu_items_admin_update on public.menu_items
  for update using (auth.uid() is not null);
drop policy if exists menu_items_admin_delete on public.menu_items;
create policy menu_items_admin_delete on public.menu_items
  for delete using (auth.uid() is not null);

drop trigger if exists menu_items_touch on public.menu_items;
create trigger menu_items_touch before update on public.menu_items
  for each row execute function public.touch_updated_at();
