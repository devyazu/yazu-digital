-- Chat Archive: Her kullanıcının AI aracı yazışmaları
-- Supabase Dashboard → SQL Editor'da bu dosyanın içeriğini yapıştırıp "Run" deyin.

-- Tablo: chat_archive
create table if not exists public.chat_archive (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id text not null,
  tool_name text not null,
  input text not null,
  output text not null,
  brand_id text,
  created_at timestamptz not null default now()
);

-- Hızlı listeleme için index (kullanıcı + tarih)
create index if not exists idx_chat_archive_user_created
  on public.chat_archive (user_id, created_at desc);

-- RLS: Sadece kendi kayıtlarını görsün / eklesin
alter table public.chat_archive enable row level security;

create policy "Users can read own chat archive"
  on public.chat_archive for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat archive"
  on public.chat_archive for insert
  with check (auth.uid() = user_id);

-- Not: Supabase Auth kullanacaksanız auth.users ile user_id eşleşir.
-- Henüz auth yoksa bu migration'ı auth ekledikten sonra çalıştırın veya
-- user_id'yi text yapıp geçici olarak farklı bir auth sistemiyle doldurabilirsiniz.
