# Stripe Tarafında Yapılacaklar – Adım Adım

Bu rehber **sadece Stripe Dashboard**’da yapmanız gerekenleri, en basit dille ve tek tek anlatıyor. Her adımda nereye tıklayacağınız, ne yazacağınız ve hangi değeri nereye kopyalayacağınız yazıyor.

---

## Giriş

Stripe’da üç şey yapacaksınız:

1. **API anahtarı** alıp Vercel’e yapıştırmak  
2. **Pro ve Premium** için iki ürün + aylık fiyat oluşturup Price ID’leri Vercel’e yazmak  
3. **Webhook** ekleyip Signing secret’ı Vercel’e yazmak  

Hepsi Stripe Dashboard’da; kod yazmıyorsunuz.

---

## Adım 1: Stripe Hesabına Giriş

1. Tarayıcıda **https://dashboard.stripe.com** adresine gidin.  
2. Giriş yapın (yoksa hesap oluşturun).  
3. Üstte **“Test modu”** (Test mode) açık mı kontrol edin:  
   - Geliştirme için **açık** (turuncu/Test data) olsun.  
   - Canlı ödeme almak istediğinizde **kapatıp** gerçek moda geçersiniz.

---

## Adım 2: Gizli API Anahtarını (Secret Key) Almak

Bu anahtar, sunucunuzun (Vercel) Stripe’a “ben bu projenin sahibiyim” demesi için kullanılır. **Asla** tarayıcıda veya public repoda göstermeyin; sadece Vercel Environment Variables’a yapıştıracaksınız.

1. Stripe Dashboard’da sol menüden **“Developers”** (Geliştiriciler) bölümüne tıklayın.  
2. Açılan alt menüden **“API keys”** seçin.  
3. Sayfada iki anahtar görürsünüz:  
   - **Publishable key** (pk_ ile başlar) – bunu **kullanmayacaksınız** (biz sadece sunucu tarafında çalışıyoruz).  
   - **Secret key** (sk_ ile başlar) – yanında **“Reveal test key”** veya **“Reveal live key”** linki vardır.  
4. **“Reveal test key”** (test modundaysanız) veya **“Reveal live key”** (canlı modda çalışacaksanız) tıklayın.  
5. Çıkan uzun anahtarı **tamamen** kopyalayın (sk_test_... veya sk_live_...).  
6. **Vercel**’e gidin: Projeniz → **Settings** → **Environment Variables**.  
7. Yeni değişken ekleyin:  
   - **Name:** `STRIPE_SECRET_KEY`  
   - **Value:** Az önce kopyaladığınız sk_... anahtarı.  
   - **Environment:** Production (ve isterseniz Preview) seçin.  
8. **Save** deyin.

Bu adım bitti. Bu anahtarı başka yerde kullanmayın; sadece Vercel’de kalacak.

---

## Adım 3: Pro Ürünü ve Aylık Fiyatı Oluşturmak

“Pro” paketi için Stripe’da bir **ürün** (product) ve bu ürünün **aylık tekrarlayan fiyatı** (price) oluşturacaksınız.

1. Stripe Dashboard’da sol menüden **“Product catalog”** (Ürün kataloğu) veya kısaca **“Products”** bölümüne girin.  
2. Sağ üstte **“Add product”** (Ürün ekle) butonuna tıklayın.  
3. **Ürün bilgileri:**  
   - **Name:** `Pro` (veya “Yazu Pro” gibi istediğiniz isim).  
   - **Description:** İsteğe bağlı; örn. “Pro paket – aylık abonelik”.  
   - **Image:** İsterseniz logo ekleyin; zorunlu değil.  
4. Aşağıda **“Pricing”** (Fiyatlandırma) kısmı var.  
   - **Pricing model:** **“Standard pricing”** seçili kalsın.  
   - **Price:** Örneğin `19.99` (veya Pro için belirlediğiniz aylık tutar).  
   - **Billing period:** **“Monthly”** (Aylık) seçin. **Recurring** (tekrarlayan) olduğundan emin olun.  
   - Para birimi: **USD** (veya kullanacağınız birim).  
5. **“Add product”** / **“Save product”** butonuna basın.  
6. Ürün kaydedildikten sonra sayfada veya ürün detayında **“Pricing”** altında bir satır görürsünüz; o satırdaki **Price ID**’ye tıklayın veya yanındaki **ID**’yi kopyalayın.  
   - Bu ID **price_xxxxxxxxxxxxx** şeklinde bir şey olacak.  
7. Bu **price_...** değerini kopyalayın.  
8. **Vercel** → Proje → **Settings** → **Environment Variables**.  
9. Yeni değişken:  
   - **Name:** `STRIPE_PRICE_PRO`  
   - **Value:** Kopyaladığınız price_... (tamamen, boşluksuz).  
10. **Save** deyin.

Pro tarafı bitti.

---

## Adım 4: Premium Ürünü ve Aylık Fiyatı Oluşturmak

Aynı işlemi “Premium” için tekrarlayacaksınız.

1. Yine **“Products”** → **“Add product”**.  
2. **Name:** `Premium` (veya “Yazu Premium”).  
3. **Pricing:**  
   - **Recurring**, **Monthly**, örn. `29.99` USD.  
4. Kaydedin; oluşan **Price ID**’yi (yine price_... ile başlayan) kopyalayın.  
5. **Vercel** → Environment Variables.  
6. Yeni değişken:  
   - **Name:** `STRIPE_PRICE_PREMIUM`  
   - **Value:** Premium’un price_... değeri.  
7. **Save** deyin.

Artık hem Pro hem Premium’un aylık fiyatları Stripe’da var ve Vercel’de tanımlı.

---

## Adım 5: Webhook Eklemek (Çok Önemli)

Webhook, Stripe’ın “abonelik oluştu”, “güncellendi”, “iptal edildi” gibi olayları **sizin sunucunuza** (Vercel’deki API’nize) anında göndermesini sağlar. Bu sayede kullanıcının tier’ı ve abonelik bilgisi güncellenir.

### 5.1 Webhook URL’ini Belirleyin

Önce Vercel’de projenizin **canlı adresi** ne, onu bilin. Örnek:  
`https://yazu-digital.vercel.app`  
veya kendi domain’iniz:  
`https://app.yazu.digital`

Webhook adresiniz şu formatta olacak:

- `https://SİZİN-DOMAIN/api/stripe-webhook`

Örnek:  
`https://yazu-digital.vercel.app/api/stripe-webhook`  
veya  
`https://app.yazu.digital/api/stripe-webhook`

Bu URL’yi bir yere not edin; bir sonraki adımda Stripe’a yapıştıracaksınız.

### 5.2 Stripe’da Webhook Endpoint’i Ekleyin

1. Stripe Dashboard’da sol menüden **“Developers”** → **“Webhooks”** seçin.  
2. **“Add endpoint”** (Endpoint ekle) butonuna tıklayın.  
3. **Endpoint URL** kutusuna az önce not ettiğiniz adresi yapıştırın:  
   `https://SİZİN-DOMAIN/api/stripe-webhook`  
   (SİZİN-DOMAIN’i kendi Vercel/domain adresinizle değiştirin.)  
4. **“Select events to listen to”** (Dinlenecek olayları seçin) kısmında **“Select events”** veya benzeri butona tıklayın.  
5. Açılan listeden **şu üç olayı** bulup işaretleyin (tek tek seçebilirsiniz):  
   - `customer.subscription.created`  
   - `customer.subscription.updated`  
   - `customer.subscription.deleted`  
   İsterseniz ek olarak şunları da seçebilirsiniz (opsiyonel):  
   - `invoice.paid`  
   - `invoice.payment_failed`  
6. **“Add endpoint”** / **“Create endpoint”** deyin.  
7. Endpoint oluştuktan sonra açılan sayfada **“Signing secret”** bölümüne gidin.  
8. **“Reveal”** veya **“Click to reveal”** ile signing secret’ı gösterin.  
   - Bu değer **whsec_xxxxxxxxxxxxxxxx** şeklinde bir şey olacak.  
9. Bu **whsec_...** değerini **tamamen** kopyalayın.  
10. **Vercel** → Proje → **Settings** → **Environment Variables**.  
11. Yeni değişken:  
    - **Name:** `STRIPE_WEBHOOK_SECRET`  
    - **Value:** Kopyaladığınız whsec_... (tamamen, boşluksuz).  
12. **Save** deyin.

Webhook tarafı da bitti. Stripe artık abonelik olaylarını bu URL’e gönderecek; sizin API’niz de bu secret ile isteğin gerçekten Stripe’dan geldiğini doğrulayacak.

---

## Özet: Stripe’da Yaptıklarınız ve Vercel’e Yazdıklarınız

| Stripe’da ne yaptınız? | Vercel’de hangi env değişkenine yapıştırdınız? |
|------------------------|-----------------------------------------------|
| Developers → API keys → Secret key (Reveal) | `STRIPE_SECRET_KEY` |
| Products → Pro → oluşan aylık Price ID (price_...) | `STRIPE_PRICE_PRO` |
| Products → Premium → oluşan aylık Price ID (price_...) | `STRIPE_PRICE_PREMIUM` |
| Developers → Webhooks → Add endpoint → Signing secret (Reveal) | `STRIPE_WEBHOOK_SECRET` |

---

## Test vs Canlı (Live) Mod

- **Test modu:** Stripe Dashboard’da “Test mode” açıkken kullandığınız anahtarlar **sk_test_...** ve **whsec_...** (test endpoint’e ait). Test kartlarıyla (örn. 4242 4242 4242 4242) deneme yaparsınız; gerçek para çekilmez.  
- **Canlı mod:** Gerçek ödeme almak için test modunu kapatıp **sk_live_...** ve canlı webhook endpoint’i için yeni bir **whsec_...** alırsınız. Aynı env isimlerini kullanıp değerleri canlı anahtarlarla değiştirirsiniz (Vercel’de Production env’e).

---

## Sık Karşılaşılan Noktalar

- **Price ID yanlış:** STRIPE_PRICE_PRO / STRIPE_PRICE_PREMIUM’a **price_...** ile başlayan ID’yi yapıştırdığınızdan emin olun; ürün adı veya fiyat değil, sadece ID.  
- **Webhook 401 / imza hatası:** STRIPE_WEBHOOK_SECRET’ı webhook sayfasındaki “Signing secret”tan kopyalayın; başında sonunda boşluk olmasın.  
- **Webhook URL 404:** Vercel’de proje deploy edilmiş olmalı ve URL tam olarak `https://.../api/stripe-webhook` formatında olmalı.  
- **Test kartı:** Test modunda Stripe’ın test kartlarını kullanın (örn. 4242 4242 4242 4242); son kullanma gelecek bir tarih, CVC herhangi 3 rakam.

Bu adımları tamamladığınızda Stripe tarafında yapmanız gereken her şey bitmiş olur. Diğer tarafta sadece Vercel env’lerini kaydedip projeyi yeniden deploy etmeniz yeterli.
