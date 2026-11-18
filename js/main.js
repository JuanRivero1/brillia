/* ===== Brillia · lógica principal ===== */
(() => {
  "use strict";
  const D = window.BRILLIA;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducirMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const eur = (n) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(Math.round(n));

  /* ---------- Tema ---------- */
  const raiz = document.documentElement;
  const btnTema = $("#btnTema");
  const aplicarTema = (t) => { raiz.dataset.tema = t; btnTema.textContent = t === "oscuro" ? "☀️" : "🌙"; };
  try {
    aplicarTema(localStorage.getItem("brillia-tema") || (matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro"));
  } catch { aplicarTema("claro"); }
  btnTema.addEventListener("click", () => {
    const t = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
    aplicarTema(t);
    try { localStorage.setItem("brillia-tema", t); } catch {}
  });

  /* ---------- Cabecera, menú y progreso ---------- */
  const cabecera = $("#cabecera");
  const progreso = $("#progreso span");
  const btnMenu = $("#btnMenu");
  const enlaces = $("#enlaces");
  btnMenu.addEventListener("click", () => {
    const abierto = enlaces.classList.toggle("abierto");
    btnMenu.setAttribute("aria-expanded", String(abierto));
  });
  enlaces.addEventListener("click", (e) => { if (e.target.closest("a")) { enlaces.classList.remove("abierto"); btnMenu.setAttribute("aria-expanded", "false"); } });

  const secciones = $$("main section[id]");
  const navLinks = $$(".nav__enlaces a[href^='#']");
  const onScroll = () => {
    const y = scrollY;
    cabecera.classList.toggle("con-sombra", y > 10);
    const total = document.documentElement.scrollHeight - innerHeight;
    progreso.style.width = `${total > 0 ? (y / total) * 100 : 0}%`;
    let actual = "";
    for (const s of secciones) if (s.offsetTop - 120 <= y) actual = s.id;
    navLinks.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === `#${actual}`));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Transición de mopa entre secciones ---------- */
  const mopa = $("#mopaTransicion");
  let mopaHecha = false; // la mopa solo barre una vez por visita
  const barrer = () => {
    if (reducirMovimiento || mopaHecha) return;
    mopaHecha = true;
    mopa.classList.remove("activa");
    void mopa.offsetWidth; // reinicia la animación
    mopa.classList.add("activa");
    setTimeout(() => mopa.classList.remove("activa"), 950);
  };
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      if (!en.target.classList.contains("visible")) {
        en.target.classList.add("visible");
        if (!en.target.classList.contains("hero")) barrer();
      }
      observador.unobserve(en.target);
    });
  }, { threshold: 0.18 });
  $$("[data-mopa]").forEach((s) => observador.observe(s));
  // El hero se muestra sin esperar
  $(".hero").classList.add("visible");

  /* ---------- Destello en botones ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-brillo]");
    if (!b || reducirMovimiento) return;
    const r = b.getBoundingClientRect();
    const d = document.createElement("span");
    d.className = "destello";
    d.style.left = `${e.clientX - r.left - 5}px`;
    d.style.top = `${e.clientY - r.top - 5}px`;
    b.appendChild(d);
    setTimeout(() => d.remove(), 700);
  });

  /* ---------- Demo interactiva: limpia la escena ---------- */
  (() => {
    const demo = $("#demo");
    const lienzo = $("#lienzoSucio");
    const ctx = lienzo.getContext("2d");
    const porcentaje = $("#demoPorcentaje");
    const relleno = $("#demoRelleno");
    const cursor = document.createElement("div");
    cursor.className = "demo__cursor";
    cursor.innerHTML = `<svg viewBox="0 0 64 64"><rect x="29" y="2" width="6" height="34" rx="3" fill="#94a3b8"/><rect x="12" y="34" width="40" height="12" rx="5" fill="#0f766e"/><g fill="#5eead4"><rect x="13" y="44" width="5" height="16" rx="2.5"/><rect x="20" y="44" width="5" height="18" rx="2.5"/><rect x="27" y="44" width="5" height="16" rx="2.5"/><rect x="34" y="44" width="5" height="18" rx="2.5"/><rect x="41" y="44" width="5" height="16" rx="2.5"/><rect x="48" y="44" width="4" height="17" rx="2"/></g></svg>`;
    cursor.style.display = "none";
    demo.appendChild(cursor);

    let ancho = 0, alto = 0, limpio = false, muestreo = 0;
    const pintarSuciedad = () => {
      const r = lienzo.getBoundingClientRect();
      ancho = lienzo.width = Math.max(1, Math.round(r.width));
      alto = lienzo.height = Math.max(1, Math.round(r.height));
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, 0, ancho, alto);
      g.addColorStop(0, "#9a8f7f"); g.addColorStop(1, "#6b6157");
      ctx.fillStyle = g; ctx.fillRect(0, 0, ancho, alto);
      // manchas y polvo
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * ancho, y = Math.random() * alto, rad = 8 + Math.random() * 40;
        const m = ctx.createRadialGradient(x, y, 0, x, y, rad);
        m.addColorStop(0, `rgba(${40 + Math.random() * 30},${30 + Math.random() * 20},${20},${0.35 + Math.random() * 0.4})`);
        m.addColorStop(1, "rgba(40,30,20,0)");
        ctx.fillStyle = m; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = "rgba(255,255,255,.08)";
      for (let i = 0; i < 400; i++) ctx.fillRect(Math.random() * ancho, Math.random() * alto, 2, 2);
      ctx.globalCompositeOperation = "destination-out";
      limpio = false; demo.classList.remove("limpio"); demo.classList.remove("tocado");
      actualizar(0);
    };
    const actualizar = (p) => { porcentaje.textContent = `${Math.round(p)}% limpio`; relleno.style.width = `${p}%`; };
    const medir = () => {
      if (limpio) return;
      const paso = 8;
      const datos = ctx.getImageData(0, 0, ancho, alto).data;
      let transparentes = 0, total = 0;
      for (let y = 0; y < alto; y += paso) for (let x = 0; x < ancho; x += paso) { total++; if (datos[(y * ancho + x) * 4 + 3] < 40) transparentes++; }
      const p = Math.min(100, (transparentes / total) * 100 * 1.08);
      actualizar(p);
      if (p >= 97) {
        limpio = true; actualizar(100);
        ctx.clearRect(0, 0, ancho, alto);
        demo.classList.add("limpio");
        if (navigator.vibrate) navigator.vibrate(30);
        mostrarToast("✨ ¡Impecable! Así quedan nuestros trabajos.");
        setTimeout(pintarSuciedad, 4500);
      }
    };
    let ultimo = null;
    const limpiar = (x, y) => {
      demo.classList.add("tocado");
      const r = 34;
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = r * 2; ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.beginPath();
      if (ultimo) ctx.moveTo(ultimo.x, ultimo.y); else ctx.moveTo(x, y);
      ctx.lineTo(x, y); ctx.stroke();
      ultimo = { x, y };
      if (++muestreo % 6 === 0) medir();
    };
    const pos = (e) => { const r = lienzo.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    demo.addEventListener("pointermove", (e) => {
      const p = pos(e);
      cursor.style.display = "block"; cursor.style.left = `${p.x}px`; cursor.style.top = `${p.y}px`;
      if (e.pointerType === "touch" && !e.buttons) return;
      limpiar(p.x, p.y);
    });
    demo.addEventListener("pointerdown", (e) => { const p = pos(e); ultimo = null; limpiar(p.x, p.y); });
    demo.addEventListener("pointerup", () => { ultimo = null; medir(); });
    demo.addEventListener("pointerleave", () => { cursor.style.display = "none"; ultimo = null; medir(); });
    new ResizeObserver(() => pintarSuciedad()).observe(lienzo);
    pintarSuciedad();
  })();

  /* ---------- Servicios ---------- */
  const tarjetas = $("#tarjetasServicios");
  tarjetas.innerHTML = D.servicios.map((s) => `
    <article class="tarjeta" data-servicio="${s.id}">
      ${s.destacado ? `<span class="tarjeta__destacado">${s.destacado}</span>` : ""}
      <div class="tarjeta__icono">${s.icono}</div>
      <h3>${s.titulo}</h3>
      <p>${s.texto}</p>
      <div class="tarjeta__pie"><span>desde ${s.desde} € <small>/ servicio</small></span><button type="button" data-calcular="${s.id}">Calcular →</button></div>
    </article>`).join("");
  tarjetas.addEventListener("click", (e) => {
    const b = e.target.closest("[data-calcular]");
    if (!b) return;
    const id = b.dataset.calcular;
    const radio = $(`#calc input[name="tipo"][value="${id}"]`);
    if (radio) { radio.checked = true; } else {
      const extra = $(`#calc input[name="extras"][value="${id}"]`);
      if (extra) extra.checked = true;
    }
    calcular();
    $("#presupuesto").scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth" });
  });
  // Inclinación 3D suave en tarjetas
  if (!reducirMovimiento && matchMedia("(pointer: fine)").matches) {
    tarjetas.addEventListener("pointermove", (e) => {
      const t = e.target.closest(".tarjeta"); if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    tarjetas.addEventListener("pointerleave", (e) => { $$(".tarjeta", tarjetas).forEach((t) => (t.style.transform = "")); }, true);
    tarjetas.addEventListener("pointerout", (e) => { const t = e.target.closest(".tarjeta"); if (t && !t.contains(e.relatedTarget)) t.style.transform = ""; });
  }

  /* ---------- Calculadora ---------- */
  const form = $("#calc");
  const metros = $("#metros");
  const metrosOut = $("#metrosOut");
  const precioTotal = $("#precioTotal");
  const precioNota = $("#precioNota");
  const precioDetalle = $("#precioDetalle");
  const duracionEl = $("#duracion");
  const equipoEl = $("#equipo");
  let presupuestoActual = null;

  function calcularPresupuesto({ tipo, m2, frecuencia, extras }) {
    const t = D.tarifas[tipo];
    const base = t.base + t.porM2 * m2;
    const extrasTotal = extras.reduce((a, e) => a + e.precio, 0);
    const descuento = D.descuentos[frecuencia] || 0;
    const ahorro = (base + extrasTotal) * descuento;
    const total = Math.max(base + extrasTotal - ahorro, 39);
    const horas = Math.max(t.minHoras, t.horasPorM2 * m2 + extras.length * 0.5);
    const equipo = horas > 5 ? 2 : 1;
    const horasReales = horas / equipo;
    return { tipo, nombre: t.nombre, m2, frecuencia, extras, base, extrasTotal, descuento, ahorro, total, horas: horasReales, equipo };
  }
  window.calcularPresupuesto = calcularPresupuesto;

  function leerFormulario() {
    const fd = new FormData(form);
    const extras = $$('input[name="extras"]:checked', form).map((i) => ({ id: i.value, nombre: i.nextElementSibling.textContent.replace(/\s\+\d+€/, "").trim(), precio: Number(i.dataset.precio) }));
    return { tipo: fd.get("tipo"), m2: Number(fd.get("metros")), frecuencia: fd.get("frecuencia"), extras };
  }
  function calcular() {
    const p = calcularPresupuesto(leerFormulario());
    presupuestoActual = p;
    metrosOut.textContent = `${p.m2} m²`;
    if (precioTotal.textContent !== eur(p.total)) {
      precioTotal.parentElement.classList.remove("cambiando"); void precioTotal.offsetWidth; precioTotal.parentElement.classList.add("cambiando");
    }
    precioTotal.textContent = eur(p.total);
    precioNota.textContent = p.frecuencia === "unica" ? "por servicio · IVA incluido" : `por servicio, ${D.nombresFrecuencia[p.frecuencia]} · IVA incluido`;
    const filas = [`<li><span>${p.nombre} · ${p.m2} m²</span><span>${eur(p.base)} €</span></li>`]
      .concat(p.extras.map((e) => `<li><span>${e.nombre}</span><span>+${e.precio} €</span></li>`));
    if (p.ahorro > 0) filas.push(`<li class="ahorro"><span>Descuento ${D.nombresFrecuencia[p.frecuencia]} (${Math.round(p.descuento * 100)}%)</span><span>−${eur(p.ahorro)} €</span></li>`);
    precioDetalle.innerHTML = filas.join("");
    const h = Math.round(p.horas * 2) / 2;
    duracionEl.textContent = `${h} h`.replace(".5", ",5");
    equipoEl.textContent = p.equipo === 1 ? "1 profesional" : `${p.equipo} profesionales`;
    actualizarResumenReserva();
  }
  form.addEventListener("input", calcular);

  /* ---------- Contadores ---------- */
  (() => {
    const contadores = $$("[data-contador]");
    const io = new IntersectionObserver((en) => {
      en.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const fin = Number(e.target.dataset.contador), suf = e.target.dataset.sufijo || "";
        const inicio = performance.now(), dur = 1600;
        const tick = (ahora) => {
          const t = Math.min(1, (ahora - inicio) / dur), f = 1 - Math.pow(1 - t, 3);
          e.target.textContent = new Intl.NumberFormat("es-ES").format(Math.round(fin * f)) + suf;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    contadores.forEach((c) => io.observe(c));
  })();

  /* ---------- Opiniones ---------- */
  (() => {
    const lista = $("#opinionesLista");
    const puntos = $("#opinionesPuntos");
    lista.innerHTML = D.opiniones.map((o) => `
      <article class="opinion">
        <div class="opinion__estrellas" aria-label="5 estrellas">★★★★★</div>
        <p>“${o.texto}”</p>
        <div class="opinion__quien"><span class="opinion__avatar" style="background:${o.color}">${o.nombre[0]}</span><div><strong>${o.nombre}</strong><small>${o.lugar}</small></div></div>
      </article>`).join("");
    puntos.innerHTML = D.opiniones.map((_, i) => `<button role="tab" aria-label="Opinión ${i + 1}" data-i="${i}" class="${i === 0 ? "activo" : ""}"></button>`).join("");
    const items = $$(".opinion", lista);
    const irA = (i) => lista.scrollTo({ left: items[i].offsetLeft - (lista.clientWidth - items[i].offsetWidth) / 2, behavior: "smooth" });
    puntos.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) irA(Number(b.dataset.i)); });
    lista.addEventListener("scroll", () => {
      const centro = lista.scrollLeft + lista.clientWidth / 2;
      let mejor = 0, dist = Infinity;
      items.forEach((it, i) => { const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - centro); if (d < dist) { dist = d; mejor = i; } });
      $$("button", puntos).forEach((b, i) => b.classList.toggle("activo", i === mejor));
    }, { passive: true });
    // Autoavance suave
    if (!reducirMovimiento) {
      let i = 0, pausa = false;
      lista.addEventListener("pointerenter", () => (pausa = true)); lista.addEventListener("pointerleave", () => (pausa = false));
      setInterval(() => { if (pausa || document.hidden) return; i = (i + 1) % items.length; irA(i); }, 5000);
    }
  })();

  /* ---------- FAQ ---------- */
  $("#faqLista").innerHTML = D.faq.map((f) => `<details><summary>${f.p}</summary><p>${f.r}</p></details>`).join("");

  /* ---------- Reserva ---------- */
  const formReserva = $("#formReserva");
  const formResumen = $("#formResumen");
  const fecha = $("#fecha");
  const hoy = new Date(); hoy.setDate(hoy.getDate() + 1);
  fecha.min = hoy.toISOString().slice(0, 10);
  calcular();
  function actualizarResumenReserva() {
    if (!presupuestoActual) return;
    const p = presupuestoActual;
    formResumen.innerHTML = `🧾 <strong>${p.nombre}</strong> · ${p.m2} m² · ${D.nombresFrecuencia[p.frecuencia]}${p.extras.length ? " · " + p.extras.map((e) => e.nombre).join(", ") : ""} → <strong>${eur(p.total)} €</strong> <button type="button" class="enlace" style="color:#5eead4" data-ir="#presupuesto">cambiar</button>`;
  }
  formResumen.addEventListener("click", (e) => { const b = e.target.closest("[data-ir]"); if (b) $(b.dataset.ir).scrollIntoView({ behavior: "smooth" }); });

  function datosReserva() {
    const fd = new FormData(formReserva);
    let ok = true;
    $$("[required]", formReserva).forEach((i) => { const vacio = !i.value.trim(); i.closest(".campo").classList.toggle("error", vacio); if (vacio) ok = false; });
    if (!ok) { mostrarToast("Revisa los campos marcados 🙏"); return null; }
    const p = presupuestoActual;
    const f = fd.get("fecha") ? new Date(fd.get("fecha") + "T12:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : "";
    const texto = `Hola Brillia 👋 Quiero reservar:\n` +
      `• Servicio: ${p.nombre} (${p.m2} m², ${D.nombresFrecuencia[p.frecuencia]})${p.extras.length ? "\n• Extras: " + p.extras.map((e) => e.nombre).join(", ") : ""}\n` +
      `• Precio web: ${eur(p.total)} €\n• Fecha: ${f}, ${fd.get("hora")}\n• Nombre: ${fd.get("nombre")}\n• Teléfono: ${fd.get("telefono")}\n• Dirección: ${fd.get("direccion")}` +
      (fd.get("notas") ? `\n• Notas: ${fd.get("notas")}` : "");
    return texto;
  }
  formReserva.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = datosReserva(); if (!texto) return;
    $("#formOk").hidden = false;
    lanzarConfeti();
    open(`https://wa.me/${D.config.telefono}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });
  $("#btnEmail").addEventListener("click", () => {
    const texto = datosReserva(); if (!texto) return;
    location.href = `mailto:${D.config.email}?subject=${encodeURIComponent("Reserva de limpieza · Brillia")}&body=${encodeURIComponent(texto)}`;
  });
  formReserva.addEventListener("input", (e) => e.target.closest(".campo")?.classList.remove("error"));

  /* ---------- Contacto en pie y WhatsApp flotante ---------- */
  $("#pieTelefono").textContent = D.config.telefonoBonito; $("#pieTelefono").href = `tel:+${D.config.telefono}`;
  $("#pieEmail").textContent = D.config.email; $("#pieEmail").href = `mailto:${D.config.email}`;
  $("#whatsappFlotante").href = `https://wa.me/${D.config.telefono}?text=${encodeURIComponent("Hola Brillia 👋, quiero información sobre una limpieza.")}`;
  $("#reservaWhatsapp").href = `https://wa.me/${D.config.telefono}?text=${encodeURIComponent("Hola Brillia 👋, quiero reservar una limpieza.")}`;
  $("#reservaWhatsapp").textContent = `WhatsApp ${D.config.telefonoBonito.replace("+34 ", "")}`;
  $("#reservaLlamar").href = `tel:+${D.config.telefono}`;
  $("#anio").textContent = new Date().getFullYear();

  /* ---------- Toast y confeti ---------- */
  const toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); document.body.appendChild(toast);
  let toastTimer;
  function mostrarToast(msg) { toast.textContent = msg; toast.classList.add("visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800); }
  window.mostrarToast = mostrarToast;

  function lanzarConfeti() {
    if (reducirMovimiento) return;
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 });
    c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const piezas = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 18, vy: -Math.random() * 16 - 4, r: 4 + Math.random() * 5, c: ["#0ea5a4", "#a3e635", "#5eead4", "#fff", "#fbbf24"][Math.floor(Math.random() * 5)], rot: Math.random() * 6 }));
    let t = 0;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      piezas.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += .5; p.vx *= .99; p.rot += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.restore(); });
      if (++t < 110) requestAnimationFrame(tick); else c.remove();
    };
    requestAnimationFrame(tick);
  }
  window.lanzarConfeti = lanzarConfeti;

  /* ---------- Acceso al chat desde cualquier botón ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-abrir-chat]");
    if (!b) return;
    e.preventDefault();
    window.Brilli?.abrir(b.dataset.mensaje);
  });
})();
