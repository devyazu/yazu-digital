-- Avatar storage: public bucket "avatars" and RLS so users can upload only to their own folder.
-- Run this migration so Profile avatar upload works (bucket + policies).

-- 1) Create public bucket (idempotent: skip if exists)
-- Optional: in Dashboard set file_size_limit 1MB and allowed_mime_types image/* for avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2) Policies: authenticated users can upload/update/select only in folder named by their user id
drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "Users can select own avatar" on storage.objects;
create policy "Users can select own avatar"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- Public read is via bucket public = true (getPublicUrl); no extra SELECT policy for anon needed.
