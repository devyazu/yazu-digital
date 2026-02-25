-- Easy Email editörü JSON formatında saklamak için
alter table public.email_templates
  add column if not exists body_json text;

comment on column public.email_templates.body_json is 'Easy Email editor JSON; body_html send mail için kullanılır.';
