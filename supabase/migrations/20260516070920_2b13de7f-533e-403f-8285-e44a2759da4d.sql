
-- team_members
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_url text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.team_members enable row level security;
create policy team_public_read on public.team_members for select using (active);
create policy team_admin_all on public.team_members for all using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));
create trigger team_set_updated before update on public.team_members for each row execute function public.set_updated_at();

-- sponsors
create type sponsor_level as enum ('platinum','gold','silver','bronze');
create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  level sponsor_level not null default 'silver',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.sponsors enable row level security;
create policy sponsors_public_read on public.sponsors for select using (active);
create policy sponsors_admin_all on public.sponsors for all using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));
create trigger sponsors_set_updated before update on public.sponsors for each row execute function public.set_updated_at();

-- site_settings
create table public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy settings_public_read on public.site_settings for select using (true);
create policy settings_admin_all on public.site_settings for all using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));
create trigger settings_set_updated before update on public.site_settings for each row execute function public.set_updated_at();

-- contact_messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy contact_anyone_insert on public.contact_messages for insert with check (true);
create policy contact_admin_read on public.contact_messages for select using (has_role(auth.uid(),'admin'));
create policy contact_admin_update on public.contact_messages for update using (has_role(auth.uid(),'admin'));

-- storage bucket
insert into storage.buckets (id, name, public) values ('team-photos','team-photos', true) on conflict (id) do nothing;
create policy "team-photos public read" on storage.objects for select using (bucket_id = 'team-photos');
create policy "team-photos admin write" on storage.objects for insert with check (bucket_id = 'team-photos' and has_role(auth.uid(),'admin'));
create policy "team-photos admin update" on storage.objects for update using (bucket_id = 'team-photos' and has_role(auth.uid(),'admin'));
create policy "team-photos admin delete" on storage.objects for delete using (bucket_id = 'team-photos' and has_role(auth.uid(),'admin'));

-- seed: board of directors
insert into public.team_members (name, role, bio, sort_order) values
  ('Irena Shantz', 'President', 'Leading NUFF with vision and dedication to celebrate Ukrainian heritage in the Niagara region.', 1),
  ('Michael Saciuk', 'Vice President', 'Supporting strategic direction and community partnerships for the festival.', 2),
  ('Oksana Fischer', 'Treasurer', 'Stewarding NUFF''s finances to keep the festival sustainable and accessible.', 3),
  ('Luba Novosad', 'Secretary', 'Keeping the board organized and the community informed.', 4),
  ('Stefan Fischer', 'Director', 'Bringing operational excellence to festival production.', 5),
  ('Andrew Novosad', 'Director', 'Building bridges between generations of the Ukrainian-Canadian community.', 6);

-- seed: site settings
insert into public.site_settings (key, value) values
  ('festival_name', 'Niagara Ukrainian Family Festival'),
  ('festival_short_name', 'NUFF'),
  ('festival_dates', 'July 17–19, 2026'),
  ('festival_year', '2026'),
  ('location_name', 'Fireman''s Park'),
  ('location_address', '2275 Dorchester Road, Niagara Falls, ON'),
  ('hero_tagline', 'A celebration of Ukrainian heritage in the heart of Niagara.'),
  ('hero_subtitle', 'Three days of music, dance, food, craft, and community at Fireman''s Park.'),
  ('about_mission', 'The Niagara Ukrainian Family Festival exists to celebrate, preserve, and share Ukrainian culture with the Niagara region. Through music, dance, cuisine, and craft we honour the traditions our families carried across an ocean and the new ones we build together each summer.'),
  ('about_history', 'Rooted in a community that has called the Niagara region home for generations, NUFF grew from neighbourhood gatherings into a destination festival. Today thousands of friends and families — Ukrainian-Canadian and not — come together to dance, eat, learn, and stand in solidarity with Ukraine.'),
  ('contact_email', 'info@nuff.ca'),
  ('contact_phone', ''),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11649.83!2d-79.099!3d43.097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sFireman''s%20Park!5e0!3m2!1sen!2sca!4v1700000000000');

-- seed: a few placeholder sponsors so the homepage section looks real
insert into public.sponsors (name, level, sort_order, website_url) values
  ('Become a Platinum Sponsor', 'platinum', 1, '/contact'),
  ('Become a Gold Sponsor', 'gold', 2, '/contact'),
  ('Become a Silver Sponsor', 'silver', 3, '/contact');
