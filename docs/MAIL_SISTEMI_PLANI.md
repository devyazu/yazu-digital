# E-posta Sistemi – Plan ve Tasarım

Bu dokümanda tüm mail akışları, admin yönetim paneli, otomasyon ve editör (GrapesJS) tasarımı özetlenir.

---

## 1. Mail akışları (kullanıcı + admin)

### 1.1 Kullanıcıya giden mailler

| Slug | Tetikleyici | Açıklama |
|------|-------------|----------|
| `signup_confirm` | Kayıt sonrası | E-posta onay linki (mevcut akış). |
| `welcome` | E-posta onayı sonrası | “Hesabın hazır, panele girebilirsin.” |
| `password_reset` | Şifre sıfırlama isteği | Link: Supabase veya kendi sayfamız. |
| (opsiyonel) | Periyodik | Hatırlatma / özet mailleri (ileride). |

### 1.2 Admine giden mailler

| Slug | Tetikleyici | Açıklama |
|------|-------------|----------|
| `admin_new_signup` | Yeni kayıt | “Yeni kullanıcı kaydoldu: email, tarih.” |
| `admin_email_confirmed` | Kullanıcı e-postayı onayladı | “X e-postasını onayladı.” |

### 1.3 Tetikleyici özeti (otomasyon)

- **Kayıt (signup)** → kullanıcıya `signup_confirm`; admine `admin_new_signup`.
- **E-posta onayı (confirm-email)** → kullanıcıya `welcome`; admine `admin_email_confirmed`.
- **Şifre sıfırlama** → kullanıcıya `password_reset` (Supabase veya özel sayfa).

Tüm bu mailler **veritabanındaki şablonlardan** (subject + HTML body) alınacak; admin panelden düzenlenebilecek.

---

## 2. Veritabanı şeması

### 2.1 `email_templates`

Şablonlar tek tabloda; her mail tipi bir satır.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | uuid | PK. |
| `slug` | text | Benzersiz: `signup_confirm`, `welcome`, `admin_new_signup`, vb. |
| `name` | text | Admin panelde görünen ad (örn. “Kayıt onay maili”). |
| `description` | text | Kısa açıklama, tetikleyici. |
| `subject` | text | E-posta konusu (placeholder destekli: `{{user_email}}`, `{{confirm_link}}`). |
| `body_html` | text | E-posta gövdesi (HTML). Placeholder’lar aynı mantıkla. |
| `from_name` | text | Gönderen adı (örn. “Yazu.digital”). |
| `recipient_type` | text | `user` \| `admin` – kime gideceği. |
| `is_active` | boolean | Aktif/pasif. |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Placeholder örnekleri: `{{user_email}}`, `{{confirm_link}}`, `{{user_name}}`, `{{site_url}}`, admin mailleri için `{{new_user_email}}`, `{{confirmed_at}}` vb.

### 2.2 `email_log` (isteğe bağlı, raporlama için)

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | uuid | PK. |
| `template_slug` | text | Hangi şablon. |
| `recipient` | text | Alıcı e-posta. |
| `user_id` | uuid | İlişkili kullanıcı (varsa). |
| `status` | text | `sent` \| `failed` \| `bounced`. |
| `sent_at` | timestamptz | |
| `error_message` | text | Hata durumunda. |

---

## 3. Admin panel – Mail yönetimi

### 3.1 Yerleşim

- **Sidebar:** “E-posta / Mail” veya “Şablonlar” bölümü.
- **Liste ekranı:** Tüm şablonlar (slug, name, recipient_type, is_active, son güncelleme).
- **Detay/Düzenle ekranı:**
  - Genel: name, slug (readonly), description, recipient_type, is_active.
  - Konu: `subject` (metin, placeholder’lar için kısa yardım).
  - İçerik: **GrapesJS ile HTML editör** (`body_html`).
  - Önizleme: Seçili şablonda placeholder’ları örnek değerlerle değiştirip gösterme.
  - Test gönderimi: Bir e-posta adresi girip “Test maili gönder”.

### 3.2 GrapesJS entegrasyonu

- **Kütüphaneler:** `grapesjs`, `@grapesjs/react`, `grapesjs-preset-newsletter`.
- **Kullanım:** Sadece admin panelinde, şablon düzenleme sayfasında.
- **Akış:** `body_html` DB’den yüklenir → editörde gösterilir → kaydetmede editörden HTML alınır → `body_html` olarak saklanır.
- **Placeholder’lar:** Blok olarak veya “Metin” içinde `{{confirm_link}}` gibi kullanılır; gönderim sırasında sunucu tarafında replace edilir.

### 3.3 Otomasyon yönetimi

- **“Otomasyon kuralları”** sayfası (veya aynı mail bölümünde sekme):
  - Tablo: Olay (Tetikleyici) | Gönderilecek şablon | Alıcı (user / admin) | Aktif.
  - Örnek satırlar:
    - Tetikleyici: “Kayıt (signup)” → Şablon: `signup_confirm` → Alıcı: user.
    - Tetikleyici: “Kayıt (signup)” → Şablon: `admin_new_signup` → Alıcı: admin.
    - Tetikleyici: “E-posta onayı” → Şablon: `welcome` → Alıcı: user.
    - Tetikleyici: “E-posta onayı” → Şablon: `admin_email_confirmed` → Alıcı: admin.
- İlk sürümde kurallar **sabit** (kod tarafında) da olabilir; admin paneli sadece “hangi şablon kullanılsın” ve “açık/kapalı” seçimi yapabilir. İleride tamamen DB’den okunabilir.

---

## 4. API tasarımı

### 4.1 Şablon CRUD (sadece admin)

- `GET /api/admin/email-templates` – Liste (admin session gerekli).
- `GET /api/admin/email-templates/:slug` – Tek şablon.
- `PUT /api/admin/email-templates/:slug` – Güncelleme (subject, body_html, from_name, is_active vb.).

### 4.2 Mail gönderimi

- **Mevcut:** `POST /api/send-confirm-email` – Mümkünse şablona taşınır: `slug = signup_confirm` olan şablon + placeholder replace.
- **Genel:** `POST /api/send-templated-email` (veya mevcut endpoint’in genişletilmesi):
  - Body: `{ templateSlug, to, placeholders: { confirm_link: "...", user_email: "..." } }`.
  - Sadece backend (cron, webhook, diğer API’ler) veya güvenli admin aksiyonu çağırır; kimlik doğrulama zorunlu.

### 4.3 Tetikleyicilerin bağlanması

- **Kayıt:** Mevcut `signUp` sonrası akışta `signup_confirm` + `admin_new_signup` tetiklenir.
- **E-posta onayı:** `confirm-email` API’si başarılı olunca `welcome` + `admin_email_confirmed` tetiklenir.
- Admin e-posta adresi: `admin_users` tablosundan veya ayrı bir `settings` / `admin_notification_email` değerinden okunabilir.

---

## 5. Placeholder standardı

Gönderim öncesi replace edilecek anahtar kelimeler (örnek):

- `{{user_email}}` – Kullanıcı e-postası.
- `{{user_name}}` – İsim (profilden veya boş).
- `{{confirm_link}}` – Onay linki (signup_confirm için).
- `{{site_url}}` – Ana site URL’i (örn. app.yazu.digital).
- `{{new_user_email}}` – Admin maillerinde yeni kayıt olan e-posta.
- `{{confirmed_at}}` – Onay zamanı (admin_email_confirmed için).

Editörde “Kullanılabilir değişkenler” kutusunda listelenebilir.

---

## 6. Uygulama aşamaları

| Aşama | İçerik | Öncelik |
|-------|--------|---------|
| 1 | Migration: `email_templates` (+ varsa `email_log`). Varsayılan şablonlar (signup_confirm, welcome, admin_new_signup, admin_email_confirmed) seed. | Yüksek |
| 2 | API: Şablon listeleme/güncelleme (admin), şablonla mail gönderme (send-templated-email veya mevcut API’nin genişletilmesi). | Yüksek |
| 3 | Mevcut send-confirm-email’i şablondan okuyacak şekilde değiştirme; confirm sonrası welcome + admin maillerini tetikleme. | Yüksek |
| 4 | Admin panel: Mail/Şablonlar listesi + detay sayfası + GrapesJS editör (subject + body_html). | Yüksek |
| 5 | Placeholder replace mantığı, önizleme, test maili gönder. | Orta |
| 6 | Otomasyon sekmesi: tetikleyici–şablon eşlemesi (basit tablo veya aç/kapa). | Orta |
| 7 | email_log yazma, admin panelde “Gönderim geçmişi” (opsiyonel). | Düşük |

---

## 7. GrapesJS kurulumu (özet)

- Paketler: `grapesjs`, `@grapesjs/react`, `grapesjs-preset-newsletter`.
- Admin panelinde tek sayfa/component: “E-posta içeriği” alanı = GrapesJS React component; `body_html` state ile senkron.
- Preset: newsletter (e-posta uyumlu bloklar); gerekirse custom blok “Placeholder ekle” (metin: `{{confirm_link}}` vb.).
- Kaydet: `editor.getHtml()` → API’ye gönder, `body_html` olarak sakla.

---

Bu plan onaylandıktan sonra sırayla: migration + seed, API, mevcut akışların şablona bağlanması, ardından admin paneli (liste + GrapesJS editör) ve en son otomasyon arayüzü implemente edilebilir.
