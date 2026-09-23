select
 to_regclass('public.households') is not null as households,
 to_regclass('public.household_members') is not null as members,
 to_regclass('public.household_records') is not null as records,
 to_regprocedure('public.apply_household_changes(uuid,uuid,jsonb)') is not null as write_rpc,
 to_regprocedure('public.import_household_changes(uuid,uuid,jsonb)') is not null as import_rpc,
 exists(
  select 1 from pg_publication_tables
  where pubname='supabase_realtime'
   and schemaname='public'
   and tablename='household_records'
 ) as realtime_records;
