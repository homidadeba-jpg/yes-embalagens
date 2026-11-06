"""Extract the supplied PDF's original images and text, preserving embedded alpha.
Source/ is an ignored local provenance directory. This does not synthesize product photos.
Run with pypdf and pdfplumber installed.
"""
import json
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

root = Path(__file__).resolve().parents[1]
reader = PdfReader(root / 'source/catalogo-original.pdf')
pdf = pdfplumber.open(root / 'source/catalogo-original.pdf')
out = root / 'public/images/products'
out.mkdir(parents=True, exist_ok=True)
pages = []
for i, (page, layout) in enumerate(zip(reader.pages, pdf.pages), 1):
    if i < 4:
        continue
    assets = []
    for asset in page.images:
        name = asset.name.split('.')[0]
        target = out / f'p{i}-{asset.name}'
        target.write_bytes(asset.data)
        positions = [dict(x0=round(im['x0']), x1=round(im['x1']), top=round(im['top']), bottom=round(im['bottom'])) for im in layout.images if im['name'] == name]
        assets.append(dict(name=name, file=f'/images/products/{target.name}', positions=positions))
    lines = layout.extract_text_lines()
    pages.append(dict(page=i, images=assets, lines=[dict(text=l['text'],x=round(l['x0']),y=round(l['top']),right=round(l['x1']),bottom=round(l['bottom'])) for l in lines]))
(root/'source/extraction.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(pages)} product pages; {sum(len(p["images"]) for p in pages)} original images extracted')
