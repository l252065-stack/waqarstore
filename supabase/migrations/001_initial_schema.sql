-- ============================================================
-- Waqar Store – Initial Database Schema
-- Run with: supabase db push
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";      -- fast ILIKE search

-- ─── Enum types ─────────────────────────────────────────────
create type user_role as enum ('customer', 'admin');
create type order_status as enum (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type payment_method as enum ('cod', 'stripe', 'payfast');

-- ─── Profiles ───────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles"
  on profiles for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Categories ─────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  description text,
  image_url   text,
  parent_id   uuid references categories(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table categories enable row level security;

create policy "Anyone can read categories"
  on categories for select using (true);
create policy "Only admins can modify categories"
  on categories for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on categories(slug);
create index on categories(parent_id);

-- ─── Products ───────────────────────────────────────────────
create table if not exists products (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text unique not null,
  description      text,
  price            numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price >= 0),
  category_id      uuid references categories(id) on delete set null,
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table products enable row level security;

create policy "Anyone can read active products"
  on products for select using (is_active = true);
create policy "Admins can do anything to products"
  on products for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on products(slug);
create index on products(category_id);
create index on products(is_featured) where is_featured = true;
create index on products using gin(name gin_trgm_ops);  -- for ILIKE search

-- ─── Product Images ─────────────────────────────────────────
create table if not exists product_images (
  id         uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url        text not null,
  alt        text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table product_images enable row level security;

create policy "Anyone can read product images"
  on product_images for select using (true);
create policy "Admins can modify product images"
  on product_images for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on product_images(product_id);

-- ─── Product Variants ────────────────────────────────────────
create table if not exists product_variants (
  id             uuid primary key default uuid_generate_v4(),
  product_id     uuid not null references products(id) on delete cascade,
  sku            text unique not null,
  size           text,
  color          text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  price_modifier numeric(10, 2) not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table product_variants enable row level security;

create policy "Anyone can read product variants"
  on product_variants for select using (true);
create policy "Admins can modify product variants"
  on product_variants for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on product_variants(product_id);
create index on product_variants(sku);

-- ─── Orders ─────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete restrict,
  status           order_status not null default 'pending',
  subtotal         numeric(10, 2) not null,
  discount         numeric(10, 2) not null default 0,
  shipping         numeric(10, 2) not null default 0,
  total            numeric(10, 2) not null,
  payment_method   payment_method not null,
  payment_status   payment_status not null default 'pending',
  shipping_address jsonb not null,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table orders enable row level security;

create policy "Users can read their own orders"
  on orders for select using (auth.uid() = user_id);
create policy "Users can insert their own orders"
  on orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders"
  on orders for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on orders(user_id);
create index on orders(status);
create index on orders(created_at desc);

-- ─── Order Items ────────────────────────────────────────────
create table if not exists order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references orders(id) on delete cascade,
  variant_id   uuid not null references product_variants(id) on delete restrict,
  quantity     integer not null check (quantity > 0),
  unit_price   numeric(10, 2) not null,
  total_price  numeric(10, 2) not null
);

alter table order_items enable row level security;

create policy "Users can read their own order items"
  on order_items for select using (
    exists (select 1 from orders where id = order_id and user_id = auth.uid())
  );
create policy "Admins can manage all order items"
  on order_items for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on order_items(order_id);

-- ─── Cart Items ─────────────────────────────────────────────
create table if not exists cart_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references profiles(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete cascade,
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, variant_id)
);

alter table cart_items enable row level security;

create policy "Users can manage their own cart"
  on cart_items for all using (auth.uid() = user_id);

create index on cart_items(user_id);

-- ─── Wishlist Items ──────────────────────────────────────────
create table if not exists wishlist_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table wishlist_items enable row level security;

create policy "Users can manage their own wishlist"
  on wishlist_items for all using (auth.uid() = user_id);

create index on wishlist_items(user_id);

-- ─── Updated-at trigger ──────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger set_updated_at_products
  before update on products
  for each row execute procedure set_updated_at();

create trigger set_updated_at_variants
  before update on product_variants
  for each row execute procedure set_updated_at();

create trigger set_updated_at_orders
  before update on orders
  for each row execute procedure set_updated_at();
