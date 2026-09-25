-- ===========================================================================
-- site_settings.sql  —  singleton (id = 1) JSON override over code defaults.
-- The real defaults live in lib/settings.ts (SETTINGS_DEFAULTS); this row only
-- stores a partial override that getSettings() deep-merges over them. If the
-- row is missing/empty the site renders 100% from code. Requires setup.sql.
-- ===========================================================================

create table if not exists public.site_settings (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Everyone can read settings (they drive the public header/footer/JSON-LD).
drop policy if exists site_settings_public_select on public.site_settings;
create policy site_settings_public_select on public.site_settings
  for select using (true);

-- Any authenticated (admin) user can write.
drop policy if exists site_settings_admin_write on public.site_settings;
create policy site_settings_admin_write on public.site_settings
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();
