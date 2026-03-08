-- User tier, credits, and max_brands for plan/subscription and tool access.
-- Tier: free | basic | pro | premium | enterprise

alter table public.profiles
  add column if not exists tier text not null default 'free' check (tier in ('free', 'basic', 'pro', 'premium', 'enterprise')),
  add column if not exists credits_total int not null default 1000,
  add column if not exists credits_used int not null default 0,
  add column if not exists max_brands int not null default 1;

comment on column public.profiles.tier is 'User plan: free, basic, pro, premium, enterprise';
comment on column public.profiles.credits_total is 'Total credits for the current period';
comment on column public.profiles.credits_used is 'Credits consumed';
comment on column public.profiles.max_brands is 'Max brand workspaces allowed';

-- Ensure new signups get a profile row with default tier (if not already present)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, created_at, tier, credits_total, credits_used, max_brands)
  values (new.id, coalesce(new.created_at, now()), 'free', 1000, 0, 1)
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
