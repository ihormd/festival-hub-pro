
-- ============ ENUMS ============
create type public.app_role as enum ('admin','vendor','artist','volunteer','donor');
create type public.application_status as enum ('pending','approved','rejected','cancelled');
create type public.spot_status as enum ('available','pending','occupied','reserved');
create type public.sponsor_tier as enum ('bronze','silver','gold','platinum','custom');
create type public.payment_status as enum ('pending','paid','failed','refunded');
create type public.order_status as enum ('pending','paid','fulfilled','cancelled','refunded');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  locale text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create policy "user_roles_select_own" on public.user_roles for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "user_roles_admin_all" on public.user_roles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ VENDOR SPOTS ============
create table public.vendor_spots (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text,
  price_cents integer not null default 25000,
  x numeric not null,
  y numeric not null,
  w numeric not null default 60,
  h numeric not null default 60,
  status spot_status not null default 'available',
  vendor_user_id uuid references auth.users(id) on delete set null,
  pending_until timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.vendor_spots enable row level security;
create trigger vendor_spots_updated before update on public.vendor_spots for each row execute function public.set_updated_at();

create policy "spots_public_read" on public.vendor_spots for select using (true);
create policy "spots_admin_all" on public.vendor_spots for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

alter publication supabase_realtime add table public.vendor_spots;

-- ============ VENDOR APPLICATIONS ============
create table public.vendor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  category text not null,
  description text,
  contact_email text not null,
  contact_phone text,
  document_urls text[] default '{}',
  requested_spot_id uuid references public.vendor_spots(id) on delete set null,
  status application_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.vendor_applications enable row level security;
create trigger vendor_apps_updated before update on public.vendor_applications for each row execute function public.set_updated_at();

create policy "vendor_apps_own_select" on public.vendor_applications for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "vendor_apps_own_insert" on public.vendor_applications for insert with check (auth.uid() = user_id);
create policy "vendor_apps_own_update" on public.vendor_applications for update using (auth.uid() = user_id and status = 'pending');
create policy "vendor_apps_admin_all" on public.vendor_applications for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ ARTIST APPLICATIONS ============
create table public.artist_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_name text not null,
  bio text,
  contact_email text not null,
  contact_phone text,
  portfolio_links text[] default '{}',
  tech_rider_url text,
  stage_preference text,
  set_length_minutes integer,
  status application_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.artist_applications enable row level security;
create trigger artist_apps_updated before update on public.artist_applications for each row execute function public.set_updated_at();

create policy "artist_apps_own_select" on public.artist_applications for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "artist_apps_own_insert" on public.artist_applications for insert with check (auth.uid() = user_id);
create policy "artist_apps_own_update" on public.artist_applications for update using (auth.uid() = user_id and status = 'pending');
create policy "artist_apps_admin_all" on public.artist_applications for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ VOLUNTEER SHIFTS + APPS ============
create table public.volunteer_shifts (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 5,
  created_at timestamptz not null default now()
);
alter table public.volunteer_shifts enable row level security;
create policy "shifts_public_read" on public.volunteer_shifts for select using (true);
create policy "shifts_admin_all" on public.volunteer_shifts for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  contact_email text not null,
  contact_phone text,
  interests text[] default '{}',
  selected_shifts uuid[] default '{}',
  notes text,
  status application_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.volunteer_applications enable row level security;
create trigger vol_apps_updated before update on public.volunteer_applications for each row execute function public.set_updated_at();

create policy "vol_apps_own_select" on public.volunteer_applications for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "vol_apps_own_insert" on public.volunteer_applications for insert with check (auth.uid() = user_id);
create policy "vol_apps_own_update" on public.volunteer_applications for update using (auth.uid() = user_id and status = 'pending');
create policy "vol_apps_admin_all" on public.volunteer_applications for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ SPONSORSHIPS ============
create table public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tier sponsor_tier not null,
  amount_cents integer not null,
  company_name text not null,
  contact_name text,
  contact_email text not null,
  logo_url text,
  website_url text,
  message text,
  payment_status payment_status not null default 'pending',
  stripe_session_id text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.sponsorships enable row level security;
create trigger sponsorships_updated before update on public.sponsorships for each row execute function public.set_updated_at();

create policy "sponsors_public_read_paid" on public.sponsorships for select using (payment_status = 'paid' and is_public);
create policy "sponsors_own_select" on public.sponsorships for select using (auth.uid() = user_id);
create policy "sponsors_own_insert" on public.sponsorships for insert with check (auth.uid() = user_id or user_id is null);
create policy "sponsors_admin_all" on public.sponsorships for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ MERCH ============
create table public.merch_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null,
  image_url text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.merch_products enable row level security;
create trigger merch_products_updated before update on public.merch_products for each row execute function public.set_updated_at();
create policy "merch_public_read_active" on public.merch_products for select using (active);
create policy "merch_admin_all" on public.merch_products for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.merch_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  contact_email text not null,
  contact_name text,
  total_cents integer not null,
  status order_status not null default 'pending',
  stripe_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.merch_orders enable row level security;
create trigger merch_orders_updated before update on public.merch_orders for each row execute function public.set_updated_at();
create policy "orders_own_select" on public.merch_orders for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "orders_own_insert" on public.merch_orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "orders_admin_all" on public.merch_orders for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.merch_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.merch_orders(id) on delete cascade,
  product_id uuid not null references public.merch_products(id),
  product_name text not null,
  unit_price_cents integer not null,
  quantity integer not null
);
alter table public.merch_order_items enable row level security;
create policy "order_items_select" on public.merch_order_items for select using (
  exists (select 1 from public.merch_orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);
create policy "order_items_admin_all" on public.merch_order_items for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ STORAGE BUCKETS ============
insert into storage.buckets (id, name, public) values
  ('vendor-docs','vendor-docs', false),
  ('artist-riders','artist-riders', false),
  ('merch-images','merch-images', true),
  ('sponsor-logos','sponsor-logos', true)
on conflict (id) do nothing;

-- Public read for public buckets
create policy "public read merch-images" on storage.objects for select using (bucket_id = 'merch-images');
create policy "public read sponsor-logos" on storage.objects for select using (bucket_id = 'sponsor-logos');

-- Authenticated users upload to their own folder (object name starts with their uid)
create policy "vendor-docs auth upload own" on storage.objects for insert
  with check (bucket_id = 'vendor-docs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "vendor-docs auth read own" on storage.objects for select
  using (bucket_id = 'vendor-docs' and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(),'admin')));

create policy "artist-riders auth upload own" on storage.objects for insert
  with check (bucket_id = 'artist-riders' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "artist-riders auth read own" on storage.objects for select
  using (bucket_id = 'artist-riders' and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(),'admin')));

create policy "sponsor-logos auth upload" on storage.objects for insert
  with check (bucket_id = 'sponsor-logos' and auth.role() = 'authenticated');

-- ============ SEED DATA ============
-- 30 vendor spots arranged in a 6x5 grid on a 800x600 SVG canvas
do $$
declare
  i int;
  r int;
  c int;
  spot_x numeric;
  spot_y numeric;
begin
  for i in 1..30 loop
    r := (i - 1) / 6;
    c := (i - 1) % 6;
    spot_x := 80 + c * 110;
    spot_y := 100 + r * 90;
    insert into public.vendor_spots (code, label, price_cents, x, y, w, h)
    values ('A' || lpad(i::text, 2, '0'), 'Booth ' || i, case when i <= 6 then 50000 else 25000 end, spot_x, spot_y, 90, 70);
  end loop;
end $$;

-- Sample volunteer shifts
insert into public.volunteer_shifts (area, description, starts_at, ends_at, capacity) values
  ('Gate / Welcome','Greet attendees and check tickets', now() + interval '30 days' + interval '8 hours', now() + interval '30 days' + interval '12 hours', 8),
  ('Vendor Support','Help vendors with setup and logistics', now() + interval '30 days' + interval '7 hours', now() + interval '30 days' + interval '11 hours', 6),
  ('Stage Crew','Assist stage transitions and equipment', now() + interval '30 days' + interval '12 hours', now() + interval '30 days' + interval '20 hours', 10),
  ('Cleanup Team','End-of-day grounds cleanup', now() + interval '30 days' + interval '20 hours', now() + interval '30 days' + interval '23 hours', 12);

-- Sample merch products
insert into public.merch_products (name, description, price_cents, stock) values
  ('Festua Festival T-Shirt','Premium cotton tee with embroidered Festua mark', 3500, 100),
  ('Vyshyvanka-inspired Hoodie','Heavyweight hoodie featuring traditional Ukrainian motifs', 7500, 50),
  ('Festival Tote Bag','Durable canvas tote — perfect for the festival grounds', 2500, 200),
  ('Ceramic Mug','Hand-glazed Festua keepsake mug', 2200, 75),
  ('Enamel Pin Set','Set of 4 collectible Ukrainian-Canadian pins', 1800, 150),
  ('Embroidered Cap','Six-panel cap with Festua embroidery', 3200, 80);
