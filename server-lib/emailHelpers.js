/**
 * Şablondan mail yükleme, placeholder değiştirme, SMTP ile gönderim.
 * API route'ları bu modülü kullanır.
 */
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = parseInt(process.env.SMTP_PORT?.trim() || '587', 10);
// Port 465 = SSL from start (secure: true). Port 587 = STARTTLS (secure: false). Wrong pairing causes "wrong version number".
const SMTP_SECURE = SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASSWORD = process.env.SMTP_PASSWORD != null ? String(process.env.SMTP_PASSWORD).trim() : undefined;
// SMTP_FROM: full "Display Name <email@domain.com>" or just display name (then SMTP_USER is used as email)
const _fromRaw = (process.env.SMTP_FROM || 'Yazu.digital').trim();
const DEFAULT_FROM = _fromRaw.includes('<') ? _fromRaw : `${_fromRaw} <${SMTP_USER || 'noreply@yazu.digital'}>`;

/** E-postada base64 görseller uzun kod gibi görünür; img src'deki data: URL'leri kaldırır (boş bırakır). */
export function stripDataUrlsFromHtml(html) {
  if (!html || typeof html !== 'string') return html;
  return html.replace(/\ssrc="data:image[^"]*"/gi, ' src=""');
}

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
    .select('subject, body_html, body_json, from_name, is_active')
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
  const safeHtml = stripDataUrlsFromHtml(html || '');
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html: safeHtml,
    });
  } catch (err) {
    const msg = err?.message || String(err);
    if (/535|authentication|Invalid login/i.test(msg)) {
      throw new Error(
        'SMTP 535: Kimlik doğrulama hatası. Kontrol edin: SMTP_USER tam e-posta olmalı (örn. noreply@mail.yazu.digital); şifre boşluksuz; port 465 ise SMTP_SECURE=true; 587 ise SMTP_SECURE=false. ' + msg
      );
    }
    throw err;
  }
}

function getFromAddress(fromName) {
  if (!fromName) return DEFAULT_FROM;
  const match = DEFAULT_FROM.match(/<[^>]+>/);
  const email = match ? match[0] : `<${SMTP_USER}>`;
  return `${fromName} ${email}`;
}

/** EmailBuilder.js JSON ise HTML'e çevirir; değilse null döner. */
async function renderEmailBuilderDoc(bodyJson) {
  if (!bodyJson || typeof bodyJson !== 'string') return null;
  let doc;
  try {
    doc = JSON.parse(bodyJson);
  } catch {
    return null;
  }
  if (!doc || typeof doc !== 'object' || !doc.root) return null;
  try {
    const { renderToStaticMarkup } = await import('@usewaypoint/email-builder');
    return renderToStaticMarkup(doc, { rootBlockId: 'root' });
  } catch {
    return null;
  }
}

export async function sendTemplatedEmail(supabase, { slug, to, placeholders = {} }) {
  const t = await getTemplate(supabase, slug);
  if (!t) throw new Error(`Template not found: ${slug}`);
  const subject = replacePlaceholders(t.subject, placeholders);
  let html = null;
  if (t.body_json) {
    html = await renderEmailBuilderDoc(t.body_json);
  }
  if (!html) {
    html = replacePlaceholders(t.body_html || '', placeholders);
  } else {
    html = replacePlaceholders(html, placeholders);
  }
  html = stripDataUrlsFromHtml(html);
  const from = getFromAddress(t.from_name);
  await sendMail({ to, subject, html, from });
}
