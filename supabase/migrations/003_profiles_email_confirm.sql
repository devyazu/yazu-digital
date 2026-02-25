-- Profil: her kullanıcı için kayıt tarihi ve e-posta onay bilgisi
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email_confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Yeni kullanıcı oluşunca otomatik profil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, created_at)
  values (new.id, coalesce(new.created_at, now()));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- E-posta onay token'ları (link ile onay için)
create table if not exists public.confirm_tokens (
  token uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

alter table public.confirm_tokens enable row level security;

-- confirm_tokens'a sadece API (service_role key) erişir; anon policy yok.

-- Mevcut kullanıcılar için profil satırı (yeni kayıtlar trigger ile eklenir)
insert into public.profiles (id, created_at)
select id, created_at from auth.users
on conflict (id) do nothing;
