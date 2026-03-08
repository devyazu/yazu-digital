-- Stripe subscription fields for billing. Run in Supabase Dashboard → SQL Editor.
-- Security: only service role (e.g. webhook) may update these; trigger blocks client updates.

alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists current_period_end timestamptz,
  add column if not exists stripe_price_id text;

comment on column public.profiles.stripe_customer_id is 'Stripe customer ID (set by backend only)';
comment on column public.profiles.stripe_subscription_id is 'Stripe subscription ID';
comment on column public.profiles.subscription_status is 'active, canceled, past_due, etc.';
comment on column public.profiles.current_period_end is 'End of current billing period';
comment on column public.profiles.stripe_price_id is 'Stripe price ID (maps to tier)';

-- Prevent client from updating subscription/tier fields (only service role / webhook should).
-- When request uses anon key with auth.uid() set, block changes to these columns.
create or replace function public.block_subscription_fields_update()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null then
    if (new.tier is distinct from old.tier)
       or (new.stripe_customer_id is distinct from old.stripe_customer_id)
       or (new.stripe_subscription_id is distinct from old.stripe_subscription_id)
       or (new.subscription_status is distinct from old.subscription_status)
       or (new.current_period_end is distinct from old.current_period_end)
       or (new.stripe_price_id is distinct from old.stripe_price_id)
       or (new.credits_total is distinct from old.credits_total)
       or (new.max_brands is distinct from old.max_brands)
    then
      raise exception 'Subscription and tier fields can only be updated by the billing service.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists block_subscription_fields_update on public.profiles;
create trigger block_subscription_fields_update
  before update on public.profiles
  for each row execute function public.block_subscription_fields_update();
