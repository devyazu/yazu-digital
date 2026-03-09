/**
 * E-posta onay linki tıklandığında: token doğrula, profili güncelle, welcome + admin mailleri gönder, yönlendir.
 * GET /api/confirm-email?token=xxx
 */
import { createClient } from '@supabase/supabase-js';
import { sendTemplatedEmail } from '../server-lib/emailHelpers.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL || 'https://app.yazu.digital';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const token = typeof req.query.token === 'string' ? req.query.token : null;
  if (!token) {
    return res.redirect(302, `${APP_URL}/?confirm=missing`);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.redirect(302, `${APP_URL}/?confirm=error`);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: row, error: fetchErr } = await supabase
    .from('confirm_tokens')
    .select('user_id, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (fetchErr || !row) {
    return res.redirect(302, `${APP_URL}/?confirm=invalid`);
  }

  const expiresAt = new Date(row.expires_at).getTime();
  if (Date.now() > expiresAt) {
    await supabase.from('confirm_tokens').delete().eq('token', token);
    return res.redirect(302, `${APP_URL}/?confirm=expired`);
  }

  const now = new Date().toISOString();
  const confirmedAt = new Date().toLocaleString('tr-TR');
  await supabase.from('profiles').update({ email_confirmed_at: now }).eq('id', row.user_id);
  await supabase.from('confirm_tokens').delete().eq('token', token);

  const { data: userData } = await supabase.auth.admin.getUserById(row.user_id);
  const userEmail = userData?.user?.email || '';
  const userName = userData?.user?.user_metadata?.full_name || userData?.user?.user_metadata?.name || '';

  try {
    await sendTemplatedEmail(supabase, {
      slug: 'welcome',
      to: userEmail,
      placeholders: { user_email: userEmail, user_name: userName, site_url: APP_URL },
    });
  } catch (e) {
    console.error('Welcome email error:', e);
  }

  try {
    const { data: adminRows } = await supabase.from('admin_users').select('email');
    const adminEmails = (adminRows || []).map((r) => r.email).filter(Boolean);
    for (const adminEmail of adminEmails) {
      await sendTemplatedEmail(supabase, {
        slug: 'admin_email_confirmed',
        to: adminEmail,
        placeholders: { user_email: userEmail, confirmed_at: confirmedAt },
      });
    }
  } catch (e) {
    console.error('Admin confirm notify error:', e);
  }

  return res.redirect(302, `${APP_URL}/?confirm=ok`);
}
