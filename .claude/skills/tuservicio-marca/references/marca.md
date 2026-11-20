# Guía de marca de TUservicio

Fuente de verdad de la identidad visual y verbal. El manual visual (`manual-de-marca.html`, en la raíz de la skill) muestra lo mismo con ejemplos; si cambias algo aquí, cámbialo también allí.

## 1. Idea

**TUservicio** es una empresa de limpieza profesional en Madrid. La marca gira en torno a «tu»: tu casa, tu oficina, tu tiempo. El nombre se escribe siempre así, con **TU** en mayúsculas y **servicio** en minúsculas, todo junto.

El símbolo es una **casa cuyo cuerpo es una «U»**: el tejado y la U forman a la vez una vivienda y la segunda letra de «TU». El **destello lima** en la esquina es el «recién limpio». El cuadrado de esquinas redondeadas lo hace funcionar como icono de app, de WhatsApp y de pestaña del navegador.

Atributos: cercana, clara, fresca, de confianza. Nada de lujo frío ni de dibujos infantiles.

## 2. Logo

| Archivo (`assets/marca/`) | Uso |
|---|---|
| `logo-horizontal.svg` | Versión principal. Cabecera de la web, firmas, facturas, presupuestos. |
| `logo-horizontal-blanco.svg` | Fondos oscuros o fotografías oscuras. |
| `logo-vertical.svg` | Espacios cuadrados o verticales: carteles, uniformes, perfil de redes con texto. |
| `simbolo.svg` | Solo símbolo: foto de perfil de WhatsApp, Instagram, Google Business, icono de app. |
| `simbolo-mono.svg` | Un solo color: sellos, bordados, vinilos de furgoneta, grabados. |
| `simbolo-blanco.svg` | Símbolo sobre fondo oscuro. |
| `favicon.svg` | Pestaña del navegador (16–48 px): trazos más gruesos, sin destello. |
| `nombre.svg` | Solo el nombre, cuando el símbolo ya aparece cerca. |
| `logo-512.png`, `logo-horizontal.png`, `apple-touch-icon.png` | Versiones en imagen para donde no se admite SVG. |

**Zona de respeto:** deja alrededor del logo un margen libre igual a la mitad del alto del símbolo. Nada de texto ni bordes dentro de ese margen.

**Tamaño mínimo:** símbolo 24 px en pantalla (por debajo, usa `favicon.svg`); logo horizontal 120 px de ancho en pantalla o 30 mm impreso.

**No hacer:**
- Cambiar los colores del símbolo, salvo las versiones mono y blanca.
- Escribir «Tuservicio», «Tu Servicio», «TU SERVICIO» o «tuservicio» en textos de cara al cliente. El dominio `tuservicioes.com` y las cuentas en minúsculas son la única excepción.
- Deformar, girar, añadir sombras, contornos o efectos al logo.
- Poner el logo a color sobre fondos turquesa o fotos con mucho ruido: usa la versión blanca.
- Recomponer el nombre con otra fuente: usa siempre los SVG, que llevan el texto convertido en trazados.

## 3. Color

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Turquesa oscuro | `#0f766e` | 15 118 110 | Color de marca para texto, enlaces, botones con texto blanco y «TU» del logo. |
| Turquesa | `#0ea5a4` | 14 165 164 | Superficies, degradados, iconos, fondos de sección. |
| Turquesa claro | `#14b8a6` | 20 184 166 | Inicio del degradado del símbolo. |
| Menta | `#5eead4` | 94 234 212 | Brillos, fondos suaves y «TU» sobre fondo oscuro. |
| Lima | `#a3e635` | 163 230 53 | Acento: destello, foco de teclado, detalles. Nunca para texto sobre blanco. |
| Tinta | `#0f172a` | 15 23 42 | Texto principal y «servicio» del logo. |
| Gris pizarra | `#475569` | 71 85 105 | Texto secundario. |
| Niebla | `#f8fafc` | 248 250 252 | Fondo general. |
| Noche | `#0b1b2b` | 11 27 43 | Fondos oscuros, pie de página. |

Degradado de marca: `linear-gradient(135deg, #14b8a6, #0f766e)`.

Proporción orientativa: 60 % blancos y niebla, 25 % tinta, 12 % turquesas, 3 % lima.

**Contraste (WCAG):**

| Combinación | Contraste | Veredicto |
|---|---|---|
| Blanco sobre turquesa oscuro | 5,5 : 1 | Apto para cualquier texto. |
| Turquesa oscuro sobre blanco o niebla | 5,5 / 5,2 : 1 | Apto para cualquier texto. |
| Tinta sobre blanco | 17,9 : 1 | Apto. |
| Gris pizarra sobre blanco | 7,6 : 1 | Apto. |
| Blanco sobre turquesa `#0ea5a4` | 3,0 : 1 | Solo texto grande (24 px, o 19 px en negrita) o iconos. |
| Menta o blanco sobre noche | 11,8 / 17,4 : 1 | Apto. |
| Tinta sobre lima | 11,8 : 1 | Apto (etiquetas, insignias). |
| Lima sobre blanco | 1,5 : 1 | No apto para texto. Solo decoración. |

## 4. Tipografía

- **Outfit** (Google Fonts, licencia OFL) para el logo, titulares, cifras y botones. Pesos: 800 titulares grandes, 700 títulos, 600 botones y el «servicio» del logo.
- **Inter** (Google Fonts) para texto corrido, formularios y letra pequeña. Pesos 400, 500 y 600.
- Titulares con interletrado ligeramente cerrado (`letter-spacing: -0.02em`). Lemas en mayúsculas con interletrado abierto (`0.18em`) y Outfit 500, como en el logo vertical.
- Si no hay Google Fonts (por ejemplo en Word), usa Arial o Helvetica en negrita, pero nunca para el logo.

## 5. Formas y elementos

- Esquinas redondeadas: 16 px en tarjetas grandes (en la web, 18 px con `--radio`), píldora (999 px) en botones y etiquetas.
- Trazos redondeados como los del símbolo para iconos propios.
- El destello de cuatro puntas lima es el elemento gráfico de apoyo: en esquinas, junto a precios, en el «antes y después». Con moderación: uno por composición.
- Fotografía: espacios reales y luminosos, luz natural, gente del equipo con uniforme. Evitar bancos de imágenes con modelos posando y guantes de látex.

## 6. Voz y tono

- **Tuteamos** al cliente: «tu casa», «te lo dejamos listo». Es coherente con el nombre.
- Frases cortas y concretas: precio, tiempo, qué incluye. Sin jerga ni superlativos vacíos («el mejor servicio del mundo»).
- Cálido pero profesional. Algún emoji en WhatsApp y en la web (🏠 🧽 ✨), nunca más de uno por frase y ninguno en facturas.
- Promesas que se cumplen: precio cerrado, mismo equipo, repaso gratis si algo no queda bien.

Ejemplos:
- Sí: «Tu piso, como nuevo en 3 horas. Precio cerrado antes de empezar.»
- No: «Ofrecemos soluciones integrales de higienización de alta calidad.»

## 7. Aplicaciones

- **Web**: logo horizontal en la cabecera (símbolo + «TU» en turquesa oscuro + «servicio» en tinta), favicon simplificado, botones en degradado de marca.
- **WhatsApp Business y redes**: foto de perfil con `simbolo.svg` exportado a 640×640 (`logo-512.png` sirve). Nombre del perfil: «TUservicio · Limpieza Madrid».
- **Google Business**: mismo símbolo, misma escritura del nombre que en la web.
- **Uniformes y furgoneta**: símbolo mono o blanco sobre tela turquesa oscuro o noche; logo vertical en la espalda.
- **Documentos** (presupuestos, facturas): logo horizontal arriba a la izquierda, tinta para el texto, turquesa oscuro para títulos y totales.
