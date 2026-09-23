select
 (select count(*) from public.household_records) as record_count,
 (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname in ('households','household_members','household_records')) as public_table_count,
 (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname in ('households','household_members','household_records')
   and c.relrowsecurity) as rls_table_count,
 to_regprocedure('public.import_household_changes(uuid,uuid,jsonb)') is not null as import_rpc,
 has_function_privilege('authenticated','public.import_household_changes(uuid,uuid,jsonb)','execute') as import_granted,
 exists(select 1 from pg_publication_tables
  where pubname='supabase_realtime' and schemaname='public' and tablename='household_records') as realtime_records;
