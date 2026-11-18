#!/usr/bin/env python3
"""Auditoría SEO de la web de Brillia.

Uso:
    python3 auditar_seo.py https://brilliaes.com
    python3 auditar_seo.py http://localhost:8030
    python3 auditar_seo.py https://brilliaes.com/limpieza-fin-de-obra-madrid

Solo lee: descarga la página y los archivos técnicos (robots.txt, sitemap.xml)
y escribe un informe en Markdown por la salida estándar. Usa solo la biblioteca
estándar de Python. Sale con código 1 si encuentra problemas graves.
"""
from __future__ import annotations

import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

AGENTE = "Mozilla/5.0 (compatible; BrilliaSEOAudit/1.0)"
DOMINIO_PRINCIPAL = "brilliaes.com"
# Contenedores que js/main.js rellena en el navegador; si llegan vacíos en el HTML,
# su contenido solo existe para quien ejecuta JavaScript.
CONTENEDORES_JS = {
    "tarjetasServicios": "Los servicios",
    "opinionesLista": "Las opiniones",
    "faqLista": "Las preguntas frecuentes",
}
# Cifras de ejemplo de la primera versión de la web: hay que confirmar que son reales.
CIFRAS_EJEMPLO = ["1.200+ opiniones", "4,9/5", "4800", "26000", "+4.800"]


class Respuesta:
    def __init__(self, url, estado, cabeceras, cuerpo, url_final):
        self.url = url
        self.estado = estado
        self.cabeceras = cabeceras
        self.cuerpo = cuerpo
        self.url_final = url_final


class SinRedireccion(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):  # noqa: D401
        return None


def pedir(url: str, seguir: bool = True) -> Respuesta:
    contexto = ssl.create_default_context()
    manejadores = [urllib.request.HTTPSHandler(context=contexto)]
    if not seguir:
        manejadores.append(SinRedireccion())
    abridor = urllib.request.build_opener(*manejadores)
    peticion = urllib.request.Request(url, headers={"User-Agent": AGENTE})
    try:
        with abridor.open(peticion, timeout=20) as r:
            return Respuesta(url, r.status, dict(r.headers), r.read().decode("utf-8", "replace"), r.geturl())
    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode("utf-8", "replace") if e.fp else ""
        return Respuesta(url, e.code, dict(e.headers or {}), cuerpo, url)
    except Exception as e:  # red caída, DNS, certificado...
        return Respuesta(url, 0, {}, f"{type(e).__name__}: {e}", url)


class Analizador(HTMLParser):
    """Recoge lo que importa para el SEO en una sola pasada."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.titulo = ""
        self._en_titulo = False
        self.metas: dict[str, str] = {}
        self.links: list[dict] = []
        self.encabezados: list[tuple[str, str]] = []
        self._encabezado_abierto: list | None = None
        self.imagenes: list[dict] = []
        self.anclas: list[str] = []
        self.ids: set[str] = set()
        self.vacios: dict[str, bool] = {}
        self._contenedor: list | None = None
        self.jsonld: list[str] = []
        self._en_jsonld = False
        self._buffer_jsonld = ""
        self.texto_visible: list[str] = []
        self._ignorar = 0

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        if "id" in a:
            self.ids.add(a["id"])
            if a["id"] in CONTENEDORES_JS:
                self._contenedor = [a["id"], tag, 1, False]
        elif self._contenedor and tag == self._contenedor[1]:
            self._contenedor[2] += 1
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._en_titulo = True
        elif tag == "meta":
            clave = a.get("name") or a.get("property")
            if clave:
                self.metas[clave.lower()] = a.get("content", "")
        elif tag == "link":
            self.links.append(a)
        elif tag in ("h1", "h2", "h3", "h4"):
            self._encabezado_abierto = [tag, ""]
        elif tag == "img":
            self.imagenes.append(a)
        elif tag == "a" and a.get("href"):
            self.anclas.append(a["href"])
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._en_jsonld = True
            self._buffer_jsonld = ""
        if tag in ("script", "style", "svg", "noscript"):
            self._ignorar += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self._en_titulo = False
        elif self._encabezado_abierto and tag == self._encabezado_abierto[0]:
            self.encabezados.append((tag, " ".join(self._encabezado_abierto[1].split())))
            self._encabezado_abierto = None
        elif tag == "script" and self._en_jsonld:
            self.jsonld.append(self._buffer_jsonld)
            self._en_jsonld = False
        if self._contenedor and tag == self._contenedor[1]:
            self._contenedor[2] -= 1
            if self._contenedor[2] == 0:
                self.vacios[self._contenedor[0]] = not self._contenedor[3]
                self._contenedor = None
        if tag in ("script", "style", "svg", "noscript") and self._ignorar:
            self._ignorar -= 1

    def handle_data(self, data):
        if self._en_titulo:
            self.titulo += data
        if self._encabezado_abierto:
            self._encabezado_abierto[1] += data
        if self._en_jsonld:
            self._buffer_jsonld += data
        if self._contenedor and data.strip():
            self._contenedor[3] = True
        if not self._ignorar and data.strip():
            self.texto_visible.append(data.strip())


class Informe:
    def __init__(self):
        self.items: list[tuple[str, str, str]] = []  # (nivel, seccion, texto)

    def ok(self, seccion, texto):
        self.items.append(("ok", seccion, texto))

    def aviso(self, seccion, texto):
        self.items.append(("aviso", seccion, texto))

    def grave(self, seccion, texto):
        self.items.append(("grave", seccion, texto))

    def imprimir(self, url):
        iconos = {"ok": "✅", "aviso": "⚠️", "grave": "❌"}
        print(f"# Auditoría SEO · {url}\n")
        secciones: dict[str, list] = {}
        for nivel, sec, txt in self.items:
            secciones.setdefault(sec, []).append((nivel, txt))
        for sec, lista in secciones.items():
            print(f"## {sec}\n")
            for nivel, txt in lista:
                print(f"- {iconos[nivel]} {txt}")
            print()
        graves = [t for n, _, t in self.items if n == "grave"]
        avisos = [t for n, _, t in self.items if n == "aviso"]
        print("## Resumen\n")
        print(f"- ❌ Graves: {len(graves)}")
        print(f"- ⚠️ Mejorables: {len(avisos)}")
        print(f"- ✅ Correctos: {sum(1 for n, _, _ in self.items if n == 'ok')}\n")
        if graves or avisos:
            print("### Por dónde empezar\n")
            for i, t in enumerate(graves + avisos, 1):
                print(f"{i}. {t}")
        return 1 if graves else 0


def auditar_pagina(r: Respuesta, p: Analizador, inf: Informe, es_produccion: bool):
    S = "Etiquetas principales"
    if p.lang and p.lang.lower().startswith("es"):
        inf.ok(S, f'Idioma declarado: `lang="{p.lang}"`.')
    else:
        inf.grave(S, 'Falta `lang="es"` en `<html>`.')

    titulo = " ".join(p.titulo.split())
    if not titulo:
        inf.grave(S, "La página no tiene `<title>`.")
    else:
        n = len(titulo)
        tl = titulo.lower()
        if n < 30 or n > 65:
            inf.aviso(S, f"Título de {n} caracteres (ideal 50–60): «{titulo}».")
        else:
            inf.ok(S, f"Título de {n} caracteres: «{titulo}».")
        if "limpieza" not in tl:
            inf.aviso(S, "El título no contiene «limpieza», la palabra que más se busca.")
        if "madrid" not in tl:
            inf.aviso(S, "El título no menciona «Madrid»; para un negocio local es clave.")

    desc = p.metas.get("description", "")
    if not desc:
        inf.grave(S, "Falta `<meta name=\"description\">`.")
    elif not 120 <= len(desc) <= 165:
        inf.aviso(S, f"Descripción de {len(desc)} caracteres (ideal 140–160).")
    else:
        inf.ok(S, f"Descripción de {len(desc)} caracteres.")
    if desc and "madrid" not in desc.lower():
        inf.aviso(S, "La descripción no menciona Madrid.")

    if "viewport" in p.metas:
        inf.ok(S, "Tiene `meta viewport` (apta para móvil).")
    else:
        inf.grave(S, "Falta `meta viewport`: Google indexa primero la versión móvil.")

    robots_meta = p.metas.get("robots", "")
    if "noindex" in robots_meta.lower():
        inf.grave(S, f"`meta robots` contiene noindex («{robots_meta}»): Google no indexará la página.")

    canon = next((l.get("href") for l in p.links if "canonical" in l.get("rel", "").split()), None)
    if not canon:
        inf.grave(S, "Falta `<link rel=\"canonical\">`.")
    else:
        dom = urlparse(canon).netloc
        if es_produccion and dom != DOMINIO_PRINCIPAL:
            inf.grave(S, f"El canonical apunta a `{dom}` en vez de `{DOMINIO_PRINCIPAL}`.")
        else:
            inf.ok(S, f"Canonical: `{canon}`.")

    S = "Encabezados"
    h1 = [t for tag, t in p.encabezados if tag == "h1"]
    if len(h1) == 1:
        inf.ok(S, f"Un único H1: «{h1[0]}».")
        if not re.search(r"limpi", h1[0], re.I):
            inf.aviso(S, "El H1 no dice que es una empresa de limpieza; Google lo usa para entender la página.")
    elif not h1:
        inf.grave(S, "No hay H1.")
    else:
        inf.aviso(S, f"Hay {len(h1)} H1; debería haber uno.")
    nivel_previo = 0
    for tag, texto in p.encabezados:
        nivel = int(tag[1])
        if nivel_previo and nivel > nivel_previo + 1:
            inf.aviso(S, f"Salto de {tag.upper()} sin nivel intermedio antes de «{texto[:50]}».")
            break
        nivel_previo = nivel
    h2 = [t for tag, t in p.encabezados if tag == "h2"]
    if h2 and not any(re.search(r"limpi|madrid", t, re.I) for t in h2):
        inf.aviso(S, "Ningún H2 contiene «limpieza» ni «Madrid»; hay oportunidad de usar búsquedas reales.")

    S = "Imágenes"
    sin_alt = [i.get("src", "?") for i in p.imagenes if "alt" not in i]
    if not p.imagenes:
        inf.ok(S, "No hay etiquetas `<img>` (ilustraciones en CSS/SVG).")
    elif sin_alt:
        inf.aviso(S, f"{len(sin_alt)} imágenes sin `alt`: {', '.join(sin_alt[:5])}.")
    else:
        inf.ok(S, f"Las {len(p.imagenes)} imágenes tienen `alt`.")

    S = "Redes sociales (Open Graph)"
    for clave in ("og:title", "og:description", "og:url", "og:type"):
        if clave in p.metas:
            inf.ok(S, f"`{clave}` presente.")
        else:
            inf.aviso(S, f"Falta `{clave}`.")
    if "og:image" not in p.metas:
        inf.aviso(S, "Falta `og:image`: al compartir por WhatsApp el enlace sale sin imagen.")
    else:
        inf.ok(S, "`og:image` presente.")
    if "twitter:card" not in p.metas:
        inf.aviso(S, "Falta `twitter:card` (`summary_large_image`).")

    S = "Datos estructurados (JSON-LD)"
    if not p.jsonld:
        inf.grave(S, "No hay JSON-LD. Añade `CleaningService` (negocio local) y `FAQPage`.")
    tipos = []
    for bloque in p.jsonld:
        try:
            datos = json.loads(bloque)
        except json.JSONDecodeError as e:
            inf.grave(S, f"Un bloque JSON-LD no es JSON válido: {e}.")
            continue
        nodos = datos.get("@graph", [datos]) if isinstance(datos, dict) else datos
        for nodo in nodos:
            if not isinstance(nodo, dict):
                continue
            t = nodo.get("@type")
            tipos.extend(t if isinstance(t, list) else [t])
            if t in ("CleaningService", "LocalBusiness", "HomeAndConstructionBusiness"):
                faltan = [c for c in ("name", "url", "telephone", "areaServed", "address", "openingHoursSpecification") if c not in nodo]
                if faltan:
                    inf.aviso(S, f"`{t}` sin: {', '.join(faltan)}.")
                else:
                    inf.ok(S, f"`{t}` completo en lo básico.")
                if "aggregateRating" in nodo or "review" in nodo:
                    inf.aviso(S, "Hay `aggregateRating`/`review`: confirma que son opiniones reales y verificables.")
    if p.jsonld:
        inf.ok(S, f"Tipos encontrados: {', '.join(str(t) for t in tipos) or 'ninguno'}.")
        if not any(t in ("CleaningService", "LocalBusiness", "HomeAndConstructionBusiness") for t in tipos):
            inf.aviso(S, "Falta un tipo de negocio local (`CleaningService`).")
        if p.vacios.get("faqLista") is not None and "FAQPage" not in tipos:
            inf.aviso(S, "Hay preguntas frecuentes pero no `FAQPage`.")

    S = "Contenido"
    for cid, nombre in CONTENEDORES_JS.items():
        if cid in p.vacios:
            if p.vacios[cid]:
                inf.aviso(S, f"{nombre} (`#{cid}`) solo existen vía JavaScript; conviene tener ese contenido también en el HTML o en JSON-LD para que todos los buscadores lo lean.")
            else:
                inf.ok(S, f"{nombre} (`#{cid}`) están en el HTML.")
    palabras = len(" ".join(p.texto_visible).split())
    if palabras < 300:
        inf.aviso(S, f"Solo {palabras} palabras de texto en el HTML; las páginas que posicionan suelen tener más de 300.")
    else:
        inf.ok(S, f"{palabras} palabras de texto en el HTML.")
    cuerpo = r.cuerpo
    encontradas = [c for c in CIFRAS_EJEMPLO if c in cuerpo]
    if encontradas:
        inf.aviso(S, f"Cifras de ejemplo de la primera versión ({', '.join(encontradas)}): confirma con el usuario que son reales o sustitúyelas.")

    S = "Enlaces internos"
    rotos = sorted({h for h in p.anclas if h.startswith("#") and len(h) > 1 and h[1:] not in p.ids})
    if rotos:
        inf.grave(S, f"Anclas que no llevan a ninguna sección: {', '.join(rotos)}.")
    else:
        inf.ok(S, "Todas las anclas internas (#...) existen.")
    rutas = sorted({h for h in p.anclas if h.startswith("/") and not h.startswith("//")})
    for ruta in rutas[:20]:
        rr = pedir(urljoin(r.url_final, ruta))
        if rr.estado >= 400 or rr.estado == 0:
            inf.grave(S, f"Enlace interno roto: `{ruta}` ({rr.estado}).")


def auditar_sitio(base: str, inf: Informe, es_produccion: bool):
    S = "Archivos técnicos"
    robots = pedir(urljoin(base, "/robots.txt"))
    if robots.estado == 200 and "user-agent" in robots.cuerpo.lower():
        inf.ok(S, "robots.txt existe.")
        if re.search(r"^disallow:\s*/\s*$", robots.cuerpo, re.I | re.M):
            inf.grave(S, "robots.txt bloquea todo el sitio (`Disallow: /`).")
        if "sitemap:" not in robots.cuerpo.lower():
            inf.aviso(S, "robots.txt no indica la URL del sitemap.")
    else:
        inf.aviso(S, f"No hay robots.txt ({robots.estado}).")

    sitemap = pedir(urljoin(base, "/sitemap.xml"))
    if sitemap.estado == 200 and "<urlset" in sitemap.cuerpo:
        urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", sitemap.cuerpo)
        inf.ok(S, f"sitemap.xml con {len(urls)} URL(s).")
        if es_produccion:
            for u in urls[:30]:
                ru = pedir(u)
                if ru.estado != 200:
                    inf.grave(S, f"El sitemap incluye `{u}`, que responde {ru.estado}.")
                if urlparse(u).netloc != DOMINIO_PRINCIPAL:
                    inf.aviso(S, f"El sitemap usa `{urlparse(u).netloc}` en vez de `{DOMINIO_PRINCIPAL}`: `{u}`.")
    else:
        inf.aviso(S, f"No hay sitemap.xml ({sitemap.estado}).")

    if not es_produccion:
        return
    S = "Dominio y HTTPS"
    for origen in (f"http://{DOMINIO_PRINCIPAL}/", f"https://www.{DOMINIO_PRINCIPAL}/", f"http://www.{DOMINIO_PRINCIPAL}/"):
        actual, saltos, temporales = origen, [], False
        for _ in range(5):
            rr = pedir(actual, seguir=False)
            destino = rr.cabeceras.get("Location") or rr.cabeceras.get("location") or ""
            if rr.estado not in (301, 302, 307, 308) or not destino:
                break
            temporales |= rr.estado in (302, 307)
            actual = urljoin(actual, destino)
            saltos.append(f"{rr.estado} → {actual}")
        if not actual.startswith(f"https://{DOMINIO_PRINCIPAL}/"):
            inf.grave(S, f"`{origen}` no termina en https://{DOMINIO_PRINCIPAL}/ (último destino «{actual}»).")
        elif temporales:
            inf.aviso(S, f"`{origen}` usa una redirección temporal (302/307); mejor 301/308. Cadena: {'; '.join(saltos)}.")
        elif len(saltos) > 2:
            inf.aviso(S, f"`{origen}` llega en {len(saltos)} saltos; mejor uno o dos.")
        else:
            inf.ok(S, f"`{origen}` redirige de forma permanente a https://{DOMINIO_PRINCIPAL}/ ({len(saltos)} salto{'s' if len(saltos) != 1 else ''}).")


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    url = sys.argv[1].rstrip("/") or sys.argv[1]
    if not urlparse(url).scheme:
        url = "https://" + url
    r = pedir(url)
    inf = Informe()
    if r.estado != 200:
        inf.grave("Acceso", f"La página respondió {r.estado}: {r.cuerpo[:200]}")
        sys.exit(inf.imprimir(url))
    es_produccion = urlparse(r.url_final).netloc.endswith(DOMINIO_PRINCIPAL)
    p = Analizador()
    p.feed(r.cuerpo)
    base = f"{urlparse(r.url_final).scheme}://{urlparse(r.url_final).netloc}"
    auditar_pagina(r, p, inf, es_produccion)
    auditar_sitio(base, inf, es_produccion)
    sys.exit(inf.imprimir(r.url_final))


if __name__ == "__main__":
    main()
