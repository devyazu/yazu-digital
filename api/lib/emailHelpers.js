/**
 * Şablondan mail yükleme, placeholder değiştirme, SMTP ile gönderim.
 * API route'ları bu modülü kullanır.
 */
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const DEFAULT_FROM = process.env.SMTP_FROM || 'Yazu.digital <noreply@yazu.digital>';

export function replacePlaceholders(text, placeholders = {}) {
  if (!text || typeof text !== 'string') return text;
  let out = text;
  for (const [key, value] of Object.entries(placeholders)) {
    const needle = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    out = out.replace(needle, value != null ? String(value) : '');
  }
  return out;
}

export async function getTemplate(supabase, slug) {
  const { data, error } = await supabase
    .from('email_templates')
    .select('subject, body_html, from_name, is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function sendMail({ to, subject, html, from = DEFAULT_FROM }) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP not configured');
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from,
    to,
    subject,
    html: html || '',
  });
}

function getFromAddress(fromName) {
  if (!fromName) return DEFAULT_FROM;
  const match = DEFAULT_FROM.match(/<[^>]+>/);
  const email = match ? match[0] : `<${SMTP_USER}>`;
  return `${fromName} ${email}`;
}

export async function sendTemplatedEmail(supabase, { slug, to, placeholders = {} }) {
  const t = await getTemplate(supabase, slug);
  if (!t) throw new Error(`Template not found: ${slug}`);
  const subject = replacePlaceholders(t.subject, placeholders);
  const html = replacePlaceholders(t.body_html, placeholders);
  const from = getFromAddress(t.from_name);
  await sendMail({ to, subject, html, from });
}
