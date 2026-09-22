-- One household per account for this release. All mutations use checked RPCs.
create schema if not exists private;
revoke all on schema private from public;
create table public.households (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(name) between 1 and 80),
 owner_id uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
create table public.household_members (
 user_id uuid primary key references auth.users(id),
 household_id uuid not null references public.households(id) on delete cascade,
 display_name text not null check(length(display_name) between 1 and 60),
 unique(household_id,display_name)
);
create table private.invitations (
 token uuid primary key default gen_random_uuid(),
 household_id uuid not null unique references public.households(id) on delete cascade,
 expires_at timestamptz not null default now()+interval '24 hours'
);
create table public.household_records (
 household_id uuid not null references public.households(id) on delete cascade,
 kind text not null check(kind in ('items','bills','tasks','products','decks','localEvents','messages','contacts','recurringBills','marketCategories','categories')),
 item_id text not null check(length(item_id) between 1 and 200),
 data jsonb,
 revision bigint not null default 1,
 deleted boolean not null default false,
 updated_by uuid not null references auth.users(id),
 updated_at timestamptz not null default now(),
 primary key(household_id,kind,item_id),
 check(deleted or data is not null),
 check(octet_length(data::text) <= 65536)
);
create table private.operations (
 household_id uuid not null references public.households(id) on delete cascade,
 operation_id uuid not null,
 user_id uuid not null references auth.users(id),
 payload jsonb not null,
 created_at timestamptz not null default now(),
 primary key(household_id,operation_id)
);
create function public.is_household_member(house uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.household_members where user_id=auth.uid() and household_id=house)
$$;
revoke all on function public.is_household_member(uuid) from public;
grant execute on function public.is_household_member(uuid) to authenticated;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.household_records enable row level security;
create policy household_read on public.households for select to authenticated using(public.is_household_member(id));
create policy member_read on public.household_members for select to authenticated using(public.is_household_member(household_id));
create policy records_read on public.household_records for select to authenticated using(public.is_household_member(household_id));
revoke all on public.households, public.household_members, public.household_records from anon,authenticated;
grant select on public.households, public.household_members, public.household_records to authenticated;

create function public.create_household(house_name text, member_name text) returns uuid
language plpgsql security definer set search_path='' as $$
declare house uuid;
begin
 if auth.uid() is null then raise exception 'authentication_required'; end if;
 if exists(select 1 from public.household_members where user_id=auth.uid()) then raise exception 'already_member'; end if;
 insert into public.households(name,owner_id) values(trim(house_name),auth.uid()) returning id into house;
 insert into public.household_members values(auth.uid(),house,trim(member_name));
 return house;
end $$;
create function public.create_household_invite() returns uuid
language plpgsql security definer set search_path='' as $$
declare house uuid; code uuid;
begin
 select h.id into house from public.households h where h.owner_id=auth.uid();
 if house is null then raise exception 'owner_required'; end if;
 perform pg_advisory_xact_lock(hashtextextended(house::text,0));
 if (select count(*) from public.household_members where household_id=house)>=2 then raise exception 'household_full'; end if;
 insert into private.invitations(household_id) values(house)
 on conflict(household_id) do update set token=gen_random_uuid(),expires_at=now()+interval '24 hours'
 returning token into code;
 return code;
end $$;
create function public.join_household(invite_token uuid, member_name text) returns uuid
language plpgsql security definer set search_path='' as $$
declare house uuid;
begin
 if auth.uid() is null then raise exception 'authentication_required'; end if;
 select household_id into house from private.invitations where token=invite_token and expires_at>now();
 if house is null then raise exception 'invalid_invite'; end if;
 perform pg_advisory_xact_lock(hashtextextended(house::text,0));
 -- Recheck after the lock to prevent reuse by concurrent requests.
 if not exists(select 1 from private.invitations where token=invite_token and expires_at>now()) then raise exception 'invalid_invite'; end if;
 if (select count(*) from public.household_members where household_id=house)>=2 then raise exception 'household_full'; end if;
 insert into public.household_members values(auth.uid(),house,trim(member_name));
 delete from private.invitations where household_id=house;
 return house;
end $$;
create function public.apply_household_changes(house uuid, operation uuid, changes jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare change jsonb; current_revision bigint; existing private.operations%rowtype;
begin
 if not public.is_household_member(house) then raise exception 'access_denied'; end if;
 if operation is null then raise exception 'operation_required'; end if;
 if jsonb_typeof(changes)<>'array' or jsonb_array_length(changes)>1000 or octet_length(changes::text)>2000000 then raise exception 'invalid_batch'; end if;
 perform pg_advisory_xact_lock(hashtextextended(house::text,0));
 select * into existing from private.operations where household_id=house and operation_id=operation;
 if found then
  if existing.user_id<>auth.uid() or existing.payload<>changes then raise exception 'operation_mismatch'; end if;
  return;
 end if;
 for change in select * from jsonb_array_elements(changes) loop
  if change->>'kind' in ('categories','marketCategories') then
   if not coalesce((change->>'deleted')::boolean,false) and (jsonb_typeof(change->'data')<>'string' or change->>'data'<>change->>'item_id') then raise exception 'invalid_record'; end if;
  elsif not coalesce((change->>'deleted')::boolean,false) then
   if jsonb_typeof(change->'data')<>'object' then raise exception 'invalid_record'; end if;
   if change->>'kind'<>'contacts' and ((change->'data'->>'id') is distinct from change->>'item_id' or change->>'item_id' !~ '^[a-zA-Z0-9_-]{1,200}$') then raise exception 'invalid_record'; end if;
  end if;
  select revision into current_revision from public.household_records where household_id=house and kind=change->>'kind' and item_id=change->>'item_id';
  if coalesce(current_revision,0) is distinct from (change->>'expected_revision')::bigint then raise exception 'revision_conflict' using errcode='40001'; end if;
  insert into public.household_records(household_id,kind,item_id,data,revision,deleted,updated_by)
  values(house,change->>'kind',change->>'item_id',change->'data',coalesce(current_revision,0)+1,coalesce((change->>'deleted')::boolean,false),auth.uid())
  on conflict(household_id,kind,item_id) do update set data=excluded.data,revision=excluded.revision,deleted=excluded.deleted,updated_by=excluded.updated_by,updated_at=now();
 end loop;
 insert into private.operations(household_id,operation_id,user_id,payload) values(house,operation,auth.uid(),changes);
end $$;
revoke all on function public.create_household(text,text),public.create_household_invite(),public.join_household(uuid,text),public.apply_household_changes(uuid,uuid,jsonb) from public;
grant execute on function public.create_household(text,text),public.create_household_invite(),public.join_household(uuid,text),public.apply_household_changes(uuid,uuid,jsonb) to authenticated;
-- Supabase provides this publication. Local SQL tests omit replication.
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  alter publication supabase_realtime add table public.household_records;
 end if;
end $$;