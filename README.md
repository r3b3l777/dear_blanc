# Dear Blanc Dental Studio

Sitio de una página para el spa dental de Metepec. HTML, CSS y JavaScript
nativos: sin build, sin dependencias, sin CDN. Se sube tal cual.

```
dear-blanc/
├── index.html
├── css/
│   ├── styles.css        # todo el diseño, con tokens en :root
│   └── fonts.css         # @font-face de las tipografías locales
├── js/
│   ├── config.js         # ← lo único que hay que editar
│   └── main.js           # intro, barra, pestañas y agenda
├── assets/
│   ├── img/              # foto del estudio y del sanatorio (jpg + webp)
│   ├── fonts/            # Cormorant Garamond e Instrument Sans (woff2)
│   └── favicon.svg, icon-192.png, icon-512.png, apple-touch-icon.png
├── robots.txt, sitemap.xml, site.webmanifest, vercel.json
```

## Antes de publicar

Abre `js/config.js` y llena:

| Campo | Qué es | Estado |
|---|---|---|
| `whatsapp` | Número del consultorio, formato `52` + 10 dígitos, sin `+` ni espacios | **pendiente** |
| `doctoralia` | URL del perfil | **pendiente** |
| `maps` | Enlace de Google Maps | listo |
| `social` | Instagram, TikTok, Facebook | listo |

Mientras `whatsapp` siga en `52XXXXXXXXXX`, el botón flotante se oculta solo y
el formulario muestra el mensaje en pantalla en lugar de abrir un enlace roto.
Lo mismo con Doctoralia: si está vacío, esos botones no se pintan. Nunca queda
un `href="#"` a la vista.

También hay que cambiar `dearblanc.mx` por el dominio real en `index.html`
(canonical, Open Graph y los dos bloques JSON-LD) y en `sitemap.xml`.

## Lo que falta de contenido

- **Fotografía del estudio.** La sección "El espacio habla antes que nosotros"
  tiene tres huecos marcados con la clase `.slot`. Cuando haya fotos, cada
  `<li class="slot ...">` se cambia por un `<img>` con las mismas proporciones
  (`3/4` la vertical, `16/9` las dos horizontales) y se borra el bloque
  `.studio__cta`. No se inventaron imágenes.
- La foto del hero es un recorte de la imagen original de la marca. Se recortó
  porque el encuadre completo lleva el texto "Something beautiful is coming",
  que era del anuncio de apertura y no puede ir en un sitio en vivo. El archivo
  completo sigue en `assets/img/estudio-arco.jpg` por si se quiere recuperar.

## Correr en local

```bash
cd ~/dear-blanc
python3 -m http.server 4173
```

Hay que servirlo por HTTP, no abrir el `index.html` con doble clic: las rutas
son absolutas (`/css/...`) y con `file://` no resuelven.

## Publicar en Vercel

```bash
npx vercel --prod
```

`vercel.json` ya trae cabeceras de caché para `/assets` y las de seguridad
básicas. No hay paso de build.

## Decisiones que conviene saber

**Tokens de color.** Todo el color sale de variables en `:root` (`css/styles.css`).
La paleta es la original de la marca: crema `#FAF3EC`, vino `#2A1119`, dorado
`#AB8657`. Los tonos de texto se ajustaron a lo mínimo necesario para pasar
WCAG AA; si se cambian, hay que revisar contraste otra vez.

Hay dos familias de tokens y no se pueden mezclar:

- `--paper`, `--ink`, `--oak`… se invierten con `prefers-color-scheme`.
- `--c-wine`, `--c-cream`, `--c-gold-lt`… **no** se invierten. Son para las
  superficies que siempre son oscuras (intro, cierre, pie, la tarjeta oscura
  del estudio). Usar `--paper` como color de texto ahí deja el texto oscuro
  sobre fondo oscuro en modo noche.

**La barra.** `header` lleva `display: contents` a propósito: un elemento
`sticky` solo se pega dentro de su padre, y con el `<header>` como padre la
barra se despegaba a los 110 px. Por lo mismo el `body` usa `overflow-x: clip`
y no `hidden` (`hidden` convierte al body en contenedor de scroll y anula el
`sticky`). El menú móvil vive dentro de `.nav` para viajar con ella.

**La intro** sale como cortina hacia arriba, no con fundido: un fundido cruzado
deja el texto crema encima de la página crema y desaparece a media transición.
Solo se muestra una vez por sesión (`sessionStorage`) y no aparece con
`prefers-reduced-motion`.

**Iconos.** Sprite SVG en línea al inicio del `index.html`, con trazados de
Phosphor Icons (MIT). Los `<symbol>` no llevan `fill`, por eso el CSS aplica
`svg { fill: currentColor }`; sin esa regla los iconos se pintan negros y
desaparecen sobre los fondos oscuros.

**Tipografías** auto-hospedadas en `assets/fonts`. No se cargan de Google.

## Puntos de quiebre

| Ancho | Qué cambia |
|---|---|
| < 640 | Una columna. Barra inferior fija con "Cómo llegar" y "Agendar cita". Tratamientos como píldoras deslizables. |
| ≥ 640 | Rejillas a 2 columnas, ritual a 3. |
| ≥ 768 | Hero y ubicación a dos columnas. Agenda al lado del texto. |
| ≥ 1024 | Menú completo en la barra, tratamientos como lista vertical más panel, experiencia a 4 columnas, se quita la barra inferior. |

Probado con Chrome sin cabeza de 320 a 1440 px, en claro y oscuro, sin
desbordes horizontales y sin errores de consola.
