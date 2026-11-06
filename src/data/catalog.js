import source from './catalog.tsv?raw';
import metrics from './image-metrics.json';
import prices from './prices.json';
export const categories = [
  {id:'copos',name:'Copos e garrafas',short:'Copos e garrafas',image:'p4-X18.webp',icon:'cup'},
  {id:'tampas',name:'Tampas e canudos',short:'Tampas e canudos',image:'p5-X12.webp',icon:'cup'},
  {id:'refeicao',name:'Refeição e delivery',short:'Refeição e delivery',image:'p6-X19.webp',icon:'box'},
  {id:'potes',name:'Potes e embalagens',short:'Potes e embalagens',image:'p11-X7.webp',icon:'box'},
  {id:'sacolas',name:'Sacolas e sacos',short:'Sacolas e sacos',image:'p13-X12.webp',icon:'bag'},
  {id:'papel',name:'Papéis e filmes',short:'Papéis e filmes',image:'p7-X29.webp',icon:'paper'},
  {id:'isopor',name:'Isopor e conservação',short:'Isopor',image:'p12-X7.webp',icon:'box'},
  {id:'limpeza',name:'Limpeza e higiene',short:'Limpeza e higiene',image:'p20-X35.webp',icon:'clean'},
  {id:'utilidades',name:'Cozinha e utilidades',short:'Cozinha e utilidades',image:'p21-X42.webp',icon:'kitchen'},
  {id:'escritorio',name:'Escritório e organização',short:'Escritório',image:'p22-X20.webp',icon:'office'},
  {id:'protecao',name:'Proteção e vestuário',short:'Proteção e vestuário',image:'p17-X17.webp',icon:'glove'},
  {id:'festas',name:'Festas, doces e alimentos',short:'Festas e doces',image:'p25-X14.webp',icon:'party'},
];
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const extraPhotos={
  'embalagem-articulada-para-alimentos':['p10-X24.webp'],
  'rodo-para-pia':['p21-X25.webp'],
  'dispenser-para-guardanapo':['p23-X24.webp'],
};
export const products=source.split(/\r?\n/).filter(l=>l.trim()&&!l.startsWith('#')).map(line=>{
  const [page,image,name,category,options='',details='']=line.split('|');
  const id=slug(name);
  const file=`p${page}-${image}.webp`;
  return {id,name,category,options:options.split(';').filter(Boolean),details,page:Number(page),image:`/images/products/${file}`,metric:metrics[file],extraPhotos:extraPhotos[id]||[],price:prices[id]??null};
});
export const byId=Object.fromEntries(products.map(p=>[p.id,p]));
export const featuredIds=['copo-de-acai','hamburgueira-de-isopor','kit-pote-redondo','sacola-kraft','copo-milk-shake','embalagem-redonda-para-bolo','saco-zip','marmitex-de-isopor'];
export const categoryName=id=>categories.find(c=>c.id===id)?.name||id;
export const currency=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
export const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
