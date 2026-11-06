# Imagens e direção visual

Identidade: amarelo `#ffcd05`, vermelho `#96191c`, branco e tons neutros. Logo original extraída da capa do PDF, sem redesenho, apresentada em `public/images/logo-original.png`. Tipografia Manrope e DM Sans. Movimento com GSAP, `useGSAP` e ScrollTrigger; a preferência de movimento reduzido desativa as animações.

## Fotos de catálogo

`public/images/products/`: 286 imagens WebP, extraídas do PDF fornecido, preservando as fotografias e a transparência. Não foram geradas fotos de produtos nem removidos detalhes deles por IA. Os originais ficam em `source/original-products/` no computador, fora do Git.

O enquadramento usa os limites visíveis do canal alfa. Um viewport SVG mostra cada imagem centralizada e com o mesmo espaço útil. Isso padroniza a escala sem deformar o produto ou alterar seus pixels. Imagens repetidas ou de modelos do mesmo produto foram agrupadas.

## Hero

Arquivo final: `public/images/hero.webp`.

Ferramenta: image_gen integrada, modo de geração. É uma composição ilustrativa, identificada na página, que apresenta a categoria da loja; o catálogo mantém as fotos reais.

Prompt utilizado:

> Use case: product-mockup. Asset type: square editorial hero photograph for Yes Embalagens, a Brazilian packaging supplies shop whose identity is sunny yellow and dark red. Create a premium, photorealistic studio still life of disposable food packaging: a tall plain kraft paper shopping bag with twisted handles at the back, an open kraft hamburger clamshell carton at front left, two stacked round kraft takeaway bowls with transparent lids, a clear plastic cold-drink cup with a flat lid, a small white paper coffee cup and a small cluster of wooden disposable cutlery. Authentic everyday packaging, realistic manufacturing proportions. Composition: sculptural grouping with different heights on matte warm yellow plinths, objects occupy most of the frame, ample breathing room at edges, balanced center framing. Backdrop: seamless solid warm vivid yellow (#ffcc05), including tabletop. Camera: eye level slightly above products, 50mm, soft directional daylight with crisp but gentle shadows. Polished commercial product photography, tactile paper, transparent plastic clearly visible. No food, people, letters, text, branding, stickers, logos, watermark, or decorative graphics. Square composition.

O PNG original foi preservado em `source/hero-generated.png`; o WebP para o site tem 1.100 px de largura e aproximadamente 136 KB.
