# GitHub'a Push – Adım Adım

## 1. Proje klasörüne gir

Terminal’i aç ve proje klasörüne geç:

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu-digital"
```

---

## 2. Git kurulu mu kontrol et

```bash
git --version
```

Çıktı gelmezse [git’i yükle](https://git-scm.com/downloads).

---

## 3. Henüz Git kullanmıyorsan: repo’yu başlat

Sadece bu projede hiç `git init` yapmadıysan:

```bash
git init
```

Zaten repo ise bu adımı atla.

---

## 4. GitHub’da yeni repo oluştur

1. https://github.com/new adresine git
2. **Repository name:** örn. `yazu-digital`
3. **Public** seç
4. **“Add a README file”** işaretleme (zaten projede dosyalar var)
5. **Create repository**’e tıkla

Oluşan sayfada şuna benzer bir adres görürsün:  
`https://github.com/KULLANICI_ADIN/yazu-digital.git`

---

## 5. Tüm dosyaları ekle ve ilk commit’i at

```bash
git add .
git commit -m "İlk commit: Yazu.digital projesi"
```

(Eğer “Author identity unknown” uyarısı çıkarsa önce şunu yaz:  
`git config user.email "senin@email.com"`  
`git config user.name "Adın Soyadın"`  
sonra tekrar `git commit -m "..."`)

---

## 6. GitHub’ı “remote” olarak ekle

GitHub’daki repo adresini kullan (KULLANICI_ADIN ve REPO_ADI kendi bilgilerinle değiştir):

```bash
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
```

Örnek:

```bash
git remote add origin https://github.com/engindemirci/yazu-digital.git
```

Zaten `origin` eklediysen ve adresi değiştirmek istiyorsan:

```bash
git remote set-url origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
```

---

## 7. Ana branch’i main yap (gerekirse)

```bash
git branch -M main
```

---

## 8. İlk kez push et

```bash
git push -u origin main
```

GitHub kullanıcı adı ve şifre (veya Personal Access Token) isteyebilir. Şifre kapalıysa **Settings → Developer settings → Personal access tokens** ile token oluşturup onu kullan.

---

## Sonraki güncellemelerde (her seferinde)

Değişiklik yaptıktan sonra:

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu-digital"
git add .
git commit -m "Kısa açıklama: ne değişti"
git push
```

Bu kadar. Push’tan sonra Vercel (repo’ya bağlıysa) otomatik deploy alır.
