-- E-posta şablonları: admin panelden yönetilecek, tetikleyicilerle gönderilecek
create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  subject text not null,
  body_html text not null default '',
  from_name text,
  recipient_type text not null check (recipient_type in ('user', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.email_templates enable row level security;

-- Sadece admin (service_role veya admin_users üzerinden) erişir; anon policy yok.
-- API service_role ile kullanacak. Admin paneli kendi API'si ile.

create index if not exists idx_email_templates_slug on public.email_templates(slug);
create index if not exists idx_email_templates_recipient on public.email_templates(recipient_type);

-- Varsayılan şablonlar (seed)
insert into public.email_templates (slug, name, description, subject, body_html, from_name, recipient_type, is_active)
values
  (
    'signup_confirm',
    'Kayıt onay maili',
    'Kullanıcı kayıt olduktan sonra e-posta onay linki',
    'E-postanızı onaylayın - Yazu.digital',
    '<p>Merhaba,</p><p>Yazu.digital hesabınızı oluşturdunuz. E-postanızı onaylamak için aşağıdaki bağlantıya tıklayın:</p><p><a href="{{confirm_link}}">E-postamı onayla</a></p><p>Bu link 24 saat geçerlidir. 3 saat içinde onaylamazsanız hesabınız kullanıma kapanacaktır.</p><p>— Yazu.digital</p>',
    'Yazu.digital',
    'user',
    true
  ),
  (
    'welcome',
    'Hoş geldin maili',
    'E-posta onayı sonrası kullanıcıya gönderilir',
    'Hesabınız hazır - Yazu.digital',
    '<p>Merhaba{{#user_name}} {{user_name}}{{/user_name}},</p><p>E-postanızı onayladığınız için teşekkürler. Artık Yazu.digital paneline giriş yapabilirsiniz.</p><p><a href="{{site_url}}">Panele git</a></p><p>— Yazu.digital</p>',
    'Yazu.digital',
    'user',
    true
  ),
  (
    'admin_new_signup',
    'Admin: Yeni kayıt bildirimi',
    'Yeni kullanıcı kaydolduğunda admin e-postasına gider',
    'Yeni kullanıcı kaydoldu - Yazu.digital',
    '<p>Yeni bir kullanıcı kayıt oldu.</p><p>E-posta: {{new_user_email}}</p><p>Kayıt tarihi: {{signed_up_at}}</p><p>— Yazu.digital Admin</p>',
    'Yazu.digital',
    'admin',
    true
  ),
  (
    'admin_email_confirmed',
    'Admin: E-posta onayı bildirimi',
    'Kullanıcı e-postasını onayladığında admin e-postasına gider',
    'Kullanıcı e-postasını onayladı - Yazu.digital',
    '<p>Bir kullanıcı e-posta adresini onayladı.</p><p>E-posta: {{user_email}}</p><p>Onay tarihi: {{confirmed_at}}</p><p>— Yazu.digital Admin</p>',
    'Yazu.digital',
    'admin',
    true
  )
on conflict (slug) do nothing;
