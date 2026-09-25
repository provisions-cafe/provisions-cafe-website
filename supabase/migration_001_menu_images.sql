-- ===========================================================================
-- migration_001_menu_images.sql
-- Adds an optional photo per menu item. Run once in the Supabase SQL editor on
-- an existing database (already folded into menu.sql / all.sql for fresh installs).
-- Safe to re-run.
-- ===========================================================================

alter table public.menu_items
  add column if not exists image_url text;
