if ('serviceWorker' in navigator) {
 window.addEventListener('load',async()=>{
  try {
   const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
   function offer(){if(!registration.waiting||!navigator.serviceWorker.controller||document.querySelector('#pwa-update'))return;
    const button=document.createElement('button');button.id='pwa-update';button.className='pwa-update';button.textContent='Atualização disponível · atualizar';
    button.onclick=()=>{if(document.querySelector('#dialog').open||document.querySelector('main').inert){window.Casa?.toast('Conclua a edição e a sincronização antes de atualizar.');return}registration.waiting?.postMessage({type:'ACTIVATE_UPDATE'})};document.body.append(button);
   }
   offer();registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')offer()})});
   let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading&&document.querySelector('#pwa-update')){reloading=true;location.reload()}});
   registration.update().catch(()=>{});
  }catch(error){console.warn('PWA: não foi possível preparar o acesso offline.',error.name)}
 });
}