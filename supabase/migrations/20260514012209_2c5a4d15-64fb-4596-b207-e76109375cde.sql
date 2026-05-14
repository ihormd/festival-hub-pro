
-- Fix: set search_path on set_updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql
security invoker set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;

-- Restrict execute on security-definer helpers
revoke execute on function public.has_role(uuid, app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, app_role) to authenticated;
-- handle_new_user is invoked only via trigger; revoke direct execute
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Tighten public bucket select policies: drop broad ones (already exist) and recreate as no-op since
-- public buckets serve via /object/public/* without needing storage.objects SELECT.
drop policy if exists "public read merch-images" on storage.objects;
drop policy if exists "public read sponsor-logos" on storage.objects;
-- (No replacement policy needed — public buckets are accessible via the public URL endpoint.)
