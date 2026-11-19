#!/usr/bin/env node
/**
 * Copia al HTML estático lo que js/datos.js pinta con JavaScript, para que
 * cualquier buscador lo lea sin ejecutar scripts:
 *   - las tarjetas de servicios       (<!-- datos:servicios --> … <!-- /datos:servicios -->)
 *   - las preguntas frecuentes        (<!-- datos:faq --> … <!-- /datos:faq -->)
 *   - el JSON-LD CleaningService + FAQPage en <head> (<!-- datos:jsonld --> … <!-- /datos:jsonld -->)
 *
 * js/datos.js sigue siendo la única fuente: cambia los datos allí y vuelve a ejecutar esto.
 * js/main.js sigue pintando lo mismo en el navegador, así que la página se ve igual.
 *
 * Uso, desde la raíz del repo:
 *   node .claude/skills/tuservicio-seo/scripts/sincronizar_html.mjs              # reescribe index.html
 *   node .claude/skills/tuservicio-seo/scripts/sincronizar_html.mjs --comprobar  # sale con 1 si está desfasado
 *
 * Las opiniones NO se copian: son de ejemplo hasta que el usuario las sustituya por reales,
 * y nunca deben aparecer como reseñas en datos estructurados (ver SKILL.md, "Datos reales").
 */
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const RAIZ = process.cwd();
const HTML = `${RAIZ}/index.html`;
const URL_BASE = "https://tuservicioes.com";
// Horario de atención. Si cambia, cámbialo aquí, en el pie de index.html y en config.horario de datos.js.
const HORARIO = { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], abre: "08:00", cierra: "20:00" };

function cargarDatos() {
  const contexto = { window: {} };
  vm.createContext(contexto);
  vm.runInContext(readFileSync(`${RAIZ}/js/datos.js`, "utf8"), contexto, { filename: "js/datos.js" });
  const D = contexto.window.TUSERVICIO;
  if (!D) throw new Error("js/datos.js no define window.TUSERVICIO");
  return D;
}

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Mismo marcado que genera js/main.js, para que no haya saltos al cargar el script.
function htmlServicios(D) {
  return D.servicios.map((s) => `
    <article class="tarjeta" data-servicio="${esc(s.id)}">
      ${s.destacado ? `<span class="tarjeta__destacado">${esc(s.destacado)}</span>` : ""}
      <div class="tarjeta__icono">${s.icono}</div>
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.texto)}</p>
      <div class="tarjeta__pie"><span>desde ${esc(s.desde)} € <small>/ servicio</small></span><button type="button" data-calcular="${esc(s.id)}">Calcular →</button></div>
    </article>`).join("");
}

function htmlFaq(D) {
  return D.faq.map((f) => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join("");
}

function jsonLd(D) {
  const c = D.config;
  const empresa = {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    "@id": `${URL_BASE}/#empresa`,
    name: c.nombre,
    url: `${URL_BASE}/`,
    logo: `${URL_BASE}/assets/logo-512.png`,
    image: `${URL_BASE}/assets/og-tuservicio.jpg`,
    description: "Empresa de limpieza profesional en Madrid: hogares, oficinas, fin de obra y limpiezas a fondo con productos ecológicos.",
    telephone: `+${c.telefono}`,
    email: c.email,
    priceRange: "€€",
    address: { "@type": "PostalAddress", addressLocality: "Madrid", addressRegion: "Comunidad de Madrid", addressCountry: "ES" },
    areaServed: [
      { "@type": "City", name: "Madrid" },
      { "@type": "AdministrativeArea", name: "Comunidad de Madrid" },
    ],
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: HORARIO.dias, opens: HORARIO.abre, closes: HORARIO.cierra }],
    contactPoint: { "@type": "ContactPoint", telephone: `+${c.telefono}`, contactType: "customer service", availableLanguage: "Spanish" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de limpieza",
      itemListElement: D.servicios.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `Limpieza: ${s.titulo}`, description: s.texto },
        priceSpecification: { "@type": "PriceSpecification", minPrice: s.desde, priceCurrency: "EUR" },
      })),
    },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: D.faq.map((f) => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
  // "</" dentro de un <script> lo cerraría antes de tiempo.
  const bloque = (o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2).replace(/<\//g, "<\\/")}\n</script>`;
  return `\n  ${bloque(empresa)}\n  ${bloque(faq)}\n  `;
}

function sustituir(html, nombre, contenido) {
  const re = new RegExp(`(<!-- datos:${nombre} -->)[\\s\\S]*?(<!-- /datos:${nombre} -->)`);
  if (!re.test(html)) throw new Error(`index.html no tiene los marcadores <!-- datos:${nombre} --> … <!-- /datos:${nombre} -->`);
  return html.replace(re, (_, abre, cierra) => `${abre}${contenido}${cierra}`);
}

const D = cargarDatos();
const actual = readFileSync(HTML, "utf8");
let nuevo = actual;
nuevo = sustituir(nuevo, "servicios", `${htmlServicios(D)}\n        `);
nuevo = sustituir(nuevo, "faq", htmlFaq(D));
nuevo = sustituir(nuevo, "jsonld", jsonLd(D));

if (process.argv.includes("--comprobar")) {
  if (nuevo !== actual) {
    console.error("index.html está desfasado respecto a js/datos.js. Ejecuta sincronizar_html.mjs sin --comprobar.");
    process.exit(1);
  }
  console.log("index.html está sincronizado con js/datos.js.");
} else if (nuevo === actual) {
  console.log("Sin cambios: index.html ya estaba sincronizado.");
} else {
  writeFileSync(HTML, nuevo);
  console.log(`index.html actualizado: ${D.servicios.length} servicios, ${D.faq.length} preguntas y JSON-LD.`);
}
