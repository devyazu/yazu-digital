/**
 * Admin: Belirtilen şablona placeholder’lar ile test maili gönder.
 * POST body: { templateSlug: string, to: string, placeholders?: Record<string, string> }
 * Authorization: Bearer <admin JWT>
 */
import requireAdmin from '../lib/adminAuth.js';
import { sendTemplatedEmail } from '../lib/emailHelpers.js';

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
  return res?.end?.(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
  if (method === 'OPTIONS') return res.status(200).end();
  if (method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const authResult = await requireAdmin(req, res);
  if (!authResult) return;
  const { supabaseAdmin } = authResult;

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }
  const { templateSlug, to, placeholders } = body || {};
  if (!templateSlug || !to) {
    return send(res, 400, { error: 'templateSlug and to are required' });
  }
  const toStr = String(to).trim();
  if (!toStr) return send(res, 400, { error: 'to must be a non-empty email' });

  try {
    await sendTemplatedEmail(supabaseAdmin, {
      slug: templateSlug,
      to: toStr,
      placeholders: placeholders || {},
    });
    return send(res, 200, { ok: true, message: 'Test email sent' });
  } catch (e) {
    console.error('Send test email error:', e);
    return send(res, 500, { error: 'Failed to send test email', detail: e?.message });
  }
}
