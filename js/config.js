/* ==========================================================================
   Dear Blanc Dental Studio · Configuración
   Esto es lo único que hay que editar para poner el sitio en producción.
   ========================================================================== */

window.DB = {
  /* Número de WhatsApp en formato internacional, sin +, espacios ni guiones.
     Ejemplo Metepec: "527221234567"
     >>> PENDIENTE: sustituir por el número real del consultorio. */
  whatsapp: "52XXXXXXXXXX",

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

  /* Tratamientos del paso 1 de la agenda. El id debe coincidir con las
     pestañas de la sección Tratamientos (tab-estetica, tab-rehabilitacion,
     tab-salud) y con los atributos data-agenda repartidos por el sitio. */
  tratamientos: [
    { id: "estetica",       nombre: "Estética dental",       nota: "Diseño de sonrisa, carillas, blanqueamiento" },
    { id: "rehabilitacion", nombre: "Rehabilitación oral",   nota: "Implantes, coronas, puentes y prótesis" },
    { id: "salud",          nombre: "Salud y prevención",    nota: "Limpieza, periodoncia, guardas oclusales" },
    { id: "valoracion",     nombre: "Todavía no lo sé",      nota: "Empecemos con una valoración" }
  ],

  /* Franjas horarias que se ofrecen en el paso 2. */
  horarios: [
    { id: "manana", nombre: "Por la mañana", nota: "9:00 a 13:00" },
    { id: "tarde",  nombre: "Por la tarde",  nota: "13:00 a 19:00" },
    { id: "flexible", nombre: "Me acomodo",  nota: "Cualquier horario" }
  ]
};
