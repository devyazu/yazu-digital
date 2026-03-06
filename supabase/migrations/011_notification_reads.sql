-- Track which notifications each user has read (for unread badge and "mark as read").
create table if not exists public.notification_reads (
  user_id uuid not null references auth.users(id) on delete cascade,
  notification_id uuid not null references public.notifications(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, notification_id)
);

create index if not exists idx_notification_reads_user_id
  on public.notification_reads (user_id);

alter table public.notification_reads enable row level security;

-- Users can only see and insert their own read records
create policy "Users can select own notification reads"
  on public.notification_reads for select
  using (auth.uid() = user_id);

create policy "Users can insert own notification reads"
  on public.notification_reads for insert
  to authenticated
  with check (auth.uid() = user_id);

comment on table public.notification_reads is 'Per-user read state for in-app notifications; used for unread count badge.';
