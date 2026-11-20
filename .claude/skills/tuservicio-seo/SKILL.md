---
name: tuservicio-seo
description: Gestiona el posicionamiento SEO de la web de TUservicio (tuservicioes.com), la empresa de limpieza en Madrid. Audita la página, corrige títulos, descripciones, encabezados, datos estructurados, robots.txt y sitemap, crea páginas de servicio orientadas a búsquedas locales y verifica el resultado en producción. Úsala siempre que el usuario hable de SEO, posicionamiento, Google, salir en buscadores, palabras clave, Search Console, ficha de Google Business, visitas orgánicas, "que me encuentren", meta descripciones, sitemap o nuevas páginas para captar clientes, aunque no diga "SEO" de forma explícita.
---

# SEO de TUservicio

TUservicio es una empresa de limpieza de Madrid con una web estática de una sola página: HTML, CSS y JavaScript sin frameworks ni build, en la raíz del repo. Se despliega sola en Vercel con cada `git push` a `main` y se sirve en https://tuservicioes.com. Su objetivo es que alguien en Madrid que busque "limpieza de pisos", "limpieza fin de obra" o "empresa de limpieza cerca de mí" encuentre TUservicio y le escriba por WhatsApp.

> **Cambio de marca (19 nov 2026).** La empresa se llamaba Brillia (dominio `brilliaes.com`, en IONOS). Ahora es TUservicio en `tuservicioes.com`, registrado en Wix el 19 nov 2026, que también gestiona su DNS. El usuario quiere transferirlo a IONOS cuando pase el bloqueo de 60 días (hacia el 18 ene 2027); entonces hay que recrear en IONOS los registros A y CNAME que apuntan a Vercel. El email de contacto es `infotuservicioes@gmail.com`; si cambia, cámbialo en `js/datos.js`, `index.html` y `references/fuera-de-pagina.md` y ejecuta `sincronizar_html.mjs`.

Esta skill sirve para tres tipos de trabajo, que se combinan a menudo:

1. **Auditar**: saber cómo está el SEO ahora y qué arreglar primero.
2. **Mejorar en la página**: títulos, textos, datos estructurados, archivos técnicos y páginas nuevas.
3. **Fuera de la página**: Google Search Console, ficha de Google Business, opiniones y directorios. Esto lo hace el usuario en sus cuentas; tú le guías y preparas lo que haga falta.

## Cómo es la web (y por qué importa para el SEO)

- `index.html` es la única página. Las secciones van por anclas (`#servicios`, `#presupuesto`, `#prueba`, `#opiniones`, `#reservar`, `#faq`).
- `js/datos.js` es la fuente única de teléfono, email, servicios, tarifas, opiniones y FAQ. `js/main.js` los pinta en el navegador. Google ejecuta JavaScript, pero con retraso y no siempre; otros buscadores y las vistas previas de redes sociales no. Por eso las tarjetas de servicios, las preguntas frecuentes y el JSON-LD (`CleaningService` + `FAQPage`) también están en el HTML estático, entre marcadores `<!-- datos:servicios -->`, `<!-- datos:faq -->` y `<!-- datos:jsonld -->` de `index.html`.
- **Esos bloques no se editan a mano**: los genera `scripts/sincronizar_html.mjs` a partir de `js/datos.js`. Cada vez que cambien servicios, precios "desde", FAQ, teléfono o email en `datos.js`, ejecútalo desde la raíz del repo:

  ```bash
  node .claude/skills/tuservicio-seo/scripts/sincronizar_html.mjs
  node .claude/skills/tuservicio-seo/scripts/sincronizar_html.mjs --comprobar   # solo comprueba; sale con 1 si está desfasado
  ```

  Así la web, los datos estructurados y el chat dicen siempre lo mismo, que es lo que Google exige (información incoherente entre la web, la ficha de Google y los directorios penaliza). El horario del JSON-LD está en la constante `HORARIO` del script.
- Las opiniones se quedan solo en JavaScript a propósito: son de ejemplo hasta que el usuario las sustituya (ver "Datos reales").
- La imagen para compartir (`assets/og-tuservicio.jpg`, 1200×630) se genera con Chrome sin interfaz desde `assets/og-tuservicio.html` de esta skill. Regénérala si cambia el lema, el teléfono, el logo o los colores (comandos en `references/plantillas.md`, sección 5). El logo y los iconos (`assets/logo-512.png`, `assets/marca/`) son de la skill `tuservicio-marca`.
- `vercel.json` tiene `cleanUrls: true`: un archivo `limpieza-fin-de-obra-madrid.html` se sirve como `/limpieza-fin-de-obra-madrid`. Así se crean páginas nuevas sin tocar configuración.
- El idioma de la web, los textos y los nombres del código están en español. Mantenlo.

## Flujo de trabajo

### 1. Auditar antes de tocar nada

Ejecuta el script de auditoría. Funciona contra producción o contra el servidor local:

```bash
python3 .claude/skills/tuservicio-seo/scripts/auditar_seo.py https://tuservicioes.com
python3 .claude/skills/tuservicio-seo/scripts/auditar_seo.py http://localhost:8030
```

Revisa título, descripción, canonical, encabezados, imágenes, Open Graph, JSON-LD, robots.txt, sitemap, redirecciones de `www` y HTTPS, enlaces internos rotos y contenido que solo existe vía JavaScript. Termina con una lista de problemas ordenados por gravedad (❌ grave, ⚠️ mejorable). El script solo lee; no cambia nada.

El script no lo ve todo. Complétalo leyendo `index.html` y `js/datos.js` con estas preguntas:

- ¿El título y el H1 dicen qué es (limpieza) y dónde (Madrid)? Un titular creativo vale para el visitante, pero Google necesita las palabras que la gente teclea.
- ¿Hay afirmaciones que el usuario no ha confirmado como reales? Ver "Datos reales" más abajo.
- ¿Cada servicio importante tiene texto suficiente para posicionar por sí mismo, o habría que darle su propia página?

Presenta al usuario los hallazgos en lenguaje llano, con lo más rentable primero. Si pide la auditoría sin más, para ahí y pregúntale si quiere que apliques los arreglos.

### 2. Arreglos en la página

Por orden de impacto para un negocio local como TUservicio:

1. **Título y descripción** de cada página. El título, de unos 50–60 caracteres, con servicio + Madrid + marca. La descripción, de 140–160, con beneficio, zona y llamada a la acción. Ejemplos y plantillas en `references/plantillas.md`.
2. **Datos estructurados JSON-LD** en `<head>`: `CleaningService` (un tipo de `LocalBusiness`) y `FAQPage`. En `index.html` los genera `sincronizar_html.mjs`; para cambiar su estructura, edita el script, no el HTML. En páginas nuevas usa las plantillas de `references/plantillas.md`.
3. **robots.txt y sitemap.xml** en la raíz del repo. Sin ellos Google tarda más en descubrir páginas nuevas. Actualiza el sitemap cada vez que añadas o quites una página, con la fecha del día en `lastmod`.
4. **Imagen para compartir** (`og:image`, 1200×630) y etiquetas `twitter:card`. Afecta a cómo se ve el enlace al enviarlo por WhatsApp, que para TUservicio es el canal principal.
5. **Encabezados**: un solo H1 por página, y H2 que contengan búsquedas reales donde encaje sin forzar ("Limpieza de pisos en Madrid", "Limpieza fin de obra").
6. **Páginas de servicio y de zona**. Es lo que más tráfico trae a largo plazo. Ver la siguiente sección.

Tras cada cambio, ejecuta `node --check js/*.js` si tocaste JavaScript, `sincronizar_html.mjs --comprobar`, abre la web en local y repite la auditoría.

### 3. Crear páginas de servicio o de zona

Una página por intención de búsqueda fuerte posiciona mucho mejor que una sola página que lo intenta todo. Candidatas, de más a menos interesantes (detalle en `references/palabras-clave.md`):

- `/limpieza-pisos-madrid`, `/limpieza-fin-de-obra-madrid`, `/limpieza-oficinas-madrid`, `/limpieza-a-fondo-madrid`.
- Páginas por municipio solo si TUservicio trabaja de verdad allí y hay algo propio que contar (por ejemplo `/limpieza-pisos-alcobendas`). Páginas clónicas cambiando solo el nombre del barrio son contenido duplicado y Google las ignora o penaliza.

Cada página nueva:

- Es un `.html` en la raíz que reutiliza `css/styles.css`, la cabecera, el pie y los scripts (`js/datos.js`, `js/main.js`, `js/chat.js`) para mantener el chat y el botón de WhatsApp. Si `main.js` falla porque busca elementos que la página no tiene, protégelo comprobando que el elemento existe antes de usarlo, en lugar de duplicar HTML vacío.
- Tiene su propio título, descripción, canonical, H1 y JSON-LD `Service`.
- Lleva al menos 300–500 palabras útiles y propias: qué incluye, cuánto cuesta (coherente con las tarifas de `js/datos.js`), cuánto tarda, preguntas frecuentes de ese servicio y una llamada clara a WhatsApp y a la calculadora.
- Se enlaza desde `index.html` (tarjeta del servicio o pie) y se añade a `sitemap.xml`.

Plantilla de página en `references/plantillas.md`.

### 4. Publicar y verificar

1. Comprueba que `index.html` está sincronizado (`sincronizar_html.mjs --comprobar`). Commit con mensaje en español y `git push`. Vercel despliega solo en uno o dos minutos.
2. Comprueba que producción sirve tu versión comparando archivos:

   ```bash
   for f in index.html robots.txt sitemap.xml; do r=$(curl -sL https://tuservicioes.com/$f | sha1sum | cut -d' ' -f1); l=$(sha1sum < $f | cut -d' ' -f1); [ "$r" = "$l" ] && echo "OK $f" || echo "DIFF $f"; done
   ```

3. Vuelve a ejecutar la auditoría contra `https://tuservicioes.com`.
4. Si el usuario ya tiene Search Console, recuérdale pedir la indexación de las URLs nuevas o reenviar el sitemap.

### 5. Fuera de la página

Para un negocio local, la ficha de Google Business y las opiniones pesan tanto como la web. Guía al usuario con `references/fuera-de-pagina.md`: verificar el dominio en Search Console con un registro TXT en Wix, crear la ficha de Google Business, pedir opiniones a clientes reales y mantener nombre, dirección y teléfono idénticos en todas partes. Estas acciones se hacen en las cuentas del usuario: prepárale los textos y los valores exactos, pero no inicies sesión ni metas contraseñas por él.

## Datos reales

La web se construyó con algunas cifras de ejemplo. Antes de marcarlas en datos estructurados o repetirlas en páginas nuevas, confirma con el usuario que son reales:

- "4,9/5 en 1.200+ opiniones", "+4.800 hogares limpios", "26.000 horas", "98 % repiten".
- Las cinco opiniones de `js/datos.js`.
- Ecolabel, filtro HEPA, seguro de responsabilidad civil y zonas concretas de Madrid.

Nunca pongas `aggregateRating` ni `review` en JSON-LD con opiniones inventadas. Las directrices de Google lo prohíben y puede retirar todos los resultados enriquecidos del sitio, y además engaña a los clientes. Si no hay opiniones reales todavía, omite esas propiedades y sugiere al usuario sustituir las cifras de ejemplo por datos verdaderos o por afirmaciones que no necesiten números.

## Qué no hacer

- No rellenes textos de palabras clave repetidas ni escondas texto. Escribe para personas que buscan limpieza en Madrid; Google premia eso.
- No cambies el diseño, los colores ni las secciones existentes salvo que el SEO lo requiera; y entonces explica por qué.
- No toques la calculadora ni las tarifas de `js/datos.js` para el SEO. Si una página nueva cita precios, léelos de ahí.
- No borres el `canonical` ni cambies el dominio principal (`tuservicioes.com` sin `www`).
