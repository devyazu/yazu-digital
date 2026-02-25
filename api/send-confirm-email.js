/**
 * Kayıt sonrası e-posta onay linki gönderir.
 * SMTP ile gönderim. Vercel env:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
 */
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
const nodemailer = require('nodemailer');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL || 'https://app.yazu.digital';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || 'Yazu.digital <noreply@yazu.digital>';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, email: bodyEmail } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Supabase not configured for this API' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let email = bodyEmail;
  if (!email) {
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    email = userData?.user?.email;
  }
  if (!email) {
    return res.status(400).json({ error: 'Email not found for user' });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error: insertErr } = await supabase.from('confirm_tokens').insert({
    token,
    user_id: userId,
    expires_at: expiresAt,
  });

  if (insertErr) {
    console.error('confirm_tokens insert:', insertErr);
    return res.status(500).json({ error: 'Could not create confirmation token' });
  }

  const confirmLink = `${APP_URL}/api/confirm-email?token=${token}`;
  const subject = 'E-postanızı onaylayın - Yazu.digital';
  const html = `
    <p>Merhaba,</p>
    <p>Yazu.digital hesabınızı oluşturdunuz. E-postanızı onaylamak için aşağıdaki bağlantıya tıklayın:</p>
    <p><a href="${confirmLink}">E-postamı onayla</a></p>
    <p>Bu link 24 saat geçerlidir. 3 saat içinde onaylamazsanız hesabınız kullanıma kapanacaktır.</p>
    <p>Bu işlemi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
    <p>— Yazu.digital</p>
  `;

  if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      });
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject,
        html,
      });
    } catch (e) {
      console.error('SMTP send error:', e);
    }
  }

  return res.status(200).json({ ok: true });
};
