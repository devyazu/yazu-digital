/**
 * Kayıt sonrası: onay linki (signup_confirm şablonu) + admin bildirimi (admin_new_signup).
 * Vercel env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL, SMTP_*
 */
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { getTemplate, sendTemplatedEmail, sendMail, replacePlaceholders } from '../server-lib/emailHelpers.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL || 'https://app.yazu.digital';

function send(res, status, body) {
  if (res?.setHeader) res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const { userId, email: bodyEmail } = req.body || {};
  if (!userId) return send(res, 400, { error: 'Missing userId' });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return send(res, 503, { error: 'Supabase not configured for this API' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let email = bodyEmail;
  if (!email) {
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    email = userData?.user?.email;
  }
  if (!email) return send(res, 400, { error: 'Email not found for user' });

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { error: insertErr } = await supabase.from('confirm_tokens').insert({
    token,
    user_id: userId,
    expires_at: expiresAt,
  });
  if (insertErr) {
    console.error('confirm_tokens insert:', insertErr);
    return send(res, 500, { error: 'Could not create confirmation token', detail: insertErr.message });
  }

  const confirmLink = `${APP_URL}/api/confirm-email?token=${token}`;
  const placeholders = { confirm_link: confirmLink, user_email: email, site_url: APP_URL };
  const signedUpAt = new Date().toLocaleString('tr-TR');

  try {
    const signupTemplate = await getTemplate(supabase, 'signup_confirm');
    if (signupTemplate) {
      await sendTemplatedEmail(supabase, { slug: 'signup_confirm', to: email, placeholders });
    } else {
      await sendMail({ to: email, subject: 'E-postanızı onaylayın - Yazu.digital', html: `<p>Merhaba,</p><p>E-postanızı onaylamak için <a href="${confirmLink}">tıklayın</a>.</p><p>— Yazu.digital</p>` });
    }

    const { data: adminRows } = await supabase.from('admin_users').select('email');
    const adminEmails = (adminRows || []).map((r) => r.email).filter(Boolean);
    const adminPlaceholders = { new_user_email: email, signed_up_at: signedUpAt };
    for (const adminEmail of adminEmails) {
      try {
        await sendTemplatedEmail(supabase, { slug: 'admin_new_signup', to: adminEmail, placeholders: adminPlaceholders });
      } catch (e) {
        console.error('Admin notify error:', e);
      }
    }
    return send(res, 200, { ok: true, sent: true });
  } catch (e) {
    console.error('send-confirm-email error:', e);
    return send(res, 500, { error: 'E-posta gönderilemedi', detail: e?.message || String(e), sent: false });
  }
}
