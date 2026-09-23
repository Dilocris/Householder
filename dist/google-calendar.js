(() => {
 const clientId=__GOOGLE_CLIENT_ID__;
 const scopes=['https://www.googleapis.com/auth/calendar.events.readonly','https://www.googleapis.com/auth/calendar.calendarlist.readonly'];
 const api=window.Casa;
 let tokenClient=null,token='',expiresAt=0,lastFetch=0,calendars=[],selectedId='',generation=0,requestGeneration=0,statusText=clientId?'Carregando conexão Google…':'Conexão Google ainda não configurada.';
 const status=message=>{statusText=message;const output=document.querySelector('#google-calendar-status');if(output)output.textContent=message};
 const localDate=date=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
 function clear(){generation++;token='';expiresAt=0;lastFetch=0;calendars=[];selectedId='';localStorage.removeItem('casa-google-calendar-id');api.setGoogleEvents([]);status(clientId?'Agenda Google desconectada.':'Conexão Google ainda não configurada.');showCalendarChoice()}
 function showCalendarChoice(){
  document.querySelector('#google-calendar-choice')?.remove();
  if(!calendars.length)return;
  const output=document.querySelector('#google-calendar-status');if(!output)return;
  const label=document.createElement('label');label.id='google-calendar-choice';label.textContent='Agenda Google';
  const select=document.createElement('select');
  for(const calendar of calendars){const option=document.createElement('option');option.value=calendar.id;option.textContent=calendar.summary||calendar.id;option.selected=calendar.id===selectedId;select.append(option)}
  select.onchange=()=>{selectedId=select.value;localStorage.setItem('casa-google-calendar-id',selectedId);api.setGoogleEvents([]);refresh()};
  label.append(select);output.after(label);
 }
 function mapped(item){
  const start=item.start?.dateTime||item.start?.date;
  if(!start||item.status==='cancelled')return null;
  const allDay=Boolean(item.start?.date);
  const date=new Date(allDay?start+'T12:00:00':start);
  if(Number.isNaN(date.getTime()))return null;
  return {googleId:item.id,day:localDate(date),time:allDay?'':date.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),allDay,title:item.summary||'Evento sem título',local:item.location||'Google Calendar',area:'Google'};
 }
 async function refresh(){
  if(!token||Date.now()>=expiresAt){status('Reconecte a agenda Google para atualizar os eventos.');return}
  if(!selectedId){status('Escolha uma agenda Google.');return}
  const activeGeneration=generation,activeCalendar=selectedId;
  status('Atualizando agenda Google…');
  const from=new Date();from.setDate(from.getDate()-7);
  const until=new Date();until.setDate(until.getDate()+90);
  let page='',items=[],pages=0;
  try{
   do{
    const params=new URLSearchParams({timeMin:from.toISOString(),timeMax:until.toISOString(),singleEvents:'true',orderBy:'startTime',maxResults:'250'});
    if(page)params.set('pageToken',page);
    const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(selectedId)+'/events?'+params,{headers:{Authorization:'Bearer '+token},cache:'no-store'});
    if(response.status===401){token='';expiresAt=0;api.setGoogleEvents([]);status('A conexão Google expirou. Conecte novamente.');return}
    if(!response.ok)throw Error('calendar_fetch');
    const data=await response.json();
    items.push(...(data.items||[]));page=data.nextPageToken||'';pages++;
   }while(page&&pages<4);
   if(activeGeneration!==generation||activeCalendar!==selectedId)return;
   api.setGoogleEvents(items.map(mapped).filter(Boolean));lastFetch=Date.now();
   status(page?'Agenda Google parcial. Abra o Google Calendar para ver os demais eventos.':'Agenda Google atualizada. Somente leitura neste aparelho.');
  }catch{status('Não foi possível atualizar a agenda Google. Tente novamente.')}
 }
 async function loadCalendars(){
  const activeGeneration=generation;
  status('Carregando agendas Google…');
  try{
   const response=await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader&maxResults=250',{headers:{Authorization:'Bearer '+token},cache:'no-store'});
   if(!response.ok)throw Error('calendar_list');
   const data=await response.json();if(activeGeneration!==generation)return;calendars=(data.items||[]).filter(item=>item.id);
   const saved=localStorage.getItem('casa-google-calendar-id');
   selectedId=calendars.find(item=>item.id===saved)?.id||calendars.find(item=>item.primary)?.id||calendars[0]?.id||'';
   showCalendarChoice();
   if(selectedId)refresh();else status('Nenhuma agenda Google disponível para leitura.');
  }catch{status('Não foi possível carregar as agendas Google. Tente novamente.')}
 }
 function prepare(){
  if(!clientId||tokenClient||!window.google?.accounts?.oauth2)return;
  tokenClient=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:scopes.join(' '),callback:response=>{
   if(requestGeneration!==generation)return;
   if(response.error||!response.access_token||!scopes.every(value=>response.scope?.split(' ').includes(value))){status('Acesso à agenda Google não autorizado.');return}
   token=response.access_token;expiresAt=Date.now()+Number(response.expires_in||3600)*1000-60000;loadCalendars();
  }});
  status('Conecte sua conta Google para ver os eventos.');
 }
 function connect(){
  if(!tokenClient){status('A conexão Google ainda carrega. Tente novamente.');return}
  if(token&&Date.now()<expiresAt){loadCalendars();return}
  requestGeneration=generation;tokenClient.requestAccessToken({prompt:'consent'});
 }
 function settings(container){
  const section=document.createElement('section');section.className='account-settings';
  const title=document.createElement('h3');title.textContent='Google Calendar';section.append(title);
  const message=document.createElement('p');message.className='helper';message.id='google-calendar-status';message.textContent=statusText;section.append(message);
  if(clientId){
   const button=document.createElement('button');button.type='button';button.className='text-button';button.textContent='Conectar ou atualizar agenda';button.onclick=connect;section.append(button);
   const disconnect=document.createElement('button');disconnect.type='button';disconnect.className='text-button';disconnect.textContent='Limpar agenda deste aparelho';disconnect.onclick=clear;section.append(disconnect);
  }
  container.append(section);showCalendarChoice();
 }
 window.GoogleCalendar={settings,clear,refresh};
 if(clientId){
  if(window.google?.accounts?.oauth2)prepare();
  else{const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.onload=prepare;script.onerror=()=>status('Não foi possível carregar a conexão Google.');document.head.append(script)}
  window.addEventListener('focus',()=>{if(token&&Date.now()<expiresAt&&Date.now()-lastFetch>300000)refresh()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&Date.now()<expiresAt&&Date.now()-lastFetch>300000)refresh()});
 }
})();