// Shared state is stored as independent, versioned records. Preferences stay on the device.
export const collections = ['items','bills','tasks','products','decks','localEvents','messages','contacts','recurringBills','marketCategories','categories'];
export function emptyState(settings = {}) {
  return Object.fromEntries([...collections.map(k => [k, []]), ['plans', []], ['settings', settings]]);
}
export function flatten(state) {
  const records = new Map();
  for (const kind of collections) {
    for (const value of state[kind] || []) {
      const itemId = typeof value === 'string' ? value : value.id || (kind === 'contacts' ? value.phone : null);
      if (!itemId) throw new Error(`Registro sem identificador: ${kind}`);
      const key = JSON.stringify([kind, String(itemId)]);
      if (records.has(key)) throw new Error(`Identificador duplicado: ${kind}`);
      assertSafe(value);
      records.set(key, {kind, item_id:String(itemId), data:structuredClone(value)});
    }
  }
  return records;
}
export function diff(before, after, versions) {
  const old = flatten(before), next = flatten(after), changes = [];
  for (const [key, record] of next) {
    if (!old.has(key) || JSON.stringify(old.get(key).data) !== JSON.stringify(record.data))
      changes.push({...record, expected_revision:versions.get(key) || 0, deleted:false});
  }
  for (const [key, record] of old) if (!next.has(key))
    changes.push({...record, data:null, expected_revision:versions.get(key) || 0, deleted:true});
  return changes;
}
export function hydrate(rows, settings = {}) {
  const state = emptyState(settings), versions = new Map();
  for (const row of rows) {
    if (!collections.includes(row.kind)) continue;
    if(!row.deleted)assertSafe(row.data);
    versions.set(JSON.stringify([row.kind, row.item_id]), row.revision);
    if (!row.deleted) state[row.kind].push(structuredClone(row.data));
  }
  return {state, versions};
}
export function validateImport(payload) {
  if (payload?.format !== 'casa-prototype-v1' || !payload.state || typeof payload.state !== 'object') throw new Error('Arquivo de exportação inválido.');
  for (const kind of collections) if (payload.state[kind] != null && !Array.isArray(payload.state[kind])) throw new Error(`Lista inválida: ${kind}`);
  const state = {...emptyState(), ...payload.state};
  const rows = flatten(state);
  if (rows.size > 1000) throw new Error('Importe no máximo 1.000 registros por vez.');
  if (JSON.stringify(state).length > 2_000_000) throw new Error('O arquivo excede o limite de 2 MB.');
  return state;
}
// Attribute-backed fields need stricter validation than escaped display text.
export function assertSafe(value, depth=0) {
 if(depth>12)throw new Error('Estrutura de dados muito profunda.');
 if(value===null||typeof value!=='object')return;
 for(const [key,field] of Object.entries(value)){
  if(key==='id' && (typeof field!=='string'||!/^[a-zA-Z0-9_-]{1,200}$/.test(field)))throw new Error('Identificador inválido.');
  if(['date','due','bought','start','needed'].includes(key)&&field && (typeof field!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(field)))throw new Error('Data inválida.');
  if(['time','end'].includes(key)&&field && (typeof field!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(field)))throw new Error('Horário inválido.');
  if(['amount','days','cycles','progress','occurrence','occurrences'].includes(key)&&field!=null && (typeof field!=='number'||!Number.isFinite(field)))throw new Error('Valor numérico inválido.');
  if(typeof field==='object')assertSafe(field,depth+1);
 }
}