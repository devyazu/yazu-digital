# Supabase Storage – avatars bucket policy’leri (baştan kurulum)

Bucket’taki **tüm policy’leri sildikten sonra** aşağıdakileri sırayla ekle.  
Bucket adı: **avatars** (küçük harf). Farklıysa her yerde `avatars` yerine kendi bucket adını yaz.

---

## 1) Herkes avatar’ları görebilsin (SELECT – public read)

- **Policy name:** `Avatar files are public read`
- **Allowed operation:** **SELECT** (Read)
- **Target roles:** `public` (veya "All users" / hepsini seç)
- **USING expression** (Policy definition kutusuna yapıştır):

```sql
bucket_id = 'avatars'
```

- **WITH CHECK:** boş bırak (SELECT’te gerekmez)
- **Save** / **Create policy**

---

## 2) Giriş yapan kullanıcı sadece kendi klasörüne yükleyebilsin (INSERT)

- **Policy name:** `Users can upload own avatar`
- **Allowed operation:** **INSERT** (Create)
- **Target roles:** `authenticated`
- **USING expression:** boş bırak (INSERT’te genelde USING yok)
- **WITH CHECK expression** (Varsa “With check” / “Check” kutusuna yapıştır):

```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

- **Save** / **Create policy**

Açıklama: Dosya yolu `userId/avatar.jpg` gibi olmalı; `(storage.foldername(name))[1]` ilk klasör adı = kullanıcı id’si.

---

## 3) Giriş yapan kullanıcı sadece kendi dosyasını güncelleyebilsin (UPDATE)

- **Policy name:** `Users can update own avatar`
- **Allowed operation:** **UPDATE**
- **Target roles:** `authenticated`
- **USING expression:**

```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

- **WITH CHECK expression** (varsa, USING ile aynı yaz):

```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

- **Save** / **Create policy**

---

## 4) Giriş yapan kullanıcı sadece kendi dosyasını silebilsin (DELETE)

- **Policy name:** `Users can delete own avatar`
- **Allowed operation:** **DELETE**
- **Target roles:** `authenticated`
- **USING expression:**

```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

- **WITH CHECK:** boş bırak (DELETE’te genelde yok)
- **Save** / **Create policy**

---

## Özet tablo

| Sıra | Policy name                     | Operation | Target roles   | USING | WITH CHECK |
|------|---------------------------------|-----------|----------------|--------|------------|
| 1    | Avatar files are public read    | SELECT    | public         | `bucket_id = 'avatars'` | – |
| 2    | Users can upload own avatar     | INSERT    | authenticated  | –      | `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text` |
| 3    | Users can update own avatar     | UPDATE    | authenticated  | Aynı ifade (aşağıda) | Aynı ifade |
| 4    | Users can delete own avatar     | DELETE    | authenticated  | Aynı ifade | – |

**Ortak ifade (UPDATE ve DELETE USING; INSERT WITH CHECK):**

```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

---

## Supabase arayüzünde kısa yol

1. **Storage** → **avatars** bucket’ına gir.
2. **Policies** sekmesi → **New policy**.
3. "For full customization" / "Use SQL" / "Custom" seç.
4. **Policy name** yaz, **Operation** seç (SELECT / INSERT / UPDATE / DELETE), **Role** seç (public veya authenticated).
5. **USING** ve gerekiyorsa **WITH CHECK** kutularına yukarıdaki ifadeleri yapıştır.
6. **Review** → **Save**.

Hepsi bittikten sonra toplam **4 policy** olmalı; fazla veya isimleri karışık olan eski policy’leri silmiş olacaksın.
