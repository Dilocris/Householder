-- Apply after 202609210001_households.sql. The lock also guards normal writes.
create function public.import_household_changes(house uuid, operation uuid, changes jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare existing private.operations%rowtype;
begin
 if not public.is_household_member(house) then raise exception 'access_denied'; end if;
 if operation is null then raise exception 'operation_required'; end if;
 perform pg_advisory_xact_lock(hashtextextended(house::text,0));
 select * into existing from private.operations where household_id=house and operation_id=operation;
 if found then
  perform public.apply_household_changes(house,operation,changes);
  return;
 end if;
 if exists(select 1 from public.household_records where household_id=house) then raise exception 'house_not_empty'; end if;
 perform public.apply_household_changes(house,operation,changes);
end $$;
revoke all on function public.import_household_changes(uuid,uuid,jsonb) from public;
grant execute on function public.import_household_changes(uuid,uuid,jsonb) to authenticated;
