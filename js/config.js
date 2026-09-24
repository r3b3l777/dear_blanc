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
    resumen: "Lun a Vie 9:00-14:00 y 16:00-20:00 · Sáb 9:00-14:00",
    detalle: "Lunes a viernes de 9:00 a 14:00 y de 16:00 a 20:00. Sábados de 9:00 a 14:00. Domingos cerrado.",
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
    { id: "manana",   nombre: "Por la mañana", nota: "9:00 a 14:00" },
    { id: "tarde",    nombre: "Por la tarde",  nota: "16:00 a 20:00, de lunes a viernes" },
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
      intro: "Armonía, proporción y naturalidad. No una sonrisa idéntica para todos.",
      cierre: "No buscamos que todos tengan la misma sonrisa. Buscamos que la tuya se vea naturalmente tuya.",
      items: [
        { slug: "diseno-de-sonrisa",   nombre: "Diseño de sonrisa",    img: "diseno-de-sonrisa",   linea: "Planeamos los cambios tomando en cuenta tus facciones y proporciones." },
        { slug: "carillas",            nombre: "Carillas dentales",    img: "carillas",            linea: "Transforman forma, color y armonía de determinados dientes." },
        { slug: "blanqueamiento",      nombre: "Blanqueamiento",       img: "blanqueamiento",      linea: "Un tono más claro con protocolo profesional." },
        { slug: "armonizacion",        nombre: "Armonización estética",img: "armonizacion",        linea: "Cambios que transforman la percepción de tu sonrisa." },
        { slug: "ortodoncia-invisible",nombre: "Ortodoncia invisible", img: "ortodoncia-invisible",linea: "Alinea tu sonrisa de forma discreta y removible." }
      ]
    },
    rehabilitacion: {
      titulo: "Recuperar lo que una sonrisa ha perdido",
      intro: "Cuando hay dientes ausentes o dañados no se trata solo de estética: es función, salud y confianza.",
      cierre: "Primero entendemos el problema. Después diseñamos la solución.",
      items: [
        { slug: "implantes",     nombre: "Implantes dentales",  img: "implantes",     linea: "Reemplazan dientes ausentes con una solución planificada." },
        { slug: "coronas",       nombre: "Coronas",             img: "coronas",       linea: "Devuelven estructura, función y apariencia." },
        { slug: "protesis",      nombre: "Puentes y prótesis",  img: "protesis",      linea: "Recuperan dientes ausentes y el equilibrio de la mordida." },
        { slug: "restauraciones",nombre: "Restauraciones",      img: "restauraciones",linea: "Reparan el diente conservando la estructura sana." }
      ]
    },
    salud: {
      titulo: "La mejor transformación también es conservar lo que tienes",
      intro: "Una sonrisa saludable necesita atención antes de que aparezcan los problemas.",
      cierre: "Que tu sonrisa no solo se vea bien. Que esté bien.",
      items: [
        { slug: "limpieza",    nombre: "Limpieza profesional",  img: "limpieza",    linea: "Previene la acumulación de placa y cálculo." },
        { slug: "prevencion",  nombre: "Prevención",            img: "prevencion",  linea: "Seguimiento para conservar los resultados." },
        { slug: "periodoncia", nombre: "Periodoncia",           img: "periodoncia", linea: "Atención de las estructuras que sostienen tus dientes." },
        { slug: "guardas",     nombre: "Guardas oclusales",     img: "guardas",     linea: "Protegen dientes y restauraciones del bruxismo." }
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
