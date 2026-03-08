/**
 * Admin: Update a user's profile (tier, credits, name, etc.) and optionally is_admin.
 * PATCH body: user_id, full_name?, first_name?, last_name?, company_name?, job_title?, tier?, credits_total?, credits_used?, max_brands?, is_admin?
 */
import requireAdmin from '../lib/adminAuth.js';

const VALID_TIERS = ['free', 'basic', 'pro', 'premium', 'enterprise'];

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
  return res?.end?.(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
  if (method === 'OPTIONS') return res.status(200).end();
  if (method !== 'PATCH') return send(res, 405, { error: 'Method not allowed' });

  const authResult = await requireAdmin(req, res);
  if (!authResult) return;
  const { supabaseAdmin } = authResult;

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

  const profileUpdates = {};
  if (body.full_name !== undefined) profileUpdates.full_name = body.full_name;
  if (body.first_name !== undefined) profileUpdates.first_name = body.first_name;
  if (body.last_name !== undefined) profileUpdates.last_name = body.last_name;
  if (body.company_name !== undefined) profileUpdates.company_name = body.company_name;
  if (body.job_title !== undefined) profileUpdates.job_title = body.job_title;
  if (body.tier !== undefined) {
    if (!VALID_TIERS.includes(body.tier)) {
      return send(res, 400, { error: 'tier must be one of: ' + VALID_TIERS.join(', ') });
    }
    profileUpdates.tier = body.tier;
  }
  if (body.credits_total !== undefined) profileUpdates.credits_total = Math.max(0, Number(body.credits_total) || 0);
  if (body.credits_used !== undefined) profileUpdates.credits_used = Math.max(0, Number(body.credits_used) || 0);
  if (body.max_brands !== undefined) profileUpdates.max_brands = Math.max(1, Math.min(100, Number(body.max_brands) || 1));

  if (Object.keys(profileUpdates).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId);
    if (updateError) {
      console.error('profile update error:', updateError);
      return send(res, 500, { error: 'Failed to update profile', detail: updateError?.message });
    }
  }

  if (body.is_admin !== undefined) {
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    const email = userData?.user?.email;
    if (!email) {
      return send(res, 404, { error: 'User not found' });
    }
    if (body.is_admin) {
      await supabaseAdmin.from('admin_users').upsert({ email }, { onConflict: 'email' });
    } else {
      await supabaseAdmin.from('admin_users').delete().eq('email', email);
    }
  }

  return send(res, 200, { ok: true });
}
