# Yazu.digital — AI Pazarlama Araçları

E-ticaret ve pazarlama ekipleri için 100+ AI destekli araç (metin, görsel fikirleri, reklam, SEO, vb.). Google Gemini API ile çalışır.

## Yerel çalıştırma

**Gereksinim:** Node.js 18+

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env.local` dosyası oluşturup Gemini API anahtarınızı ekleyin:
   ```bash
   cp .env.example .env.local
   # .env.local içinde GEMINI_API_KEY=... değerini düzenleyin
   ```
   API anahtarı: [Google AI Studio](https://aistudio.google.com/apikey)

3. Uygulama + API proxy’yi birlikte başlatın:
   ```bash
   npm run dev
   ```
   - Uygulama: http://localhost:3000  
   - API proxy: http://localhost:3001 (Gemini çağrıları buradan gider)

Sadece frontend: `npm run dev:app` (AI çalışmaz; proxy kapalıdır).

## Canlıya alma (yazu.digital)

Adım adım rehber: **[YOL_HARITASI_YAZUDIGITAL.md](./YOL_HARITASI_YAZUDIGITAL.md)**  
Özet: Vercel’e deploy → `GEMINI_API_KEY` ekle → domain’i yazu.digital olarak bağla.

## Proje yapısı

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **AI:** Google Gemini (istekler `/api/generate` proxy’si üzerinden; anahtar sunucuda)
- **Yerel API:** `server.js` (Express)
- **Canlı API:** Vercel Serverless `api/generate.js`

Teknik detaylar: [TECHNICAL_REPORT_TR.md](./TECHNICAL_REPORT_TR.md)
