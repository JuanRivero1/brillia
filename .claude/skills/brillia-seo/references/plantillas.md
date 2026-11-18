# Plantillas SEO para Brillia

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
| Inicio | `Empresa de limpieza en Madrid · Hogares y oficinas · Brillia` | `Limpieza profesional de pisos, oficinas y fin de obra en Madrid. Precio cerrado al momento, productos ecológicos y reserva por WhatsApp en 1 minuto.` |
| Pisos | `Limpieza de pisos en Madrid desde {{precio}} € · Brillia` | `Limpieza de pisos y casas en Madrid, puntual o semanal. Mismo equipo en cada visita, material incluido y precio cerrado. Pide presupuesto por WhatsApp.` |
| Fin de obra | `Limpieza fin de obra en Madrid · Lista para entrar · Brillia` | `Quitamos polvo de obra, restos de pintura y silicona para que entres a vivir el mismo día. Presupuesto cerrado en Madrid y alrededores.` |
| Oficinas | `Limpieza de oficinas en Madrid · Antes de que llegue tu equipo` | `Limpieza de oficinas y locales en Madrid a primera hora o al cierre. Contrato flexible, factura mensual y mismo equipo cada semana.` |

El H1 puede conservar el tono de marca siempre que incluya el qué. Por ejemplo: `Limpieza profesional en Madrid: tu casa, como nueva`.

## 2. JSON-LD: negocio local

Va en `<head>` de `index.html`. `CleaningService` es el tipo de schema.org para empresas de limpieza. Brillia no tiene local abierto al público: usa `areaServed` para las zonas y deja en `address` solo localidad, región y país, salvo que el usuario dé una dirección fiscal que quiera mostrar.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CleaningService",
  "@id": "https://brilliaes.com/#empresa",
  "name": "Brillia",
  "url": "https://brilliaes.com/",
  "logo": "https://brilliaes.com/assets/favicon.svg",
  "image": "https://brilliaes.com/assets/og-brillia.jpg",
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
- Si `og-brillia.jpg` no existe todavía, quita `image` o créala antes (ver sección 5).

## 3. JSON-LD: preguntas frecuentes

Debe repetir exactamente las preguntas y respuestas de `D.faq` en `js/datos.js`. Si alguien cambia la FAQ allí, hay que cambiar también este bloque. Una forma de no olvidarlo es dejar un comentario junto a `faq:` en `datos.js` que lo recuerde.

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
  "url": "https://brilliaes.com/limpieza-fin-de-obra-madrid",
  "provider": { "@id": "https://brilliaes.com/#empresa" },
  "areaServed": { "@type": "City", "name": "Madrid" },
  "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "{{desde}}", "description": "Precio desde, IVA incluido" }
}
</script>
```

`provider` apunta al `@id` del negocio definido en `index.html`, así no se repiten los datos de contacto.

## 5. Open Graph y Twitter

```html
<meta property="og:site_name" content="Brillia">
<meta property="og:locale" content="es_ES">
<meta property="og:image" content="https://brilliaes.com/assets/og-brillia.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Brillia, limpieza profesional en Madrid">
<meta name="twitter:card" content="summary_large_image">
```

La imagen debe ser JPG o PNG de 1200×630, de menos de 300 KB, con la URL absoluta. WhatsApp no muestra SVG. Si no hay foto real, se puede generar una con el logo, el lema y los colores de la web (`#0ea5a4`, `#0f766e`, `#a3e635`) renderizando un HTML con Chrome sin interfaz:

```bash
google-chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot=assets/og-brillia.png file:///ruta/a/og.html
```

## 6. robots.txt

En la raíz del repo:

```
User-agent: *
Allow: /

Sitemap: https://brilliaes.com/sitemap.xml
```

## 7. sitemap.xml

En la raíz del repo. Una entrada por página pública, con la URL limpia (sin `.html`) y `lastmod` con la fecha del último cambio real de esa página.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://brilliaes.com/</loc>
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
