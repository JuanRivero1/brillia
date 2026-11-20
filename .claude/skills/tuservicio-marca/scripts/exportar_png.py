#!/usr/bin/env python3
"""Exporta a PNG los SVG de assets/marca/ con Chrome sin interfaz (y Pillow para recortar).

Escribe:
  assets/logo-512.png              símbolo 512×512 sobre blanco (JSON-LD, manifest, Google)
  assets/apple-touch-icon.png      símbolo 180×180 sobre blanco (icono al añadir la web al móvil)
  assets/marca/simbolo-1024.png    símbolo 1024×1024 sobre blanco (perfil de WhatsApp, Instagram, Google Business)
  assets/marca/logo-horizontal.png logo horizontal, 1200 px de ancho, fondo transparente (documentos)
  assets/marca/logo-vertical.png   logo vertical, 800 px de alto, fondo transparente

Uso, desde la raíz del repo (después de generar_marca.py):
  python3 .claude/skills/tuservicio-marca/scripts/exportar_png.py
"""
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

RAIZ = Path.cwd()
MARCA = RAIZ / "assets" / "marca"


def proporcion(svg):
    caja = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg.read_text()).groups()
    return float(caja[0]) / float(caja[1])


def capturar(svg, ancho, alto, destino, fondo="#ffffff", margen=0):
    transparente = fondo is None
    html = (f'<!doctype html><html><head><style>*{{margin:0}}html,body{{width:{ancho}px;height:{alto}px;'
            f'background:{"transparent" if transparente else fondo};display:grid;place-items:center;overflow:hidden}}'
            f'img{{width:{ancho - 2 * margen}px;height:{alto - 2 * margen}px}}</style></head>'
            f'<body><img src="{svg.as_uri()}"></body></html>')
    with tempfile.TemporaryDirectory() as tmp:
        pagina = Path(tmp) / "p.html"
        pagina.write_text(html)
        captura = Path(tmp) / "c.png"
        args = ["google-chrome", "--headless=new", "--disable-gpu", "--hide-scrollbars",
                "--allow-file-access-from-files", f"--window-size={ancho},{alto}",
                f"--screenshot={captura}", pagina.as_uri()]
        if transparente:
            args.insert(4, "--default-background-color=00000000")
        subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        img = Image.open(captura)
        img = img.convert("RGBA" if transparente else "RGB")
        img.crop((0, 0, ancho, alto)).save(destino, optimize=True)
    print(f"escrito {destino.relative_to(RAIZ)} ({ancho}×{alto})")


def main():
    simbolo = MARCA / "simbolo.svg"
    capturar(simbolo, 512, 512, RAIZ / "assets" / "logo-512.png", margen=24)
    capturar(simbolo, 180, 180, RAIZ / "assets" / "apple-touch-icon.png", margen=0)
    capturar(simbolo, 1024, 1024, MARCA / "simbolo-1024.png", margen=96)

    horizontal = MARCA / "logo-horizontal.svg"
    capturar(horizontal, 1200, round(1200 / proporcion(horizontal)), MARCA / "logo-horizontal.png", fondo=None)
    vertical = MARCA / "logo-vertical.svg"
    capturar(vertical, round(800 * proporcion(vertical)), 800, MARCA / "logo-vertical.png", fondo=None)


if __name__ == "__main__":
    main()
