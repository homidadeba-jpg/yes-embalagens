export const store = {
  name: 'Yes Embalagens',
  whatsapp: '5585981420099',
  phone: '(85) 98142-0099',
  instagram: 'https://www.instagram.com/yesembalagens.oficial/',
  instagramHandle: '@yesembalagens.oficial',
  catalogPdf: 'https://ugc.production.linktr.ee/ec1c8538-53c1-4e9d-9ed5-bfa72cae96bf_Catalogo.pdf',
  hours: [ { days: 'Segunda a sexta', time: '7h às 18h' }, { days: 'Sábado', time: '7h às 15h' } ],
};
export function whatsappUrl(text='Olá, Yes Embalagens! Gostaria de saber mais sobre os produtos.') {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`;
}
