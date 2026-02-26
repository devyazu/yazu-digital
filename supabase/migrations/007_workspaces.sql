-- Workspaces (markalar): Kullanıcıya özel marka/workspace listesi
-- Logo URL Supabase Storage (brand-logos) veya harici URL olabilir.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'New Brand',
  website text not null default '',
  logo_url text,
  integrations jsonb not null default '[]',
  sales_agent_config jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_workspaces_user_id
  on public.workspaces (user_id);

alter table public.workspaces enable row level security;

create policy "Users can read own workspaces"
  on public.workspaces for select
  using (auth.uid() = user_id);

create policy "Users can insert own workspaces"
  on public.workspaces for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workspaces"
  on public.workspaces for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own workspaces"
  on public.workspaces for delete
  using (auth.uid() = user_id);

comment on table public.workspaces is 'Kullanıcı markaları (workspace). Logo brand-logos bucket''ta saklanır.';
