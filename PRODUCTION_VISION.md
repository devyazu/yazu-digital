# Yazu.digital — Üretim Vizyonu ve Gereksinimler

Bu belge, mevcut taslağın **100’lerce aktif kullanıcı** ve **kullanıcı bazlı chat arşivi** hedefine nasıl taşınacağını tanımlar.

---

## Mevcut durum (taslak)

- **Kullanıcı / marka verisi:** Kod içinde sabit (`data.ts`). Gerçek hesap yok.
- **AI çıktıları:** Veritabanında `chat_archive` tablosunda; "Save" ve her araç çalıştırmasında kaydedilir. Tarihçe ekranı buradan okur.
- **Tarihçe ekranı:** Chat Archive (DB) üzerinden kullanıcıya özel kayıtlar listelenir.

Bu yapı **demo / taslak** için uygundur; canlıya alındığında herkes aynı “mock” kullanıcıyla aynı deneyimi görür.

---

## Hedef

1. **Her kullanıcı kendi hesabıyla giriş yapacak.**  
   Kendi markaları, kredi bilgisi ve araç kullanımı sadece kendine ait olacak.

2. **Her kullanıcının AI aracı yazışmaları kendi Chat Archive’inde görünecek.**  
   Yani:
   - Hangi araçta, ne zaman, hangi prompt girildi ve AI ne üretti → **kullanıcıya özel** kayıt.
   - Bu kayıtlar **sunucu tarafında** saklanacak; cihaz değişse bile aynı kullanıcı giriş yaptığında arşivinde görebilecek.

3. **Ölçek: 100’lerce aktif kullanıcı.**  
   Auth, veritabanı ve API’ler buna göre tasarlanmalı (gereksiz karmaşıklık olmadan, ileride büyümeye uygun).

---

## Yapılması Gerekenler (özet)

| Alan | Şu an | Hedef |
|------|--------|--------|
| **Kimlik** | Yok (mock kullanıcı) | Gerçek auth: e-posta/şifre veya OAuth (Google, GitHub vb.) |
| **Kullanıcı / marka / kredi verisi** | `data.ts` (sabit) | Veritabanında; kullanıcıya göre okuma/yazma |
| **AI konuşmaları (chat archive)** | Veritabanında (`chat_archive`) | Veritabanında; kullanıcı ID’ye bağlı, kalıcı |
| **Tarihçe ekranı** | Placeholder | Kullanıcının kendi kayıtlarını listeleme + filtreleme/arama |

---

## 1. Kimlik doğrulama (Auth)

- **Seçenekler (tercihe göre biri):**
  - **Clerk / Auth0 / Supabase Auth:** Hazır login/kayıt, session, “forgot password” vb. Hızlı entegrasyon.
  - **NextAuth (Auth.js):** Kendi backend’inizle; Google/GitHub vb. provider eklenebilir.
  - **Kendi basit auth’unuz:** E-posta + şifre (hash’lenmiş), JWT veya session cookie.
- **Gereken:** Giriş yapan kullanıcının **benzersiz ID**’si (ve isteğe bağlı e-posta, ad). Bu ID tüm kullanıcı verisi ve chat arşivi kayıtlarıyla ilişkilendirilecek.

---

## 2. Veritabanı

- **Ne saklanacak:**
  - **Kullanıcılar:** id, email, ad, tier, kredi bilgisi, kayıt tarihi vb.
  - **Markalar:** Kullanıcıya ait markalar (user_id ile).
  - **Chat archive (AI yazışmaları):** Her “araç kullanımı” = bir kayıt: user_id, tool_id / tool_name, prompt (input), AI çıktısı (output), timestamp, isteğe bağlı brand_id.
- **Veritabanı seçenekleri:**
  - **Vercel Postgres / Neon / Supabase (PostgreSQL):** Vercel ile uyumlu, serverless-friendly.
  - **PlanetScale (MySQL):** Branch’lerle geliştirme için uygun.
- **Ölçek:** 100’lerce kullanıcı için tek bölge, tek instance yeterli; index’ler user_id ve timestamp üzerinde olmalı (arşiv listesi hızlı olsun diye).

---

## 3. Chat Archive (kullanıcının AI yazışmaları)

- **Kayıt yapısı (örnek):**

  | Alan | Açıklama |
  |------|----------|
  | id | Benzersiz kayıt ID |
  | user_id | Giriş yapan kullanıcı |
  | tool_id | Hangi araç (örn. copy-1, meta-1) |
  | tool_name | Araç adı (göstermek için) |
  | input | Kullanıcının yazdığı prompt |
  | output | AI’ın ürettiği metin |
  | brand_id | İsteğe bağlı; hangi marka bağlamında kullanıldı |
  | created_at | Zaman damgası |

- **Akış:**
  - Kullanıcı bir araçta “Generate” yapar → mevcut `/api/generate` (veya genişletilmiş bir API) AI cevabı döner.
  - Aynı istekte veya hemen sonra **backend** bu konuşmayı (user_id, tool_id, input, output, timestamp) veritabanına yazar.
  - “Chat Archive” / “Tarihçe” ekranı açıldığında backend, **sadece o user_id**’ye ait kayıtları döner (sayfalama ile, örn. son 50 kayıt).

- **Frontend:** Mevcut “History” view’ı gerçek API’den gelen listeyle doldurulur; araç adı, tarih, input/output önizlemesi ve isteğe bağlı “Copy / Open” gibi aksiyonlar eklenir.

---

## 4. API ve güvenlik

- **Tüm kullanıcıya özel istekler** (arşiv kaydetme, arşiv listeleme, marka/kredi güncelleme) **oturum/JWT ile doğrulanmalı.**  
  İstekte `user_id` backend’de token’dan alınmalı; istemciye güvenilmemeli.
- **Rate limiting:** 100’lerce kullanıcı için API’de (özellikle `/api/generate` ve arşiv listesi) kullanıcı başına limit konulması hem adil kullanım hem maliyet kontrolü için faydalıdır.
- **Kredi:** Her AI çağrısında kullanıcının kredi bakiyesi güncellenmeli; yetkisiz kullanım engellenmeli.

---

## 5. Öncelik sırası (önerilen)

1. **Auth:** Giriş/kayıt + session. Kullanıcı ID’nin her yerde kullanılabilmesi.
2. **Veritabanı:** Kullanıcı + marka (ve isteğe bağlı kredi) tabloları; chat archive tablosu.
3. **Chat archive API:** Kaydetme (Generate sonrası) + listeleme (Tarihçe sayfası).
4. **Frontend:** Tarihçe ekranını gerçek veriyle doldurma; “Save” davranışını “sunucuya kaydet” olarak değiştirme.
5. **Kredi ve limitler:** Tier’a göre kredi düşme, yetersiz kredi durumunda uyarı/engel.

Bu sırayla ilerlenirse, “her kullanıcının kendi AI tool yazışmaları chat archive’inde görünecek” hedefi karşılanır ve 100’lerce aktif kullanıcı için temel altyapı hazır olur.
