-- Applied via Supabase MCP. Extends the existing public community platform.
-- Migration: audio_platform_categories
alter table public.adhan_recordings
  add column audio_kind text not null default 'adhan';

alter table public.adhan_recordings
  add constraint adhan_recordings_audio_kind_check
  check (audio_kind in ('adhan','recitation','dua'));

create index adhan_recordings_kind_timeline
  on public.adhan_recordings(audio_kind,created_at,id);

grant insert(display_name,title,object_path,audio_kind)
  on public.adhan_recordings to authenticated;

-- Migration: audio_platform_feed_category
-- Keep the original view columns in place and append the category for clients.
create or replace view public.adhan_feed with (security_invoker=true) as
 select r.id,r.user_id,r.display_name,r.title,r.object_path,r.created_at,
        count(l.user_id)::integer as likes,
        coalesce(bool_or(l.user_id=(select auth.uid())),false) as liked,
        r.audio_kind
 from public.adhan_recordings r
 left join public.adhan_likes l on l.recording_id=r.id
 group by r.id;

grant select on public.adhan_feed to anon,authenticated;

-- Migration: audio_platform_phone_guest_login
-- Phone-only participation uses Supabase anonymous users and stores the typed
-- phone as unverified metadata in the browser session.
drop policy if exists adhan_publish on public.adhan_recordings;
create policy adhan_publish
  on public.adhan_recordings
  for insert to authenticated
  with check (
    user_id=(select auth.uid())
    and object_path like user_id::text || '/%'
    and exists(
      select 1
      from storage.objects o
      where o.bucket_id='adhan-community'
        and o.name=object_path
        and o.owner_id=user_id::text
    )
  );

drop policy if exists adhan_like on public.adhan_likes;
create policy adhan_like
  on public.adhan_likes
  for insert to authenticated
  with check(user_id=(select auth.uid()));

drop policy if exists adhan_audio_upload on storage.objects;
create policy adhan_audio_upload
  on storage.objects
  for insert to authenticated
  with check(
    bucket_id='adhan-community'
    and (storage.foldername(name))[1]=(select auth.uid())::text
  );

-- Migration: audio_platform_public_phone_publish
-- Publishing no longer creates a Supabase Auth session. The phone is stored for
-- follow-up contact only and is not exposed through the public feed view.
alter table public.adhan_recordings
  alter column user_id drop not null;

alter table public.adhan_recordings
  add column if not exists contact_phone text;

alter table public.adhan_recordings
  drop constraint if exists adhan_recordings_contact_phone_check;

alter table public.adhan_recordings
  add constraint adhan_recordings_contact_phone_check
  check (contact_phone is null or contact_phone ~ '^\+[1-9][0-9]{7,14}$');

revoke select on public.adhan_recordings from anon,authenticated;
grant select(id,user_id,display_name,title,object_path,created_at,audio_kind)
  on public.adhan_recordings to anon,authenticated;

grant insert(display_name,title,object_path,audio_kind,contact_phone)
  on public.adhan_recordings to anon;

grant insert(display_name,title,object_path,audio_kind,contact_phone)
  on public.adhan_recordings to authenticated;

drop policy if exists adhan_publish_public on public.adhan_recordings;
create policy adhan_publish_public
  on public.adhan_recordings
  for insert to anon
  with check (
    user_id is null
    and contact_phone ~ '^\+[1-9][0-9]{7,14}$'
    and audio_kind in ('adhan','recitation','dua')
    and object_path ~ '^public/(adhan|recitation|dua)/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and object_path = ('public/' || audio_kind || '/' || split_part(object_path,'/',3))
  );

drop policy if exists adhan_audio_upload_public on storage.objects;
create policy adhan_audio_upload_public
  on storage.objects
  for insert to anon
  with check(
    bucket_id='adhan-community'
    and (storage.foldername(name))[1]='public'
    and (storage.foldername(name))[2] in ('adhan','recitation','dua')
    and storage.filename(name) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  );
