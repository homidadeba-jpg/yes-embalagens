import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Search, ShoppingBag, X, Plus, Minus, Check, MessageCircle, Menu, Package, PackageCheck, Layers3, Clock3, Instagram, HeartHandshake, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Trash2, ExternalLink, Coffee, Utensils, Sparkles, Gift, ShoppingBasket, FileText, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { products, byId, categories, featuredIds, categoryName, currency, normalize } from './data/catalog';
import imageMetrics from './data/image-metrics.json';
import { store, whatsappUrl } from './data/store';
import { addItem, restoreCart, validQuantity, orderMessage } from './lib/cart.mjs';
import './styles.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const STORAGE_KEY='yes-embalagens:cart:v1';
const iconMap={cup:Coffee,box:Package,bag:ShoppingBag,paper:FileText,clean:Sparkles,kitchen:Utensils,office:FileText,glove:HeartHandshake,party:Gift};

function App(){
  const [route,setRoute]=useState(location.pathname+location.search);
  const [cart,setCart]=useState(()=>{try{return restoreCart(localStorage.getItem(STORAGE_KEY),byId);}catch{return [];}});
  const [cartOpen,setCartOpen]=useState(false);
  const [selected,setSelected]=useState(null);
  const [toast,setToast]=useState('');
  const toastTimer=useRef();
  const catalogRoute=route.startsWith('/catalogo');
  useEffect(()=>{const fn=()=>setRoute(location.pathname+location.search);window.addEventListener('popstate',fn);return()=>window.removeEventListener('popstate',fn);},[]);
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch{/* Cart remains available for this visit. */}},[cart]);
  useEffect(()=>()=>clearTimeout(toastTimer.current),[]);
  useEffect(()=>{document.title=catalogRoute?'Catálogo de produtos | Yes Embalagens':'Yes Embalagens — Boa embalagem. Bom negócio.';},[catalogRoute]);
  function navigate(url,{scroll=true,replace=false}={}){
    if(replace)history.replaceState({},'',url);else history.pushState({},'',url);
    setRoute(location.pathname+location.search);
    if(scroll)window.scrollTo({top:0,behavior:'instant'});
  }
  function add(product,option,quantity){
    setCart(previous=>addItem(previous,product,option,quantity));
    setSelected(null);
    setToast(`${product.name} adicionado ao pedido`);
    clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),4000);
  }
  const total=cart.reduce((s,item)=>s+item.quantity,0);
  function Link({href,children,...props}){
    return <a href={href} {...props} onClick={event=>{if(!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&event.button===0){event.preventDefault();navigate(href);}}}>{children}</a>;
  }
  function goSection(id){
    if(catalogRoute){navigate('/');requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}));}
    else document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="announcement"><span>Da embalagem ao cuidado com o seu negócio.</span><a href={whatsappUrl()} target="_blank" rel="noreferrer">Peça pelo WhatsApp <MessageCircle size={13}/></a></div>
    <Header Link={Link} catalogRoute={catalogRoute} total={total} onCart={()=>setCartOpen(true)} navigate={navigate} goSection={goSection}/>
    <main id="conteudo" tabIndex={-1}>
      {catalogRoute?<Catalog route={route} navigate={navigate} onSelect={setSelected}/>:<Home Link={Link} navigate={navigate} onSelect={setSelected}/>}
    </main>
    <Footer Link={Link} goSection={goSection}/>
    <a className="floating-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Conversar com a Yes pelo WhatsApp"><MessageCircle size={25}/></a>
    <div className={`toast ${toast?'visible':''}`} role="status" aria-live="polite">{toast&&<><span className="toast-check"><Check size={16}/></span><span>{toast}</span><button onClick={()=>{setToast('');setCartOpen(true);}}>Ver pedido</button></>}</div>
    {selected&&<ProductModal key={selected.id} product={selected} onClose={()=>setSelected(null)} onAdd={add}/>}
    {cartOpen&&<Cart cart={cart} setCart={setCart} onClose={()=>setCartOpen(false)} navigate={navigate}/>}
  </>;
}

function Logo(){return <span className="logo-crop"><img src="/images/logo-original.png" alt="Yes! Embalagens" width="996" height="959"/></span>;}
function Header({Link,catalogRoute,total,onCart,navigate,goSection}){
  const [menuOpen,setMenuOpen]=useState(false);
  const [search,setSearch]=useState('');
  function submit(event){event.preventDefault();navigate(`/catalogo${search.trim()?`?busca=${encodeURIComponent(search.trim())}`:''}`);setMenuOpen(false);}
  useEffect(()=>{const escape=e=>{if(e.key==='Escape')setMenuOpen(false);};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[]);
  return <header className="header"><div className="container header-main">
    <Link href="/" className="brand" aria-label="Yes Embalagens — início"><Logo/></Link>
    <nav className="desktop-nav" aria-label="Navegação principal"><Link href="/" className={!catalogRoute?'active':''}>Início</Link><Link href="/catalogo" className={catalogRoute?'active':''}>Catálogo <ChevronDown size={13}/></Link><button onClick={()=>goSection('sobre')}>Sobre a Yes</button><button onClick={()=>goSection('contato')}>Contato</button></nav>
    <div className="header-actions"><button className="cart-button" onClick={onCart} aria-label={`Meu pedido, ${total} itens`}><ShoppingBag size={19}/><span>Meu pedido</span><b>{total}</b></button><button className="icon-button menu-toggle" aria-label={menuOpen?'Fechar menu':'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div>
  </div>
    <div className="header-search"><div className="container search-row"><span className="search-intro"><Package size={17}/> Tudo para o seu negócio</span><form onSubmit={submit} role="search"><label className="sr-only" htmlFor="header-search">Buscar no catálogo</label><Search size={18}/><input id="header-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="O que você precisa embalar hoje?" type="search"/><button type="submit">Buscar</button></form><a className="header-contact" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={17}/><span>Vamos conversar?</span></a></div></div>
    {menuOpen&&<nav id="mobile-menu" className="mobile-nav" aria-label="Menu do celular"><button onClick={()=>{navigate('/');setMenuOpen(false);}}>Início</button><button onClick={()=>{navigate('/catalogo');setMenuOpen(false);}}>Catálogo completo</button><button onClick={()=>{goSection('sobre');setMenuOpen(false);}}>Sobre a Yes</button><button onClick={()=>{goSection('contato');setMenuOpen(false);}}>Contato e horários</button></nav>}
  </header>;
}

function ProductImage({product,file,className=''}){
  const source=product?.image||`/images/products/${file}`;
  const metric=product?.metric||imageMetrics[file];
  return <div className={`product-image ${className}`} aria-hidden="true">{metric?<svg viewBox={metric.viewBox} role="presentation" focusable="false"><image href={source} width={metric.width} height={metric.height}/></svg>:<img src={source} alt="" loading="lazy"/>}</div>;
}

function Home({Link,navigate,onSelect}){
  const root=useRef(null);
  const [featuredTab,setFeaturedTab]=useState('destaques');
  const featured=featuredTab==='destaques'?featuredIds.map(id=>byId[id]):products.filter(p=>p.category===featuredTab).slice(0,8);
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      gsap.from('.hero-copy > *',{y:24,opacity:0,duration:.65,stagger:.075,ease:'power3.out'});
      gsap.from('.hero-visual',{y:24,opacity:0,duration:.8,ease:'power3.out',delay:.12});
      gsap.to('.hero-sticker',{rotation:5,y:-7,duration:3,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:24,opacity:0,duration:.6,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
      gsap.to('.story-product:nth-of-type(3)',{y:-26,rotation:5,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:1}});
    });
    return()=>media.revert();
  },{scope:root});
  return <div ref={root}>
    <section className="hero"><div className="container hero-layout">
      <div className="hero-copy"><span className="eyebrow"><span className="little-dot"/> SUA IDEIA. NOSSA EMBALAGEM.</span><h1>Boa embalagem.<br/><span>Bom negócio.</span></h1><p>Para servir, entregar e encantar.<br/>Tudo o que o seu negócio precisa,<br className="desktop-break"/> do balcão à casa do cliente.</p><div className="hero-buttons"><Link href="/catalogo" className="button button-red">Explorar catálogo <ArrowRight size={18}/></Link><a className="hero-talk" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={19}/> Falar com a Yes</a></div><div className="hero-footnote"><span className="hero-footnote-icon"><HeartHandshake size={22}/></span><span>Quem empreende tem a gente por perto.<br/><strong>Conte com a Yes no seu dia a dia.</strong></span></div></div>
      <div className="hero-visual"><div className="hero-photo"><img src="/images/hero.webp" alt="Composição ilustrativa de sacola kraft, potes, copos e embalagem para lanche" fetchPriority="high" width="1100" height="1100"/><span className="image-caption">Composição ilustrativa</span></div><div className="hero-sticker"><span>TEM NA</span><strong>YES!</strong><Sparkles size={19}/></div><div className="hero-floating"><span><PackageCheck size={25}/></span><div>A embalagem certa<br/><strong>faz toda a diferença.</strong></div></div></div>
    </div></section>
    <div className="benefits"><div className="container benefits-grid"><div><Layers3/><span><strong>Variedade que resolve</strong><small>Do descartável à organização</small></span></div><div><ShoppingBag/><span><strong>Um pedido do seu jeito</strong><small>Escolha os produtos e quantidades</small></span></div><div><MessageCircle/><span><strong>Atendimento próximo</strong><small>Finalize com a gente no WhatsApp</small></span></div></div></div>
    <section className="section container categories-section"><div className="section-heading reveal"><div><span className="eyebrow red-text">UM MUNDO DE POSSIBILIDADES</span><h2>O que seu negócio<br/>precisa hoje?</h2></div><p>Pequenos detalhes, grandes soluções.<br/>Encontre a categoria que faz parte da sua rotina.</p></div><div className="category-grid reveal">{['copos','refeicao','potes','sacolas','limpeza','festas'].map(id=>{const cat=categories.find(c=>c.id===id);return <Link className="category-tile" href={`/catalogo?categoria=${id}`} key={id}><ProductImage file={cat.image}/><h3>{cat.short}</h3><span>Quero explorar</span></Link>;})}</div><div className="category-more"><Link href="/catalogo" className="text-link">Ver todas as categorias <ArrowRight size={16}/></Link></div></section>
    <section className="featured section" id="produtos"><div className="container"><div className="section-heading reveal"><div><span className="eyebrow red-text">ESCOLHAS PARA A SUA ROTINA</span><h2>Prontos para o seu dia a dia.</h2></div><Link href="/catalogo" className="text-link">Ver catálogo completo <ArrowRight size={16}/></Link></div><div className="tabs" role="group" aria-label="Selecionar produtos em destaque">{[['destaques','Em destaque'],['refeicao','Para delivery'],['copos','Para bebidas'],['sacolas','Para levar']].map(([id,name])=><button key={id} aria-pressed={featuredTab===id} className={featuredTab===id?'selected':''} onClick={()=>setFeaturedTab(id)}>{name}</button>)}</div><div className="product-grid home-products">{featured.map(p=><ProductCard key={p.id} product={p} onSelect={onSelect}/>)}</div><p className="catalog-note"><MessageCircle size={15}/> Valores e disponibilidade? Nosso time confirma tudo pelo WhatsApp.</p></div></section>
    <section className="container story-wrap" id="sobre"><div className="story reveal"><div className="story-copy"><span className="eyebrow">MUITO ALÉM DA EMBALAGEM</span><h2>Você cuida do negócio.<br/>A gente ajuda<br/>a <em>embalar o resto.</em></h2><p>Somos a Yes Embalagens. Uma loja feita para facilitar a rotina de quem vende, produz, serve e faz acontecer.</p><p>Embalagens, descartáveis, limpeza, organização e muito mais. Variedade e atendimento próximo, em um só lugar.</p><a href={whatsappUrl()} className="button button-yellow" target="_blank" rel="noreferrer">Conte com a Yes <MessageCircle size={18}/></a></div><div className="story-visual" aria-hidden="true"><span className="story-orbit"/><span className="story-caption">DO SEU JEITO.<br/>COM A YES.</span><div className="story-product"><ProductImage file="p13-X12.webp"/></div><div className="story-product"><ProductImage file="p4-X18.webp"/></div><div className="story-product"><ProductImage file="p6-X19.webp"/></div><span className="story-spark">✳</span></div></div></section>
    <section className="section container how-section"><div className="section-heading reveal"><div><span className="eyebrow red-text">PRÁTICO DO COMEÇO AO FIM</span><h2>Seu próximo pedido,<br/>a uma conversa de distância.</h2></div><p>Monte sua lista com calma.<br/>A gente te ajuda com o resto.</p></div><div className="how-grid reveal"><div><span className="how-icon"><Search/></span><h3>Encontre o que precisa</h3><p>Explore as categorias, confira os tamanhos e escolha os produtos para o seu negócio.</p></div><div><span className="how-icon"><ShoppingBag/></span><h3>Monte seu pedido</h3><p>Adicione os itens, selecione as opções e ajuste as quantidades no seu carrinho.</p></div><div><span className="how-icon"><MessageCircle/></span><h3>Converse com a Yes</h3><p>Envie a lista pelo WhatsApp. Nosso time confirma os valores e combina os próximos passos.</p></div></div></section>
    <Contact/>
  </div>;
}

function ProductCard({product,onSelect}){
  const p=product;
  return <article className="product-card"><button className="product-visual" onClick={()=>onSelect(p)} aria-label={`Ver ${p.name}`}><ProductImage product={p}/><span className="product-view">Ver opções <Plus size={14}/></span></button><div className="product-info"><span className="product-category">{categoryName(p.category)}</span><h3><button onClick={()=>onSelect(p)}>{p.name}</button></h3><p className="product-options">{p.options.length?p.options.length===1?p.options[0]:`${p.options.length} opções disponíveis`:p.details||'Consulte as opções com a Yes'}</p><div className="product-bottom"><span className={p.price===null?'price-consult':'product-price'}>{p.price===null?'Preço sob consulta':currency(p.price)}</span><button className="add-button" onClick={()=>onSelect(p)} aria-label={`Adicionar ${p.name} ao pedido`}><Plus size={19}/></button></div></div></article>;
}

function Catalog({route,navigate,onSelect}){
  const params=new URLSearchParams(route.split('?')[1]||'');
  const category=categories.some(c=>c.id===params.get('categoria'))?params.get('categoria'):'';
  const query=params.get('busca')||'';
  const [sort,setSort]=useState('catalogo');
  const [page,setPage]=useState(1);
  const [showFilters,setShowFilters]=useState(false);
  const heading=useRef(null);
  function update(key,value){const next=new URLSearchParams(location.search);if(value)next.set(key,value);else next.delete(key);navigate(`/catalogo${next.size?'?'+next.toString():''}`,{scroll:false,replace:key==='busca'});setPage(1);}
  useEffect(()=>{setPage(1);},[category,query,sort]);
  const words=normalize(query).split(/\s+/).filter(Boolean);
  let filtered=products.filter(p=>(!category||p.category===category)&&words.every(term=>normalize([p.name,p.details,...p.options,categoryName(p.category)].join(' ')).includes(term)));
  if(sort!=='catalogo') filtered=[...filtered].sort((a,b)=>sort==='az'?a.name.localeCompare(b.name,'pt-BR'):b.name.localeCompare(a.name,'pt-BR'));
  const pageSize=24;
  const lastPage=Math.max(1,Math.ceil(filtered.length/pageSize));
  const currentPage=Math.min(page,lastPage);
  const visible=filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
  function changePage(next){setPage(next);heading.current?.scrollIntoView({behavior:'instant',block:'start'});}
  return <>
    <section className="catalog-hero"><div className="container"><div className="breadcrumb"><a href="/" onClick={e=>{e.preventDefault();navigate('/');}}>Início</a><ChevronRight size={12}/><span>Catálogo</span></div><div className="catalog-hero-row"><div><span className="eyebrow red-text">ENCONTRE. ESCOLHA. PEÇA.</span><h1>Tem no seu dia.<br/><span>Tem na Yes.</span></h1><p>Explore o catálogo e monte um pedido que faz sentido para você.</p></div><div className="catalog-hero-art" aria-hidden="true"><ProductImage file="p4-X18.webp"/><ProductImage file="p13-X12.webp"/><span className="catalog-star">✳</span></div></div></div></section>
    <section className="container catalog-section" ref={heading}><div className="catalog-layout"><aside className={`catalog-sidebar ${showFilters?'expanded':''}`}><button className="filter-toggle" onClick={()=>setShowFilters(!showFilters)} aria-expanded={showFilters}><SlidersHorizontal size={18}/> Categorias <ChevronDown size={16}/></button><div className="category-filters"><h2>Categorias</h2><button className={!category?'selected':''} aria-pressed={!category} onClick={()=>update('categoria','')}><span>Todos os produtos</span><small>{products.length}</small></button>{categories.map(c=>{const Icon=iconMap[c.icon];return <button key={c.id} className={category===c.id?'selected':''} aria-pressed={category===c.id} onClick={()=>{update('categoria',c.id);setShowFilters(false);}}><Icon size={16}/><span>{c.name}</span><small>{products.filter(p=>p.category===c.id).length}</small></button>;})}</div><div className="sidebar-help"><MessageCircle size={23}/><h3>Não sabe qual escolher?</h3><p>A gente ajuda a encontrar a embalagem certa.</p><a href={whatsappUrl()} target="_blank" rel="noreferrer">Fale com a Yes <ExternalLink size={13}/></a></div><a className="pdf-link" href={store.catalogPdf} target="_blank" rel="noreferrer"><FileText size={17}/> Ver catálogo em PDF</a></aside>
    <div className="catalog-results"><div className="catalog-search"><Search size={19}/><label htmlFor="product-search" className="sr-only">Buscar produtos</label><input id="product-search" type="search" value={query} onChange={e=>update('busca',e.target.value)} placeholder="Busque por produto, tamanho ou material..."/>{query&&<button aria-label="Limpar busca" onClick={()=>update('busca','')}><X size={17}/></button>}</div><div className="results-toolbar"><div><h2>{category?categoryName(category):'Todos os produtos'}</h2><span role="status" aria-live="polite">{filtered.length} {filtered.length===1?'produto encontrado':'produtos encontrados'}</span></div><label className="sort-label"><span className="sr-only">Ordenar produtos</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="catalogo">Ordem do catálogo</option><option value="az">Nome: A a Z</option><option value="za">Nome: Z a A</option></select><ChevronDown size={14}/></label></div>{(query||category)&&<div className="active-filters">{query&&<button onClick={()=>update('busca','')}>Busca: {query}<X size={12}/></button>}{category&&<button onClick={()=>update('categoria','')}>{categoryName(category)}<X size={12}/></button>}<button className="clear-all" onClick={()=>navigate('/catalogo',{scroll:false})}>Limpar filtros</button></div>}
    {visible.length?<><div className="product-grid catalog-products">{visible.map(p=><ProductCard product={p} onSelect={onSelect} key={p.id}/>)}</div><div className="pagination"><button className="button button-outline" disabled={currentPage===1} onClick={()=>changePage(currentPage-1)}><ChevronLeft size={16}/> Anterior</button><span>Página {currentPage} de {lastPage}</span><button className="button button-outline" disabled={currentPage===lastPage} onClick={()=>changePage(currentPage+1)}>Próxima <ChevronRight size={16}/></button></div></>:<div className="empty-state"><Search size={40}/><h3>Não encontramos esse produto.</h3><p>Tente outro nome ou retire os filtros.<br/>Se preferir, pergunte diretamente à Yes.</p><button className="button button-red" onClick={()=>navigate('/catalogo',{scroll:false})}>Ver todos os produtos</button><a href={whatsappUrl(`Olá, Yes Embalagens! Vocês têm ${query||'este produto'}?`)} target="_blank" rel="noreferrer">Consultar pelo WhatsApp</a></div>}
    <p className="catalog-note">Imagens do catálogo da loja. Consulte valores, unidade de venda e disponibilidade antes de confirmar o pedido.</p></div></div></section>
  </>;
}

function Modal({children,onClose,className='',label}){
  const ref=useRef(null);
  useEffect(()=>{const dialog=ref.current;dialog.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;dialog.close();};},[]);
  return <dialog ref={ref} className={className} aria-label={label} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current){const rect=ref.current.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)onClose();}}}>{children}</dialog>;
}
function Quantity({value,onChange,label='Quantidade'}){
  const id=React.useId();
  return <div className="quantity-control"><button type="button" aria-label={`Diminuir ${label.toLowerCase()}`} disabled={value<=1} onClick={()=>onChange(validQuantity(value-1))}><Minus size={15}/></button><label className="sr-only" htmlFor={id}>{label}</label><input id={id} aria-label={label} type="number" inputMode="numeric" min="1" max="999" value={value} onChange={e=>onChange(validQuantity(e.target.value))}/><button type="button" aria-label={`Aumentar ${label.toLowerCase()}`} disabled={value>=999} onClick={()=>onChange(validQuantity(value+1))}><Plus size={15}/></button></div>;
}
function ProductModal({product:p,onClose,onAdd}){
  const [option,setOption]=useState(p.options.length===1?p.options[0]:'');
  const [quantity,setQuantity]=useState(1);
  const [photo,setPhoto]=useState(p.image.split('/').pop());
  const gallery=[p.image.split('/').pop(),...p.extraPhotos];
  return <Modal className="product-modal" onClose={onClose} label={p.name}><button className="modal-close icon-button" aria-label="Fechar produto" onClick={onClose}><X/></button><div className="product-modal-visual"><ProductImage file={photo}/>{gallery.length>1&&<div className="photo-thumbs" role="group" aria-label="Fotos do produto">{gallery.map((file,i)=><button key={file} type="button" aria-label={`Ver foto ${i+1} de ${p.name}`} aria-pressed={photo===file} onClick={()=>setPhoto(file)}><ProductImage file={file}/></button>)}</div>}<span>Foto do catálogo Yes Embalagens</span></div><form className="product-modal-info" onSubmit={e=>{e.preventDefault();onAdd(p,option,quantity);}}><span className="eyebrow red-text">{categoryName(p.category)}</span><h2>{p.name}</h2><p className="modal-price">{p.price===null?'Preço sob consulta':currency(p.price)}</p><p className="modal-description">{p.details||'Escolha a opção e a quantidade para incluir no seu pedido. Nosso time confirma todos os detalhes com você.'}</p>{p.options.length>0&&<label className="field-label">{p.options.length===1?'Opção do produto':'Escolha uma opção'}<select required value={option} onChange={e=>setOption(e.target.value)}><option value="" disabled>Selecione o tamanho ou modelo</option>{p.options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>}<div className="modal-quantity"><span>Quantidade</span><Quantity value={quantity} onChange={setQuantity}/></div><button className="button button-red add-to-cart" type="submit" disabled={p.options.length>0&&!option}><ShoppingBag size={18}/> Adicionar ao pedido</button><p className="modal-disclaimer"><PackageCheck size={16}/> A Yes confirma a unidade de venda, os valores e a disponibilidade pelo WhatsApp.</p></form></Modal>;
}
function Cart({cart,setCart,onClose,navigate}){
  const [name,setName]=useState('');
  const [note,setNote]=useState('');
  const [fulfillment,setFulfillment]=useState('Retirada na loja');
  const count=cart.reduce((s,item)=>s+item.quantity,0);
  const priced=cart.every(item=>byId[item.id]?.price!==null);
  const knownTotal=cart.reduce((s,item)=>s+(byId[item.id]?.price||0)*item.quantity,0);
  function remove(key){setCart(previous=>previous.filter(item=>item.key!==key));}
  function quantity(key,value){setCart(previous=>previous.map(item=>item.key===key?{...item,quantity:validQuantity(value)}:item));}
  const href=cart.length?whatsappUrl(orderMessage(cart,byId,{name,note,fulfillment})):'';
  return <Modal className="cart-dialog" onClose={onClose} label="Meu pedido"><div className="cart-header"><div><span className="eyebrow red-text">DO SEU JEITO</span><h2>Meu pedido <small>{count}</small></h2></div><button className="icon-button" aria-label="Fechar pedido" onClick={onClose}><X/></button></div>{cart.length?<><div className="cart-scroll"><p className="cart-intro">Sua seleção está aqui. Ajuste os detalhes e envie para a Yes.</p><div className="cart-items">{cart.map(item=>{const p=byId[item.id];return <article className="cart-item" key={item.key}><ProductImage product={p}/><div className="cart-item-content"><h3>{p.name}</h3>{item.option&&<p>{item.option}</p>}<span>{p.price===null?'Preço sob consulta':currency(p.price)}</span><Quantity value={item.quantity} onChange={value=>quantity(item.key,value)} label={`Quantidade de ${p.name} ${item.option}`}/></div><button className="remove-button" onClick={()=>remove(item.key)} aria-label={`Remover ${p.name}${item.option?' '+item.option:''}`}><Trash2 size={16}/></button></article>;})}</div><div className="order-fields"><label className="field-label">Seu nome <span>(opcional)</span><input value={name} maxLength={80} onChange={e=>setName(e.target.value)} placeholder="Como podemos chamar você?" autoComplete="name"/></label><label className="field-label">Como prefere receber?<select value={fulfillment} onChange={e=>setFulfillment(e.target.value)}><option>Retirada na loja</option><option>Consultar entrega</option></select></label><label className="field-label">Algum detalhe para a Yes? <span>(opcional)</span><textarea value={note} maxLength={500} onChange={e=>setNote(e.target.value)} placeholder="Cor, marca, prazo ou alguma dúvida..." rows={3}/></label></div></div><div className="cart-footer"><div className="cart-total"><span>{priced?'Subtotal dos produtos':'Valores do pedido'}</span><strong>{priced?currency(knownTotal):'A confirmar com a Yes'}</strong></div><p>O envio da lista inicia uma conversa. O pedido só é confirmado após o atendimento da loja.</p><a href={href} target="_blank" rel="noreferrer" className="button button-whatsapp"><MessageCircle size={20}/> Enviar pedido pelo WhatsApp</a><button className="continue-shopping" onClick={onClose}>Continuar escolhendo</button></div></>:<div className="empty-state cart-empty"><ShoppingBag size={48}/><h3>Seu pedido começa aqui.</h3><p>Adicione seus produtos favoritos<br/>e converse com a Yes para finalizar.</p><button className="button button-red" onClick={()=>{onClose();navigate('/catalogo');}}>Explorar catálogo</button></div>}</Modal>;
}

function Contact(){return <section className="contact-section" id="contato"><div className="container contact-grid"><div className="reveal"><span className="eyebrow red-text">PODE CHEGAR. A CASA É SUA.</span><h2>Vamos conversar<br/>sobre o seu pedido?</h2><p>Uma dúvida, uma embalagem específica ou uma lista inteira.<br/>Nosso time está aqui para ajudar.</p><a href={whatsappUrl()} className="button button-red" target="_blank" rel="noreferrer"><MessageCircle size={19}/> Chamar no WhatsApp</a></div><div className="contact-details reveal"><div><Clock3 size={23}/><div><h3>Estamos por aqui</h3>{store.hours.map(h=><p key={h.days}><span>{h.days}</span><strong>{h.time}</strong></p>)}</div></div><div><Instagram size={23}/><div><h3>Tem novidade no Instagram</h3><a href={store.instagram} target="_blank" rel="noreferrer">{store.instagramHandle} <ExternalLink size={13}/></a></div></div><div><MessageCircle size={23}/><div><h3>Atendimento pelo WhatsApp</h3><a href={whatsappUrl()} target="_blank" rel="noreferrer">{store.phone}</a></div></div></div></div></section>;}
function Footer({Link,goSection}){return <footer className="footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Link href="/" aria-label="Yes Embalagens — início"><Logo/></Link><p>Embalagens para o seu negócio.<br/>Praticidade para o seu dia.</p></div><div><h3>Encontre na Yes</h3><Link href="/catalogo?categoria=refeicao">Refeição e delivery</Link><Link href="/catalogo?categoria=copos">Copos e garrafas</Link><Link href="/catalogo?categoria=sacolas">Sacolas e sacos</Link><Link href="/catalogo?categoria=limpeza">Limpeza e higiene</Link></div><div><h3>Fique à vontade</h3><Link href="/catalogo">Catálogo completo</Link><button onClick={()=>goSection('sobre')}>Sobre a Yes</button><button onClick={()=>goSection('contato')}>Contato e horários</button><a href={store.catalogPdf} target="_blank" rel="noreferrer">Catálogo em PDF <ExternalLink size={12}/></a></div><div className="footer-social"><h3>Perto de você</h3><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={16}/>{store.phone}</a><a href={store.instagram} target="_blank" rel="noreferrer"><Instagram size={16}/> Instagram da Yes</a><p>Seg. a sex. · 7h às 18h<br/>Sábado · 7h às 15h</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Yes Embalagens.</span><span>Feito para quem faz acontecer.</span><a href="https://wa.me/5585999745534" target="_blank" rel="noreferrer">Desenvolvido por <strong>Jonas Jr</strong></a></div></div></footer>;}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
