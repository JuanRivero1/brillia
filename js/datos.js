/* ===== TUservicio · datos y configuración =====
   Cambia aquí teléfono, email, precios y textos sin tocar la lógica. */
window.TUSERVICIO = {
  config: {
    nombre: "TUservicio",
    telefono: "34649671247",          // sin espacios ni "+", para WhatsApp
    telefonoBonito: "+34 649 671 247",
    email: "infotuservicioes@gmail.com",
    ciudad: "Madrid y alrededores",
    horario: "lunes a sábado de 8:00 a 20:00",
  },

  // Tarifas de la calculadora (€/m² y mínimos)
  tarifas: {
    hogar:    { nombre: "Limpieza de hogar",    base: 35, porM2: 0.68, horasPorM2: 0.035, minHoras: 2 },
    oficina:  { nombre: "Limpieza de oficina",  base: 45, porM2: 0.55, horasPorM2: 0.028, minHoras: 2 },
    obra:     { nombre: "Limpieza fin de obra", base: 90, porM2: 1.45, horasPorM2: 0.07,  minHoras: 4 },
    profunda: { nombre: "Limpieza a fondo",     base: 60, porM2: 1.05, horasPorM2: 0.055, minHoras: 3 },
  },
  descuentos: { unica: 0, semanal: 0.15, quincenal: 0.10, mensual: 0.05 },
  nombresFrecuencia: { unica: "una vez", semanal: "cada semana", quincenal: "cada dos semanas", mensual: "cada mes" },

  // Tras cambiar servicios o FAQ, ejecuta desde la raíz:
  //   node .claude/skills/tuservicio-seo/scripts/sincronizar_html.mjs
  // para copiarlos al HTML estático y a los datos estructurados de Google.
  servicios: [
    { id: "hogar", icono: "🏠", titulo: "Hogar", texto: "Mantenimiento semanal o puntual: polvo, suelos, baños, cocina y cristales interiores.", desde: 59, destacado: "Más pedido" },
    { id: "oficina", icono: "🏢", titulo: "Oficinas", texto: "Espacios de trabajo impecables, antes de que llegue tu equipo o cuando se va.", desde: 69 },
    { id: "obra", icono: "🏗️", titulo: "Fin de obra", texto: "Polvo de obra, restos de pintura y silicona. Entrega lista para vivir o alquilar.", desde: 149 },
    { id: "profunda", icono: "🧼", titulo: "A fondo", texto: "Esa limpieza de cambio de estación: electrodomésticos por dentro, zócalos, juntas y rincones.", desde: 99 },
    { id: "cristales", icono: "🪟", titulo: "Cristales", texto: "Ventanas, mamparas y escaparates sin marcas. Con agua desionizada, sin productos agresivos.", desde: 39 },
    { id: "tapiceria", icono: "🛋️", titulo: "Tapicerías", texto: "Sofás, colchones y alfombras con inyección-extracción. Adiós a manchas y ácaros.", desde: 49 },
  ],

  opiniones: [
    { nombre: "Lucía M.", lugar: "Chamberí", texto: "Reservé a las 9 de la mañana y a las 12 tenía la casa brillando. El presupuesto online fue exactamente lo que pagué.", color: "#0ea5a4" },
    { nombre: "Carlos R.", lugar: "Oficina en Las Tablas", texto: "Vienen cada semana a las 7 y cuando llegamos todo huele a limpio. Siempre el mismo equipo, eso se nota.", color: "#6366f1" },
    { nombre: "Marta y Jorge", lugar: "Fin de obra · Getafe", texto: "La reforma dejó un polvo infernal. Lo dejaron para entrar a vivir ese mismo día. Repetiremos sin dudar.", color: "#f59e0b" },
    { nombre: "Elena P.", lugar: "Alcobendas", texto: "Tengo dos gatos y mucha alergia. Usan productos eco y el sofá quedó como nuevo. Un 10.", color: "#ec4899" },
    { nombre: "David S.", lugar: "Retiro", texto: "Lo del chat está muy bien: pregunté por el precio un domingo y me contestó al momento. Reservado en 2 minutos.", color: "#22c55e" },
  ],

  faq: [
    { p: "¿Tengo que estar en casa durante la limpieza?", r: "No es necesario. Muchos clientes nos dejan llaves o nos abren a distancia. Todo el equipo está identificado, asegurado y con contrato." },
    { p: "¿Traéis vuestros productos y material?", r: "Sí, siempre. Trabajamos con productos ecológicos certificados y aspiradores con filtro HEPA. Si prefieres que usemos los tuyos, dínoslo en las notas." },
    { p: "¿Cómo se paga?", r: "Después del servicio, cuando lo hayas revisado: tarjeta, Bizum o transferencia. Para servicios recurrentes, factura mensual." },
    { p: "¿Qué pasa si no quedo satisfecho?", r: "Volvemos y lo repasamos sin coste en las siguientes 48 horas. Es nuestra garantía TUservicio." },
    { p: "¿Puedo cancelar o cambiar la fecha?", r: "Sí, gratis hasta 24 horas antes desde el mismo WhatsApp de confirmación. Con menos antelación se cobra el 50 %." },
    { p: "¿En qué zonas trabajáis?", r: "Madrid capital y municipios a menos de 30 km. Para otras zonas, escríbenos y te decimos si podemos." },
  ],

  // Base de conocimiento del chat: palabras clave -> respuesta
  conocimiento: [
    { claves: ["hola", "buenas", "hey", "hello", "buenos días", "buenas tardes"], respuesta: "¡Hola! 👋 Soy la asistente de TUservicio. Puedo darte precios, horarios, zonas o ayudarte a reservar. ¿Qué necesitas?", chips: ["¿Cuánto cuesta?", "Reservar", "Zonas"] },
    { claves: ["precio", "cuesta", "cuánto", "cuanto", "tarifa", "presupuesto", "vale"], respuesta: "Nuestros precios orientativos:\n🏠 Hogar desde 59 €\n🏢 Oficina desde 69 €\n🧼 A fondo desde 99 €\n🏗️ Fin de obra desde 149 €\n\nDime los metros cuadrados (por ejemplo «80 m² hogar») y te calculo el precio exacto aquí mismo, o usa la [calculadora](#presupuesto).", chips: ["80 m² hogar", "150 m² oficina", "Ir a la calculadora"] },
    { claves: ["incluye", "incluido", "qué hacéis", "que haceis", "qué entra"], respuesta: "Una limpieza estándar incluye: polvo en todas las superficies, aspirado y fregado de suelos, baños y cocina completos (exterior de electrodomésticos), espejos, y vaciado de papeleras. Los extras (horno y nevera por dentro, cristales, plancha, tapicerías) se añaden en la calculadora. 👍", chips: ["¿Cuánto cuesta?", "Reservar"] },
    { claves: ["horario", "hora", "cuando", "cuándo", "abierto", "domingo", "sábado", "sabado"], respuesta: "Trabajamos de lunes a sábado de 8:00 a 20:00. Puedes elegir franja de mañana, mediodía o tarde al reservar. Los domingos descansamos, pero este chat no 😄", chips: ["Reservar", "¿Cuánto cuesta?"] },
    { claves: ["zona", "zonas", "dónde", "donde", "ciudad", "madrid", "barrio", "venís", "venis", "llegáis"], respuesta: "Cubrimos Madrid capital y municipios a menos de 30 km (Alcobendas, Getafe, Pozuelo, Las Rozas, Majadahonda, Rivas...). Si estás un poco más lejos, escríbenos por WhatsApp y vemos qué podemos hacer.", chips: ["Reservar", "WhatsApp"] },
    { claves: ["reservar", "reserva", "contratar", "cita", "quiero", "agendar"], respuesta: "¡Genial! Rellena el [formulario de reserva](#reservar) y te confirmamos por WhatsApp en menos de 10 minutos. Si prefieres hablar directamente, aquí tienes nuestro [WhatsApp](whatsapp).", chips: ["Ir al formulario", "WhatsApp"] },
    { claves: ["producto", "productos", "eco", "ecológico", "ecologico", "químico", "quimico", "alergia", "mascota", "perro", "gato", "bebé", "bebe"], respuesta: "Usamos solo productos ecológicos con certificado Ecolabel, seguros para niños, mascotas y personas con alergias. Y aspiradores con filtro HEPA que atrapan el polvo en vez de levantarlo. 🌿", chips: ["¿Cuánto cuesta?", "Reservar"] },
    { claves: ["pago", "pagar", "tarjeta", "bizum", "efectivo", "factura"], respuesta: "Pagas después del servicio, cuando lo hayas revisado: tarjeta, Bizum o transferencia. Siempre con factura. Para servicios recurrentes, una única factura al mes.", chips: ["Reservar"] },
    { claves: ["cancelar", "cancelación", "cancelacion", "cambiar", "anular", "modificar"], respuesta: "Puedes cancelar o cambiar la fecha gratis hasta 24 h antes, desde el WhatsApp de confirmación. Con menos antelación se cobra el 50 %.", chips: ["Reservar", "Horario"] },
    { claves: ["seguro", "garantía", "garantia", "rotura", "confianza", "fiable"], respuesta: "Todo el equipo tiene contrato, seguro de responsabilidad civil y está identificado. Y si algo no queda a tu gusto, volvemos a repasarlo gratis en 48 h. Esa es la garantía TUservicio. 🛡️", chips: ["Reservar", "¿Cuánto cuesta?"] },
    { claves: ["llaves", "estar en casa", "en casa", "presente"], respuesta: "No necesitas estar en casa. Puedes dejarnos llaves, una caja de seguridad o abrirnos a distancia. Te mandamos foto al terminar. 📸", chips: ["Reservar"] },
    { claves: ["tiempo", "dura", "duración", "duracion", "tarda", "tardan"], respuesta: "Depende de los metros: un piso de 80 m² son unas 3 horas con una profesional; una oficina de 150 m², unas 4 h. En la [calculadora](#presupuesto) te sale la duración exacta junto al precio.", chips: ["Ir a la calculadora"] },
    { claves: ["humano", "persona", "llamar", "teléfono", "telefono", "whatsapp", "contacto", "hablar"], respuesta: "Claro, puedes hablar con una persona del equipo por [WhatsApp](whatsapp) o llamar al +34 649 671 247 de lunes a sábado.", chips: ["WhatsApp"] },
    { claves: ["gracias", "perfecto", "genial", "vale", "ok"], respuesta: "¡A ti! 😊 Si necesitas algo más, aquí estoy. ¡Que brille tu día!", chips: ["Reservar", "¿Cuánto cuesta?"] },
    { claves: ["trabajo", "empleo", "trabajar", "curriculum", "cv", "vacante"], respuesta: "¡Nos encanta que quieras unirte! Envíanos tu CV a infotuservicioes@gmail.com con el asunto «Quiero brillar» y te contestamos en una semana.", chips: [] },
  ],
};
