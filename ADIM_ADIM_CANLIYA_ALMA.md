# app.yazu.digital — Adım Adım Canlıya Alma Rehberi

Bu rehberde **sadece senin yapacakların** var. Uygulama **app.yazu.digital** adresinde çalışacak. Her adımda tek bir işlem yapacaksın. Takıldığın yerde dur, ekranda ne gördüğünü yaz, devam edelim.

---

## BÖLÜM A: GitHub’a kodu yüklemek

GitHub, kodun saklanacağı yerdir. Vercel buradan alıp yayına alacak.

### Adım A1 — GitHub hesabı

1. Tarayıcıda **github.com** yaz, Enter.
2. Sağ üstte **Sign up** (Kayıt ol) görüyorsan tıkla; **Sign in** (Giriş yap) görüyorsan zaten hesabın var, onu tıkla ve şifrenle giriş yap, sonra **Adım A2**’ye geç.
3. E-posta adresini yaz.
4. Şifre oluştur (en az 8 karakter, bir büyük harf, bir rakam olsun).
5. Kullanıcı adı seç (örn: seninadi).
6. “Are you a robot?” sorusunu geç (robot değilsen işaretle).
7. **Create account** tıkla.
8. E-postana gelen doğrulama kodunu gir (istersen “Skip” de diyebilirsin).

Hesap açıldıysa devam et.

---

### Adım A2 — Yeni depo (repo) oluşturma

1. GitHub’a giriş yaptıktan sonra sağ üstte **+** işaretine tıkla.
2. **New repository** seç.
3. **Repository name** kutusuna tam olarak şunu yaz: **yazu-digital**
4. **Public** seçili kalsın.
5. **“Add a README file”** işaretleme; boş repo olsun.
6. En altta **Create repository** tıkla.

Sayfa “Quick setup” yazısıyla açılacak. O sayfayı kapatma, bir sonraki adımda kullanacağız.

---

### Adım A3 — Bilgisayarındaki projeyi GitHub’a göndermek

Bu adım için **Cursor’da Terminal** kullanacağız (veya Mac’te Terminal uygulaması).

1. Cursor’da menüden **Terminal** → **New Terminal** aç (veya kısayol ile).
2. Aşağıdaki komutları **sırayla**, her satırda Enter’a basarak yaz. (Proje klasöründe olduğundan emin ol; Cursor’da proje klasörü açıksa genelde oradasındır.)

Önce proje klasörüne gidelim. Bu satırı yaz (kendi kullanıcı adın varsa yolu ona göre değiştirebilirsin):

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu-digital"
```

Enter. Sonra sırayla:

```bash
git init
```

Enter.

```bash
git add .
```

Enter.

```bash
git commit -m "yazu.digital ilk yükleme"
```

Enter.

Şimdi GitHub’daki repo’yu “uzak adres” olarak ekleyeceğiz. **GitHub’daki repo sayfasında** (Adım A2’de açtığın sayfa) yeşil **Code** butonuna tıkla. Açılan pencerede **HTTPS** seçili olsun. Oradaki adres şöyle bir şey: `https://github.com/KULLANICI_ADIN/yazu-digital.git`

Aşağıdaki komutta **KULLANICI_ADIN** yerine kendi GitHub kullanıcı adını yaz:

```bash
git remote add origin https://github.com/KULLANICI_ADIN/yazu-digital.git
```

Enter. (Eğer “already exists” derse sorun yok, devam et.)

```bash
git branch -M main
```

Enter.

```bash
git push -u origin main
```

Enter. İlk seferde GitHub kullanıcı adı ve şifre (veya token) isteyebilir; yazıp Enter de.

**Özet:** Kodun artık GitHub’da “yazu-digital” reposunda olmalı. Tarayıcıda github.com/KULLANICI_ADIN/yazu-digital sayfasını açıp dosyaları görüyorsan bu bölüm tamam.

---

## BÖLÜM B: Vercel’de siteyi yayına almak

Vercel, sitesini internette açacak olan yer.

### Adım B1 — Vercel hesabı

1. Tarayıcıda **vercel.com** yaz, Enter.
2. **Sign Up** tıkla.
3. **Continue with GitHub** seç (GitHub ile giriş yap).
4. GitHub’a giriş izni ver (Authorize tıkla).
5. Vercel “Import your Git repository” gibi bir ekran açabilir; **Add New…** → **Project** diyerek devam edebilirsin.

---

### Adım B2 — Projeyi GitHub’dan Vercel’e bağlamak

1. Vercel’de **Add New…** → **Project** tıkla.
2. Listede **yazu-digital** reposunu gör. Yanında **Import** tıkla.
3. **Framework Preset:** Vite yazıyorsa dokunma.
4. **Root Directory:** boş kalsın.
5. **Build Command:** `npm run build` yazılı olsun.
6. **Output Directory:** `dist` yazılı olsun.
7. **Environment Variables** bölümüne gel. Şimdilik hiçbir şey ekleme.
8. En altta **Deploy** tıkla.

Bir süre bekleyecek. “Congratulations” veya “Your project has been deployed” gibi bir mesaj ve **Visit** butonu çıkacak. **Visit** tıkla: site açılacak ama henüz giriş/AI çalışmayacak (API anahtarlarını sonra ekleyeceğiz). Önemli olan site açılsın.

Bu adımdan sonra adresin şöyle bir şey olacak: **yazu-digital-xxxx.vercel.app**  
Bunu not et; bir sonraki bölümde domain’i bu projeye bağlayacağız.

---

## BÖLÜM C: Domain’i (www.yazu.digital) bağlamak

### Adım C1 — Alan adının nerede olduğunu bilmek

**yazu.digital** alan adını nereden aldıysan (GoDaddy, Namecheap, Cloudflare, Getir, Turhost, vs.) o sitenin **giriş yap** kısmından hesabına gir. Alan adı “yazu.digital” listede görünüyor olmalı.

Eğer henüz **yazu.digital** almadıysan, bir domain satıcısından (örn. namecheap.com, godaddy.com) “yazu.digital” diye arayıp satın al. Sonra aynı siteden “DNS ayarları” veya “Manage DNS” bölümüne gir.

---

### Adım C2 — Vercel’e domain eklemek

1. **vercel.com** → giriş yap → **yazu-digital** projesini aç.
2. Üstten **Settings** sekmesine tıkla.
3. Sol menüden **Domains** seç.
4. “Add” veya domain yazılan kutuya **app.yazu.digital** yaz (uygulama bu subdomain’de çalışacak).
5. **Add** tıkla.
6. Vercel sana birkaç satır **DNS kaydı** gösterecek. Örnek:
   - **CNAME** → **app** → **cname.vercel-dns.com**
   veya
   - **A** → **@** → **76.76.21.21**

Bu satırları **kopyala** veya ekranda açık bırak; bir sonraki adımda domain satıcısına yapıştıracağız.

---

### Adım C3 — Domain satıcısında DNS ayarlamak

1. Alan adını aldığın sitede (GoDaddy, Namecheap, vb.) **yazu.digital** için **DNS / Nameservers / Manage DNS** benzeri bir sayfayı aç.
2. Vercel’in söylediği kayıtları **aynen** ekle:
   - **app.yazu.digital** için **CNAME** dediyse: Host/Name kısmına **app**, Value/Point to kısmına **cname.vercel-dns.com** yaz.
   - **A** dediyse: Host **@**, Value **76.76.21.21** (Vercel’de yazan numarayı kullan).
3. **Kaydet** / **Save** tıkla.

DNS’in yayılması 5 dakika – birkaç saat sürebilir. Vercel’de **Domains** sayfasında app.yazu.digital’in yanında yeşil tik çıkınca bağlantı tamamdır. Tarayıcıda **https://app.yazu.digital** yazıp site açılıyorsa bu bölüm tamam.

---

## BÖLÜM D: Siteyi “çalışır” hale getirmek (API anahtarları)

Şu ana kadar site açıldı ama **giriş** ve **AI** çalışmıyor. Bunun için iki şey lazım: **Supabase** (giriş + arşiv) ve **Gemini** (AI). İkisini de Vercel’e “gizli bilgi” olarak ekleyeceğiz.

### Adım D1 — Supabase’te bilgileri almak

1. **supabase.com** → giriş yap (Supabase hesabın yoksa Sign up, e-posta ile aç).
2. **yazu-digital** projesini aç (yoksa “New project” ile oluştur; Organization: yazu, Name: yazu-digital, şifre belirle, region seç, Create).
3. Sol menüden **Project Settings** (dişli ikonu) tıkla.
4. **API** sekmesine gir.
5. Şunları **kopyala** ve bir yere (Not Defteri gibi) yapıştır:
   - **Project URL** (örn: https://xxxxx.supabase.co)
   - **anon public** anahtarı (Project API keys altında “anon” “public” yazan uzun metin)

Bu iki değeri **asla** kimseyle paylaşma; sadece bir sonraki adımda Vercel’e yapıştıracağız.

---

### Adım D2 — Gemini API anahtarı almak

1. Tarayıcıda **aistudio.google.com/apikey** yaz, Enter.
2. Google hesabınla giriş yap.
3. **Create API Key** tıkla → bir proje seç veya “Create new” de → anahtar oluşacak.
4. **Copy** ile anahtarı kopyala; Not Defteri’ne yapıştır. Bu da gizli; sadece Vercel’e gireceğiz.

---

### Adım D3 — Vercel’e bu üç değeri yazmak

1. **vercel.com** → **yazu-digital** projesi → **Settings** → **Environment Variables**.
2. Şu üç satırı **tek tek** ekle (Name ve Value’yu aynen yaz; Value’lara kendi kopyaladığın değerleri yapıştır):

| Name | Value (senin kopyaladığın) |
|------|----------------------------|
| **VITE_SUPABASE_URL** | Supabase’ten kopyaladığın Project URL |
| **VITE_SUPABASE_ANON_KEY** | Supabase’ten kopyaladığın anon public key |
| **GEMINI_API_KEY** | Google’dan kopyaladığın API key |

Her satırda **Add** veya **Save** tıkla. **Environment** kısmında **Production** (ve istersen Preview) işaretli olsun.

3. Üstteki **Deployments** sekmesine geç. En üstteki deployment’ın sağındaki **⋯** (üç nokta) → **Redeploy** tıkla. “Redeploy” onayla.

Bir iki dakika sonra deployment biter. **app.yazu.digital** adresini yenile: giriş sayfası gelmeli; kayıt ol / giriş yap deneyebilirsin. Bir araç seçip “Generate” dene; AI cevap veriyorsa her şey tamam.

---

## BÖLÜM E: Supabase’te tabloyu oluşturmak (Chat Archive)

Giriş ve AI çalışıyorsa, son olarak “Tarihçe”nin dolması için Supabase’te tek bir tablo oluşturacağız.

1. **supabase.com** → **yazu-digital** projesi.
2. Sol menüden **SQL Editor** tıkla.
3. **New query** veya boş alanı kullan.
4. Projede **supabase/migrations/001_chat_archive.sql** dosyasını aç; içindeki **tüm metni** kopyala.
5. SQL Editor’deki kutuya yapıştır.
6. **Run** (veya Execute) tıkla. Hata almazsan “Success” benzeri bir mesaj görürsün.

Bundan sonra sitede giriş yapıp bir araçta “Generate” dediğinde, o kullanım **Chat Archive**’e kaydedilir ve **Tarihçe** sayfasında listelenir.

---

## Özet — Sıra

1. **A:** GitHub hesabı → yazu-digital repo → kodu push et.
2. **B:** Vercel hesabı → GitHub’dan yazu-digital’i import et → Deploy.
3. **C:** app.yazu.digital domain’ini Vercel’e ekle → Domain satıcısında DNS’i Vercel’in söylediği gibi ayarla.
4. **D:** Supabase’ten URL + anon key, Google’dan Gemini key al → Vercel’de Environment Variables’a ekle → Redeploy.
5. **E:** Supabase SQL Editor’de 001_chat_archive.sql’i çalıştır.

Takıldığın adımı söyle (örn: “B2’de Import’a tıklayınca ne yapacağım?”); o adımı daha da basit parçalara bölebilirim.
