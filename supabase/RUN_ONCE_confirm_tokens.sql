-- Onay e-postası token'ları için tablo. Supabase Dashboard > SQL Editor'da çalıştır (Run).
-- send-confirm-email API bu tabloya yazar.

create table if not exists public.confirm_tokens (
  token uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

alter table public.confirm_tokens enable row level security;

-- Bu tabloya sadece backend (service_role) erişir; anon için policy tanımlamıyoruz.
