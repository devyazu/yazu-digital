-- Abonelik ürünleri: admin panelden yönetilir, Stripe'a senkronize edilir.
-- Checkout ve webhook stripe_price_id ile bu tabloya bakarak tier eşleştirir.

create table if not exists public.subscription_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tier text not null check (tier in ('basic','pro','premium')),
  price_amount_cents int not null check (price_amount_cents >= 0),
  currency text not null default 'usd',
  stripe_product_id text,
  stripe_price_id text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscription_products is 'Admin panelden yönetilen abonelik planları; Stripe Product/Price ile senkronize.';
create index if not exists idx_subscription_products_tier on public.subscription_products(tier);
create index if not exists idx_subscription_products_stripe_price_id on public.subscription_products(stripe_price_id);
create index if not exists idx_subscription_products_active on public.subscription_products(is_active) where is_active = true;

alter table public.subscription_products enable row level security;

create policy "Service role full access subscription_products"
  on public.subscription_products for all
  to service_role using (true) with check (true);

create policy "Authenticated read subscription_products"
  on public.subscription_products for select
  to authenticated using (true);
