create table if not exists public.woo_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  site_url text not null,
  consumer_key text not null,
  consumer_secret text not null,
  is_connected boolean not null default true,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id)
);

create index if not exists idx_woo_connections_user_workspace
  on public.woo_connections (user_id, workspace_id);

create table if not exists public.woo_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  external_id text not null,
  name text,
  status text,
  price text,
  stock_status text,
  raw jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, external_id)
);

create index if not exists idx_woo_products_workspace_updated
  on public.woo_products (workspace_id, updated_at desc);

create table if not exists public.woo_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  external_id text not null,
  status text,
  currency text,
  total text,
  customer_name text,
  customer_email text,
  raw jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, external_id)
);

create index if not exists idx_woo_orders_workspace_updated
  on public.woo_orders (workspace_id, updated_at desc);

alter table public.woo_connections enable row level security;
alter table public.woo_products enable row level security;
alter table public.woo_orders enable row level security;

create policy "Users can read own woo connections"
  on public.woo_connections
  for select
  using (auth.uid() = user_id);

create policy "Users can read own woo products"
  on public.woo_products
  for select
  using (auth.uid() = user_id);

create policy "Users can read own woo orders"
  on public.woo_orders
  for select
  using (auth.uid() = user_id);
