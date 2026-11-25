-- Wall schema: one posts table, public read and insert, realtime, and a photo bucket.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default 'Anonymous'
    check (char_length(trim(author_name)) between 1 and 50),
  message text not null
    check (char_length(trim(message)) between 1 and 280),
  -- Storage path inside the wall-photos bucket, e.g. "<uuid>.jpg". Paths, not URLs,
  -- so nobody can point the feed at an image hosted somewhere else.
  photo_path text
    check (photo_path ~ '^[0-9a-f-]{36}\.(jpg|png|webp|gif)$'),
  created_at timestamptz not null default now()
);

create index posts_created_at_idx on public.posts (created_at desc);

-- Anyone may read and add posts. There are no update or delete policies, so posts can't be edited or removed.
alter table public.posts enable row level security;

create policy "Anyone can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

create policy "Anyone can add a post"
  on public.posts for insert
  to anon, authenticated
  with check (true);

-- Broadcast new rows to subscribed browsers.
alter publication supabase_realtime add table public.posts;

-- Public bucket for photos: images only, up to 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wall-photos', 'wall-photos', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

create policy "Anyone can upload wall photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'wall-photos');
