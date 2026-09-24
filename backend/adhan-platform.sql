-- Applied via Supabase MCP. Public participation; no reward payouts are configured.
create table public.adhan_recordings (
 id uuid primary key default gen_random_uuid(),
 user_id uuid default auth.uid() references auth.users(id) on delete cascade,
 display_name text not null check (length(trim(display_name)) between 2 and 60),
 contact_phone text check (contact_phone is null or contact_phone ~ '^\+[1-9][0-9]{7,14}$'),
 title text not null check (length(trim(title)) between 2 and 100),
 object_path text not null unique,
 created_at timestamptz not null default now()
);
create index adhan_recordings_timeline on public.adhan_recordings(created_at,id);
create index adhan_recordings_owner on public.adhan_recordings(user_id);
create table public.adhan_likes (
 recording_id uuid not null references public.adhan_recordings(id) on delete cascade,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 primary key(recording_id,user_id)
);
create index adhan_likes_owner on public.adhan_likes(user_id);
alter table public.adhan_recordings enable row level security;
alter table public.adhan_likes enable row level security;
revoke all on public.adhan_recordings,public.adhan_likes from anon,authenticated;
grant select(id,user_id,display_name,title,object_path,created_at) on public.adhan_recordings to anon,authenticated;
grant select on public.adhan_likes to anon,authenticated;
grant insert(display_name,title,object_path,contact_phone) on public.adhan_recordings to anon;
grant insert(display_name,title,object_path),delete on public.adhan_recordings to authenticated;
grant insert(recording_id),delete on public.adhan_likes to authenticated;
create policy adhan_read on public.adhan_recordings for select to anon,authenticated using(true);
create policy adhan_publish on public.adhan_recordings for insert to authenticated with check (
 user_id=(select auth.uid())
 and object_path like user_id::text || '/%'
 and exists(select 1 from storage.objects o where o.bucket_id='adhan-community' and o.name=object_path and o.owner_id=user_id::text)
);
create policy adhan_publish_public on public.adhan_recordings for insert to anon with check (
 user_id is null
 and contact_phone ~ '^\+[1-9][0-9]{7,14}$'
 and object_path ~ '^public/(adhan|recitation|dua)/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
);
create policy adhan_remove on public.adhan_recordings for delete to authenticated using(user_id=(select auth.uid()));
-- Only opaque account IDs are exposed for aggregation; no email or auth records.
create policy adhan_likes_read on public.adhan_likes for select to anon,authenticated using(true);
create policy adhan_like on public.adhan_likes for insert to authenticated with check(user_id=(select auth.uid()));
create policy adhan_unlike on public.adhan_likes for delete to authenticated using(user_id=(select auth.uid()));
create view public.adhan_feed with (security_invoker=true) as
 select r.id,r.user_id,r.display_name,r.title,r.object_path,r.created_at,count(l.user_id)::integer as likes,
 coalesce(bool_or(l.user_id=(select auth.uid())),false) as liked
 from public.adhan_recordings r left join public.adhan_likes l on l.recording_id=r.id group by r.id;
grant select on public.adhan_feed to anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('adhan-community','adhan-community',true,8388608,array['audio/mpeg','audio/mp4','audio/x-m4a','audio/wav','audio/x-wav','audio/webm','audio/ogg','audio/aac']);
create policy adhan_audio_upload on storage.objects for insert to authenticated with check(bucket_id='adhan-community' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy adhan_audio_upload_public on storage.objects for insert to anon with check(
 bucket_id='adhan-community'
 and (storage.foldername(name))[1]='public'
 and (storage.foldername(name))[2] in ('adhan','recitation','dua')
 and storage.filename(name) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
);
create policy adhan_audio_owner_read on storage.objects for select to authenticated using(bucket_id='adhan-community' and owner_id=(select auth.uid())::text);
create policy adhan_audio_remove on storage.objects for delete to authenticated using(bucket_id='adhan-community' and owner_id=(select auth.uid())::text);
