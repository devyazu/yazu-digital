-- REQUIRED: Run this in Supabase Dashboard → SQL Editor (once per project).
-- User's favorite tool IDs (ordered). Persisted per user so favorites and order survive refresh.
alter table public.profiles
  add column if not exists favorite_tool_ids jsonb not null default '[]'::jsonb;

comment on column public.profiles.favorite_tool_ids is 'Ordered list of favorite tool IDs for sidebar';
