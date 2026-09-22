import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const css = fs.readFileSync(path.join(root,'styles.css'),'utf8');
const js = fs.readFileSync(path.join(root,'app.js'),'utf8');
const errors = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
for (const id of new Set(ids)) if(ids.filter(x=>x===id).length>1) errors.push('Doppelte ID: '+id);
for (const [,href] of html.matchAll(/\bhref="#([^"]+)"/g)) if(!ids.includes(href)) errors.push('Anker fehlt: '+href);
const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(x=>!/^https?:|^mailto:|^tel:/.test(x));
refs.push(...[...css.matchAll(/url\(['"]?([^)'"\s]+)/g)].map(m=>m[1]));
for(const file of new Set(refs)) if(!fs.existsSync(path.join(root,file))) errors.push('Datei fehlt: '+file);
for(const [,key] of html.matchAll(/data-art="([^"]+)"/g)) {
  if(!js.includes("'"+key+"':")) errors.push('Werkdaten fehlen: '+key);
  if(!fs.existsSync(path.join(root,'assets/images',key+'.webp'))) errors.push('Werkbild fehlt: '+key);
}
for(const image of html.matchAll(/<img\b[^>]+>/g)) if(!/\balt="/.test(image[0])) errors.push('Bild ohne Alternativtext');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/sources.json'),'utf8'));
for(const asset of manifest) if(!fs.existsSync(path.join(root,asset.file))) errors.push('Quellennachweis ohne Datei: '+asset.file);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`OK: ${new Set(refs).size} lokale Verweise, ${ids.length} IDs, 6 Werkdatensätze, Alternativtexte und Asset-Quellen.`);
