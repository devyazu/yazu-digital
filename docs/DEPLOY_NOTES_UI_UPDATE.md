# Deploy notes – UI & profile update

After pulling this update:

## Supabase

1. **Run migration 008 (profiles first/last name)**  
   In Supabase Dashboard → SQL Editor, run the contents of:
   - `supabase/migrations/008_profiles_first_last.sql`  
   This adds `first_name` and `last_name` to `profiles`.

2. **Run migration 009 (notifications)**  
   Run the contents of `supabase/migrations/009_notifications.sql` to create the `notifications` table used by the admin notifications feature and the user notifications panel.

3. **Run migration 011 (notification reads – unread badge)**  
   Run the contents of `supabase/migrations/011_notification_reads.sql` so the header bell shows the unread count and “mark as read” works when the user opens the notifications panel.

4. **Run migration 012 (profiles tier & credits)**  
   Run the contents of `supabase/migrations/012_profiles_tier_credits.sql` to add user tier (free, basic, pro, premium, enterprise), credits, and max_brands. New signups get a profile row with default tier via trigger. Admin can edit any user’s tier and credits in the Users tab.

5. Avatars and brand logos use existing buckets and tables.

## Vercel

- No new env vars. Ensure existing admin API routes can call `api/admin/notifications` (same auth as other admin routes).
- Redeploy as usual after pushing.

## Summary of changes (latest)

- **Avatar:** Header and Account Settings share DB profile; avatar update propagates and persists. Image key forces refresh when URL changes.
- **Profile:** First / last name; Notifications tab removed from Settings.
- **Help & Support:** Moved to Account Settings as a tab; removed from sidebar footer.
- **Notifications:** Unread count badge on header bell (1, 2, … or 99+). Opening the notifications panel marks all as read and updates the badge. Narrower side panel (max 320px). List from DB (admin-created). Admin: create notifications, target “all users” or “selected users”; list shows “All users” or “Selected users (N)”.
- **Header:** User email removed from top right.
- **Sidebar:** Logout and sidebar toggle only in footer; Help removed.
