-- Notifications: admin creates, users see in panel
-- target_type: 'all' = all users, 'selected' = only target_user_ids

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  target_type text not null default 'all' check (target_type in ('all', 'selected')),
  target_user_ids uuid[] default '{}'
);

create index if not exists idx_notifications_created_at
  on public.notifications (created_at desc);

alter table public.notifications enable row level security;

-- Users can read notifications targeted to them (all or their id in target_user_ids)
create policy "Users can read own notifications"
  on public.notifications for select
  using (
    target_type = 'all'
    or (auth.uid() = any (target_user_ids))
  );

-- Insert only via API (service role), no RLS insert policy for clients

comment on table public.notifications is 'In-app notifications created by admin; target_type all or selected user ids.';
