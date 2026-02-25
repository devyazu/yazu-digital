-- Profil alanları: ad, şirket, unvan, avatar (Account Settings için)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists company_name text,
  add column if not exists job_title text,
  add column if not exists avatar_url text;

comment on column public.profiles.full_name is 'Kullanıcının tam adı';
comment on column public.profiles.company_name is 'Şirket adı';
comment on column public.profiles.job_title is 'İş unvanı';
comment on column public.profiles.avatar_url is 'Profil fotoğrafı URL (Supabase Storage)';

-- Avatar: Supabase Dashboard > Storage > New bucket "avatars" (Public, 1MB). Policy: auth.uid() = (path)[1]
