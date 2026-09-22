import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyState,diff,hydrate,validateImport} from '../dist/sync-core.js';
test('changes target only changed records and omit device settings',()=>{
 const a=emptyState({theme:'dark'});a.items=[{id:'a',name:'Leite'},{id:'b',name:'Pão'}];
 const b=structuredClone(a);b.items[0].done=true;b.settings.theme='light';
 const changes=diff(a,b,new Map([[JSON.stringify(['items','a']),4]]));
 assert.equal(changes.length,1);assert.equal(changes[0].item_id,'a');assert.equal(changes[0].expected_revision,4);
});
test('hydrate retains deletion versions without displaying deleted records',()=>{
 const value=hydrate([{kind:'items',item_id:'a',revision:5,deleted:true,data:null},{kind:'categories',item_id:'Casa',revision:1,deleted:false,data:'Casa'}]);
 assert.equal(value.state.items.length,0);assert.deepEqual(value.state.categories,['Casa']);assert.equal(value.versions.get('["items","a"]'),5);
});
test('category rename and deletion become independent versioned mutations',()=>{
 const a=emptyState();a.categories=['Casa','Mercado'];const b=structuredClone(a);b.categories=['Casa','Compras'];
 const changes=diff(a,b,new Map());assert.equal(changes.length,2);assert.equal(changes.filter(c=>c.deleted).length,1);
});
test('invalid imports never reach synchronization',()=>{
 assert.throws(()=>validateImport({state:{}}));assert.throws(()=>validateImport({format:'casa-prototype-v1',state:{items:[{name:'Sem id'}]}}));
});
test('import rejects unsafe attributes and invalid numeric fields',()=>{
 assert.throws(()=>validateImport({format:'casa-prototype-v1',state:{items:[{id:'x" onclick="evil',name:'bad'}]}}));
 assert.throws(()=>validateImport({format:'casa-prototype-v1',state:{products:[{id:'p1',days:'<img src=x>'}]}}));
});
