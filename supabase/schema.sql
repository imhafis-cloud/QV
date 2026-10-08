-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- Visitors can submit requests but cannot read, change or delete anything.
-- You read the requests in Table Editor (dashboard), which bypasses these rules.

create table if not exists public.callback_requests (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null check (phone ~ '^[0-9+() .-]{7,25}$'),
  email      text not null check (char_length(email) <= 200 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  message    text not null check (char_length(message) between 1 and 2000),
  source     text check (char_length(source) <= 300),
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes      text
);

alter table public.callback_requests enable row level security;

revoke all on public.callback_requests from anon, authenticated;
grant insert on public.callback_requests to anon;

drop policy if exists "Anyone can submit a request" on public.callback_requests;
create policy "Anyone can submit a request"
  on public.callback_requests
  for insert
  to anon
  with check (status = 'new' and notes is null);
