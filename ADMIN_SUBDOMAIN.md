# Admin paneli ayrı subdomain (admin.yazu.digital)

Admin paneli artık **admin.yazu.digital** adresinde açılıyor. Böylece:
- **app.yazu.digital** → Normal kullanıcı paneli (bir oturum)
- **admin.yazu.digital** → Yönetici paneli (ayrı oturum)

Aynı anda iki sekmede farklı hesaplar açık kalabilir (biri kullanıcı, biri admin).

---

## Vercel’de yapman gerekenler

1. **Vercel Dashboard** → **yazu-digital** projesi → **Settings** → **Domains**
2. **Add** ile yeni domain ekle: **admin.yazu.digital**
3. DNS’te bu adresin **Vercel’e yönlendiğinden** emin ol:
   - Vercel, eklediğinde genelde **CNAME** önerir: `cname.vercel-dns.com` (veya projeye özel bir adres).  
   - Domain sağlayıcında (GoDaddy, Cloudflare, vb.) **admin.yazu.digital** için CNAME kaydı ekle ve Vercel’in verdiği hedefe yönlendir.

Aynı Vercel projesine eklendiği için **app.yazu.digital** ve **admin.yazu.digital** aynı build’i kullanır; ekstra deploy gerekmez.

---

## Nasıl çalışıyor?

- Adres **admin.yazu.digital** ise → Uygulama doğrudan admin giriş/panel ekranını gösterir. Oturum bu domain’e özel (localStorage ayrı).
- Adres **app.yazu.digital** ise → Normal Yazu paneli açılır.
- **localhost**’ta `/admin` path’i hâlâ çalışır (geliştirme için).

---

## Özet

| Adres | Görünen |
|-------|--------|
| https://app.yazu.digital | Kullanıcı paneli |
| https://admin.yazu.digital | Admin paneli (ayrı oturum) |
| http://localhost:5173/admin | Admin paneli (geliştirme) |

"Exit to App" admin panelinde **app.yazu.digital**’e gider.
