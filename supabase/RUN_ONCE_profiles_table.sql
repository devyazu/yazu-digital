-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştır (Run).
-- profiles tablosu ve gerekli sütunları oluşturur / günceller.

-- 1) profiles tablosu (yoksa oluştur)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email_confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policy'ler (varsa sil, tekrar oluştur)
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2) Ek profil sütunları (avatar, ad, şirket, unvan)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists company_name text,
  add column if not exists job_title text,
  add column if not exists avatar_url text;

-- 3) Mevcut auth kullanıcıları için profil satırı
insert into public.profiles (id, created_at)
select id, created_at from auth.users
on conflict (id) do nothing;
