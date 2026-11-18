# SEO fuera de la página

Para una empresa de limpieza local, la mitad del posicionamiento ocurre fuera de la web: la ficha de Google Business (el mapa con negocios que sale arriba al buscar "limpieza cerca de mí") y las opiniones. Todo esto se hace en cuentas del usuario. Tu papel es guiarle paso a paso, darle los textos y valores exactos listos para pegar, y comprobar después lo que se pueda comprobar desde fuera. No inicies sesión ni escribas contraseñas por él.

## 1. Google Search Console

Sirve para ver por qué búsquedas aparece la web, qué páginas están indexadas y avisos de errores.

1. Entrar en https://search.google.com/search-console con la cuenta de Google del negocio.
2. Añadir propiedad de tipo **Dominio** con `brilliaes.com`. Así cubre `www`, `http` y `https` a la vez.
3. Google da un registro TXT del estilo `google-site-verification=XXXX`.
4. En IONOS: Dominios y SSL → brilliaes.com → DNS → Añadir registro → TXT, nombre `@`, valor el texto de Google. No borres los registros existentes: el TXT de SPF (`v=spf1 include:_spf-eu.ionos.com ~all`) y los MX son del correo, y los A y el CNAME de `www` son los que apuntan a Vercel.
5. Volver a Search Console y pulsar Verificar. Si falla, esperar unos minutos: IONOS tarda en publicar.
6. Ya verificado: Sitemaps → enviar `https://brilliaes.com/sitemap.xml`.

Para comprobar desde aquí que el TXT ya se publica:

```bash
dig +short TXT brilliaes.com @ns1040.ui-dns.com
```

## 2. Ficha de Google Business

Es lo que más clientes trae a un negocio local.

1. Crear la ficha en https://business.google.com con el nombre exacto **Brillia**. Sin añadidos tipo "Brillia Limpiezas Madrid Baratas": Google lo considera spam y puede suspender la ficha.
2. Categoría principal: **Servicio de limpieza** o **Servicio de limpieza de casas**. Secundarias: Servicio de limpieza de oficinas, Servicio de limpieza tras obras.
3. Marcar que es un negocio de **área de servicio**, que va a casa del cliente, y ocultar la dirección si no hay local abierto al público. Zonas: Madrid y los municipios donde de verdad trabaja.
4. Teléfono, web (`https://brilliaes.com`), horario y servicios con precio "desde", idénticos a la web.
5. Fotos reales de trabajos, del equipo y del material. Las fotos de antes y después funcionan muy bien.
6. Google verificará el negocio, normalmente por vídeo o por teléfono.

Cuando exista, añade la URL de la ficha a `sameAs` en el JSON-LD de la web.

## 3. Opiniones

Las opiniones reales en Google son lo que más pesa en el mapa local, y lo que convence al cliente.

- Pedirlas al terminar cada servicio, por WhatsApp, con el enlace directo para dejar reseña que da la propia ficha ("Pedir reseñas"). Ofrécele al usuario un mensaje listo, por ejemplo:

  > ¡Gracias por confiar en Brillia! Si te ha gustado cómo ha quedado tu casa, nos ayudarías muchísimo dejando tu opinión aquí: {{enlace}}. ¡Que brille tu día! ✨

- Responder a todas, también a las negativas, con educación y una solución.
- Nunca comprar opiniones, ni escribirlas, ni ofrecer descuentos a cambio de 5 estrellas. Google las elimina y puede penalizar la ficha.
- Cuando haya opiniones reales, sustituir las de ejemplo de `js/datos.js` por algunas de ellas, con permiso del cliente, y actualizar la cifra "4,9/5 en 1.200+ opiniones" del hero por la real.

## 4. Coherencia de datos (NAP)

Nombre, dirección y teléfono deben ser idénticos en la web, la ficha de Google, los directorios y las redes. Valores actuales, tomados de `js/datos.js`: Brillia · Madrid · +34 649 671 247 · info@brilliaes.com. Si alguno cambia, cámbialo en todas partes a la vez.

## 5. Directorios y enlaces

Enlaces desde webs locales y de confianza ayudan, pero mucho menos que la ficha y las opiniones. Prioridad:

1. Directorios generales con ficha gratuita: Páginas Amarillas, Bing Places (se puede importar desde Google Business) y Apple Business Connect (para Apple Maps).
2. Plataformas de servicios del sector donde se puedan conseguir opiniones reales.
3. Colaboraciones locales: inmobiliarias, administradores de fincas o empresas de reformas que recomienden a Brillia para limpiezas de fin de obra y mudanzas.

Evitar directorios de baja calidad y paquetes de "cientos de enlaces": no ayudan y pueden perjudicar.
