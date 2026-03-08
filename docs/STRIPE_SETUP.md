# Stripe Abonelik Entegrasyonu

Bu dokümanda Stripe ödeme ve abonelik akışının kurulumu, güvenlik ve Vercel/Supabase adımları özetlenir.

## Özellikler

- **Yeni abonelik:** Kullanıcı Pro veya Premium paketini Stripe Checkout ile aylık tekrarlayan ödeme (recurring) olarak satın alır.
- **Yükseltme (upgrade):** Zaten abonesi olan kullanıcı üst pakete geçer; Stripe proration ile kalan dönem için fark hesaplanır, bir sonraki ay yeni paket fiyatı uygulanır.
- **Webhook:** Stripe olayları (abonelik oluşturuldu/güncellendi/iptal) webhook ile alınır; `profiles` tablosu sadece **service role** ile güncellenir (istemci tier/credits değiştiremez).

## 1. Ortam Değişkenleri

### Vercel (Project → Settings → Environment Variables)

| Değişken | Açıklama | Gizli |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → Secret key | Evet |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → [endpoint] → Signing secret | Evet |
| `STRIPE_PRICE_PRO` | Pro aylık fiyatın Price ID’si (örn. `price_xxx`) | Hayır |
| `STRIPE_PRICE_PREMIUM` | Premium aylık fiyatın Price ID’si | Hayır |
| `STRIPE_PRICE_BASIC` | (İsteğe bağlı) Basic fiyat Price ID | Hayır |
| `APP_URL` | Uygulama URL’i (örn. `https://app.yazu.digital`). Vercel’de boş bırakılırsa `VERCEL_URL` kullanılır. | Hayır |
| `SUPABASE_URL` | Supabase proje URL | Hayır |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (webhook ve checkout API için) | Evet |
| `SUPABASE_ANON_KEY` | (Checkout API’de kullanıcı doğrulama için; yoksa `VITE_SUPABASE_ANON_KEY` kullanılır) | Hayır |

Not: Hiçbir Stripe veya Supabase **gizli** anahtar repoda veya client tarafında kullanılmamalı; sadece Vercel env’de tanımlanır.

## 2. Stripe Dashboard

1. **Ürünler ve fiyatlar**
   - Products → Create product: örn. “Pro” ve “Premium”.
   - Her ürün için **Recurring** (Monthly) bir Price oluştur.
   - Her Price’ın ID’sini (`price_xxx`) kopyalayıp Vercel’de `STRIPE_PRICE_PRO` ve `STRIPE_PRICE_PREMIUM` olarak ayarlayın.

2. **Webhook**
   - Developers → Webhooks → Add endpoint.
   - URL: `https://<vercel-domain>/api/stripe-webhook` (production domain’iniz).
   - Dinlenecek olaylar: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, (isteğe bağlı) `invoice.paid`, `invoice.payment_failed`.
   - “Signing secret” oluşturulur; bunu `STRIPE_WEBHOOK_SECRET` olarak Vercel’e ekleyin.

3. **Test:** Stripe CLI ile lokalde test:  
   `stripe listen --forward-to localhost:3000/api/stripe-webhook`  
   CLI’nin verdiği `whsec_xxx` değerini geçici olarak `STRIPE_WEBHOOK_SECRET` yapabilirsiniz.

## 3. Supabase

1. **Migration**
   - `supabase/migrations/014_profiles_stripe_subscription.sql` dosyasını Supabase Dashboard → SQL Editor’da çalıştırın (veya `supabase db push`).
   - Bu migration `profiles` tablosuna `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `current_period_end`, `stripe_price_id` ekler ve **trigger** ile bu alanların (ve tier/credits_total/max_brands) yalnızca service role tarafından güncellenmesini sağlar; anon key ile gelen güncellemeler reddedilir.

2. **Güvenlik**
   - RLS kurallarınız kullanıcının sadece kendi `profiles` satırını okumasına izin vermeli; yazma tarafında trigger subscription/tier alanlarını kilitler.
   - `SUPABASE_SERVICE_ROLE_KEY` sadece sunucu tarafında (Vercel API) kullanılır; client’ta veya repoda asla kullanılmaz.

## 4. Vercel

- Tüm yukarıdaki env değişkenlerini Production (ve gerekiyorsa Preview) için ekleyin.
- Deploy sonrası webhook URL’ini Stripe’a kaydettiğiniz domain ile aynı olmalı.
- Webhook’ta **raw body** imza doğrulaması için `micro` paketi kullanılıyor; Vercel’de body’nin önceden parse edilmesi durumunda imza hatası alırsanız, Stripe dokümantasyonundaki “Raw body” notlarına ve Vercel function ayarlarına bakın.

## 5. Akış Özeti

- **İlk abonelik:** Kullanıcı “Upgrade” → `POST /api/create-checkout-session` (Bearer token) → Stripe Checkout’a yönlendirilir → Ödeme sonrası `success_url` ile dönülür → Webhook `customer.subscription.created` ile profile güncellenir → Kullanıcı sayfada `?checkout=success` ile gelir, profil yenilenir.
- **Upgrade (zaten aboneli):** Aynı API, mevcut aboneliği bulur; Stripe’da subscription update (yeni price, proration) yapar; yanıt `{ updated: true, url }` döner; frontend modal kapanır ve profil yenilenir.
- **İptal:** Stripe’da iptal edilen abonelik `customer.subscription.deleted` ile webhook’ta işlenir; profile tier `free` ve ilgili alanlar sıfırlanır.

## 6. Güvenlik Özeti

- Tüm ödeme ve abonelik güncellemeleri sunucuda (Stripe API + webhook) yapılır.
- Client sadece Checkout URL’ine yönlendirilir veya “upgrade” isteği gönderir; tier/credits doğrudan client’tan değiştirilemez (Supabase trigger).
- Stripe webhook isteği `Stripe-Signature` ve `STRIPE_WEBHOOK_SECRET` ile doğrulanır; raw body kullanılır.
- Repo public olsa bile gizli anahtarlar sadece Vercel/Supabase env’de tutulur.
