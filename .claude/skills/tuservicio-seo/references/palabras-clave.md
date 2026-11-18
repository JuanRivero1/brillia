# Palabras clave y estructura de páginas

TUservicio es un negocio local: casi todas sus búsquedas útiles llevan "Madrid", un municipio o "cerca de mí" (Google añade la ubicación por su cuenta). Este mapa agrupa las búsquedas por intención, que es lo que decide qué página debe posicionar para cada una.

No hay datos de volumen de búsqueda aquí a propósito: cambian y no se deben inventar. Si el usuario quiere cifras, que las mire en Google Search Console (consultas reales que ya traen visitas) o en el Planificador de palabras clave de Google Ads, y priorizad con eso.

## Grupos de búsqueda

| Intención | Búsquedas típicas | Página que debe posicionar |
|---|---|---|
| Empresa en general | empresa de limpieza Madrid, servicio de limpieza Madrid, empresa de limpieza cerca de mí | Inicio `/` |
| Limpieza de casa | limpieza de pisos Madrid, limpieza de casas Madrid, asistenta por horas Madrid, limpieza del hogar semanal | `/limpieza-pisos-madrid` |
| Fin de obra | limpieza fin de obra Madrid, limpieza después de reforma, limpieza post obra precio | `/limpieza-fin-de-obra-madrid` |
| Oficinas y locales | limpieza de oficinas Madrid, empresa limpieza oficinas, limpieza de locales comerciales | `/limpieza-oficinas-madrid` |
| Limpieza profunda | limpieza a fondo de casa Madrid, limpieza general de piso, limpieza mudanza Madrid, limpieza entrada salida inquilino | `/limpieza-a-fondo-madrid` |
| Extras | limpieza de cristales Madrid, limpieza de sofás a domicilio, limpieza de colchones | Secciones dentro de las páginas de servicio, o página propia si el usuario ve demanda |
| Precio | cuánto cuesta una limpieza de piso, precio limpieza por hora Madrid, presupuesto limpieza fin de obra | La página del servicio, con una sección de precios clara y la calculadora |

Las búsquedas de precio son muy valiosas para TUservicio porque la calculadora da el precio al momento, algo que la competencia no suele ofrecer. Merece la pena decirlo en títulos y descripciones ("precio cerrado al momento").

## Municipios

Solo crea páginas por municipio cuando el usuario confirme que trabaja allí y haya algo propio que contar: tiempo de llegada, trabajos hechos en esa zona, opiniones reales de clientes de allí. Candidatos dentro de un radio de unos 30 km, que la web ya menciona: Alcobendas, Getafe, Pozuelo de Alarcón, Las Rozas, Majadahonda, Rivas-Vaciamadrid.

Hasta entonces, basta con nombrarlos en una sección "Zonas en las que trabajamos" de cada página de servicio y en `areaServed` del JSON-LD.

## Dónde colocar cada palabra

- **Título y H1**: la búsqueda principal de la página, una vez y de forma natural.
- **Descripción**: la búsqueda principal y un beneficio. Google suele resaltar en negrita las palabras que coinciden con la búsqueda.
- **H2**: variantes y búsquedas secundarias ("Precio de la limpieza de pisos en Madrid", "¿Qué incluye la limpieza fin de obra?").
- **Texto**: sinónimos y preguntas reales. Las preguntas que llegan por WhatsApp o al chat de la web son una buena fuente de contenido.
- **Enlaces internos**: el texto del enlace describe el destino ("limpieza fin de obra en Madrid"), no "pincha aquí".

## Cómo medir

Una vez verificado el dominio en Search Console (ver `fuera-de-pagina.md`):

- **Rendimiento → Consultas**: qué búsquedas ya muestran la web y en qué posición. Las que están entre la posición 5 y la 20 son las más fáciles de subir mejorando título, descripción o contenido de esa página.
- **Rendimiento → Páginas**: qué página aparece para cada búsqueda. Si la portada sale para "limpieza fin de obra", falta una página específica.
- **Indexación → Páginas**: que todas las URLs del sitemap estén indexadas.

Revisa cada mes. Los cambios de SEO tardan de unas semanas a varios meses en notarse.
