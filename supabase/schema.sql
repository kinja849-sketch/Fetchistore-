-- ──────────────────────────────────────────────
-- FETCHISTORE — PRODUCTION SUPABASE SCHEMA WITH POSTGIS & RLS
-- ──────────────────────────────────────────────

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- 2. Trigger Function for Updated At Timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. Profiles Table (Buyer / Seller users)
create table if not exists public.profiles (
  id text primary key,
  role text not null default 'user',
  full_name text,
  avatar_url text,
  phone text,
  location geography(POINT, 4326),
  preferred_radius_km numeric default 10.0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at_column();

-- 4. Delivery Addresses Table
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  buyer_id text not null references public.profiles(id) on delete cascade,
  label text default 'Home',
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text,
  country text default 'US',
  location geography(POINT, 4326),
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 5. Categories Table
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 6. Listings Table (New & Second-Hand Products)
create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id text not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  category_slug text,
  title text not null,
  description text not null,
  condition text not null check (condition in ('new', 'like_new', 'good', 'fair')),
  price numeric(10,2) not null check (price >= 0),
  old_price numeric(10,2) check (old_price >= 0),
  currency text default 'USD',
  quantity integer default 1 check (quantity >= 0),
  images text[] not null default '{}',
  location geography(POINT, 4326) not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_listings_location on public.listings using gist(location);
create index if not exists idx_listings_category on public.listings(category_id);
create index if not exists idx_listings_seller on public.listings(seller_id);
create index if not exists idx_listings_is_active on public.listings(is_active);

create trigger set_listings_updated_at
  before update on public.listings
  for each row execute function update_updated_at_column();

-- 7. Orders Table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id text not null references public.profiles(id),
  seller_id text not null references public.profiles(id),
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'cod_pending', 'accepted', 'out_for_delivery', 'nearby', 'delivered', 'completed', 'cancelled', 'refunded')
  ),
  payment_method text not null check (
    payment_method in ('stripe', 'bank_transfer', 'ewallet', 'cod')
  ),
  payment_status text not null default 'unpaid' check (
    payment_status in ('unpaid', 'paid', 'pending', 'refunded')
  ),
  total numeric(10,2) not null check (total >= 0),
  delivery_address jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_buyer on public.orders(buyer_id);
create index if not exists idx_orders_seller on public.orders(seller_id);
create index if not exists idx_orders_status on public.orders(status);

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at_column();

-- 8. Order Items Table
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

-- 9. Delivery Updates Table (Timeline + Stage History)
create table if not exists public.delivery_updates (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  location geography(POINT, 4326),
  created_at timestamptz default now()
);

create index if not exists idx_delivery_updates_order on public.delivery_updates(order_id);

-- 10. Live Delivery Locations (GPS Points while out for delivery)
create table if not exists public.delivery_locations (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  location geography(POINT, 4326) not null,
  recorded_at timestamptz default now()
);

create index if not exists idx_delivery_locations_order on public.delivery_locations(order_id);
create index if not exists idx_delivery_locations_location on public.delivery_locations using gist(location);

-- 11. Conversations & Messages (Order-scoped Chat)
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade unique,
  buyer_id text not null references public.profiles(id),
  seller_id text not null references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id text not null references public.profiles(id),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);

-- 12. Audit Logs Table
create table if not exists public.logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id text references public.profiles(id),
  action text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ──────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.delivery_updates enable row level security;
alter table public.delivery_locations enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.logs enable row level security;

-- Profiles: Public read/insert/update
create policy "Profiles select" on public.profiles for select using (true);
create policy "Profiles insert" on public.profiles for insert with check (true);
create policy "Profiles update" on public.profiles for update using (true);

-- Addresses: Public select/insert/update/delete
create policy "Addresses select" on public.addresses for select using (true);
create policy "Addresses insert" on public.addresses for insert with check (true);
create policy "Addresses update" on public.addresses for update using (true);
create policy "Addresses delete" on public.addresses for delete using (true);

-- Categories: Public read
create policy "Public categories read" on public.categories for select using (true);

-- Listings: Public read, insert, update, delete
create policy "Listings select" on public.listings for select using (true);
create policy "Listings insert" on public.listings for insert with check (true);
create policy "Listings update" on public.listings for update using (true);
create policy "Listings delete" on public.listings for delete using (true);

-- Orders: Public select, insert, update
create policy "Orders select" on public.orders for select using (true);
create policy "Orders insert" on public.orders for insert with check (true);
create policy "Orders update" on public.orders for update using (true);

-- Order items: Public select, insert
create policy "Order items select" on public.order_items for select using (true);
create policy "Order items insert" on public.order_items for insert with check (true);

-- Delivery updates & locations: Public select, insert
create policy "Delivery updates select" on public.delivery_updates for select using (true);
create policy "Delivery updates insert" on public.delivery_updates for insert with check (true);

create policy "Delivery locations select" on public.delivery_locations for select using (true);
create policy "Delivery locations insert" on public.delivery_locations for insert with check (true);

-- Conversations & Messages: Public select, insert
create policy "Conversations select" on public.conversations for select using (true);
create policy "Conversations insert" on public.conversations for insert with check (true);

create policy "Messages select" on public.messages for select using (true);
create policy "Messages insert" on public.messages for insert with check (true);

-- Logs: Public select, insert
create policy "Logs select" on public.logs for select using (true);
create policy "Logs insert" on public.logs for insert with check (true);

-- ──────────────────────────────────────────────
-- SEED DATA (Categories)
-- ──────────────────────────────────────────────

insert into public.categories (name, slug, image_url, sort_order)
values
  ('Fashion', 'fashion', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop&q=80', 1),
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&q=80', 2),
  ('Beauty', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80', 3),
  ('Fitness', 'fitness', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop&q=80', 4),
  ('Home Decor', 'home-decor', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop&q=80', 5),
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop&q=80', 6)
on conflict (slug) do nothing;

-- ──────────────────────────────────────────────
-- POSTGIS SPATIAL RPC FUNCTIONS
-- ──────────────────────────────────────────────

create or replace function nearby_listings(
  lat float8,
  lng float8,
  radius_meters float8 default 50000
)
returns table (
  id uuid,
  seller_id text,
  category_slug text,
  title text,
  description text,
  condition text,
  price numeric,
  old_price numeric,
  images text[],
  is_active boolean,
  created_at timestamptz,
  latitude float8,
  longitude float8,
  distance_km float8
)
language sql
as $$
  select
    l.id,
    l.seller_id,
    l.category_slug,
    l.title,
    l.description,
    l.condition,
    l.price,
    l.old_price,
    l.images,
    l.is_active,
    l.created_at,
    ST_Y(l.location::geometry) as latitude,
    ST_X(l.location::geometry) as longitude,
    round((ST_Distance(l.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) / 1000.0)::numeric, 2)::float8 as distance_km
  from public.listings l
  where l.is_active = true
    and ST_DWithin(l.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius_meters)
  order by distance_km asc;
$$;

