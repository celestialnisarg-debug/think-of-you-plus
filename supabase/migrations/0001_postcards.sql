-- ThinkOfYou+ — postcards table, storage bucket, and public (no-auth) RLS policies.
create extension if not exists pgcrypto;

create table if not exists public.postcards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  theme text not null default 'vintage',
  title text not null default '',
  title_color text not null default '#2f6b3f',
  title_font text not null default 'serif-display',
  message text not null default '',
  to_name text not null default '',
  from_name text not null default '',
  photo_url text,
  bg text,
  stickers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.postcards enable row level security;

drop policy if exists "public insert" on public.postcards;
drop policy if exists "public select" on public.postcards;

create policy "public insert" on public.postcards for insert to anon with check (true);
create policy "public select" on public.postcards for select to anon using (true);

-- Storage bucket for uploaded photos (public read).
insert into storage.buckets (id, name, public)
values ('postcard-photos', 'postcard-photos', true)
on conflict (id) do nothing;

drop policy if exists "postcard photos public read" on storage.objects;
drop policy if exists "postcard photos anon insert" on storage.objects;

create policy "postcard photos public read" on storage.objects
  for select to anon using (bucket_id = 'postcard-photos');

create policy "postcard photos anon insert" on storage.objects
  for insert to anon with check (bucket_id = 'postcard-photos');
