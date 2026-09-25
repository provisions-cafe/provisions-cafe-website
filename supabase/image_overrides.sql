-- ===========================================================================
-- image_overrides.sql  —  photo-swap slot table (override over code defaults).
-- Keyed by a stable slot id (e.g. "home.hero", "gallery.mural"). A row means
-- "use this url instead of the hardcoded /uploads default". No row = the code
-- default renders. Public read (overrides show on the live site); authed write.
-- Requires setup.sql. Seeded empty.
-- ===========================================================================

create table if not exists public.image_overrides (
  slot       text primary key,
  url        text not null,
  updated_at timestamptz not null default now()
);

alter table public.image_overrides enable row level security;

drop policy if exists image_overrides_public_select on public.image_overrides;
create policy image_overrides_public_select on public.image_overrides
  for select using (true);

drop policy if exists image_overrides_admin_write on public.image_overrides;
create policy image_overrides_admin_write on public.image_overrides
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop trigger if exists image_overrides_touch on public.image_overrides;
create trigger image_overrides_touch before update on public.image_overrides
  for each row execute function public.touch_updated_at();
