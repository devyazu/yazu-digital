# Yazu.digital Canlıya Alma — Yol Haritası ve Adım Adım Rehber

Bu belge, **yazu.digital** adresinde sitesi canlıya almak için yapmanız gereken her şeyi, en basit ve sıralı adımlarla anlatır.

---

## Sık sorulan iki soru

**Vercel hesabı açmam lazım mı?**  
Evet. Siteyi canlıya almak için **Vercel hesabı** açmanız gerekir. Projeyi Vercel’e bağlayıp oradan yayına alacaksınız. Bilgisayarınızda localhost’ta çalıştırmanız **gerekmez**; tüm adımlar tarayıcı + Vercel + domain üzerinden yürür.

**Veritabanı konusu nasıl oluyor?**  
Bu projede **veritabanı yok** ve canlıya çıkmak için **veritabanı gerekmez**. Kullanıcılar, markalar ve araç listesi sabit veri; kaydedilen AI çıktıları ise ziyaretçinin kendi tarayıcısında (localStorage) tutulur. Yani sadece **Vercel + domain + Gemini API anahtarı** ile yayına alabilirsiniz. İleride gerçek kullanıcı hesapları veya abonelik isterseniz, o aşamada bir veritabanı (ör. Supabase, Vercel Postgres) eklenebilir.

---

## Özet: Ne Yaptık, Ne Yapacaksınız

### Yapılan yazılım düzenlemeleri (tamamlandı)
- **API anahtarı güvenliği:** Gemini API anahtarı artık yalnızca sunucu tarafında kullanılıyor. İstemci sadece `/api/generate` endpoint’ini çağırıyor.
- **Yerel geliştirme:** `npm run dev` hem Vite hem yerel API proxy’yi (port 3001) birlikte çalıştırıyor.
- **Canlı (Vercel):** `api/generate.js` serverless function ile aynı proxy canlıda çalışacak.
- **Arama:** Header ve ana sayfa arama kutusu araç/kategori adı ve açıklamaya göre filtreliyor.
- **.env.example:** Geliştiriciler için örnek ortam değişkeni dosyası eklendi.
- **Proje adı / başlık:** package.json `yazu-digital`, index.html başlığı “Yazu.digital – AI Pazarlama Araçları” olarak güncellendi.

### Sizin yapacaklarınız (canlıya almak için)
1. Domain: **yazu.digital** alan adını almak veya kullanıma hazırlamak.
2. Gemini API anahtarı almak (henüz yoksa).
3. Projeyi Vercel’e bağlayıp deploy etmek.
4. Vercel’de `GEMINI_API_KEY` ortam değişkenini eklemek.
5. Vercel’de yazu.digital domain’ini projeye bağlamak.

---

## Adım 1: Alan adı (yazu.digital)

1. Bir domain satıcısında (GoDaddy, Namecheap, Cloudflare, Getir, Turhost vb.) **yazu.digital** alan adını satın alın veya zaten sizdeyse yönetim paneline girin.
2. Canlıya alma için şimdilik ek bir DNS ayarı yapmanız gerekmez; **Adım 5**’te Vercel’den verilen kayıtları domain satıcısına ekleyeceğiz.

---

## Adım 2: Gemini API anahtarı

1. Tarayıcıda **https://aistudio.google.com/apikey** adresine gidin.
2. Google hesabınızla giriş yapın.
3. “Create API Key” ile yeni bir anahtar oluşturun.
4. Anahtarı kopyalayıp güvenli bir yerde (örn. şifre yöneticisi) saklayın.  
   **Adım 4**’te bu değeri Vercel’e yapıştıracaksınız.

---

## Adım 3: Projeyi Git’e atıp Vercel’e bağlamak

### 3.1 Git reposu oluşturma (henüz yoksa)

Proje klasöründe terminal açın:

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu-digital"
git init
git add .
git commit -m "Initial commit: yazu.digital v1"
```

GitHub / GitLab / Bitbucket’ta yeni bir **boş repo** oluşturup uzak adresi ekleyin:

```bash
git remote add origin https://github.com/KULLANICI_ADI/yazu-digital.git
git branch -M main
git push -u origin main
```

*(KULLANICI_ADI ve repo adını kendi bilginizle değiştirin.)*

### 3.2 Vercel’e deploy

1. **https://vercel.com** adresine gidin, ücretsiz hesap açın veya giriş yapın.
2. “Add New…” → “Project” deyin.
3. “Import Git Repository” bölümünde GitHub/GitLab/Bitbucket’ı bağlayın (ilk seferde yetki verin).
4. Az önce push ettiğiniz **yazu-digital** reposunu seçin.
5. **Framework Preset:** Vite otomatik seçilmiş olmalı.
6. **Build Command:** `npm run build` (varsayılan).
7. **Output Directory:** `dist` (varsayılan).
8. “Deploy” deyin. İlk deploy birkaç dakika sürebilir.
9. Deploy bitince size **xxx.vercel.app** gibi bir adres verilir. Bu aşamada AI çalışmaz çünkü henüz API anahtarı eklemedik.

---

## Adım 4: Vercel’de API anahtarını eklemek

1. Vercel’de projenize tıklayın.
2. Üst menüden **Settings** → **Environment Variables**.
3. **Name:** `GEMINI_API_KEY`  
   **Value:** Adım 2’de kopyaladığınız Gemini API anahtarı.  
   **Environment:** Production (ve isterseniz Preview) seçin.
4. “Save” deyin.
5. **Deployments** sekmesine gidin, son deployment’ın yanındaki “…” menüsünden **Redeploy** seçin.  
   Böylece yeni ortam değişkeni yüklü olarak tekrar deploy alınır.

Redeploy bittikten sonra **xxx.vercel.app** adresinde bir araç seçip “Generate” deneyin; AI cevap veriyorsa canlı ortam doğru çalışıyordur.

---

## Adım 5: yazu.digital domain’ini bağlamak

1. Vercel’de aynı projede **Settings** → **Domains**.
2. “Add” deyin ve **yazu.digital** yazın (www’suz veya www’li, tercihinize göre).
3. Vercel size birkaç DNS kaydı gösterecek. Örnek:
   - **A** kaydı: `76.76.21.21` (Vercel’in verdiği IP)
   - veya **CNAME**: `cname.vercel-dns.com`
4. Domain satıcınızın (GoDaddy, Cloudflare vb.) **DNS / Nameservers** bölümüne gidin.
5. Vercel’de yazdığı kayıtları aynen ekleyin:
   - **yazu.digital** için A veya CNAME (Vercel’in söylediği).
   - İsterseniz **www.yazu.digital** için de CNAME: `cname.vercel-dns.com`.
6. Kayıtların yayılması 5 dakika – 48 saat sürebilir (genelde 15–30 dakika).
7. Vercel “Domains” sayfasında domain’in yanında yeşil tik çıkınca bağlantı tamamdır.

Tarayıcıda **https://yazu.digital** açıp siteyi test edin.

---

## Adım 6: Yerel geliştirme (isteğe bağlı — atlayabilirsiniz)

Sadece canlıya almak istiyorsanız bu adımı **yapmanız gerekmez**. İleride kodu bilgisayarınızda denemek isterseniz:

1. **.env.local** oluşturun (proje kökünde):

   ```
   GEMINI_API_KEY=buraya_kendi_anahtarinizi_yapistirin
   ```

2. Bağımlılıkları yükleyip hem uygulama hem API proxy’yi başlatın:

   ```bash
   npm install
   npm run dev
   ```

3. Tarayıcıda **http://localhost:3000** açın.  
   Arama ve AI üretimi yerel API (port 3001) üzerinden çalışır.

Sadece frontend’i çalıştırmak isterseniz: `npm run dev:app`. Bu durumda AI çalışmaz; API proxy çalışmadığı için “API Key is missing” benzeri mesaj alırsınız.

---

## Kontrol listesi (özet)

- [ ] yazu.digital alan adı hazır
- [ ] Gemini API anahtarı alındı
- [ ] Proje Git’e atıldı ve Vercel’e import edildi
- [ ] İlk deploy alındı (xxx.vercel.app çalışıyor)
- [ ] Vercel’de `GEMINI_API_KEY` eklendi ve redeploy yapıldı
- [ ] AI “Generate” testi vercel.app adresinde başarılı
- [ ] Vercel’de Domain olarak yazu.digital eklendi
- [ ] DNS kayıtları domain satıcısında yapıldı
- [ ] https://yazu.digital açılıyor ve AI çalışıyor

---

## Olası sorunlar

| Sorun | Çözüm |
|--------|--------|
| “API Key is missing” | Vercel’de `GEMINI_API_KEY` ekleyip **Redeploy** yaptığınızdan emin olun. |
| Sayfa açılıyor ama AI cevap vermiyor | Tarayıcı geliştirici araçları (F12) → Network’te `/api/generate` isteğine bakın; 503/500 ise key veya model adı hatalı olabilir. |
| yazu.digital açılmıyor | DNS’in yayılmasını bekleyin; 24 saate kadar sürebilir. Vercel Domains’te “Valid Configuration” yeşil mi kontrol edin. |
| Yerelde “ECONNREFUSED localhost:3001” | `npm run dev` kullanın (sadece `npm run dev:app` değil); böylece server.js de çalışır. |

---

## Sonraki aşamalar (isteğe bağlı)

- **SSL:** Vercel https’i otomatik verir; ek işlem gerekmez.
- **Analytics:** Vercel Analytics veya Google Analytics ekleyebilirsiniz.
- **Gerçek kullanıcı girişi ve veritabanı:** İleride auth + DB eklenirse abonelik ve kredi sistemi gerçek veriyle çalışabilir.

Bu rehber, yazu.digital’i **en az ayak iziyle** canlıya almanız için yeterlidir. Tüm adımlar tamamlandığında siteniz **https://yazu.digital** adresinde yayında olur.
