/**
 * E-posta onay linki tıklandığında: token doğrula, profili güncelle, yönlendir.
 * GET /api/confirm-email?token=xxx
 * Vercel env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL || 'https://app.yazu.digital';

module.exports = async (req, res) => {
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
  await supabase.from('profiles').update({ email_confirmed_at: now }).eq('id', row.user_id);
  await supabase.from('confirm_tokens').delete().eq('token', token);

  return res.redirect(302, `${APP_URL}/?confirm=ok`);
};
