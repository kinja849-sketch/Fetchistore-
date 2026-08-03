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
  id uuid primary key references auth.users(id) on delete cascade,
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

-- Auto-create profile trigger on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Delivery Addresses Table
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
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
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
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
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
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
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);

-- 12. Audit Logs Table
create table if not exists public.logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
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

-- Profiles: Public read, user can update own profile
create policy "Public profiles read" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Addresses: Buyers see & update their own addresses
create policy "Buyers view own addresses" on public.addresses for select using (auth.uid() = buyer_id);
create policy "Buyers insert own addresses" on public.addresses for insert with check (auth.uid() = buyer_id);
create policy "Buyers update own addresses" on public.addresses for update using (auth.uid() = buyer_id);
create policy "Buyers delete own addresses" on public.addresses for delete using (auth.uid() = buyer_id);

-- Categories: Public read
create policy "Public categories read" on public.categories for select using (true);

-- Listings: Public read active listings, seller manages their own listings
create policy "Public active listings read" on public.listings for select using (is_active = true or auth.uid() = seller_id);
create policy "Sellers create listings" on public.listings for insert with check (auth.uid() = seller_id);
create policy "Sellers update own listings" on public.listings for update using (auth.uid() = seller_id);
create policy "Sellers delete own listings" on public.listings for delete using (auth.uid() = seller_id);

-- Orders: Buyers view their orders, Sellers view orders they fulfill
create policy "Order participants view orders" on public.orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers create orders" on public.orders for insert with check (auth.uid() = buyer_id);
create policy "Order participants update orders" on public.orders for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Order items: Order participants view items
create policy "Order participants view items" on public.order_items for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
  )
);
create policy "Buyers insert order items" on public.order_items for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.buyer_id = auth.uid()
  )
);

-- Delivery updates & locations: Order participants view delivery data
create policy "Order participants view delivery updates" on public.delivery_updates for select using (
  exists (
    select 1 from public.orders
    where orders.id = delivery_updates.order_id
    and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
  )
);
create policy "Sellers insert delivery updates" on public.delivery_updates for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = delivery_updates.order_id
    and orders.seller_id = auth.uid()
  )
);

create policy "Order participants view live delivery locations" on public.delivery_locations for select using (
  exists (
    select 1 from public.orders
    where orders.id = delivery_locations.order_id
    and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
  )
);
create policy "Sellers insert live location points" on public.delivery_locations for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = delivery_locations.order_id
    and orders.seller_id = auth.uid()
    and orders.status in ('out_for_delivery', 'nearby')
  )
);

-- Conversations & Messages: Order-scoped
create policy "Order participants view conversations" on public.conversations for select using (
  auth.uid() = buyer_id or auth.uid() = seller_id
);
create policy "Order participants create conversations" on public.conversations for insert with check (
  auth.uid() = buyer_id or auth.uid() = seller_id
);

create policy "Conversation participants view messages" on public.messages for select using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
    and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
  )
);
create policy "Conversation participants insert messages" on public.messages for insert with check (
  auth.uid() = sender_id and
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
    and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
  )
);

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
