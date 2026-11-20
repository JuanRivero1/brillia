---
name: tuservicio-marca
description: Diseño y marca de TUservicio, la empresa de limpieza en Madrid (tuservicioes.com). Contiene el logo (símbolo casa-U), sus versiones, la paleta, la tipografía, la voz y el manual de marca, más scripts para regenerar los SVG y PNG. Úsala siempre que el usuario pida o toque algo visual o de identidad: logo, favicon, icono, colores, fuentes, branding, manual de marca, tarjetas de visita, uniformes, furgoneta, carteles, flyers, plantillas de presupuesto o factura, imágenes para redes o WhatsApp, foto de perfil, rediseños de la web o textos con el tono de la marca, aunque no diga «marca» ni «diseño».
---

# Marca y diseño de TUservicio

TUservicio es una empresa de limpieza profesional en Madrid (antes se llamaba Brillia; ese nombre no debe aparecer en ningún sitio). Su web es estática (HTML, CSS y JS sin build) y se publica en Vercel con cada `git push` a `main`.

Esta skill es la fuente de verdad de la identidad visual y verbal. Sirve para:

1. **Aplicar la marca** en cualquier pieza nueva (web, documentos, redes, impresos) sin inventar colores ni versiones del logo.
2. **Modificar el logo o la paleta** de forma controlada, regenerando todos los archivos desde un solo sitio.
3. **Revisar** que algo ya hecho respeta la marca.

## Qué hay aquí

| Ruta | Qué es |
|---|---|
| `references/marca.md` | La guía completa: idea, versiones del logo, zona de respeto, colores con contraste, tipografía, formas, voz y aplicaciones. **Léela antes de diseñar nada.** |
| `manual-de-marca.html` | El manual visual con ejemplos. Ábrelo en el navegador desde la carpeta de la skill (usa rutas relativas a `assets/marca/`). |
| `scripts/generar_marca.py` | Genera todos los SVG del logo desde la definición del símbolo y la fuente. |
| `scripts/exportar_png.py` | Exporta los PNG (icono 512, apple-touch-icon, perfil 1024, logos para documentos). |
| `fuentes/Outfit.ttf` + `OFL.txt` | Fuente del logo (Google Fonts, licencia OFL, redistribuible con su licencia). |

Los archivos finales están en el repo, en `assets/marca/` (públicos en la web) más `assets/favicon.svg`, `assets/logo-512.png` y `assets/apple-touch-icon.png`.

## Resumen de la marca

- **Nombre:** siempre «TUservicio»: TU en mayúsculas, servicio en minúsculas, junto. En el logo, «TU» en Outfit 800 turquesa oscuro y «servicio» en Outfit 600 tinta.
- **Símbolo:** casa cuyo cuerpo es una «U» (tu casa), trazo blanco redondeado sobre un cuadrado de esquinas redondeadas con degradado turquesa, y un destello lima.
- **Colores clave:** turquesa oscuro `#0f766e` (texto y botones), turquesa `#0ea5a4`, menta `#5eead4`, lima `#a3e635` (solo acento, nunca texto sobre blanco), tinta `#0f172a`, niebla `#f8fafc`, noche `#0b1b2b`.
- **Tipografía:** Outfit para titulares y logo; Inter para texto.
- **Voz:** tuteo, cercana, concreta (precio, tiempo, qué incluye), sin superlativos vacíos.

Los detalles y el porqué de cada regla están en `references/marca.md`.

## Flujos de trabajo

### Usar la marca en una pieza nueva

1. Lee `references/marca.md`.
2. Usa los archivos de `assets/marca/` tal cual. No redibujes el logo ni escribas «TUservicio» con una fuente como si fuera el logo: el nombre del logo está convertido en trazados para que se vea igual en todas partes.
3. Elige la versión según el fondo: a color sobre claros, `-blanco` sobre oscuros o fotos, `simbolo-mono` para un solo color.
4. Para texto, usa solo combinaciones aptas de la tabla de contraste. El turquesa `#0ea5a4` con texto blanco solo vale para texto grande (24 px, o 19 px en negrita).
5. Si la pieza es web, reutiliza las variables CSS de `css/styles.css` (`--primario`, `--primario-oscuro`, `--acento`, `--fuente-titulo`...), que ya siguen esta paleta.
6. Para piezas impresas, entrega SVG o PDF vectorial; los PNG son para pantalla.

### Cambiar el logo, un color o la fuente

1. Edita la definición en `scripts/generar_marca.py`: constantes de color, trazados del símbolo (`TEJADO`, `CUERPO_U`, `DESTELLO`) o tamaños del texto.
2. Prepara fontTools (no está instalado globalmente) y genera los SVG desde la raíz del repo:

   ```bash
   ~/.local/bin/uv venv /tmp/marca-venv
   ~/.local/bin/uv pip install --python /tmp/marca-venv/bin/python fonttools
   /tmp/marca-venv/bin/python .claude/skills/tuservicio-marca/scripts/generar_marca.py
   python3 .claude/skills/tuservicio-marca/scripts/exportar_png.py
   ```

3. Revisa el resultado visualmente (por ejemplo, una hoja con todas las versiones en Chrome sin interfaz) en fondo claro, oscuro y a 16, 24 y 32 px.
4. Actualiza `references/marca.md` y `manual-de-marca.html` si cambió algún valor.
5. Si cambia un color, cámbialo también en `css/styles.css`, en `<meta name="theme-color">` de `index.html` y en `manifest.webmanifest`.
6. Si cambia el símbolo, actualiza el SVG en línea del logo en `index.html` (cabecera y pie) y regenera la imagen para compartir con la skill `tuservicio-seo` (`assets/og-tuservicio.html` → `assets/og-tuservicio.jpg`).

### Revisar algo existente

Compara con `references/marca.md`: escritura del nombre, versión del logo según el fondo, zona de respeto, colores fuera de paleta, contraste del texto, fuentes y tono. Informa de lo que no cumple con lo más visible primero.

## Qué no hacer

- No inventes colores, degradados ni versiones nuevas del logo sin que el usuario lo pida.
- No uses imágenes de bancos genéricos ni emojis como logo (el ✨ del chat de la web es decorativo, no es el logo).
- No publiques cambios visuales en producción sin enseñárselos antes al usuario: haz los cambios en local, muestra capturas y espera su visto bueno para hacer `git push`.
- No vuelvas a introducir el nombre ni el logo antiguos de Brillia.
