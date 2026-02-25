# Supabase — Yazu.digital bağlantı bilgileri

## Sizin yapmanız gerekenler

### 1. Supabase’den iki değeri alın

1. Supabase Dashboard’da **yazu-digital** projesini açın.
2. Sol menüden **Project Settings** (dişli ikonu) → **API** sayfasına gidin.
3. Şu iki değeri kopyalayın:

| Değişken adı | Nerede yazıyor | Kullanım |
|--------------|-----------------|---------|
| **Project URL** | "Project URL" kutusu | `NEXT_PUBLIC_SUPABASE_URL` veya `VITE_SUPABASE_URL` |
| **anon public** key | "Project API keys" → **anon** `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` veya `VITE_SUPABASE_ANON_KEY` |

- **Project URL** örneği: `https://xxxxxxxxxxxxx.supabase.co`
- **anon key** uzun bir JWT benzeri string (client tarafında kullanılacak; RLS ile güvenlik sağlanır).

**Önemli:** `service_role` key’ini **asla** frontend’e veya public repo’ya koymayın. Sadece güvenli backend işleri için kullanın.

### 2. Bu değerleri projeye yazın

- **Yerel:** Proje kökünde `.env.local` dosyası oluşturup (veya var olanı açıp) şu satırları ekleyin; değerleri kendi kopyaladıklarınızla değiştirin:

```env
# Supabase (yazu-digital projesi)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Vercel (canlı):** Vercel → Proje → Settings → Environment Variables. Aynı iki değişkeni (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) orada da ekleyin.

Bu iki değeri paylaşmanız gerekmiyor; sadece kendi ortamınızda tanımlayın. Kod tarafında bu isimlerle okuyacağız.

---

## Row Level Security (RLS) önerisi

Projeyi oluştururken “Enable automatic RLS” kapalı kalmış olabilir. Chat archive ve kullanıcıya özel tablolar için **RLS’i açmanız** güvenlik için iyi olur:

- Supabase Dashboard → **Authentication** → **Policies** veya **Table Editor**’da ilgili tabloya girip **RLS**’i “Enable” edin.
- Her tabloda: “Kullanıcı sadece kendi `user_id`’si olan satırları görebilir/güncelleyebilir” kuralını ekleyeceğiz (tabloları oluşturduktan sonra).

---

## İlk tablo: Chat Archive

Chat arşivini saklamak için Supabase’de bir tablo oluşturun:

1. Supabase Dashboard → **SQL Editor**.
2. **supabase/migrations/001_chat_archive.sql** dosyasının içeriğini açıp kopyalayın, SQL Editor’e yapıştırın, **Run** deyin.

Bu tablo `auth.users` ile ilişkilidir: Giriş sistemini (Supabase Auth) açtığınızda her kullanıcının ID’si orada olacak ve `chat_archive.user_id` ile eşleşecek.

**Auth (e-posta ile giriş):** Uygulama Supabase Auth kullanıyor. Dashboard’da **Authentication** → **Providers** → **Email**’in açık ve “Confirm email” ayarının ihtiyacınıza göre (açık/kapalı) olduğundan emin olun. Kayıt olan kullanıcılar `auth.users` tablosuna eklenir; chat archive bu kullanıcı ID’leriyle kaydedilir.

---

## E-posta onay linki localhost’a gidiyorsa (canlı site için düzeltme)

E-posta onay linkine tıkladığında **localhost:3000** açılıyor veya “bağlanamıyor” hatası alıyorsan, Supabase’te yönlendirme adresi hâlâ localhost’tur. Canlı sitede **app.yazu.digital** kullanıyorsan şunu yap:

1. Supabase Dashboard → **Authentication** → **URL Configuration**.
2. **Site URL** kutusuna şunu yaz: **https://app.yazu.digital**
3. **Redirect URLs** listesine şunu ekle: **https://app.yazu.digital/**
4. **Save** tıkla.

Bundan sonra gönderilen e-posta onay linkleri **app.yazu.digital**’e yönlendirir. Eski link artık geçersiz sayılır; gerekirse tekrar “Kayıt ol” deyip yeni maildeki linke tıklayabilirsin.
