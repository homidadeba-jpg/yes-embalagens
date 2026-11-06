import test from 'node:test';
import assert from 'node:assert/strict';
import {addItem,restoreCart,cartKey,orderMessage,validQuantity} from '../src/lib/cart.mjs';
const cup={id:'copo',name:'Copo de açaí',options:['300 ml','500 ml']};
const bag={id:'sacola',name:'Sacola kraft',options:[]};
const byId={copo:cup,sacola:bag};
test('merges repeated options and keeps distinct sizes separate',()=>{
  let cart=addItem([],cup,'300 ml',2);
  cart=addItem(cart,cup,'300 ml',3);
  cart=addItem(cart,cup,'500 ml',1);
  assert.equal(cart.length,2);assert.deepEqual(cart.map(i=>i.quantity),[5,1]);
  assert.throws(()=>addItem(cart,cup,'200 ml',1));
});
test('restores only valid saved items, merging duplicates and bounding quantities',()=>{
  const restored=restoreCart(JSON.stringify([{id:'copo',option:'300 ml',quantity:2},{id:'copo',option:'300 ml',quantity:4},{id:'gone',option:'',quantity:1},{id:'copo',option:'invalid',quantity:1},{id:'sacola',option:'',quantity:10000}]),byId);
  assert.equal(restored.length,2);assert.equal(restored[0].quantity,6);assert.equal(restored[1].quantity,999);
  assert.deepEqual(restoreCart('{invalid',byId),[]);assert.deepEqual(restoreCart('{}',byId),[]);assert.equal(validQuantity(-1),1);
});
test('WhatsApp message includes every selected size, quantities and customer notes',()=>{
  const cart=addItem(addItem([],cup,'500 ml',3),bag,'',2);
  const message=orderMessage(cart,byId,{name:'Ana',fulfillment:'Consultar entrega',note:'Quero confirmar as cores.'});
  assert.match(message,/3 × Copo de açaí — 500 ml/);assert.match(message,/2 × Sacola kraft/);
  assert.match(message,/Nome: Ana/);assert.match(message,/Consultar entrega/);assert.match(message,/confirmar as cores/);
  assert.match(message,/unidade de venda/);assert.throws(()=>orderMessage([],byId));
  assert.equal(cart[0].key,cartKey('copo','500 ml'));
});
