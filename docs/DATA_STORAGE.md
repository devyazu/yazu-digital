# Veri saklama politikası

Bu projede **kullanıcıya ait hiçbir veri localStorage’da tutulmaz.** Tüm kullanıcı içeriği veritabanında (Supabase) saklanır.

---

## Nerede ne tutuluyor?

| Veri | Konum | Açıklama |
|------|--------|----------|
| **AI aracı yazışmaları (Chat Archive)** | Supabase `chat_archive` | Her araç çalıştırmasında ve "Kaydet" ile kayıt eklenir. History ekranı bu tablodan okur. |
| **Kullanıcı hesapları** | Supabase Auth + `profiles` | Giriş, kayıt, e-posta onayı. |
| **Markalar / workspace’ler** | Supabase `workspaces` | Kullanıcıya özel marka listesi; ad, website, logo_url, integrations (JSONB), sales_agent_config (JSONB). |
| **Marka logoları** | Supabase Storage `brand-logos` | Yol: `{user_id}/{workspace_id}.{ext}`. Public read; sadece kendi klasörüne yükleme. |
| **Entegrasyonlar** | `workspaces.integrations` (JSONB) | Her markanın entegrasyon listesi aynı tabloda. |

---

## Chat Archive (mevcut)

- **Tablo:** `public.chat_archive`
- **Migration:** `supabase/migrations/001_chat_archive.sql`
- **Servis:** `services/chatArchive.ts` — `saveToChatArchive()`, `getChatArchive()`
- **Kullanım:** ToolWorkspace her çalıştırmada ve "Kaydet" tıklanınca `saveToChatArchive` çağırır; History ekranı `getChatArchive(userId)` ile listeler.

---

## Workspaces (markalar) ve logolar

- **Tablo:** `public.workspaces` — Migration: `supabase/migrations/007_workspaces.sql`
- **Storage:** Bucket `brand-logos` — Kurulum: `docs/SUPABASE_BRAND_LOGOS.md`
- **Servis:** `services/brandService.ts` — `getBrands()`, `createBrand()`, `uploadBrandLogo()`
- **Kullanım:** Giriş sonrası markalar DB’den yüklenir; yeni marka ekleme ve logo yükleme kalıcıdır.

---

## localStorage kullanılmıyor

- Eski "Kaydet" davranışı (ai_history localStorage) kaldırıldı; kayıtlar doğrudan `chat_archive` tablosuna yazılıyor.
- Yeni özelliklerde kullanıcı verisi için localStorage eklenmemeli; her zaman veritabanı (ve gerekirse Supabase Storage) kullanılmalı.
