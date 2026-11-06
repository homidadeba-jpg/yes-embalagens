export const MAX_QUANTITY=999;
export function validQuantity(q) {return Math.max(1,Math.min(MAX_QUANTITY,Math.floor(Number(q)||1)));}
export function cartKey(id,option='') {return JSON.stringify([id,option]);}
export function addItem(cart,product,option,quantity) {
  if(product.options.length&&!product.options.includes(option)) throw new Error('Selecione uma opção válida.');
  const chosen=product.options.length?option:'';
  const key=cartKey(product.id,chosen);
  const found=cart.find(item=>item.key===key);
  return found?cart.map(item=>item.key===key?{...item,quantity:validQuantity(item.quantity+validQuantity(quantity))}:item):[...cart,{key,id:product.id,option:chosen,quantity:validQuantity(quantity)}];
}
export function restoreCart(raw,byId) {
  try {
    const parsed=JSON.parse(raw);
    if(!Array.isArray(parsed))return [];
    return parsed.slice(0,100).reduce((cart,item)=>{
      const product=byId[item?.id];
      if(!product||typeof item.option!=='string'||!Number.isFinite(item.quantity)||item.quantity<1)return cart;
      if(product.options.length&&!product.options.includes(item.option))return cart;
      return addItem(cart,product,item.option,item.quantity);
    },[]);
  } catch {return [];}
}
export function orderMessage(cart,byId,{name='',fulfillment='Retirada na loja',note=''}={}) {
  if(!cart.length) throw new Error('O carrinho está vazio.');
  const items=cart.map(item=>{
    const p=byId[item.id];
    return `• ${item.quantity} × ${p.name}${item.option?` — ${item.option}`:''}`;
  });
  return ['Olá, Yes Embalagens! Gostaria de um orçamento para este pedido:',...items,'',name.trim()?`Nome: ${name.trim()}`:'',`Preferência: ${fulfillment}`,note.trim()?`Observações: ${note.trim()}`:'','Por favor, confirmem os valores, a unidade de venda, a disponibilidade e as condições de entrega ou retirada.'].filter((s,i,a)=>s||a[i-1]).join('\n');
}
