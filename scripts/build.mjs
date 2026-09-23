import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
let env={};
try {for(const line of (await readFile('.env','utf8')).split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)env[m[1]]=m[2].trim();}} catch(error){if(error.code!=='ENOENT')throw error;}
const url=process.env.SUPABASE_URL||env.SUPABASE_URL||'';
const key=process.env.SUPABASE_PUBLISHABLE_KEY||env.SUPABASE_PUBLISHABLE_KEY||'';
const googleId=process.env.GOOGLE_CLIENT_ID||env.GOOGLE_CLIENT_ID||'';
if(Boolean(url)!==Boolean(key))throw new Error('Configure ambas as variáveis públicas do Supabase.');
if(url && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))throw new Error('URL Supabase inválida.');
if(googleId && !/^[A-Za-z0-9-]+[.]apps[.]googleusercontent[.]com$/.test(googleId))throw new Error('Google Client ID inválido.');
if(key.startsWith('sb_secret_'))throw new Error('Chave administrativa proibida no cliente.');
if(key.startsWith('eyJ')){const data=JSON.parse(Buffer.from(key.split('.')[1],'base64url'));if(data.role!=='anon')throw new Error('Use somente a chave pública anon.');}
await mkdir('build',{recursive:true});
await cp('dist','build',{recursive:true});
await build({entryPoints:['dist/cloud.js'],bundle:true,format:'iife',outfile:'build/cloud.js',target:'es2022',define:{'__SUPABASE_URL__':JSON.stringify(url),'__SUPABASE_KEY__':JSON.stringify(key)}});
await build({entryPoints:['dist/google-calendar.js'],bundle:true,format:'iife',outfile:'build/google-calendar.js',target:'es2022',define:{'__GOOGLE_CLIENT_ID__':JSON.stringify(googleId)}});
const names=['index.html','app.js','style.css','cloud.js','google-calendar.js','sync-core.js','pwa-register.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
const hash=createHash('sha256');for(const name of names)hash.update(await readFile(`build/${name}`));
const version=hash.digest('hex').slice(0,16);
let sw=await readFile('dist/sw.js','utf8');sw=sw.replace('__BUILD_ID__',version);
await writeFile('build/sw.js',sw);
await writeFile('build/release.json',JSON.stringify({version,backendConfigured:Boolean(url),googleCalendarConfigured:Boolean(googleId),builtAt:new Date().toISOString()}));
console.log(`Build ${version}. Backend ${url?'configurado':'não configurado'}.`);