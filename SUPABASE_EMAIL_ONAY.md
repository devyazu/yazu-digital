# E-posta onayı gelmiyorsa veya "Email not confirmed" hatası

## Seçenek 1: Kullanıcıyı elle onaylamak (en hızlı)

1. **supabase.com** → **yazu-digital** projesi.
2. Sol menüden **Authentication** → **Users**.
3. Listede **admin@yazu.digital** (veya ilgili e-postayı) bulun.
4. Satırın sağında **⋯** (üç nokta) veya **Actions** → **Confirm user** / **Confirm email** seçin.

Bundan sonra o hesapla giriş yapabilirsiniz; e-posta onay linkine gerek kalmaz.

---

## Seçenek 2: Yeni kayıtlarda e-posta onayını kapatmak

Yeni kayıt olan herkes, e-posta onayı beklemeden giriş yapabilsin isterseniz:

1. **supabase.com** → **yazu-digital** projesi.
2. **Authentication** → **Providers** → **Email**.
3. **Confirm email** anahtarını **OFF** yapın.
4. **Save** tıklayın.

Bundan sonra yeni kayıtlar otomatik “onaylı” sayılır; mevcut onaylanmamış hesaplar için yine **Seçenek 1** ile elle onaylayabilirsiniz.

---

## E-posta neden gelmeyebilir?

- Supabase ücretsiz planda günlük e-posta limiti vardır.
- E-posta **spam** klasörüne düşmüş olabilir.
- **Authentication** → **Email Templates** içinde “Confirm signup” şablonu ve gönderen adresi kontrol edilebilir.

Özet: Hemen admin girişi için **Seçenek 1** (kullanıcıyı elle onayla); isterseniz **Seçenek 2** ile yeni kayıtlarda onayı kapatın.
