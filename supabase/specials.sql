-- ===========================================================================
-- specials.sql  —  "What's on" / specials cards collection.
-- Public reads published rows; any authed user has full access. Requires
-- setup.sql. Seeded empty — the home "What's on" section falls back to code
-- defaults until an admin publishes rows.
-- ===========================================================================

create table if not exists public.specials (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text,
  image_url     text,
  starts_at     timestamptz,
  ends_at       timestamptz,
  display_order int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.specials enable row level security;

drop policy if exists specials_public_select on public.specials;
create policy specials_public_select on public.specials
  for select using (is_published = true);

drop policy if exists specials_admin_select on public.specials;
create policy specials_admin_select on public.specials
  for select using (auth.uid() is not null);
drop policy if exists specials_admin_insert on public.specials;
create policy specials_admin_insert on public.specials
  for insert with check (auth.uid() is not null);
drop policy if exists specials_admin_update on public.specials;
create policy specials_admin_update on public.specials
  for update using (auth.uid() is not null);
drop policy if exists specials_admin_delete on public.specials;
create policy specials_admin_delete on public.specials
  for delete using (auth.uid() is not null);

drop trigger if exists specials_touch on public.specials;
create trigger specials_touch before update on public.specials
  for each row execute function public.touch_updated_at();
