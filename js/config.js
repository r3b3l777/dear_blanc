/* ==========================================================================
   Dear Blanc Dental Studio · Configuración
   Esto es lo único que hay que editar para poner el sitio en producción.
   ========================================================================== */

window.DB = {
  /* Número de WhatsApp en formato internacional, sin +, espacios ni guiones. */
  whatsapp: "527223390539",

  /* Perfil de Doctoralia. Mientras esté vacío, los botones de Doctoralia
     se ocultan solos en lugar de apuntar a "#". */
  doctoralia: "",

  maps: "https://www.google.com/maps?q=Sanatorio+Venecia+Tecnol%C3%B3gico+Metepec",

  social: {
    instagram: "https://www.instagram.com/dearblancdentalstudio",
    tiktok: "https://www.tiktok.com/@dearblancdentalstudio",
    facebook: "https://www.facebook.com/share/1HZznwknC2/"
  },

  /* Texto por defecto del botón principal de WhatsApp. */
  mensajeCita:
    "Hola, me gustaría agendar una cita de valoración en Dear Blanc Dental Studio.",

  /* Horario de atención. `dias` alimenta el JSON-LD y la ficha de ubicación;
     `resumen` es la línea corta que se repite en la barra y el pie. */
  atencion: {
    resumen: "Lun a Vie 10:00-14:00 y 16:00-19:00 · Sáb 9:00-14:00",
    detalle: "Lunes a viernes de 10:00 a 14:00 y de 16:00 a 19:00. Sábados de 9:00 a 14:00. Domingos cerrado.",
    domingo: "Domingos cerrado"
  },

  /* Tratamientos del paso 1 de la agenda. El id debe coincidir con las
     pestañas de la sección Tratamientos (tab-estetica, tab-rehabilitacion,
     tab-salud) y con los atributos data-agenda repartidos por el sitio. */
  tratamientos: [
    { id: "estetica",       nombre: "Estética dental",       nota: "Diseño de sonrisa, carillas, blanqueamiento" },
    { id: "rehabilitacion", nombre: "Rehabilitación oral",   nota: "Implantes, coronas, puentes y prótesis" },
    { id: "salud",          nombre: "Salud y prevención",    nota: "Limpieza, periodoncia, guardas oclusales" },
    { id: "valoracion",     nombre: "Todavía no lo sé",      nota: "Empecemos con una valoración" }
  ],

  /* Franjas horarias que se ofrecen en el paso 2. Reflejan el horario real:
     mañana corrida de 9 a 14, tarde de 16 a 20 (el sábado solo hay mañana). */
  horarios: [
    { id: "manana",   nombre: "Por la mañana", nota: "10:00 a 14:00, de lunes a viernes" },
    { id: "tarde",    nombre: "Por la tarde",  nota: "16:00 a 19:00, de lunes a viernes" },
    { id: "sabado",   nombre: "El sábado",     nota: "9:00 a 14:00" },
    { id: "flexible", nombre: "Me acomodo",    nota: "Cualquier horario" }
  ],

  /* ------------------------------------------------------------------
     Catálogo de servicios. De aquí salen las tarjetas de la sección
     Tratamientos: la foto, el nombre, la línea de apoyo y el mensaje de
     WhatsApp que se manda al tocar "Consultar precio".

     `img` es el nombre base dentro de /assets/img/tratamientos/. El sitio
     busca <base>.webp y cae a <base>.jpg. Si el archivo no existe, la
     tarjeta se pinta con su inicial sobre un fondo de la paleta: nunca
     queda un hueco roto ni un icono de imagen rota.
     ------------------------------------------------------------------ */
  servicios: {
    estetica: {
      titulo: "Una sonrisa más bonita sin dejar de parecer tú",
      cierre: "No buscamos que todos tengan la misma sonrisa. Buscamos que la tuya se vea naturalmente tuya.",
      items: [
        { slug: "diseno-de-sonrisa",    nombre: "Diseño de sonrisa",     img: "diseno-de-sonrisa",
          desc: "Planeamos los cambios tomando en cuenta tus facciones, tus proporciones y lo que esperas ver." },
        { slug: "carillas",             nombre: "Carillas dentales",     img: "carillas",
          desc: "Transforman forma, color y armonía de ciertos dientes, siempre después de valorar tu caso." },
        { slug: "blanqueamiento",       nombre: "Blanqueamiento dental", img: "blanqueamiento",
          desc: "Un tono más claro y una sonrisa más luminosa con protocolo profesional, cuidando el esmalte." },
        { slug: "ortodoncia-invisible", nombre: "Ortodoncia invisible",  img: "ortodoncia-invisible",
          desc: "Alinea tu sonrisa de forma discreta y removible, a tu propio ritmo y sin brackets a la vista." }
      ]
    },
    rehabilitacion: {
      titulo: "Recuperar lo que una sonrisa ha perdido",
      cierre: "Primero entendemos el problema. Después diseñamos la solución.",
      items: [
        { slug: "implantes",      nombre: "Implante dental",  img: "implantes",
          desc: "Reemplaza la raíz del diente ausente y sostiene la corona como lo haría el tuyo." },
        { slug: "coronas",        nombre: "Corona",           img: "coronas",
          desc: "Cubre y protege el diente dañado devolviéndole forma, función y apariencia." },
        { slug: "puentes",        nombre: "Prótesis fija",    img: "puentes",
          desc: "Rellena el hueco de uno o varios dientes apoyándose en los que quedan a los lados. Va fija." },
        { slug: "protesis",       nombre: "Prótesis total",   img: "protesis",
          desc: "Devuelve la arcada completa cuando faltan muchos dientes." },
        { slug: "restauraciones", nombre: "Restauraciones estéticas", img: "restauraciones",
          desc: "Reparan la parte dañada del diente conservando toda la estructura sana que queda." }
      ]
    },
    salud: {
      titulo: "La mejor transformación también es conservar lo que tienes",
      cierre: "Que tu sonrisa no solo se vea bien. Que esté bien.",
      items: [
        { slug: "limpieza-prevencion", nombre: "Limpieza dental y prevención", img: "limpieza-prevencion",
          desc: "Previene placa y cálculo, y da seguimiento para conservar tus resultados." },
        { slug: "periodoncia",         nombre: "Periodoncia",                 img: "periodoncia",
          desc: "Atención especializada de las encías y las estructuras que sostienen tus dientes." },
        { slug: "guardas",             nombre: "Guardas oclusales",           img: "guardas",
          desc: "Protegen dientes y restauraciones frente al bruxismo y a las cargas de la mordida." }
      ]
    }
  },

  /* Especialistas. Mientras `foto` esté vacío se pinta un avatar con las
     iniciales: la sección funciona igual y no se inventa una cara. */
  equipo: [
    { nombre: "Dirección clínica",  area: "Estética y rehabilitación", foto: "" },
    { nombre: "Rehabilitación oral",area: "Implantes y prótesis",      foto: "" },
    { nombre: "Periodoncia",        area: "Salud de encías",           foto: "" },
    { nombre: "Ortodoncia",         area: "Alineadores y brackets",    foto: "" }
  ]
};
