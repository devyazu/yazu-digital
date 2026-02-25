# Yazu Digital / SalesMind AI — Teknik Analiz Raporu

Bu rapor, **yazu-digital** (SalesMind AI / MarketerAI Canvas) uygulamasının ne olduğu, hangi teknolojilerle üretildiği, canlıya (live) geçiş gereksinimleri, artıları ve eksileri hakkında detaylı bilgi içerir.

---

## 1. Uygulama Nedir?

### Genel Tanım
**SalesMind AI** (paket adı: `salesmind-ai`), e-ticaret ve pazarlama ekipleri için tasarlanmış **AI destekli pazarlama/satış asistanı platformudur**. Uygulama:

- **100+ AI aracını** kategoriler halinde sunar (görsel, video, metin, rakip analizi, CRO, e-posta, Shopify, Amazon, Meta/TikTok reklamları, marka, B2B, retention vb.).
- Kullanıcıların **marka (brand)** bazında çalışmasına, birden fazla marka yönetmesine ve her marka için **Sales Agent** (satış botu) yapılandırmasına olanak tanır.
- **Gemini API** ile metin tabanlı üretim yapar; kullanıcı prompt’u + araç system prompt’u ile özelleştirilmiş çıktılar üretir.
- **Tier sistemi** (basic / pro / premium) ve **kredi (credits)** kavramı vardır; araçlar kullanım başına kredi tüketir.
- **Admin paneli**, araç/kategori düzenleme ve kullanıcı yönetimi için mock verilerle çalışır.
- **Destek (Support)** ekranı: FAQ ve forum benzeri içerikler (statik/mock).

Özetle: **Pazarlama/satış odaklı, çok araçlı bir “AI Marketing Suite” taslak uygulamasıdır.** Kullanıcı ve marka verisi kod içinde (mock); AI çıktıları yalnızca tarayıcıda `localStorage` ile tutulur. Hedef üretim senaryosu (gerçek kullanıcılar, kullanıcı bazlı chat arşivi, 100’lerce aktif kullanıcı) **[PRODUCTION_VISION.md](./PRODUCTION_VISION.md)** belgesinde tanımlanmıştır.

---

## 2. Teknoloji Stack’i

### 2.1 Frontend
| Teknoloji | Sürüm | Kullanım |
|-----------|--------|----------|
| **React** | ^19.2.3 | UI bileşenleri |
| **React DOM** | ^19.2.3 | Render |
| **TypeScript** | ~5.8.2 | Tip güvenliği |
| **Vite** | ^6.2.0 | Build tool & dev server |
| **Tailwind CSS** | ^4.2.0 | Stil (utility-first) |
| **@tailwindcss/vite** | ^4.2.0 | Vite entegrasyonu |
| **lucide-react** | ^0.562.0 | İkonlar |
| **@vitejs/plugin-react** | ^5.0.0 | React + Vite |

### 2.2 AI / Backend (Tek Gerçek Dış Bağımlılık)
| Teknoloji | Sürüm | Kullanım |
|-----------|--------|----------|
| **@google/genai** | ^1.34.0 | Gemini API istemcisi; metin üretimi |

- Model: `gemini-3-flash-preview` (geminiService.ts içinde sabit).
- API anahtarı: `GEMINI_API_KEY` veya `process.env.API_KEY` ile sağlanır (Vite `define` ile build zamanında enjekte edilebilir).

### 2.3 Geliştirme Araçları
- **@types/node** (^22.14.0): Node tip tanımları.
- **path** (Node): Vite alias için `path.resolve`.

### 2.4 Proje Yapısı (Özet)
```
├── index.html          # Giriş HTML (importmap ile ESM referansları)
├── index.tsx           # React giriş noktası
├── index.css           # Tailwind + özel theme (brand renkleri)
├── App.tsx             # Ana uygulama, state ve routing (view state)
├── types.ts            # TypeScript arayüzleri (Tool, Brand, User, vb.)
├── data.ts             # Mock kullanıcı, markalar, kategoriler, FAQ, forum
├── vite.config.ts     # Vite + React + Tailwind + env
├── tsconfig.json      # TypeScript ayarları (ES2022, ESNext modül)
├── package.json
├── services/
│   └── geminiService.ts   # generateContent(prompt, systemInstruction)
└── components/
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── Dashboard.tsx
    ├── ToolWorkspace.tsx   # AI aracı çalıştırma (prompt → Gemini → çıktı)
    ├── ExamplesPanel.tsx
    ├── CategoryView.tsx
    ├── BrandsView.tsx
    ├── BrandConnectView.tsx
    ├── SalesAgentView.tsx
    ├── IntegrationsView.tsx
    ├── SettingsView.tsx
    ├── SupportView.tsx
    ├── AdminView.tsx
    └── UpgradeModal.tsx
```

### 2.5 State Yönetimi
- **Global state**: React `useState` (App.tsx); Redux/Zustand yok.
- **Veri kaynağı**: `data.ts` (MOCK_USER, MOCK_BRANDS, CATEGORIES, FAQS, FORUM_TOPICS).
- **Kalıcılık**: Sadece `localStorage` — `ai_history` (kaydedilen çıktılar). Kullanıcı/marka/abonelik veritabanında değil.

### 2.6 “Routing”
- SPA; gerçek URL routing yok. `view` state ile ekranlar değişir: `home | tool | category | history | brands-list | brand-connect | settings | admin | sales-agent | support`.

---

## 3. Live’a Geçirmek İçin Gerekenler

### 3.1 Zorunlu Altyapı
1. **Hosting (statik + API key güvenliği)**
   - **Öneri**: Frontend’i Vercel, Netlify, Cloudflare Pages vb. ile statik deploy edin.
   - **Kritik**: Gemini API anahtarı **asla** client’ta (index.html / bundle) açık kalmamalı. Build’de `define` ile enjekte etmek key’i bundle’a gömerek sızdırır. Canlıda mutlaka **backend proxy** kullanın.

2. **Backend proxy (API key güvenliği)**
   - İstemci → sizin sunucunuz → Gemini API.
   - Node (Express/Fastify), serverless (Vercel/Netlify Functions, AWS Lambda) veya başka bir BFF ile tek endpoint (örn. `POST /api/generate`) oluşturup `GEMINI_API_KEY`’i sadece sunucu tarafında kullanın.
   - Mevcut `geminiService.ts` bu proxy’yi çağıracak şekilde değiştirilmelidir.

3. **Ortam değişkenleri**
   - Geliştirme: `.env.local` içinde `GEMINI_API_KEY=...` (README’de belirtilmiş; projede .env dosyası yok, oluşturulmalı).
   - Canlı: Hosting platformunda `GEMINI_API_KEY` tanımlanmalı; frontend build’inde bu değer **kullanılmamalı**.

### 3.2 Önerilen Ek Geliştirmeler (Production İçin)
- **Kimlik doğrulama**: Şu an yok. Login (e-posta/şifre, OAuth vb.) + oturum yönetimi eklenmeli.
- **Veritabanı**: Kullanıcılar, markalar, abonelikler, kredi kullanımı, geçmiş için (PostgreSQL, Supabase, Firebase vb.).
- **Gerçek ödeme**: Stripe/Paddle vb. ile basic/pro/premium ve kredi satışı.
- **Rate limiting & kota**: API proxy’de kullanıcı/abonelik bazlı limit ve kredi kontrolü.
- **Gerçek entegrasyonlar**: Shopify, Meta, Google vb. için OAuth + API çağrıları (şu an sadece mock “connected” durumu).
- **Sales Agent canlı çalışması**: Sadece config UI var; gerçek chat widget + backend entegrasyonu gerekir.
- **SEO / paylaşılabilir URL’ler**: React Router (veya benzeri) ile `/tool/:id`, `/category/:id` gibi route’lar.
- **Hata izleme**: Sentry vb. ile client/server hata loglama.
- **Analytics**: Kullanım ve dönüşüm metrikleri.

### 3.3 Build & Deploy (Minimal)
```bash
npm ci
# .env.local'da GEMINI_API_KEY set (sadece local dev için)
npm run build
# dist/ çıktısı herhangi bir statik hosta atılır
# Canlıda API key backend'de kalmalı; frontend'de kullanılmamalı
```

---

## 4. Artıları

- **Zengin araç kataloğu**: 100+ araç, kategorize ve tier’a göre erişim; pazarlama/satış senaryoları için iyi düşünülmüş.
- **Modern stack**: React 19, Vite 6, TypeScript, Tailwind 4 — güncel ve hızlı geliştirme deneyimi.
- **Tip güvenliği**: `types.ts` ile tutarlı modeller (Tool, Brand, User, SalesAgentConfig vb.).
- **Marka ve Sales Agent kavramı**: Çok markalı kullanım ve satış botu yapılandırması ürün farklılaşması için uygun.
- **UI/UX**: Temiz arayüz, responsive (sidebar toggle, mobil), marka renkleri ve gradient’lerle tutarlı görünüm.
- **Brand context**: Araç çalıştırırken marka bilgisi (isim, website, entegrasyonlar) prompt’a eklenebiliyor; çıktı markaya özelleştirilebiliyor.
- **Düşük bağımlılık**: Sadece Gemini’ye bağımlı; ek state kütüphanesi yok, proje sade.
- **Admin paneli**: Araç/kategori CRUD için altyapı mevcut (veri hâlâ client-state).

---

## 5. Eksileri

- **API key güvenliği**: Key client tarafında kullanılıyor veya build’e gömülebiliyor; canlıda mutlaka backend proxy gerekir.
- **Backend yok**: Kullanıcı, abonelik, ödeme, entegrasyonlar hep mock; production için tam backend gerekir.
- **Gerçek entegrasyon yok**: “Connected” entegrasyonlar sadece UI; Shopify/Meta/Google vb. veri çekilmiyor.
- **Sales Agent sadece config**: Widget/chat ve gerçek sohbet backend’i yok.
- **Routing**: URL ile sayfa paylaşımı/SEO yok; sayfa yenilenince state sıfırlanır (localStorage hariç).
- **Tarihçe**: Sadece localStorage’da; senkronizasyon, limit veya yedekleme yok.
- **Arama**: Header ve Dashboard’daki arama alanları işlevsel değil (aranan metne göre filtreleme yok).
- **Dosya yükleme**: ToolWorkspace’te dosya adları prompt’a ekleniyor ama içerik Gemini’ye gönderilmiyor; gerçek dosya analizi yok.
- **Tek model**: Model adı (`gemini-3-flash-preview`) sabit; hata durumları ve fallback sınırlı.
- **Erişim kontrolü**: Tier/kredi kontrolü sadece client-side; yetkisiz istekler backend’de engellenmeli.
- **.env örneği**: Projede `.env.local` veya `.env.example` yok; geliştiriciler için dokümantasyon eksik.

---

## 6. Özet Tablo

| Konu | Durum |
|------|--------|
| **Uygulama türü** | AI destekli pazarlama/satış asistanı (multi-tool, multi-brand) |
| **Frontend** | React 19 + TypeScript + Vite 6 + Tailwind 4 |
| **AI** | Google Gemini (@google/genai), metin üretimi |
| **Veri** | Mock (data.ts) + localStorage (history) |
| **Auth** | Yok |
| **Backend** | Yok (sadece doğrudan Gemini çağrısı) |
| **Live için kritik** | API key’i backend proxy ile saklamak, auth + DB + ödeme planlamak |
| **Güçlü yönler** | Zengin araç seti, modern stack, marka/agent kavramı, tip güvenliği |
| **Zayıf yönler** | Key güvenliği, backend/entegrasyon/gerçek Sales Agent eksikliği, arama/routing eksik |
| **Üretim hedefi** | 100’lerce kullanıcı; her kullanıcının AI yazışmaları kendi Chat Archive’inde → **[PRODUCTION_VISION.md](./PRODUCTION_VISION.md)** |

Bu rapor, uygulamanın mevcut kod tabanına dayanarak hazırlanmıştır. Çok kullanıcılı üretim hedefi (auth, veritabanı, kullanıcı bazlı chat arşivi) için **[PRODUCTION_VISION.md](./PRODUCTION_VISION.md)** belgesine bakın.
