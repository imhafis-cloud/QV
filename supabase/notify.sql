-- Emails info@qintarventures.com whenever a call back request is submitted.
-- Run AFTER schema.sql and AFTER you have stored your Resend key (see step 2 below).
--
-- Step 1 (once): in Resend, verify the domain qintarventures.com and create an API key.
-- Step 2 (once, in the Supabase SQL Editor, NOT in this repo): store the key privately:
--     select vault.create_secret('PASTE_YOUR_RESEND_KEY_HERE', 'resend_api_key');
-- Step 3: run this whole file.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_callback_request()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'resend_api_key';
  if k is null then
    return new;
  end if;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || k),
    body    := jsonb_build_object(
      'from',     'Qintar Website <alerts@qintarventures.com>',
      'to',       jsonb_build_array('info@qintarventures.com'),
      'reply_to', new.email,
      'subject',  'Call back request: ' || regexp_replace(new.name, '[\r\n]+', ' ', 'g'),
      'text',     E'New call back request\n\n'
                  || 'Name: '    || new.name  || E'\n'
                  || 'Phone: '   || new.phone || E'\n'
                  || 'Email: '   || new.email || E'\n\n'
                  || E'Message:\n' || new.message || E'\n\n'
                  || 'Received: ' || to_char(new.created_at at time zone 'Asia/Dubai', 'DD Mon YYYY HH24:MI') || ' (Dubai)'
    )
  );
  return new;
exception when others then
  -- an email problem must never block a visitor's request from being saved
  return new;
end;
$$;

revoke all on function public.notify_callback_request() from public, anon, authenticated;

drop trigger if exists callback_requests_notify on public.callback_requests;
create trigger callback_requests_notify
  after insert on public.callback_requests
  for each row execute function public.notify_callback_request();
