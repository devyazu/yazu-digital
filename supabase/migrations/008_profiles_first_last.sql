-- First name and last name for profile (Account Settings)
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text;

comment on column public.profiles.first_name is 'User first name';
comment on column public.profiles.last_name is 'User last name';
