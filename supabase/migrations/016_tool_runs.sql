create table if not exists public.tool_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_id uuid references public.workspaces(id) on delete set null,
  tool_id text not null,
  status text not null check (status in ('success', 'failed')),
  error_message text,
  input_preview text,
  cost_used int not null default 0,
  latency_ms int,
  created_at timestamptz not null default now()
);

create index if not exists idx_tool_runs_user_id_created_at
  on public.tool_runs (user_id, created_at desc);

create index if not exists idx_tool_runs_tool_id
  on public.tool_runs (tool_id);

alter table public.tool_runs enable row level security;

create policy "Users can read own tool runs"
  on public.tool_runs
  for select
  using (auth.uid() = user_id);
