-- v2: replace themes/stickers with a chosen stamp + flower.
alter table public.postcards add column if not exists stamp text not null default 's2';
alter table public.postcards add column if not exists flower text not null default 'f1';

-- Legacy columns from v1 are no longer written; keep them nullable so old rows survive.
alter table public.postcards alter column theme drop not null;
alter table public.postcards alter column title_font drop not null;
