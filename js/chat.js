/* ===== Asistente de chat (sin servidor, 100 % en el navegador) ===== */
(() => {
  "use strict";
  const D = window.TUSERVICIO;
  const $ = (s) => document.querySelector(s);
  const burbuja = $("#chatBurbuja"), panel = $("#chatPanel"), cerrar = $("#chatCerrar");
  const mensajes = $("#chatMensajes"), chips = $("#chatChips"), form = $("#chatForm"), input = $("#chatInput"), badge = $("#chatBadge");
  const eur = (n) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(Math.round(n));
  const normalizar = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let historial = [];
  try { historial = JSON.parse(sessionStorage.getItem("chat-historial") || "[]"); } catch {}

  const guardar = () => { try { sessionStorage.setItem("chat-historial", JSON.stringify(historial.slice(-30))); } catch {} };

  const enlazar = (texto) => texto
    .replace(/\[([^\]]+)\]\(whatsapp\)/g, `<a href="https://wa.me/${D.config.telefono}" target="_blank" rel="noopener">$1</a>`)
    .replace(/\[([^\]]+)\]\((#[^)]+)\)/g, `<a href="$2" data-cerrar-chat>$1</a>`);

  function pintar(texto, quien, guardarlo = true) {
    const div = document.createElement("div");
    div.className = `msg msg--${quien}`;
    div.innerHTML = quien === "bot" ? enlazar(texto) : texto.replace(/[<>]/g, "");
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
    if (guardarlo) { historial.push({ texto, quien }); guardar(); }
  }
  function pintarChips(lista) {
    chips.innerHTML = (lista || []).map((c) => `<button type="button">${c}</button>`).join("");
  }
  function escribiendo() {
    const d = document.createElement("div"); d.className = "msg msg--bot msg--escribiendo"; d.innerHTML = "<i></i><i></i><i></i>";
    mensajes.appendChild(d); mensajes.scrollTop = mensajes.scrollHeight; return d;
  }

  /* --- Cerebro del asistente --- */
  function responder(pregunta) {
    const q = normalizar(pregunta);

    // Presupuesto en el chat: "80 m2 hogar", "cuánto cuesta limpiar 120 metros de oficina"
    const m2 = q.match(/(\d{2,4})\s*(m2|m²|metros|mts|m\b)/);
    if (m2) {
      const metros = Math.min(400, Math.max(30, Number(m2[1])));
      const tipo = /oficin|despach|local|negocio/.test(q) ? "oficina" : /obra|reforma/.test(q) ? "obra" : /fondo|profund/.test(q) ? "profunda" : "hogar";
      const frecuencia = /seman/.test(q) ? "semanal" : /quincen|dos semanas/.test(q) ? "quincenal" : /mensual|cada mes/.test(q) ? "mensual" : "unica";
      const p = window.calcularPresupuesto({ tipo, m2: metros, frecuencia, extras: [] });
      const h = String(Math.round(p.horas * 2) / 2).replace(".5", ",5");
      return {
        texto: `Para ${p.nombre.toLowerCase()} de ${metros} m² ${D.nombresFrecuencia[frecuencia] === "una vez" ? "" : D.nombresFrecuencia[frecuencia] + " "}te sale en <strong>${eur(p.total)} €</strong> (IVA incluido), unas ${h} h con ${p.equipo === 1 ? "una profesional" : p.equipo + " profesionales"}.${p.ahorro ? ` Ya incluye el descuento del ${Math.round(p.descuento * 100)} %.` : " Si es recurrente, tienes hasta un 15 % de descuento."}\n\nPuedes afinarlo con extras en la [calculadora](#presupuesto) o [reservarlo ya](#reservar).`,
        chips: ["Añadir extras", "Reservar", "¿Qué incluye?"],
      };
    }
    if (/anadir extras|extras/.test(q)) return { texto: "Puedes añadir cristales (+25 €), horno y nevera por dentro (+20 €), una hora de plancha (+18 €) o tapicería (+35 €). Márcalos en la [calculadora](#presupuesto) y verás el total al momento.", chips: ["Ir a la calculadora", "Reservar"] };
    if (/ir a la calculadora|calculadora/.test(q)) return { texto: "Aquí la tienes 👉 [calculadora de presupuesto](#presupuesto). Mueve el deslizador de metros y elige frecuencia.", chips: ["Reservar"] };
    if (/ir al formulario|formulario/.test(q)) return { texto: "Vamos 👉 [formulario de reserva](#reservar). Te lleva un minuto.", chips: [] };

    let mejor = null, puntos = 0;
    for (const item of D.conocimiento) {
      const n = item.claves.reduce((a, k) => a + (q.includes(normalizar(k)) ? 1 + k.length / 20 : 0), 0);
      if (n > puntos) { puntos = n; mejor = item; }
    }
    if (mejor) return { texto: mejor.respuesta, chips: mejor.chips };
    return {
      texto: "Mmm, eso no lo tengo claro 🤔 pero una persona del equipo sí: escríbenos por [WhatsApp](whatsapp) y te contestamos en minutos. Mientras, puedo ayudarte con precios, horarios, zonas o reservas.",
      chips: ["¿Cuánto cuesta?", "Zonas", "Horario", "WhatsApp"],
    };
  }

  function enviar(texto) {
    texto = texto.trim(); if (!texto) return;
    pintar(texto, "yo"); pintarChips([]);
    if (/^whatsapp$/i.test(texto)) { open(`https://wa.me/${D.config.telefono}`, "_blank", "noopener"); }
    const t = escribiendo();
    const r = responder(texto);
    setTimeout(() => { t.remove(); pintar(r.texto, "bot"); pintarChips(r.chips); }, 500 + Math.min(900, r.texto.length * 4));
  }

  /* --- Abrir / cerrar --- */
  let abiertoAntes = false;
  function abrir(mensajeInicial) {
    panel.hidden = false; burbuja.setAttribute("aria-expanded", "true"); badge.hidden = true;
    if (!abiertoAntes) {
      abiertoAntes = true;
      if (historial.length) { historial.forEach((m) => pintar(m.texto, m.quien, false)); pintarChips(["¿Cuánto cuesta?", "Reservar", "Zonas"]); }
      else {
        const t = escribiendo();
        setTimeout(() => { t.remove(); pintar("¡Hola! 👋 Soy la asistente de TUservicio. Pregúntame lo que quieras sobre nuestras limpiezas: precios, zonas, horarios... o dime los metros de tu casa y te doy el precio al momento.", "bot"); pintarChips(["¿Cuánto cuesta?", "80 m² hogar", "Zonas", "Reservar"]); }, 600);
      }
    }
    if (mensajeInicial) setTimeout(() => enviar(mensajeInicial), abiertoAntes && historial.length ? 100 : 1300);
    setTimeout(() => input.focus(), 350);
  }
  function cerrarChat() { panel.hidden = true; burbuja.setAttribute("aria-expanded", "false"); }
  burbuja.addEventListener("click", () => (panel.hidden ? abrir() : cerrarChat()));
  cerrar.addEventListener("click", cerrarChat);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) cerrarChat(); });
  form.addEventListener("submit", (e) => { e.preventDefault(); enviar(input.value); input.value = ""; });
  chips.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) enviar(b.textContent); });
  mensajes.addEventListener("click", (e) => { if (e.target.closest("[data-cerrar-chat]") && innerWidth < 760) cerrarChat(); });

  // Invitación discreta a los 12 s si no se ha abierto
  setTimeout(() => { if (panel.hidden && !historial.length) { badge.hidden = false; burbuja.classList.add("latir"); window.mostrarToast?.("💬 ¿Dudas? Nuestra asistente te responde al instante"); } }, 12000);

  window.Asistente = { abrir, cerrar: cerrarChat, enviar };
})();
