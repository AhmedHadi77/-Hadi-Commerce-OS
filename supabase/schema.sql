create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  full_name text,
  avatar_url text,
  region text default 'Online',
  phone text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text,
  preferred_language text default 'English',
  marketing_opt_in boolean not null default false,
  delivery_notes text,
  created_at timestamptz not null default now()
);

alter table public.users add column if not exists phone text;
alter table public.users add column if not exists address_line_1 text;
alter table public.users add column if not exists address_line_2 text;
alter table public.users add column if not exists city text;
alter table public.users add column if not exists state text;
alter table public.users add column if not exists postal_code text;
alter table public.users add column if not exists country text;
alter table public.users add column if not exists preferred_language text default 'English';
alter table public.users add column if not exists marketing_opt_in boolean not null default false;
alter table public.users add column if not exists delivery_notes text;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  category text not null,
  stock integer not null default 0 check (stock >= 0),
  rating numeric(3, 2) not null default 4.5,
  description text not null,
  badge text default 'New Arrival',
  sku text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  total_price numeric(10, 2) not null check (total_price >= 0),
  status text not null default 'processing',
  shipping_address text,
  payment_method text,
  coupon_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0)
);

create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  type text not null check (type in ('percent', 'fixed')),
  value numeric(10, 2) not null,
  minimum_spend numeric(10, 2) not null default 0,
  active boolean not null default true,
  expires_at timestamptz
);

create table if not exists public.search_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  query text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart enable row level security;
alter table public.promotions enable row level security;
alter table public.search_events enable row level security;

create policy "Users can read their profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can update their profile"
on public.users
for update
using (auth.uid() = id);

create policy "Users can create their profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "Products are readable by everyone"
on public.products
for select
using (true);

create policy "Admins can manage products"
on public.products
for all
using (
  exists (
    select 1
    from public.users
    where users.id = auth.uid() and users.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.users
    where users.id = auth.uid() and users.role = 'admin'
  )
);

create policy "Users can manage their own orders"
on public.orders
for select
using (auth.uid() = user_id);

create policy "Users can insert their own orders"
on public.orders
for insert
with check (auth.uid() = user_id);

create policy "Users can read their own cart"
on public.cart
for select
using (auth.uid() = user_id);

create policy "Users can manage their own cart"
on public.cart
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Promotions are readable by everyone"
on public.promotions
for select
using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role, full_name, avatar_url)
  values (
    new.id,
    new.email,
    case when new.email like '%admin%' then 'admin' else 'user' end,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
