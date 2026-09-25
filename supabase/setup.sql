-- ===========================================================================
-- setup.sql  —  RUN FIRST.
-- Foundation for auth/RBAC + audit trail. Everything else depends on the
-- touch_updated_at() / is_admin() helpers created here.
-- Idempotent: safe to re-run.
-- ===========================================================================

-- Keep updated_at fresh on every UPDATE. Reused by every table's touch trigger.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- user_profiles — admin/employee role + per-section permission keys.
-- ---------------------------------------------------------------------------
create table if not exists public.user_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin', 'employee')),
  permissions text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- security definer so RLS policies on user_profiles can check admin status
-- WITHOUT recursing into user_profiles' own policies.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

alter table public.user_profiles enable row level security;

drop policy if exists user_profiles_self_select on public.user_profiles;
create policy user_profiles_self_select on public.user_profiles
  for select using (user_id = auth.uid());

drop policy if exists user_profiles_admin_all on public.user_profiles;
create policy user_profiles_admin_all on public.user_profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists user_profiles_touch on public.user_profiles;
create trigger user_profiles_touch before update on public.user_profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- activity_logs — append-only audit trail. Written by the service role only.
-- ---------------------------------------------------------------------------
create table if not exists public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  user_email text,
  action     text not null check (action in ('create','update','delete','login','logout')),
  table_name text not null,
  record_id  text,
  details    text,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

-- Admins can read the log.
drop policy if exists activity_logs_admin_select on public.activity_logs;
create policy activity_logs_admin_select on public.activity_logs
  for select using (public.is_admin());

-- Minimal mode (publishable key only): logs are written by the logged-in staff
-- user via the anon client, so authenticated users may INSERT. (If you later add
-- a service-role/secret key, drop this policy and write logs server-side for a
-- tamper-proof trail.)
drop policy if exists activity_logs_authed_insert on public.activity_logs;
create policy activity_logs_authed_insert on public.activity_logs
  for insert with check (auth.uid() is not null);

create index if not exists activity_logs_created_at_idx
  on public.activity_logs (created_at desc);
