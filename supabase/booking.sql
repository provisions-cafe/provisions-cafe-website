-- ===========================================================================
-- booking.sql  —  self-hosted table reservations.
--
--   * booking_settings  singleton (id = 1) JSON config, mirrors
--     lib/booking.ts BOOKING_DEFAULTS (partial override, deep-merged in TS).
--   * booking_closures  date-specific full closures or special hours.
--   * bookings          the reservations themselves.
--
-- Public visitors never touch `bookings` directly (that would leak other
-- customers' details). Instead the anon role calls two SECURITY DEFINER
-- functions — booking_availability() and create_booking() — which read/write
-- bookings on the caller's behalf while returning only non-sensitive data.
--
-- Requires setup.sql (touch_updated_at). Idempotent: safe to re-run.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- booking_settings — singleton config row.
-- ---------------------------------------------------------------------------
create table if not exists public.booking_settings (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.booking_settings enable row level security;

-- Config is not sensitive (it drives the public booking form), so anyone may read.
drop policy if exists booking_settings_public_select on public.booking_settings;
create policy booking_settings_public_select on public.booking_settings
  for select using (true);

drop policy if exists booking_settings_admin_write on public.booking_settings;
create policy booking_settings_admin_write on public.booking_settings
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop trigger if exists booking_settings_touch on public.booking_settings;
create trigger booking_settings_touch before update on public.booking_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- booking_closures — one row per special date (full closure or custom hours).
-- ---------------------------------------------------------------------------
create table if not exists public.booking_closures (
  id         uuid primary key default gen_random_uuid(),
  date       date not null,
  is_closed  boolean not null default true,
  open_time  text,   -- "HH:MM" when giving special hours instead of closing
  close_time text,
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists booking_closures_date_key
  on public.booking_closures (date);

alter table public.booking_closures enable row level security;

-- Closures affect what the public form offers, so they are publicly readable.
drop policy if exists booking_closures_public_select on public.booking_closures;
create policy booking_closures_public_select on public.booking_closures
  for select using (true);

drop policy if exists booking_closures_admin_write on public.booking_closures;
create policy booking_closures_admin_write on public.booking_closures
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop trigger if exists booking_closures_touch on public.booking_closures;
create trigger booking_closures_touch before update on public.booking_closures
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- bookings — the reservations. Contains customer contact details, so ONLY
-- authenticated (admin) users may read/write directly. Public bookings are
-- created via create_booking() below (SECURITY DEFINER), never by anon INSERT.
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  reference    text not null unique,
  booking_date date not null,
  booking_time time not null,
  party_size   int not null check (party_size > 0),
  table_id     text,
  table_name   text,
  name         text not null,
  phone        text,
  email        text,
  notes        text,
  status       text not null default 'pending'
                 check (status in ('pending', 'confirmed', 'cancelled')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_date_status_idx
  on public.bookings (booking_date, status);

alter table public.bookings enable row level security;

-- No public policy on purpose: anon has zero direct access to bookings.
drop policy if exists bookings_admin_all on public.bookings;
create policy bookings_admin_all on public.bookings
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- Allocation logic (single source of truth, shared by availability + create).
-- ===========================================================================

-- Return the id of the smallest table that (a) seats the party and (b) is free
-- for [p_time, p_time + turnaround) on p_date. NULL when nothing fits/free.
create or replace function public._booking_free_table(
  p_date       date,
  p_time       time,
  p_party      int,
  p_tables     jsonb,
  p_turnaround int
) returns text
language sql
security definer
set search_path = public
as $$
  select t->>'id'
  from jsonb_array_elements(p_tables) as t
  where coalesce((t->>'seats')::int, 0) >= p_party
    and not exists (
      select 1
      from public.bookings b
      where b.booking_date = p_date
        and b.status <> 'cancelled'
        and b.table_id = t->>'id'
        -- interval overlap: existing.start < new.end AND new.start < existing.end
        and b.booking_time < (p_time + make_interval(mins => p_turnaround))
        and p_time < (b.booking_time + make_interval(mins => p_turnaround))
    )
  order by (t->>'seats')::int asc, t->>'id' asc
  limit 1;
$$;

-- Available start times ("HH24:MI") for a party on a date, given the day's
-- window and policy. p_min_datetime is the earliest allowed wall-clock instant
-- (now + lead time), computed in TS in the venue timezone.
create or replace function public.booking_availability(
  p_date         date,
  p_party        int,
  p_tables       jsonb,
  p_open         time,
  p_close        time,
  p_slot         int,
  p_turnaround   int,
  p_min_datetime timestamp
) returns setof text
language sql
security definer
set search_path = public
as $$
  select to_char(g, 'HH24:MI')
  from generate_series(
    (p_date + p_open)::timestamp,
    (p_date + p_close)::timestamp - make_interval(mins => p_turnaround),
    make_interval(mins => p_slot)
  ) as g
  where g >= p_min_datetime
    and public._booking_free_table(p_date, g::time, p_party, p_tables, p_turnaround) is not null
  order by g;
$$;

-- Atomically validate + allocate a table + insert a booking. Returns JSON:
--   { "ok": true, "reference": "...", "status": "...", "tableName": "..." }
--   { "error": "human readable reason" }
create or replace function public.create_booking(
  p_date         date,
  p_time         time,
  p_party        int,
  p_name         text,
  p_phone        text,
  p_email        text,
  p_notes        text,
  p_tables       jsonb,
  p_open         time,
  p_close        time,
  p_slot         int,
  p_turnaround   int,
  p_min_datetime timestamp,
  p_max_date     date,
  p_auto_confirm boolean
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_table  text;
  v_name   text;
  v_ref    text;
  v_status text;
begin
  -- Defence-in-depth validation (the UI already restricts these).
  if p_party < 1 then
    return jsonb_build_object('error', 'Please choose a valid party size.');
  end if;
  if trim(coalesce(p_name, '')) = '' then
    return jsonb_build_object('error', 'Please enter a name.');
  end if;
  if p_date > p_max_date then
    return jsonb_build_object('error', 'That date is too far ahead.');
  end if;
  if (p_date + p_time)::timestamp < p_min_datetime then
    return jsonb_build_object('error', 'That time has already passed.');
  end if;
  if p_time < p_open
     or (p_time + make_interval(mins => p_turnaround)) > p_close then
    return jsonb_build_object('error', 'That time is outside opening hours.');
  end if;

  -- Serialise concurrent bookings for the same day so two people can't grab the
  -- last free table simultaneously. Released automatically at transaction end.
  perform pg_advisory_xact_lock(hashtext('booking:' || p_date::text));

  v_table := public._booking_free_table(p_date, p_time, p_party, p_tables, p_turnaround);
  if v_table is null then
    return jsonb_build_object(
      'error', 'Sorry, that time was just taken — please pick another.'
    );
  end if;

  select t->>'name' into v_name
  from jsonb_array_elements(p_tables) t
  where t->>'id' = v_table
  limit 1;

  v_ref := 'PC-' || to_char(p_date, 'YYMMDD') || '-'
           || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
  v_status := case when p_auto_confirm then 'confirmed' else 'pending' end;

  insert into public.bookings (
    reference, booking_date, booking_time, party_size, table_id, table_name,
    name, phone, email, notes, status
  ) values (
    v_ref, p_date, p_time, p_party, v_table, v_name,
    trim(p_name), nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''), v_status
  );

  return jsonb_build_object(
    'ok', true, 'reference', v_ref, 'status', v_status, 'tableName', v_name
  );
end;
$$;

-- Anonymous customers must be able to call the two public entrypoints.
grant execute on function
  public.booking_availability(date, int, jsonb, time, time, int, int, timestamp)
  to anon, authenticated;
grant execute on function
  public.create_booking(date, time, int, text, text, text, text, jsonb, time, time, int, int, timestamp, date, boolean)
  to anon, authenticated;
-- _booking_free_table is a helper called only inside the definer functions
-- above; it does not need to be granted to anon.

-- ===========================================================================
-- Seed a starter config (only if none exists) so /book works immediately.
-- Mirrors BOOKING_DEFAULTS in lib/booking.ts.
-- ===========================================================================
insert into public.booking_settings (id, data)
values (1, jsonb_build_object(
  'enabled', true,
  'timezone', 'Australia/Melbourne',
  'intro', 'Book a table with us. Walk-ins are always welcome too — for groups larger than we seat online, give us a call.',
  'tables', jsonb_build_array(
    jsonb_build_object('id', 't1', 'name', 'Table 1', 'seats', 2),
    jsonb_build_object('id', 't2', 'name', 'Table 2', 'seats', 2),
    jsonb_build_object('id', 't3', 'name', 'Table 3', 'seats', 4),
    jsonb_build_object('id', 't4', 'name', 'Table 4', 'seats', 4),
    jsonb_build_object('id', 't5', 'name', 'Table 5', 'seats', 6)
  ),
  'weeklyHours', jsonb_build_array(
    jsonb_build_object('day', 0, 'closed', false, 'open', '07:00', 'close', '15:00'),
    jsonb_build_object('day', 1, 'closed', false, 'open', '07:00', 'close', '15:00'),
    jsonb_build_object('day', 2, 'closed', false, 'open', '07:00', 'close', '15:00'),
    jsonb_build_object('day', 3, 'closed', false, 'open', '07:00', 'close', '15:00'),
    jsonb_build_object('day', 4, 'closed', false, 'open', '07:00', 'close', '15:00'),
    jsonb_build_object('day', 5, 'closed', false, 'open', '07:00', 'close', '15:00'),
    jsonb_build_object('day', 6, 'closed', false, 'open', '07:00', 'close', '15:00')
  ),
  'slotIntervalMinutes', 30,
  'turnaroundMinutes', 90,
  'minPartySize', 1,
  'maxPartySize', 10,
  'minLeadMinutes', 60,
  'maxAdvanceDays', 60,
  'requirePhone', true,
  'requireEmail', false,
  'autoConfirm', true,
  'confirmationNote', 'See you then! Please call us if your plans change. Walk-ins welcome any time during opening hours.'
))
on conflict (id) do nothing;

-- ===========================================================================
-- Point the site's "Book a table" buttons at the new internal /book page.
-- (Merges over any existing site_settings.urls without disturbing other keys.)
-- ===========================================================================
update public.site_settings
set data = data || jsonb_build_object(
  'urls', coalesce(data->'urls', '{}'::jsonb) || jsonb_build_object('book', '/book')
)
where id = 1;
