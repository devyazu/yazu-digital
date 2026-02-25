-- Admin kullanıcıları: Sadece bu tabloda e-postası olan kullanıcılar /admin paneline girebilir.
-- Supabase SQL Editor'da çalıştırın. Sonra aşağıdaki INSERT'te e-postayı kendi admin e-postanızla değiştirin.

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Kullanıcı sadece kendi e-postasının admin listede olup olmadığını görebilir (başka adminleri göremez).
create policy "Users can check own admin status"
  on public.admin_users for select
  using (auth.jwt() ->> 'email' = email);

-- İlk admin: Bu dosyayı çalıştırdıktan sonra ADMIN_KURULUM.md'deki gibi
-- kendi e-postanızı ekleyin: insert into public.admin_users (email) values ('sizin@email.com') on conflict (email) do nothing;
