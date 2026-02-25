# Admin paneli kurulumu

Admin girişi **sadece** **https://app.yazu.digital/admin** adresinden yapılır. Normal kullanıcı panelinde admin linki veya butonu **yoktur**.

## Adımlar

1. **Tablo oluştur:** Supabase → **SQL Editor** → **supabase/migrations/002_admin_users.sql** dosyasının içeriğini yapıştırıp **Run** de.

2. **Kendi e-postanı admin yap:** Önce uygulamada (https://app.yazu.digital) bu e-posta ile **kayıt ol** (veya zaten kayıtlıysan giriş yapabiliyor ol). Sonra Supabase → **SQL Editor**'de aşağıdaki komutu çalıştır; `senin@email.com` kısmını **kendi admin e-postan** ile değiştir:

   ```sql
   insert into public.admin_users (email) values ('senin@email.com')
     on conflict (email) do nothing;
   ```

3. **Admin girişi:** Tarayıcıda **https://app.yazu.digital/admin** adresine git. Aynı e-posta ve şifre ile giriş yap. Admin paneli açılır.

Şifre, normal uygulama kayıt/girişinde kullandığın şifredir; ayrı bir “admin şifresi” yok.
