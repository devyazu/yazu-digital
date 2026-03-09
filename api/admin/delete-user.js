/**
 * Admin: Permanently delete a user (auth + profile + admin_users entry).
 * DELETE or POST body: { user_id: string }
 */
import requireAdmin from '../../server-lib/adminAuth.js';

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
  return res?.end?.(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
  if (method === 'OPTIONS') return res.status(200).end();
  if (method !== 'DELETE' && method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const authResult = await requireAdmin(req, res);
  if (!authResult) return;
  const { caller, supabaseAdmin } = authResult;

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  const userId = body.user_id;
  if (!userId || typeof userId !== 'string') {
    return send(res, 400, { error: 'user_id is required' });
  }

  if (userId === caller.id) {
    return send(res, 400, { error: 'You cannot delete your own account' });
  }

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = userData?.user?.email;
  if (!userData?.user) {
    return send(res, 404, { error: 'User not found' });
  }

  await supabaseAdmin.from('admin_users').delete().eq('email', email || '');
  await supabaseAdmin.from('profiles').delete().eq('id', userId);
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error('auth.admin.deleteUser error:', deleteError);
    return send(res, 500, { error: 'Failed to delete user', detail: deleteError?.message });
  }

  return send(res, 200, { ok: true });
}
