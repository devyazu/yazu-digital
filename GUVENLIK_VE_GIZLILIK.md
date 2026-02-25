# Gizlilik ve güvenlik – ne yapmalı?

## 1. GitHub repo’yu **Private** yap

- **Public** → Herkes kodu görebilir.
- **Private** → Sadece sen ve eklediğin kişiler erişir.

**Nasıl:** GitHub’da repo → **Settings** → en altta **Danger Zone** → **Change repository visibility** → **Make private**.

---

## 2. Veritabanı (Supabase) GitHub’da değil

- Kodlar GitHub’da, veritabanı Supabase’te.
- Erişim: Supabase proje URL’i + **anon** / **service_role** key ile. Bu key’ler **kodun içinde yazılı değil**; sadece Vercel ortam değişkenlerinde (ve kendi bilgisayarında `.env` ile) tutuluyor.
- Yani repo public olsa bile, **key’leri koda yazmadığın sürece** veritabanına kimse GitHub üzerinden ulaşamaz.

---

## 3. Şifre ve key’leri koda koyma

- **SUPABASE_SERVICE_ROLE_KEY**, **SMTP_PASSWORD**, **GEMINI_API_KEY** vb. **asla** proje dosyalarına (ve Git’e) yazılmamalı.
- Sadece:
  - **Vercel** → Environment Variables,
  - İsteğe bağlı: bilgisayarında **`.env`** (bu dosya `.gitignore`’da; commit edilmez).

Projede zaten `process.env.XXX` kullanılıyor; gerçek değerler sadece ortamda. Bu doğru kullanım.

---

## 4. Kontrol listesi

| Yapılacak | Açıklama |
|-----------|----------|
| Repo’yu **Private** yap | Sadece sen (ve eklediğin kişiler) kodu görsün. |
| `.env` commit etme | `.gitignore`’da; zaten eklendi. Eski commit’te varsa artık ekleme. |
| Key’leri sadece Vercel’de tut | Supabase / SMTP / Gemini key’leri sadece Vercel env’de olsun. |
| `service_role` key’i tarayıcıda kullanma | Sadece sunucu (API route’larında) kullanılıyor; doğru. |

---

## Özet

- **Kod:** Repo’yu **private** yap → başkası koduna erişemez.
- **Veritabanı:** Key’ler koda yazılı değil, Vercel/Supabase’te → GitHub’dan veritabanına erişim yok.
- **Her zaman:** Şifre ve API key’leri sadece ortam değişkenlerinde tut; `.env`’i asla commit etme.
