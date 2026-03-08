/**
 * Admin: List notifications (GET), Create notification (POST).
 * Authorization: Bearer <admin JWT>
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
  if (method === 'OPTIONS') return res.status(200).end();
  if (method !== 'GET' && method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const authResult = await requireAdmin(req, res);
  if (!authResult) return;
  const { caller, supabaseAdmin } = authResult;

  if (method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('id, title, body, created_at, created_by, target_type, target_user_ids')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      console.error('notifications list error:', error);
      return send(res, 500, { error: 'Failed to list notifications', detail: error?.message });
    }
    return send(res, 200, { notifications: data ?? [] });
  }

  if (method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return send(res, 400, { error: 'Invalid JSON body' });
    }
    const { title, body: bodyText, target_type, target_user_ids } = body;
    if (!title || typeof title !== 'string' || !bodyText || typeof bodyText !== 'string') {
      return send(res, 400, { error: 'title and body are required' });
    }
    const targetType = target_type === 'selected' ? 'selected' : 'all';
    const userIds = Array.isArray(target_user_ids) ? target_user_ids : [];
    const { data: row, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        title: title.trim(),
        body: bodyText.trim(),
        created_by: caller.id,
        target_type: targetType,
        target_user_ids: targetType === 'selected' ? userIds : [],
      })
      .select('id, title, body, created_at')
      .single();
    if (error) {
      console.error('notifications insert error:', error);
      return send(res, 500, { error: 'Failed to create notification', detail: error?.message });
    }
    return send(res, 200, { notification: row });
  }
}
