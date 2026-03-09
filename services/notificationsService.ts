import { supabase } from '../lib/supabase';

export interface NotificationRow {
  id: string;
  title: string;
  body: string;
  created_at: string;
  created_by: string | null;
  target_type: string;
  target_user_ids: string[] | null;
  read_at?: string | null;
}

/** Notifications visible to current user (RLS). Only those created on or after the user's registration. */
export async function getNotificationsForUser(): Promise<{
  data: NotificationRow[];
  error: Error | null;
}> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { data: [], error: userError ?? new Error('Not authenticated') };
  const userCreatedAt = user.created_at ? new Date(user.created_at).getTime() : 0;

  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, created_by, target_type, target_user_ids')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return { data: [], error };
  const list = (data ?? []) as NotificationRow[];
  const filtered = list.filter((n) => new Date(n.created_at).getTime() >= userCreatedAt);
  return { data: filtered, error: null };
}

/** Read notification ids for current user. */
export async function getReadNotificationIds(): Promise<{
  data: Set<string>;
  error: Error | null;
}> {
  if (!supabase) return { data: new Set(), error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('notification_reads')
    .select('notification_id')
    .limit(500);
  if (error) return { data: new Set(), error };
  const set = new Set<string>((data ?? []).map((r: { notification_id: string }) => r.notification_id));
  return { data: set, error: null };
}

/** Unread count for current user (notifications visible to user minus read). */
export async function getUnreadNotificationCount(): Promise<{
  count: number;
  error: Error | null;
}> {
  const [notifRes, readRes] = await Promise.all([
    getNotificationsForUser(),
    getReadNotificationIds(),
  ]);
  if (notifRes.error) return { count: 0, error: notifRes.error };
  if (readRes.error) return { count: 0, error: readRes.error };
  const readIds = readRes.data;
  const count = notifRes.data.filter((n) => !readIds.has(n.id)).length;
  return { count, error: null };
}

/** Mark one notification as read for current user. */
export async function markNotificationAsRead(notificationId: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };
  const { error } = await supabase
    .from('notification_reads')
    .upsert(
      { user_id: user.id, notification_id: notificationId, read_at: new Date().toISOString() },
      { onConflict: 'user_id,notification_id' }
    );
  return { error: error ?? null };
}

/** Mark all visible notifications as read for current user. */
export async function markAllNotificationsAsRead(): Promise<{ error: Error | null }> {
  const { data: list, error: listError } = await getNotificationsForUser();
  if (listError || !list.length) return { error: listError ?? null };
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };
  const rows = list.map((n) => ({
    user_id: user.id,
    notification_id: n.id,
    read_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('notification_reads').upsert(rows, {
    onConflict: 'user_id,notification_id',
  });
  return { error: error ?? null };
}
