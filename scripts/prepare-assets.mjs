// Delivery optimization only: preserve the original photo and alpha, encode WebP.
// Alpha bounds are saved for a consistent, centered SVG viewport in the UI.
import { createRequire } from 'node:module';
import { readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
let sharp;
try { sharp = require('sharp'); }
catch { sharp = require('C:/Users/homid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'); }
const dir = resolve('public/images/products');
const metrics = {};
for (const name of await readdir(dir)) {
  if (!/\.(png|jpe?g)$/i.test(name)) continue;
  const input = sharp(resolve(dir, name));
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left=info.width, top=info.height, right=0, bottom=0;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    if(data[(y*info.width+x)*4+3] > 24) { left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y); }
  }
  const file=name.replace(/\.[^.]+$/,'.webp');
  await input.webp({ quality: 88, alphaQuality: 100 }).toFile(resolve(dir,file));
  metrics[file]={ width:info.width,height:info.height,viewBox:`${left} ${top} ${Math.max(1,right-left+1)} ${Math.max(1,bottom-top+1)}` };
}
await writeFile('src/data/image-metrics.json',JSON.stringify(metrics));
await sharp('source/hero-generated.png').resize({width:1100,withoutEnlargement:true}).webp({quality:90}).toFile('public/images/hero.webp');
console.log(`${Object.keys(metrics).length} product assets prepared, original files preserved.`);
