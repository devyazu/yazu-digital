# Favorites: Supabase migration (required once)

If the app shows a **white screen** after login or when using favorites, the `favorite_tool_ids` column is probably missing.

## What to do

1. Open **Supabase Dashboard** → your project.
2. Go to **SQL Editor**.
3. Run the contents of **`supabase/migrations/013_profiles_favorite_tool_ids.sql`** (or paste the SQL below).
4. Click **Run**.

## SQL to run

```sql
alter table public.profiles
  add column if not exists favorite_tool_ids jsonb not null default '[]'::jsonb;

comment on column public.profiles.favorite_tool_ids is 'Ordered list of favorite tool IDs for sidebar';
```

After this, refresh the app; favorites will persist and the white screen should be resolved.
