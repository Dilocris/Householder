import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

const source=await readFile('dist/google-calendar.js','utf8');
const settle=()=>new Promise(resolve=>setTimeout(resolve,20));
function setup(clientId){
 const dom=new JSDOM('<!doctype html><form id="settings"></form>',{url:'https://dilocris.github.io/Householder/',runScripts:'outside-only'});
 const w=dom.window,received=[];
 w.Casa={setGoogleEvents:value=>received.push(value)};
 let requests=0,calls=[];
 w.google={accounts:{oauth2:{initTokenClient:options=>({requestAccessToken:()=>{requests++;options.callback({access_token:'temporary-test-token',expires_in:3600,scope:'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.calendarlist.readonly'})}})}}};
 w.fetch=async(url,options)=>{
  calls.push(url);assert.equal(options.headers.Authorization,'Bearer temporary-test-token');
  if(url.includes('/calendarList'))return {ok:true,status:200,json:async()=>({items:[{id:'primary@example.test',summary:'Pessoal',primary:true},{id:'family@example.test',summary:'Família'}]})};
  assert.match(url,/calendar\/v3\/calendars\/(primary%40example.test|family%40example.test)\/events/);
  return {ok:true,status:200,json:async()=>({items:[{id:'g1',summary:'Consulta',start:{date:'2026-09-24'},status:'confirmed'}]})};
 };
 w.eval(source.replace('__GOOGLE_CLIENT_ID__',JSON.stringify(clientId)));
 return {dom,w,received,requests:()=>requests,calls};
}
test('Google Calendar reads the selected shared calendar after consent and keeps the token in memory',async()=>{
 const s=setup('123-test.apps.googleusercontent.com');
 try{
  const form=s.w.document.querySelector('#settings');
  s.w.GoogleCalendar.settings(form);
  assert.equal(s.calls.length,0);
  form.querySelector('button').click();await settle();
  assert.equal(s.requests(),1);
  assert.equal(s.calls.length,2);
  assert.equal(s.received.at(-1)[0].title,'Consulta');
  assert.equal(s.received.at(-1)[0].day,'2026-09-24');
  const select=form.querySelector('#google-calendar-choice select');assert.ok(select);
  select.value='family@example.test';select.dispatchEvent(new s.w.Event('change'));await settle();
  assert.match(s.calls.at(-1),/family%40example.test/);
  assert.equal(s.w.localStorage.getItem('casa-google-calendar-id'),'family@example.test');
  assert.equal(s.w.localStorage.length,1);
  s.w.GoogleCalendar.clear();
  assert.equal(s.received.at(-1).length,0);
  assert.equal(s.w.localStorage.length,0);
 }finally{s.w.close()}
});
test('Google Calendar stays inert without a configured client ID',()=>{
 const s=setup('');
 try{
  s.w.GoogleCalendar.settings(s.w.document.querySelector('#settings'));
  assert.equal(s.w.document.querySelector('#settings button'),null);
  assert.equal(s.calls.length,0);
 }finally{s.w.close()}
});
test('a delayed Google response cannot restore events after disconnect',async()=>{
 const s=setup('123-test.apps.googleusercontent.com');
 try{
  let complete;
  s.w.fetch=(url)=>{
   if(url.includes('/calendarList'))return Promise.resolve({ok:true,status:200,json:async()=>({items:[{id:'primary@example.test',summary:'Pessoal',primary:true}]})});
   return new Promise(resolve=>{complete=resolve});
  };
  const form=s.w.document.querySelector('#settings');s.w.GoogleCalendar.settings(form);
  form.querySelector('button').click();await settle();
  assert.equal(typeof complete,'function');
  s.w.GoogleCalendar.clear();
  complete({ok:true,status:200,json:async()=>({items:[{id:'late',summary:'Privado',start:{date:'2026-09-24'}}]})});
  await settle();
  assert.equal(s.received.at(-1).length,0);
 }finally{s.w.close()}
});