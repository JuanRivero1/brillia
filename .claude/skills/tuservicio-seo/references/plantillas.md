# Plantillas SEO para TUservicio

Contenido:
1. Títulos y descripciones
2. JSON-LD: negocio local (`CleaningService`)
3. JSON-LD: preguntas frecuentes (`FAQPage`)
4. JSON-LD: página de servicio (`Service`)
5. Open Graph y Twitter
6. robots.txt
7. sitemap.xml
8. Página de servicio nueva

Antes de copiar cualquier plantilla, lee `js/datos.js` y usa sus valores reales: teléfono (`config.telefono`, `config.telefonoBonito`), email, horario, servicios, precios "desde" y preguntas frecuentes. Lo que aparece aquí entre `{{llaves}}` hay que sustituirlo; no lo publiques tal cual.

## 1. Títulos y descripciones

El título lleva servicio + zona + marca, en unos 50–60 caracteres. La descripción, beneficio + zona + llamada a la acción, en 140–160. Escribe para la persona que ve el resultado en Google: tiene que entender en un segundo qué ofreces, dónde y por qué pulsar.

| Página | Título | Descripción |
|---|---|---|
| Inicio | `Empresa de limpieza en Madrid · Hogares y oficinas · TUservicio` | `Limpieza profesional de pisos, oficinas y fin de obra en Madrid. Precio cerrado al momento, productos ecológicos y reserva por WhatsApp en 1 minuto.` |
| Pisos | `Limpieza de pisos en Madrid desde {{precio}} € · TUservicio` | `Limpieza de pisos y casas en Madrid, puntual o semanal. Mismo equipo en cada visita, material incluido y precio cerrado. Pide presupuesto por WhatsApp.` |
| Fin de obra | `Limpieza fin de obra en Madrid · Lista para entrar · TUservicio` | `Quitamos polvo de obra, restos de pintura y silicona para que entres a vivir el mismo día. Presupuesto cerrado en Madrid y alrededores.` |
| Oficinas | `Limpieza de oficinas en Madrid · Antes de que llegue tu equipo` | `Limpieza de oficinas y locales en Madrid a primera hora o al cierre. Contrato flexible, factura mensual y mismo equipo cada semana.` |

El H1 puede conservar el tono de marca siempre que incluya el qué. Por ejemplo: `Limpieza profesional en Madrid: tu casa, como nueva`.

## 2. JSON-LD: negocio local

En `index.html` ya lo genera `scripts/sincronizar_html.mjs` desde `js/datos.js`; esta plantilla sirve para entender la estructura o para cambiar el script. `CleaningService` es el tipo de schema.org para empresas de limpieza. TUservicio no tiene local abierto al público: usa `areaServed` para las zonas y deja en `address` solo localidad, región y país, salvo que el usuario dé una dirección fiscal que quiera mostrar.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CleaningService",
  "@id": "https://tuservicioes.com/#empresa",
  "name": "TUservicio",
  "url": "https://tuservicioes.com/",
  "logo": "https://tuservicioes.com/assets/favicon.svg",
  "image": "https://tuservicioes.com/assets/og-tuservicio.jpg",
  "description": "Empresa de limpieza profesional en Madrid: hogares, oficinas, fin de obra y limpiezas a fondo con productos ecológicos.",
  "telephone": "+34{{telefono}}",
  "email": "{{email}}",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Madrid",
    "addressRegion": "Comunidad de Madrid",
    "addressCountry": "ES"
  },
  "areaServed": [
    { "@type": "City", "name": "Madrid" },
    { "@type": "AdministrativeArea", "name": "Comunidad de Madrid" }
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "20:00"
  }],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+34{{telefono}}",
    "contactType": "customer service",
    "availableLanguage": "Spanish"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de limpieza",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Limpieza de hogar" }, "priceSpecification": { "@type": "PriceSpecification", "minPrice": {{desde_hogar}}, "priceCurrency": "EUR" } }
    ]
  },
  "sameAs": []
}
</script>
```

- Añade un `Offer` por cada servicio de `D.servicios`, con su precio `desde`.
- Rellena `sameAs` con las URLs de la ficha de Google Business, Instagram, etc., solo cuando existan.
- No añadas `aggregateRating` ni `review` salvo que haya opiniones reales y verificables (ver SKILL.md, "Datos reales").
- Si `og-tuservicio.jpg` no existe todavía, quita `image` o créala antes (ver sección 5).

## 3. JSON-LD: preguntas frecuentes

Debe repetir exactamente las preguntas y respuestas de `D.faq` en `js/datos.js`. En `index.html` lo genera `sincronizar_html.mjs`; en una página de servicio con preguntas propias, escríbelo a mano con esta plantilla.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{pregunta}}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{respuesta}}" }
    }
  ]
}
</script>
```

Desde 2023 Google solo muestra el desplegable de FAQ en los resultados de webs oficiales y sanitarias, pero el marcado sigue ayudando a que entienda el contenido y lo lean buscadores y asistentes que no ejecutan JavaScript.

## 4. JSON-LD: página de servicio

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Limpieza fin de obra",
  "name": "Limpieza fin de obra en Madrid",
  "url": "https://tuservicioes.com/limpieza-fin-de-obra-madrid",
  "provider": { "@id": "https://tuservicioes.com/#empresa" },
  "areaServed": { "@type": "City", "name": "Madrid" },
  "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "{{desde}}", "description": "Precio desde, IVA incluido" }
}
</script>
```

`provider` apunta al `@id` del negocio definido en `index.html`, así no se repiten los datos de contacto.

## 5. Open Graph y Twitter

```html
<meta property="og:site_name" content="TUservicio">
<meta property="og:locale" content="es_ES">
<meta property="og:image" content="https://tuservicioes.com/assets/og-tuservicio.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="TUservicio, limpieza profesional en Madrid">
<meta name="twitter:card" content="summary_large_image">
```

La imagen debe ser JPG o PNG de 1200×630, de menos de 300 KB, con la URL absoluta. WhatsApp no muestra SVG. La actual se genera desde `assets/og-tuservicio.html` de la skill; edita ese HTML (lema, teléfono, colores) y regenérala desde la raíz del repo. La captura se hace en el scratchpad y luego se convierte a JPG en `assets/`:

```bash
SK=.claude/skills/tuservicio-seo/assets
google-chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --virtual-time-budget=6000 --screenshot=/ruta/scratchpad/og.png "file://$PWD/$SK/og-tuservicio.html"
python3 -c "from PIL import Image; Image.open('/ruta/scratchpad/og.png').convert('RGB').save('assets/og-tuservicio.jpg', quality=85, optimize=True, progressive=True)"
```

El logo de 512×512 (`assets/logo-512.png`, usado en el JSON-LD y como icono) lo genera la skill `tuservicio-marca` con `scripts/exportar_png.py`.

Para una página de servicio, puedes hacer una imagen propia copiando `og-tuservicio.html` y cambiando el texto (por ejemplo `og-fin-de-obra.jpg`).

## 6. robots.txt

En la raíz del repo:

```
User-agent: *
Allow: /

Sitemap: https://tuservicioes.com/sitemap.xml
```

## 7. sitemap.xml

En la raíz del repo. Una entrada por página pública, con la URL limpia (sin `.html`) y `lastmod` con la fecha del último cambio real de esa página.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tuservicioes.com/</loc>
    <lastmod>{{AAAA-MM-DD}}</lastmod>
  </url>
</urlset>
```

No incluyas anclas (`#servicios`): para Google son la misma página.

## 8. Página de servicio nueva

Archivo `limpieza-{{servicio}}-madrid.html` en la raíz. Copia de `index.html` el `<head>` (cambiando título, descripción, canonical y `og:*`), la cabecera, el pie, el chat, el botón de WhatsApp y los tres `<script>`. Estructura recomendada del `<main>`:

1. **H1** con servicio + Madrid, y un párrafo que diga para quién es y qué resuelve.
2. **Qué incluye**: lista concreta de tareas.
3. **Precio y duración**: "desde X €", cómo se calcula y un botón a `/#presupuesto`. Usa los mismos datos que `js/datos.js`.
4. **Cómo trabajamos**: los tres pasos, garantía de repaso y productos.
5. **Zonas**: Madrid y los municipios donde el usuario confirme que trabaja.
6. **Preguntas frecuentes del servicio** (3–5), también en JSON-LD `FAQPage`.
7. **Llamada final**: botón de WhatsApp con un mensaje precargado que nombre el servicio.

Enlázala desde la tarjeta correspondiente en `index.html` y desde el pie. Añádela a `sitemap.xml`.
