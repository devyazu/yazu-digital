# Supabase Storage – brand-logos bucket

Marka logoları **brand-logos** bucket'ında saklanır. Yol: `{user_id}/{workspace_id}.{ext}`

## Bucket oluşturma

1. Supabase Dashboard → **Storage** → **New bucket**
2. Name: **brand-logos** (küçük harf)
3. Public bucket: **Evet** (logo URL'leri doğrudan kullanılsın)

## Policy'ler

Bucket oluşturduktan sonra **Policies** sekmesinde aşağıdakileri ekleyin.

### 1) Herkes logoları görebilsin (SELECT)

- **Policy name:** `Brand logos are public read`
- **Operation:** SELECT
- **Target roles:** public
- **USING:** `bucket_id = 'brand-logos'`

### 2) Kullanıcı sadece kendi klasörüne yükleyebilsin (INSERT)

- **Policy name:** `Users can upload own brand logos`
- **Operation:** INSERT
- **Target roles:** authenticated
- **WITH CHECK:** `bucket_id = 'brand-logos' AND (storage.foldername(name))[1] = auth.uid()::text`

(Yol: `userId/workspaceId.png` → ilk klasör = user_id)

### 3) Kullanıcı kendi dosyasını güncelleyebilsin (UPDATE)

- **Policy name:** `Users can update own brand logos`
- **Operation:** UPDATE
- **Target roles:** authenticated
- **USING / WITH CHECK:** `bucket_id = 'brand-logos' AND (storage.foldername(name))[1] = auth.uid()::text`

### 4) Kullanıcı kendi dosyasını silebilsin (DELETE)

- **Policy name:** `Users can delete own brand logos`
- **Operation:** DELETE
- **Target roles:** authenticated
- **USING:** `bucket_id = 'brand-logos' AND (storage.foldername(name))[1] = auth.uid()::text`
