# SMTP 535 "Incorrect authentication data" Çözümü

Bu hata SMTP sunucusunun kullanıcı adı/şifreyi kabul etmediğini gösterir. Aşağıdakileri tek tek kontrol edin.

## 1. SMTP_USER tam e-posta olmalı

Çoğu sunucu (cPanel, Plesk, mail.yazu.digital) **tam e-posta adresini** kullanıcı adı olarak ister.

- **Yanlış:** `noreply` veya `noreply@yazu.digital` (farklı domain olabilir)
- **Doğru:** `noreply@mail.yazu.digital` (SMTP sunucusunun host’u ile aynı domain’de bir adres)

Vercel’de:
```env
SMTP_USER=noreply@mail.yazu.digital
```

## 2. Port ve TLS (artık otomatik)

Kod **porta göre** doğru TLS modunu seçiyor; `SMTP_SECURE` env’ine gerek yok.

- **Port 465** → Bağlantı baştan SSL (secure: true)
- **Port 587** → Önce düz bağlantı, sonra STARTTLS (secure: false)

Eğer **"wrong version number"** veya **"tls_validate_record_header"** hatası alırsanız: Port 587 kullanıyorsanız env’de `SMTP_SECURE` tanımlıysa **silin**; sadece `SMTP_PORT=587` kalsın. Kod 587 için zaten STARTTLS kullanıyor.

## 3. Şifrede boşluk / gizli karakter olmasın

Vercel Environment Variables’da değeri yapıştırırken başta/sonda boşluk kalmadığından emin olun. Kod tarafında artık `trim()` uygulanıyor; yine de env’i tekrar yazıp kaydedin.

## 4. Hesap tipi

- Normal panel şifresi bazen SMTP için kapalı olur; “SMTP şifresi” veya “Uygulama şifresi” gerekebilir.
- 2FA açıksa genelde **uygulama şifresi** (app password) kullanılır, normal giriş şifresi değil.

## 5. Host adı

`SMTP_HOST` mail sunucusu ile aynı olmalı. Örnek:

```env
SMTP_HOST=mail.yazu.digital
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@mail.yazu.digital
SMTP_PASSWORD=...
SMTP_FROM=Yazu.digital <noreply@mail.yazu.digital>
```

## Hızlı kontrol listesi

| Değişken       | Örnek                          |
|----------------|--------------------------------|
| SMTP_HOST      | `mail.yazu.digital`            |
| SMTP_PORT      | `465` veya `587`               |
| SMTP_SECURE    | 465 için `true`, 587 için `false` |
| SMTP_USER      | `noreply@mail.yazu.digital` (tam e-posta) |
| SMTP_PASSWORD  | Boşluksuz, uygulama şifresi gerekebilir |
| SMTP_FROM      | `Yazu.digital <noreply@mail.yazu.digital>` |

Değişiklikten sonra Vercel’de redeploy edin; env değişince yeniden deploy gerekir.

---

## Raporunuz (SMTP check) ne anlama geliyor?

- **550 "not permitted to relay"** = Sunucu kimlik doğrulama istiyor; auth olmadan gönderim yok. Bu **normal** ve doğru davranış.
- **535 "Incorrect authentication data"** = Bağlantı tamam, ama gönderdiğimiz kullanıcı adı/şifre kabul edilmiyor. Çözüm: aşağıdaki maddeler + SiteGround adımları.

Sunucunuz **SiteGround** (banner: gnldm2.siteground.biz). TLS destekli; port 465 veya 587 kullanılabilir.

---

## SiteGround (mail.yazu.digital) için ek kontroller

1. **Mailbox gerçekten var mı?**  
   SiteGround / cPanel → **Email Accounts** → `noreply@mail.yazu.digital` (veya kullandığınız adres) tanımlı olmalı. Yoksa oluşturun.

2. **Şifre o mailbox’ın şifresi**  
   SMTP_PASSWORD, bu e-posta hesabının (mailbox) şifresi olmalı. Ana SiteGround/cPanel giriş şifresi değil.  
   Gerekirse Email Accounts’ta bu hesap için “Change Password” ile yeni bir şifre belirleyin ve onu env’de kullanın.

3. **Port deneyin: 587**  
   SiteGround’da bazen 587 (STARTTLS) daha sorunsuz çalışır. Vercel’de:
   ```env
   SMTP_PORT=587
   SMTP_SECURE=false
   ```
   Deploy edip tekrar deneyin. Olmazsa 465 + `SMTP_SECURE=true` ile geri alın.

4. **SMTP_USER birebir mailbox e-postası**  
   cPanel’de gördüğünüz tam adres (örn. `noreply@mail.yazu.digital` veya `info@yazu.digital`) ile SMTP_USER’ı aynı yapın; başında/sonunda boşluk olmasın.
