#!/usr/bin/env python3
"""Genera todos los SVG de la marca TUservicio desde una única definición.

Escribe en assets/marca/ (y sustituye assets/favicon.svg):
  simbolo.svg                 símbolo a color (cuadrado turquesa con casa-U y destello)
  simbolo-mono.svg            símbolo en un solo color (turquesa oscuro), sin degradado ni destello
  simbolo-blanco.svg          símbolo para fondos oscuros (cuadrado blanco, trazos turquesa)
  logo-horizontal.svg         símbolo + «TUservicio», para fondos claros
  logo-horizontal-blanco.svg  ídem para fondos oscuros
  logo-vertical.svg           símbolo encima del nombre y el lema
  nombre.svg                  solo el nombre, sin símbolo
  favicon.svg                 versión simplificada para 16–48 px (trazos más gruesos, sin destello)

El texto del nombre se convierte en trazados con la fuente Outfit (fuentes/Outfit.ttf, licencia OFL),
así los logos se ven igual en cualquier equipo aunque no tenga la fuente instalada.

Requiere fontTools. Desde la raíz del repo:
  uv venv /tmp/marca-venv && uv pip install --python /tmp/marca-venv/bin/python fonttools
  /tmp/marca-venv/bin/python .claude/skills/tuservicio-marca/scripts/generar_marca.py
"""
from pathlib import Path
import io

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

RAIZ = Path.cwd()
SKILL = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "assets" / "marca"
FUENTE = SKILL / "fuentes" / "Outfit.ttf"

# ---- Paleta (ver references/marca.md) ----
TURQUESA = "#0ea5a4"
TURQUESA_CLARO = "#14b8a6"
TURQUESA_OSCURO = "#0f766e"
MENTA = "#5eead4"
LIMA = "#a3e635"
TINTA = "#0f172a"
BLANCO = "#ffffff"

# ---- Símbolo: casa cuyo cuerpo es una «U» (de TU), en una caja de 64×64 ----
TEJADO = "M13 31 L32 15 L51 31"
CUERPO_U = "M21 31 V39 a11 11 0 0 0 22 0 V31"
DESTELLO = "M50 8 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z"


def simbolo(fondo="degradado", trazo=BLANCO, grosor=5.5, destello=True, ident="ts"):
    """Devuelve el contenido SVG (sin <svg>) del símbolo en una caja 0 0 64 64."""
    defs = ""
    if fondo == "degradado":
        defs = (f'<defs><linearGradient id="{ident}" x1="0" y1="0" x2="1" y2="1">'
                f'<stop offset="0" stop-color="{TURQUESA_CLARO}"/><stop offset="1" stop-color="{TURQUESA_OSCURO}"/>'
                f'</linearGradient></defs>')
        relleno = f"url(#{ident})"
    else:
        relleno = fondo
    partes = [
        defs,
        f'<rect width="64" height="64" rx="16" fill="{relleno}"/>',
        f'<path d="{TEJADO}" fill="none" stroke="{trazo}" stroke-width="{grosor}" stroke-linecap="round" stroke-linejoin="round"/>',
        f'<path d="{CUERPO_U}" fill="none" stroke="{trazo}" stroke-width="{grosor}" stroke-linecap="round"/>',
    ]
    if destello:
        partes.append(f'<path d="{DESTELLO}" fill="{LIMA}"/>')
    return "".join(partes)


# ---- Texto a trazados ----
_cache = {}


def fuente(peso):
    if peso not in _cache:
        f = TTFont(FUENTE)
        f = instantiateVariableFont(f, {"wght": peso})
        _cache[peso] = f
    return _cache[peso]


def texto(cadena, peso, tam, x=0.0, y=0.0, espaciado=-0.02):
    """Trazado SVG de `cadena` con la línea base en (x, y). Devuelve (d, ancho)."""
    f = fuente(peso)
    upm = f["head"].unitsPerEm
    escala = tam / upm
    glifos = f.getGlyphSet()
    cmap = f.getBestCmap()
    pen = SVGPathPen(glifos)
    cursor = x
    for c in cadena:
        nombre = cmap[ord(c)]
        g = glifos[nombre]
        g.draw(TransformPen(pen, (escala, 0, 0, -escala, cursor, y)))
        cursor += g.width * escala + espaciado * tam
    return pen.getCommands(), cursor - x - espaciado * tam


def metricas(tam, peso=800):
    f = fuente(peso)
    escala = tam / f["head"].unitsPerEm
    os2 = f["OS/2"]
    return os2.sCapHeight * escala


def nombre(x, y, tam, color_tu, color_resto):
    """«TU» en negrita extra + «servicio» en seminegrita. Devuelve (svg, ancho)."""
    d_tu, a_tu = texto("TU", 800, tam, x, y)
    hueco = tam * 0.02
    d_resto, a_resto = texto("servicio", 600, tam, x + a_tu + hueco, y)
    svg = f'<path d="{d_tu}" fill="{color_tu}"/><path d="{d_resto}" fill="{color_resto}"/>'
    return svg, a_tu + hueco + a_resto


def guardar(nombre_archivo, ancho, alto, cuerpo, titulo):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho:.1f} {alto:.1f}" '
           f'role="img" aria-label="{titulo}"><title>{titulo}</title>{cuerpo}</svg>\n')
    ruta = SALIDA / nombre_archivo
    ruta.write_text(svg, encoding="utf-8")
    return ruta


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    escritos = []

    # Símbolos
    escritos.append(guardar("simbolo.svg", 64, 64, simbolo(ident="tsA"), "TUservicio"))
    escritos.append(guardar("simbolo-mono.svg", 64, 64, simbolo(fondo=TURQUESA_OSCURO, destello=False), "TUservicio"))
    escritos.append(guardar("simbolo-blanco.svg", 64, 64, simbolo(fondo=BLANCO, trazo=TURQUESA_OSCURO, ident="tsB"), "TUservicio"))
    fav = simbolo(fondo=TURQUESA_OSCURO, grosor=7, destello=False)
    escritos.append(guardar("favicon.svg", 64, 64, fav, "TUservicio"))
    (RAIZ / "assets" / "favicon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{fav}</svg>\n', encoding="utf-8")

    # Logo horizontal: símbolo de 64 + separación + nombre con altura de mayúscula ≈ 56 % del símbolo
    tam = 46.0
    cap = metricas(tam)
    sep = 16.0
    base = 32 + cap / 2  # centra la altura de mayúsculas con el símbolo
    for archivo, sim, c_tu, c_resto in [
        ("logo-horizontal.svg", simbolo(ident="tsH"), TURQUESA_OSCURO, TINTA),
        ("logo-horizontal-blanco.svg", simbolo(fondo=BLANCO, trazo=TURQUESA_OSCURO, ident="tsHB"), MENTA, BLANCO),
    ]:
        txt, ancho_txt = nombre(64 + sep, base, tam, c_tu, c_resto)
        escritos.append(guardar(archivo, 64 + sep + ancho_txt + 2, 64, sim + txt, "TUservicio"))

    # Solo nombre
    txt, ancho_txt = nombre(0, cap, tam, TURQUESA_OSCURO, TINTA)
    escritos.append(guardar("nombre.svg", ancho_txt + 2, cap + 12, txt, "TUservicio"))

    # Vertical: símbolo 96 centrado, nombre debajo y lema
    tam_v = 40.0
    _, ancho_n = nombre(0, 0, tam_v, TURQUESA_OSCURO, TINTA)
    d_lema, ancho_lema = texto("LIMPIEZA PROFESIONAL", 500, 13, 0, 0, espaciado=0.18)
    ancho = max(ancho_n, ancho_lema, 96) + 8
    sim_v = f'<g transform="translate({(ancho - 96) / 2:.2f} 0) scale(1.5)">{simbolo(ident="tsV")}</g>'
    cap_v = metricas(tam_v)
    y_nombre = 96 + 22 + cap_v
    txt_v, _ = nombre((ancho - ancho_n) / 2, y_nombre, tam_v, TURQUESA_OSCURO, TINTA)
    d_lema, _ = texto("LIMPIEZA PROFESIONAL", 500, 13, (ancho - ancho_lema) / 2, y_nombre + 28, espaciado=0.18)
    lema = f'<path d="{d_lema}" fill="{TURQUESA_OSCURO}"/>'
    escritos.append(guardar("logo-vertical.svg", ancho, y_nombre + 34, sim_v + txt_v + lema, "TUservicio, limpieza profesional"))

    for r in escritos:
        print(f"escrito {r.relative_to(RAIZ)}")
    print("escrito assets/favicon.svg")


if __name__ == "__main__":
    main()
