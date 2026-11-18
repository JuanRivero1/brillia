# TUservicio · web de servicios de limpieza

Web estática (HTML + CSS + JS, sin frameworks ni build) para una empresa de limpieza. Pensada para cargar en milisegundos y desplegarse en Vercel.

## Qué tiene

- **Hero** con titular, llamadas a la acción y una introducción de la empresa.
- **Transición de mopa** al empezar a hacer scroll (una sola vez por visita).
- **Calculadora de presupuesto instantáneo**: tipo de servicio, metros, frecuencia y extras, con precio, duración y equipo en tiempo real.
- **Sección "Pruébalo"**: una escena sucia que el visitante limpia pasando la mopa (canvas), con porcentaje de limpieza y recompensa al llegar al 100 %.
- **Asistente**, un chat que responde al instante (precios, zonas, horarios, garantías) y calcula presupuestos desde el propio chat («80 m² hogar»). Funciona 100 % en el navegador, sin servidor.
- **Reserva en un paso** que abre WhatsApp o el correo con el mensaje ya redactado.
- Modo claro/oscuro, barra de progreso, contadores animados, opiniones en carrusel, FAQ, confeti al reservar y respeto a `prefers-reduced-motion`.

## Estructura

```
index.html            página única
css/styles.css        estilos (variables en :root; tema oscuro con [data-tema="oscuro"])
js/datos.js           configuración: teléfono, email, tarifas, servicios, opiniones, FAQ y respuestas del chat
js/main.js            interacción de la página
js/chat.js            asistente de chat
assets/favicon.svg
vercel.json           cabeceras y URLs limpias
```

## Personalizar

Casi todo lo editable está en `js/datos.js`:

- `config.telefono` (sin `+` ni espacios, para WhatsApp), `config.email`, ciudad y horario.
- `tarifas` y `descuentos` de la calculadora.
- `servicios`, `opiniones`, `faq` y la base de `conocimiento` del chat (palabras clave → respuesta).

Los colores se cambian en las variables de `css/styles.css` (`--primario`, `--acento`, ...).

## Desarrollo local

```bash
python3 -m http.server 8030
```

y abre <http://localhost:8030>. Para comprobar la sintaxis del JS: `node --check js/*.js`.

## Despliegue

El proyecto está pensado para Vercel: al importar el repositorio no hace falta ningún comando de build ni carpeta de salida (es un sitio estático).

## SEO

La skill de Claude Code `.claude/skills/tuservicio-seo/` recoge cómo auditar y mejorar el posicionamiento de la web: script de auditoría, plantillas (títulos, JSON-LD, robots.txt, sitemap, páginas de servicio), mapa de palabras clave y guía de Search Console y Google Business. Para auditar a mano:

```bash
python3 .claude/skills/tuservicio-seo/scripts/auditar_seo.py https://brilliaes.com
```

La carpeta `.claude/` y este README no se publican en la web (ver `.vercelignore`).
