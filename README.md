# Yes Embalagens

Site institucional e catálogo com carrinho de orçamento pelo WhatsApp. Projeto independente em React + Vite, com animações GSAP e ScrollTrigger. Não exige banco de dados nesta etapa.

## Desenvolvimento

Node 22 ou superior e npm. Execute `npm ci`, `npm run dev`. A prévia usa a porta 5190 para não interferir com os outros sites.

Verificações: `npm run check`, `npm test`, `npm run build`.

## Manutenção do catálogo

- Produtos: `src/data/catalog.tsv`. Uma linha por produto. Colunas: página do PDF, nome da imagem extraída, nome do produto, categoria, opções separadas por ponto e vírgula, observações. Separador entre colunas: `|`. O ID deriva do nome; mantenha os nomes estáveis quando houver preços ou carrinhos em uso.
- Preços: `src/data/prices.json`. O catálogo recebido não informa preços. Para incluir um, use o ID e o valor numérico em reais, por exemplo `{"copo-de-acai": 11.9}`. O valor se aplica ao produto inteiro; preços específicos por variação exigem ampliar o modelo antes de publicar. Não usar preços de posts do Instagram sem confirmação.
- Contatos e horários: `src/data/store.js`.
- Imagens finais: `public/images/products/`. Os arquivos WebP preservam as fotos e a transparência do PDF. `src/data/image-metrics.json` define a área visível de cada foto; o componente SVG centraliza e enquadra sem cortar o produto. O mesmo padrão se aplica em cards, fichas e carrinho.
- Imagem de abertura: `public/images/hero.webp`. Fotografia ilustrativa gerada, identificada na página e usada apenas na apresentação. As fotos de produtos vêm do catálogo real.

Direção visual, arquivos de imagem e prompt da geração: [ASSETS.md](ASSETS.md).

Os arquivos brutos e o PDF permanecem em `source/`, ignorado pelo Git. O script `scripts/extract-catalog.py` extrai as imagens originais com pypdf e pdfplumber. O script `scripts/prepare-assets.mjs` otimiza a entrega e calcula os enquadramentos (requer Sharp). Os arquivos finais já estão no repositório e não é preciso reextrair para fazer o build.

Repetições do mesmo produto em mais de uma página foram unificadas (bobina térmica, etiqueta de tamanho, cola branca e cola para isopor). Modelos do mesmo produto ficam como opções na ficha.

## Pedidos

O carrinho é salvo somente no navegador. O link para WhatsApp inclui produtos, opções, quantidades, nome opcional, preferência de entrega/retirada e observações. O envio abre uma conversa e não confirma uma compra. Valores, unidade de venda, disponibilidade e entrega são combinados com a loja. Não há pagamento online, estoque ou painel administrativo nesta fase.

Para integrar um sistema futuramente, substituir o módulo `src/data/catalog.js` por uma camada de consulta mantendo os IDs. A lógica de carrinho e a apresentação estão separadas da fonte de produtos. Não há credenciais no frontend.

## Origem dos dados

- Catálogo fornecido: https://ugc.production.linktr.ee/ec1c8538-53c1-4e9d-9ed5-bfa72cae96bf_Catalogo.pdf
- Identidade e horários: imagem do Instagram fornecida pelo usuário, perfil `@yesembalagens.oficial`.
- Contato provisório: o print informa final **0099**, enquanto a capa do PDF informa **0092**. Confirmar com o usuário antes de adotar um contato definitivo.
- Endereço omitido: não há endereço completo legível nos materiais fornecidos.

## Publicação

Repositório: https://github.com/homidadeba-jpg/yes-embalagens

Branch de produção: `main`. Configuração Vercel em `vercel.json`: validação do catálogo, build Vite e rota `/catalogo` com fallback para a aplicação. Após vincular a Vercel ao repositório, commit e push em `main` acionam a publicação. Os links e a verificação do vínculo são registrados em `PUBLICACAO.md`.

Crédito visível no rodapé: **Desenvolvido por Jonas Jr**, com WhatsApp https://wa.me/5585999745534.
