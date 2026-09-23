import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`);
await db.exec(await readFile('supabase/migrations/202609210001_households.sql','utf8'));
await db.exec(await readFile('supabase/migrations/202609230001_atomic_import.sql','utf8'));
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',c='00000000-0000-4000-8000-000000000003';
await db.query('insert into auth.users values ($1),($2),($3)',[a,b,c]);
async function asUser(id,sql,params=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role authenticated');return db.query(sql,params);}
let house,other;
test('owner creates a private household and a second user joins once',async()=>{
 house=(await asUser(a,'select public.create_household($1,$2) id',['Casa','Diego'])).rows[0].id;
 const token=(await asUser(a,'select public.create_household_invite() token')).rows[0].token;
 assert.equal((await asUser(b,'select public.join_household($1,$2) id',[token,'Esposa'])).rows[0].id,house);
 await assert.rejects(asUser(c,'select public.join_household($1,$2)',[token,'Terceiro']),/invalid_invite/);
 await assert.rejects(asUser(a,'select public.create_household_invite()'),/household_full/);
 other=(await asUser(c,'select public.create_household($1,$2) id',['Outra casa','Outra pessoa'])).rows[0].id;
});
const op='10000000-0000-4000-8000-000000000001';
const item={kind:'items',item_id:'milk',data:{id:'milk',name:'Leite',done:false},expected_revision:0,deleted:false};
test('RLS and write permissions isolate households and anonymous users',async()=>{
 await asUser(a,'select public.apply_household_changes($1,$2,$3)',[house,op,JSON.stringify([item])]);
 assert.equal((await asUser(b,'select * from public.household_records')).rows.length,1);
 assert.equal((await asUser(c,'select * from public.household_records')).rows.length,0);
 assert.equal((await asUser(c,'select * from public.household_members')).rows.length,1);
 await assert.rejects(asUser(c,'select public.apply_household_changes($1,$2,$3)',[house,crypto.randomUUID(),JSON.stringify([item])]),/access_denied/);
 await assert.rejects(asUser(b,'delete from public.household_members'),/permission denied/);
 await assert.rejects(asUser(b,'update public.household_records set revision=99'),/permission denied/);
 await db.exec('reset role; set role anon');
 await assert.rejects(db.query('select * from public.household_records'),/permission denied/);
 await assert.rejects(db.query('select public.create_household($1,$2)',['Bad','Bad']),/permission denied/);
});
test('retries are idempotent, stale writes conflict, batches roll back',async()=>{
 await asUser(a,'select public.apply_household_changes($1,$2,$3)',[house,op,JSON.stringify([item])]);
 assert.equal((await asUser(a,'select revision from public.household_records')).rows[0].revision,1);
 await assert.rejects(asUser(b,'select public.apply_household_changes($1,$2,$3)',[house,op,JSON.stringify([item])]),/operation_mismatch/);
 const changed={...item,expected_revision:1,data:{...item.data,done:true}};
 await asUser(b,'select public.apply_household_changes($1,$2,$3)',[house,crypto.randomUUID(),JSON.stringify([changed])]);
 await assert.rejects(asUser(a,'select public.apply_household_changes($1,$2,$3)',[house,crypto.randomUUID(),JSON.stringify([{...item,item_id:'bread',data:{id:'bread',name:'Pão'}},changed])]),/revision_conflict/);
 const rows=(await asUser(a,'select * from public.household_records')).rows;
 assert.equal(rows.length,1);assert.equal(rows[0].revision,2);assert.equal(rows[0].data.done,true);
});
test('tombstones stop stale resurrection after delete',async()=>{
 await asUser(a,'select public.apply_household_changes($1,$2,$3)',[house,crypto.randomUUID(),JSON.stringify([{...item,expected_revision:2,deleted:true,data:null}])]);
 await assert.rejects(asUser(b,'select public.apply_household_changes($1,$2,$3)',[house,crypto.randomUUID(),JSON.stringify([{...item,expected_revision:2}])]),/revision_conflict/);
 assert.equal((await asUser(b,'select deleted from public.household_records')).rows[0].deleted,true);
});
test('import accepts one empty-house batch, replays it, and rejects a different batch',async()=>{
 const first=crypto.randomUUID(),second=crypto.randomUUID();
 const milk={...item,item_id:'import-milk',data:{id:'import-milk',name:'Leite'}};
 const bread={...item,item_id:'import-bread',data:{id:'import-bread',name:'Pao'}};
 await asUser(c,'select public.import_household_changes($1,$2,$3)',[other,first,JSON.stringify([milk])]);
 await asUser(c,'select public.import_household_changes($1,$2,$3)',[other,first,JSON.stringify([milk])]);
 await assert.rejects(asUser(c,'select public.import_household_changes($1,$2,$3)',[other,second,JSON.stringify([bread])]),/house_not_empty/);
 await assert.rejects(asUser(a,'select public.import_household_changes($1,$2,$3)',[other,crypto.randomUUID(),JSON.stringify([bread])]),/access_denied/);
 const rows=(await asUser(c,'select item_id,revision from public.household_records where household_id=$1',[other])).rows;
 assert.deepEqual(rows,[{item_id:'import-milk',revision:1}]);
});
after(()=>db.close());
