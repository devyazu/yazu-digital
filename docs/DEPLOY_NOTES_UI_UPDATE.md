# Deploy notes – UI & profile update

After pulling this update:

## Supabase

1. **Run migration 008 (profiles first/last name)**  
   In Supabase Dashboard → SQL Editor, run the contents of:
   - `supabase/migrations/008_profiles_first_last.sql`  
   This adds `first_name` and `last_name` to `profiles`. Existing rows keep `full_name`; new profile form uses first/last.

2. No other Supabase changes required. Avatars and brand logos use existing buckets and tables.

## Vercel

- No env or config changes needed for this release.
- Redeploy as usual after pushing (or let CI deploy).

## Summary of changes

- **Avatar:** Header and Account Settings use the same source (DB profile). Avatar persists after refresh.
- **Profile:** First name and last name fields; profile section updated.
- **Notifications:** Bell icon in header (left of profile photo); right-side panel with notifications.
- **Sidebar:** Toggle and logout moved to bottom-left; Help is icon-only. When sidebar is closed on desktop, a mini icon bar is shown; clicking an icon opens the full sidebar.
- **Copy:** All user-facing Turkish strings switched to English (login, chat archive, settings, header, brands, etc.).
