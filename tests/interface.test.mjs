import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
const html=await readFile('dist/index.html','utf8'),app=await readFile('dist/app.js','utf8');
const output=await build({entryPoints:['dist/cloud.js'],bundle:true,write:false,format:'iife',define:{__SUPABASE_URL__:JSON.stringify('https://test.supabase.co'),__SUPABASE_KEY__:JSON.stringify('public-test')},plugins:[{name:'fake-auth',setup(b){b.onResolve({filter:/^@supabase\/supabase-js$/},()=>({path:'fake',namespace:'test'}));b.onLoad({filter:/.*/,namespace:'test'},()=>({contents:'export const createClient=()=>window.testClient;'}))}}]});
const cloud=output.outputFiles[0].text;
const settle=()=>new Promise(resolve=>setTimeout(resolve,30));
function backend(){const rows=[],listeners=[],operations=new Set();return {rows,client(user){return {
 auth:{onAuthStateChange(){},getSession:async()=>({data:{session:user?{user:{id:user,email:`${user}@example.test`}}:null}})},
 from(table){let id;return {select(){return this},eq(key,value){if(key==='user_id')id=value;return this},order(){return this},range:async()=>({data:structuredClone(rows)}),maybeSingle:async()=>({data:{household_id:'h',display_name:user}}),then(resolve){resolve({data:[{display_name:'a'},{display_name:'b'}]})}}},
 channel(){return {on(_type,_filter,fn){listeners.push(fn);return this},subscribe(fn){queueMicrotask(()=>fn('SUBSCRIBED'));return this}}},removeChannel:async()=>{},
 rpc:async(_name,args)=>{if(operations.has(args.operation))return {};for(const change of args.changes){const row=rows.find(r=>r.kind===change.kind&&r.item_id===change.item_id);if((row?.revision||0)!==change.expected_revision)return {error:{message:'revision_conflict'}}}for(const change of args.changes){const index=rows.findIndex(r=>r.kind===change.kind&&r.item_id===change.item_id);const value={...change,revision:(index<0?0:rows[index].revision)+1};if(index<0)rows.push(value);else rows[index]=value}operations.add(args.operation);queueMicrotask(()=>listeners.forEach(fn=>fn()));return {}}};}}}
function browser(client){const dom=new JSDOM(html,{url:'https://example.test/Householder/#mercado',runScripts:'outside-only'}),w=dom.window;w.structuredClone=structuredClone;w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};w.testObservers=[];const Observer=w.MutationObserver;w.MutationObserver=class extends Observer{constructor(callback){super(callback);w.testObservers.push(this)}};w.testClient=client;w.eval(app);w.eval(cloud);return dom;}
test('signed-out shared build hides local sample data and disables edits',async()=>{const b=browser(backend().client(null));await settle();assert.equal(b.window.document.querySelector('main').inert,true);assert.equal(b.window.Casa.snapshot().items.length,0);assert.match(b.window.document.querySelector('.sync-bar').textContent,/Entre/);b.window.testObservers.forEach(o=>o.disconnect());b.window.close()});
test('two sessions see per-item changes without full-state overwrite',async()=>{const db=backend(),a=browser(db.client('a')),b=browser(db.client('b'));await settle();const form=a.window.document.querySelector('#add-item');form.elements.name.value='Teste leite';form.dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));await settle();assert.equal(db.rows.length,1);assert.equal(b.window.Casa.snapshot().items[0].name,'Teste leite');assert.equal(a.window.document.querySelector('main').inert,false);a.window.testObservers.forEach(o=>o.disconnect());a.window.close();b.window.testObservers.forEach(o=>o.disconnect());b.window.close()});
test('delayed account response cannot restore records after sign-out',async()=>{
 const db=backend(),client=db.client('a');
 db.rows.push({kind:'items',item_id:'private',data:{id:'private',name:'Privado'},revision:1,deleted:false});
 let authEvent,resolveMember;
 client.auth.onAuthStateChange=fn=>{authEvent=fn};
 const originalFrom=client.from;
 client.from=function(table){
  const query=originalFrom.call(this,table);
  if(table==='household_members')query.maybeSingle=()=>new Promise(resolve=>{resolveMember=resolve});
  return query;
 };
 const b=browser(client);
 await settle();
 assert.equal(typeof resolveMember,'function');
 authEvent('SIGNED_OUT');
 resolveMember({data:{household_id:'h',display_name:'a'}});
 await settle();
 assert.equal(b.window.Casa.snapshot().items.length,0);
 assert.equal(b.window.document.querySelector('main').inert,true);
 assert.match(b.window.document.querySelector('.sync-bar').textContent,/Sessão encerrada/);
 b.window.testObservers.forEach(o=>o.disconnect());
 b.window.close();
});
test('stale edit keeps the shared value and exposes conflict recovery',async()=>{const db=backend();db.rows.push({kind:'items',item_id:'milk',data:{id:'milk',name:'Leite',done:false},revision:1,deleted:false});const a=browser(db.client('a'));await settle();db.rows[0].revision=2;db.rows[0].data.name='Leite atualizado';const checkbox=a.window.document.querySelector('[data-item="milk"]');checkbox.checked=true;checkbox.dispatchEvent(new a.window.Event('change',{bubbles:true}));await settle();assert.equal(db.rows[0].data.name,'Leite atualizado');assert.equal(db.rows[0].data.done,false);assert.match(a.window.document.querySelector('.sync-bar').textContent,/outro aparelho/);a.window.testObservers.forEach(o=>o.disconnect());a.window.close()});
test('profile, calendar picker, replenishment removal and owner filter are available',async()=>{
 const b=browser(backend().client('a'));await settle();
 const w=b.window,doc=w.document;try{
 assert.equal(doc.querySelector('#profile').textContent,'A');
 const data=w.Casa.snapshot();
 data.products.push({id:'p1',name:'Sabão',days:30,bought:'2026-09-01'});
 data.decks=[{id:'d1',name:'Casa',description:''}];
 data.tasks=[{id:'t1',deckId:'d1',name:'Tarefa A',owner:'a',done:false},{id:'t2',deckId:'d1',name:'Tarefa B',owner:'b',done:false}];
 w.Casa.replace(data);
 assert.ok(doc.querySelector('[data-product-delete="p1"]'));
 doc.querySelector('[data-product-delete="p1"]').click();await settle();
 assert.ok(doc.querySelector('#product-delete'));
 assert.equal(doc.querySelector('#product-edit input[name="bought"]').type,'date');
 assert.ok(doc.querySelector('.date-picker-button'));
 doc.querySelector('#dialog').close();
 w.location.hash='#planos';await settle();
 const filter=doc.querySelector('#plan-owner-filter');assert.ok(filter);
 filter.value='a';filter.dispatchEvent(new w.Event('change'));
 doc.querySelector('[data-deck-view="all"]').click();
 assert.match(doc.querySelector('main').textContent,/Tarefa A/);
 assert.doesNotMatch(doc.querySelector('main').textContent,/Tarefa B/);
 }finally{b.window.testObservers.forEach(o=>o.disconnect());b.window.close()}
});
test('returning to the app refreshes records without a page reload',async()=>{
 const db=backend(),b=browser(db.client('a'));await settle();
 try{
  db.rows.push({kind:'items',item_id:'new',data:{id:'new',name:'Atualizado no outro celular',done:false},revision:1,deleted:false});
  b.window.dispatchEvent(new b.window.Event('focus'));
  await settle();
  assert.equal(b.window.Casa.snapshot().items[0].name,'Atualizado no outro celular');
 }finally{b.window.testObservers.forEach(o=>o.disconnect());b.window.close()}
});
test('back returns from a direct section entry to Today',async()=>{
 const b=browser(backend().client('a'));await settle();
 try{
  assert.equal(b.window.location.hash,'#mercado');
  b.window.history.back();
  await new Promise(resolve=>setTimeout(resolve,80));
  assert.equal(b.window.location.hash,'#hoje');
  assert.match(b.window.document.querySelector('main h1').textContent,/Hoje/);
 }finally{b.window.testObservers.forEach(o=>o.disconnect());b.window.close()}
});
test('replenishment deletion writes a tombstone without removing purchases',async()=>{
 const db=backend();
 db.rows.push({kind:'products',item_id:'p1',data:{id:'p1',name:'Sabão',days:30},revision:1,deleted:false});
 db.rows.push({kind:'items',item_id:'i1',data:{id:'i1',name:'Sabão',track:true,done:true},revision:1,deleted:false});
 const b=browser(db.client('a'));await settle();
 try{
  b.window.document.querySelector('[data-product-delete="p1"]').click();
  b.window.document.querySelector('#product-delete').click();
  await settle();
  assert.equal(db.rows.find(row=>row.kind==='products').deleted,true);
  assert.equal(db.rows.find(row=>row.kind==='items').deleted,false);
  assert.equal(b.window.Casa.snapshot().items.length,1);
 }finally{b.window.testObservers.forEach(o=>o.disconnect());b.window.close()}
});