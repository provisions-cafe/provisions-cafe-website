-- ===========================================================================
-- storage.sql  —  public "media" bucket for admin image uploads.
-- Public read; authenticated insert/update/delete. Uploads happen client-side
-- from the admin (ImageUploader), which stores the returned public URL in the
-- relevant row/field (e.g. image_overrides.url, specials.image_url).
-- Safe to re-run.
-- ===========================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_authed_insert on storage.objects;
create policy media_authed_insert on storage.objects
  for insert with check (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists media_authed_update on storage.objects;
create policy media_authed_update on storage.objects
  for update using (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists media_authed_delete on storage.objects;
create policy media_authed_delete on storage.objects
  for delete using (bucket_id = 'media' and auth.uid() is not null);
