-- ============================================================
-- 幻想外送 Supabase Schema
-- 在 Supabase SQL Editor 直接整段執行即可建立所有資料表、
-- RLS 政策與 Realtime 設定。
-- ============================================================

-- 餐廳表
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  rating numeric(2,1),
  review_count int,
  min_order int,
  delivery_time text,
  image_url text,
  created_at timestamptz default now()
);

-- 菜單品項表
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  description text,
  price int not null,
  image_url text,
  category text
);

-- 假評論表
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  reviewer_name text,
  rating int,
  content text,
  created_at timestamptz default now()
);

-- 假訂單表（永遠不會送達）
create table if not exists fake_orders (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  items jsonb,
  address text,
  payment_method text,
  -- 狀態只允許：confirmed → preparing → delivering
  -- 在資料庫層級就禁止 'delivered'（重要規則 2 的硬保證）
  status text default 'confirmed'
    check (status in ('confirmed', 'preparing', 'delivering')),
  rider_name text,
  rider_lat numeric,
  rider_lng numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 索引
create index if not exists idx_menu_items_restaurant on menu_items(restaurant_id);
create index if not exists idx_reviews_restaurant on reviews(restaurant_id);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table reviews enable row level security;
alter table fake_orders enable row level security;

-- 餐廳 / 菜單 / 評論：任何人可讀
drop policy if exists "public read restaurants" on restaurants;
create policy "public read restaurants" on restaurants for select using (true);

drop policy if exists "public read menu_items" on menu_items;
create policy "public read menu_items" on menu_items for select using (true);

drop policy if exists "public read reviews" on reviews;
create policy "public read reviews" on reviews for select using (true);

-- 假訂單：任何人可建立、讀取、更新（更新只會動到外送員座標）。
-- status 的 check constraint 已保證永遠不會變成 delivered。
-- 不開放 delete。
drop policy if exists "anon insert orders" on fake_orders;
create policy "anon insert orders" on fake_orders for insert with check (true);

drop policy if exists "anon read orders" on fake_orders;
create policy "anon read orders" on fake_orders for select using (true);

drop policy if exists "anon update orders" on fake_orders;
create policy "anon update orders" on fake_orders for update using (true) with check (true);

-- ------------------------------------------------------------
-- updated_at 自動更新
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_fake_orders_updated_at on fake_orders;
create trigger trg_fake_orders_updated_at
  before update on fake_orders
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Realtime：讓 fake_orders 的變更可被前端訂閱
-- ------------------------------------------------------------
alter publication supabase_realtime add table fake_orders;
