# Brillia · web de servicios de limpieza

Web estática (HTML + CSS + JS, sin frameworks ni build) para una empresa de limpieza. Pensada para cargar en milisegundos y desplegarse en Vercel.

## Qué tiene

- **Transición de mopa** al empezar a hacer scroll (una sola vez por visita).
- **Calculadora de presupuesto instantáneo**: tipo de servicio, metros, dormitorios/estancias, baños, frecuencia y extras. Las horas salen de metros + estancias + baños; el precio, de las horas (`tarifaHora`) más un suplemento por m² (`eurPorM2`). Muestra precio, horas, equipo y €/m².
- **Sección "Pruébalo"**: una escena sucia que el visitante limpia pasando la mopa (canvas), con porcentaje de limpieza y recompensa al llegar al 100 %.
- **Brilli**, un chat que responde al instante (precios, zonas, horarios, garantías) y calcula presupuestos desde el propio chat («80 m² hogar»). Funciona 100 % en el navegador, sin servidor.
- **Reserva en un paso** que abre WhatsApp o el correo con el mensaje ya redactado.
- Modo claro/oscuro, barra de progreso, contadores animados, opiniones en carrusel, FAQ, confeti al reservar y respeto a `prefers-reduced-motion`.

## Estructura

```
index.html            página única
css/styles.css        estilos (variables en :root; tema oscuro con [data-tema="oscuro"])
js/datos.js           configuración: teléfono, email, tarifas, servicios, opiniones, FAQ y respuestas del chat
js/main.js            interacción de la página
js/chat.js            asistente Brilli
assets/favicon.svg
vercel.json           cabeceras y URLs limpias
```

## Personalizar

Casi todo lo editable está en `js/datos.js`:

- `config.telefono` (sin `+` ni espacios, para WhatsApp), `config.email`, ciudad y horario.
- `tarifaHora`, `tarifas` (horas por m², por estancia y por baño; € por m²) y `descuentos` de la calculadora.
- `servicios`, `opiniones`, `faq` y la base de `conocimiento` del chat (palabras clave → respuesta).

Los colores se cambian en las variables de `css/styles.css` (`--primario`, `--acento`, ...).

## Desarrollo local

```bash
python3 -m http.server 8030
```

y abre <http://localhost:8030>. Para comprobar la sintaxis del JS: `node --check js/*.js`.

## Despliegue

El proyecto está pensado para Vercel: al importar el repositorio no hace falta ningún comando de build ni carpeta de salida (es un sitio estático).
