# Build ve Deploy – Her Güncellemede

## 1. Proje klasörüne gir

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu-digital"
```

---

## 2. Değişiklikleri commit et ve GitHub’a gönder

```bash
git add .
git commit -m "Ne yaptığını kısaca yaz"
git push
```

*(İlk kez push ediyorsan veya remote yoksa önce `GITHUB_PUSH_ADIMLAR.md` dosyasına bak.)*

---

## 3. Vercel otomatik deploy alır

GitHub’a push ettikten sonra Vercel kendi build’ini yapar ve canlıya alır. Ekstra bir şey yapmana gerek yok.

- Durumu kontrol etmek için: **Vercel Dashboard** → projen → **Deployments**
- Hata olursa aynı sayfadan log’lara bakabilirsin.

---

## Özet (kopyala-yapıştır)

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu-digital"
git add .
git commit -m "Açıklama"
git push
```

Bu kadar. Build ve deploy Vercel’de otomatik.
