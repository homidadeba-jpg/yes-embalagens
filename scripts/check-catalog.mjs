import { readFile, access } from 'node:fs/promises';
const raw=await readFile('src/data/catalog.tsv','utf8');
const metrics=JSON.parse(await readFile('src/data/image-metrics.json','utf8'));
const prices=JSON.parse(await readFile('src/data/prices.json','utf8'));
const rows=raw.split(/\r?\n/).filter(l=>l.trim()&&!l.startsWith('#'));
const ids=new Set(),pages=new Set(),cats=new Set(['copos','tampas','refeicao','potes','sacolas','papel','isopor','limpeza','utilidades','escritorio','protecao','festas']);
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const row of rows){
  const cells=row.split('|');
  if(cells.length!==6) throw new Error(`Malformed entry: ${row}`);
  const [page,image,name,cat,options]=cells;
  const id=slug(name),file=`p${page}-${image}.webp`;
  if(ids.has(id)) throw new Error(`Duplicate product ID: ${id}`);
  if(!cats.has(cat)) throw new Error(`Unknown category: ${cat}`);
  if(!metrics[file]) throw new Error(`Missing image framing: ${file}`);
  if(options&&new Set(options.split(';')).size!==options.split(';').length) throw new Error(`Duplicate options: ${name}`);
  await access(`public/images/products/${file}`);
  ids.add(id);pages.add(Number(page));
}
for(let p=4;p<=26;p++)if(!pages.has(p))throw new Error(`Unrepresented PDF page: ${p}`);
for(const [id,price]of Object.entries(prices))if(!ids.has(id)||!Number.isFinite(price)||price<0)throw new Error(`Invalid price: ${id}`);
for(const id of ['copo-de-acai','hamburgueira-de-isopor','kit-pote-redondo','sacola-kraft','copo-milk-shake','embalagem-redonda-para-bolo','saco-zip','marmitex-de-isopor'])if(!ids.has(id))throw new Error(`Missing featured product: ${id}`);
console.log(`Catalog OK: ${rows.length} products, ${pages.size} product pages, ${cats.size} categories. Images, options, IDs and prices validated.`);
