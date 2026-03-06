# Deploy notes – UI & profile update

After pulling this update:

## Supabase

1. **Run migration 008 (profiles first/last name)**  
   In Supabase Dashboard → SQL Editor, run the contents of:
   - `supabase/migrations/008_profiles_first_last.sql`  
   This adds `first_name` and `last_name` to `profiles`.

2. **Run migration 009 (notifications)**  
   Run the contents of `supabase/migrations/009_notifications.sql` to create the `notifications` table used by the admin notifications feature and the user notifications panel.

3. Avatars and brand logos use existing buckets and tables.

## Vercel

- No new env vars. Ensure existing admin API routes can call `api/admin/notifications` (same auth as other admin routes).
- Redeploy as usual after pushing.

## Summary of changes (latest)

- **Avatar:** Header and Account Settings share DB profile; avatar update propagates and persists. Image key forces refresh when URL changes.
- **Profile:** First / last name; Notifications tab removed from Settings.
- **Help & Support:** Moved to Account Settings as a tab; removed from sidebar footer.
- **Notifications:** Narrower side panel (max 320px). Mock data removed; list comes from DB (admin-created notifications). Admin panel has a “Notifications” section to create notifications and choose target (all users or selected users).
- **Header:** User email removed from top right.
- **Sidebar:** Logout and sidebar toggle only in footer; Help removed.
