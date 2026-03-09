/**
 * Admin: E-posta şablonları listele (GET), güncelle (PUT), test maili gönder (POST).
 * POST body: { templateSlug, to, placeholders? } = test email.
 * Authorization: Bearer <admin JWT>
 */
import requireAdmin from '../../server-lib/adminAuth.js';
import { stripDataUrlsFromHtml, sendTemplatedEmail } from '../../server-lib/emailHelpers.js';

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
  return res?.end?.(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
  if (method === 'OPTIONS') return res.status(200).end();
  if (!['GET', 'PUT', 'POST'].includes(method)) return send(res, 405, { error: 'Method not allowed' });

  const authResult = await requireAdmin(req, res);
  if (!authResult) return;
  const { supabaseAdmin } = authResult;

  if (method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('id, slug, name, description, subject, body_html, body_json, from_name, recipient_type, is_active, updated_at')
      .order('slug');
    if (error) {
      console.error('email_templates list error:', error);
      return send(res, 500, { error: 'Failed to list templates', detail: error?.message });
    }
    return send(res, 200, { templates: data ?? [] });
  }

  if (method === 'PUT') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return send(res, 400, { error: 'Invalid JSON body' });
    }
    const { slug, subject, body_html, body_json, from_name, is_active } = body;
    if (!slug || typeof slug !== 'string') {
      return send(res, 400, { error: 'slug is required' });
    }
    const updates = {};
    if (subject !== undefined) updates.subject = subject;
    if (body_html !== undefined) updates.body_html = stripDataUrlsFromHtml(body_html);
    if (body_json !== undefined) updates.body_json = typeof body_json === 'string' ? body_json : (body_json != null ? JSON.stringify(body_json) : null);
    if (from_name !== undefined) updates.from_name = from_name;
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    updates.updated_at = new Date().toISOString();
    if (Object.keys(updates).length <= 1) {
      return send(res, 400, { error: 'No fields to update' });
    }
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .update(updates)
      .eq('slug', slug)
      .select()
      .maybeSingle();
    if (error) {
      console.error('email_templates update error:', error);
      return send(res, 500, { error: 'Failed to update template', detail: error?.message });
    }
    if (!data) return send(res, 404, { error: 'Template not found' });
    return send(res, 200, { template: data });
  }

  if (method === 'POST') {
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
}
