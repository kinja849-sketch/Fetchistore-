-- ──────────────────────────────────────────────
-- FETCHISTORE — CLERK COMPATIBILITY & RLS POLICIES
-- ──────────────────────────────────────────────
-- Ensures Supabase schema works cleanly with Clerk text user IDs ('user_...')

-- 1. Ensure Profiles Table Primary Key is TEXT
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

-- 2. Ensure Listings Table references public.profiles(id) TEXT
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

-- 3. RLS Policies for Listings & Profiles
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- Profiles: Public select/insert/update
drop policy if exists "Profiles select" on public.profiles;
drop policy if exists "Profiles insert" on public.profiles;
drop policy if exists "Profiles update" on public.profiles;

create policy "Profiles select" on public.profiles for select using (true);
create policy "Profiles insert" on public.profiles for insert with check (true);
create policy "Profiles update" on public.profiles for update using (true);

-- Listings: Public select/insert/update/delete
drop policy if exists "Listings select" on public.listings;
drop policy if exists "Listings insert" on public.listings;
drop policy if exists "Listings update" on public.listings;
drop policy if exists "Listings delete" on public.listings;

create policy "Listings select" on public.listings for select using (true);
create policy "Listings insert" on public.listings for insert with check (true);
create policy "Listings update" on public.listings for update using (true);
create policy "Listings delete" on public.listings for delete using (true);

-- 4. Categories Seed Data
insert into public.categories (name, slug, image_url, sort_order)
values
  ('Fashion', 'fashion', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop&q=80', 1),
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&q=80', 2),
  ('Beauty', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80', 3),
  ('Fitness', 'fitness', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop&q=80', 4),
  ('Home Decor', 'home-decor', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop&q=80', 5),
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop&q=80', 6)
on conflict (slug) do nothing;
