# Stripe ve Vercel – Yapılacaklar (Baştan, Tane Tane)

Admin panelinde **Abonelik** sekmesine baktınız; paketler orada yönetiliyor. Şimdi ödeme ve webhook’un çalışması için Stripe ve Vercel’de yapmanız gerekenler aşağıda, en basit haliyle.

---

## A. Admin panelinde paketler

- **Abonelik** sekmesinde henüz ürün yoksa liste boş görünür.
- **Yeni ürün** ile Pro / Premium (veya Basic) ekleyebilirsiniz: ad, slug, tier, aylık fiyat, para birimi.
- Kaydettiğinizde sistem Stripe’da Product + Price oluşturur (bunun için B ve C adımlarını tamamlamanız gerekir).
- Önce Stripe ve Vercel’i bitirin, sonra admin’den ürün ekleyin.

---

## B. Stripe’da yapılacaklar

### B1. Gizli API anahtarı

1. https://dashboard.stripe.com → giriş yapın.
2. Sol menü: **Developers** → **API keys**.
3. **Secret key** yanında **Reveal test key** (veya canlı için **Reveal live key**) tıklayın.
4. Çıkan `sk_test_...` veya `sk_live_...` değerini **kopyalayın** (bir yere not edin; bir sonraki bölümde Vercel’e yapıştıracaksınız).

### B2. Webhook ekleme

1. Stripe’da sol menü: **Developers** → **Webhooks**.
2. **Add endpoint** tıklayın.
3. **Endpoint URL:**  
   `https://SİZİN-VERCEL-ADRESİNİZ/api/stripe-webhook`  
   (Örnek: `https://yazu-digital.vercel.app/api/stripe-webhook` – kendi Vercel domain’inizi yazın.)
4. **Select events** → şu üç olayı işaretleyin:  
   - `customer.subscription.created`  
   - `customer.subscription.updated`  
   - `customer.subscription.deleted`  
5. **Add endpoint** deyin.
6. Açılan sayfada **Signing secret** → **Reveal** tıklayın.
7. `whsec_...` ile başlayan değeri **kopyalayın** (Vercel’de kullanacaksınız).

Bu kadar. Ürün/fiyatı admin panelinden ekleyeceğiniz için Stripe’da ayrıca product/price oluşturmanız gerekmez.

---

## C. Vercel’de yapılacaklar

### C1. Projeyi açın

1. https://vercel.com → giriş.
2. **yazu-digital** (veya projenizin adı) projesine tıklayın.

### C2. Environment Variables ekleyin

1. Üstten **Settings** → sol menüden **Environment Variables**.
2. Aşağıdaki değişkenleri **tek tek** ekleyin (Add / New).

| Ad (Name) | Değer (Value) | Environment |
|-----------|----------------|-------------|
| `STRIPE_SECRET_KEY` | B1’de kopyaladığınız `sk_test_...` veya `sk_live_...` | Production (ve isterseniz Preview) |
| `STRIPE_WEBHOOK_SECRET` | B2’de kopyaladığınız `whsec_...` | Production (ve isterseniz Preview) |
| `SUPABASE_URL` | Supabase proje URL’iniz (Settings → API) | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service_role** key (Settings → API) | Production, Preview |

**Not:** `STRIPE_PRICE_PRO` ve `STRIPE_PRICE_PREMIUM` **zorunlu değil**. Admin panelinden ürün eklediğinizde fiyatlar oradan gelir. İsterseniz yedek olarak Stripe’daki bir price ID’yi ekleyebilirsiniz; admin’de ürün yoksa o kullanılır.

**İsteğe bağlı:**

- `APP_URL` – Uygulamanın canlı adresi (örn. `https://app.yazu.digital`). Vermezseniz Vercel kendi URL’ini kullanır.
- `SUPABASE_ANON_KEY` veya `VITE_SUPABASE_ANON_KEY` – Zaten varsa dokunmayın.

**Stripe ödeme sonrası yönlendirme:** `APP_URL` yoksa kullanıcı Vercel deployment URL’ine (örn. yazu-digital-xxx.vercel.app) gider; orada giriş koruması varsa Vercel login çıkar. Production’da mutlaka `APP_URL=https://app.yazu.digital` (kendi domain’iniz) ekleyin.

### C3. Deploy

1. **Deployments** sekmesine gidin.
2. Son deploy’un yeşil olması yeterli; env ekledikten sonra **Redeploy** yapın (en son commit ile yeniden deploy edilir).

---

## D. Sıra özeti

1. **Stripe:** Secret key + webhook endpoint + signing secret al (B1, B2).
2. **Vercel:** Bu değerleri ve Supabase’i env’e ekle (C2), gerekirse redeploy (C3).
3. **Admin panel:** Abonelik → Yeni ürün ile Pro/Premium (veya Basic) ekle; fiyatlar buradan ve Stripe’a gider.
4. **Test:** Uygulama tarafında bir paket seçip “Upgrade” deneyin; Stripe Checkout’a gidip test kartı ile ödeme deneyebilirsiniz.

Bu adımlar tamamlandığında admin’deki paketler ve fiyatlar, Stripe ve Vercel ile uyumlu çalışır.

---

## E. Test modu – Gerçek kart gerekmez

- Stripe Dashboard'da sol üstte **Test mode** açıksa (toggle ile "Test" yazıyorsa) **test anahtarları** kullanılıyordur (`sk_test_...`, webhook'ta da test signing secret).
- Bu durumda **gerçek kart kullanmanız gerekmez**; gerçek para çekilmez.
- **Test kartı:**
  - Numara: `4242 4242 4242 4242`
  - Son kullanma: ileri bir tarih (örn. 12/34)
  - CVC: herhangi 3 rakam (örn. 123)
  - Ülke / posta kodu: istediğiniz geçerli değer
- Ödeme adımını test etmek için `/start` sayfasından "Paket seç" → kayıt ol → giriş sonrası otomatik Stripe Checkout'a yönlendirilir; burada yukarıdaki test kartıyla deneyebilirsiniz.

---

## F. "No such price... test mode key was used" hatası

Bu uyarı, Vercel'de **test** Stripe anahtarı (`sk_test_...`) kullanırken veritabanındaki paketlerin **canlı (live)** modda oluşturulmuş `stripe_price_id` değerine sahip olmasından kaynaklanır. Test ve canlı modda fiyat ID'leri birbirinden farklıdır.

**Çözüm (test ile devam etmek istiyorsanız):**

1. Stripe Dashboard'da **Test mode**'un açık olduğundan emin olun.
2. Uygulama Admin → **Packages** bölümüne gidin.
3. Mevcut paketleri silin veya yeni paketler ekleyin. Kaydettiğinizde sistem Stripe **test** modunda yeni Product + Price oluşturur ve test `stripe_price_id` veritabanına yazılır.
4. Artık checkout test anahtarı ile bu fiyatlarla çalışır.

**Alternatif:** Canlı ödeme alacaksanız Stripe'da **Live** moda geçin, Vercel'de `STRIPE_SECRET_KEY` ve webhook secret'ı **canlı** değerlerle güncelleyin, redeploy yapın. Bu durumda veritabanındaki mevcut (live) price ID'leri kullanılır.
