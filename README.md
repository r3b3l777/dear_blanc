# Dear Blanc Dental Studio

Sitio de una página para el spa dental de Metepec. HTML, CSS y JavaScript
nativos: sin build, sin dependencias, sin CDN. Se sube tal cual.

```
dear-blanc/
├── index.html
├── css/
│   ├── styles.css        # base: tokens en :root, layout y componentes
│   ├── editorial.css     # capa del deck + plataforma (se carga después)
│   └── fonts.css         # @font-face de las tipografías locales
├── js/
│   ├── config.js         # ← lo único que hay que editar
│   └── main.js           # intro, barra, pestañas, tarjetas y agenda
├── scripts/
│   ├── gen-tratamientos.js  # regenera el bloque de Tratamientos
│   ├── preparar-fotos.py    # reescala y enfoca las fotos, 440 y 880
│   └── fotos-fuente/        # los originales de los que salen
├── assets/
│   ├── img/              # foto del estudio y del sanatorio (jpg + webp)
│   │   └── tratamientos/ # una por servicio (jpg + webp)
│   ├── fonts/            # Cormorant Garamond e Instrument Sans (woff2)
│   └── favicon.svg, icon-192.png, icon-512.png, apple-touch-icon.png
├── robots.txt, sitemap.xml, site.webmanifest, vercel.json
```

## Antes de publicar

Abre `js/config.js` y llena:

| Campo | Qué es | Estado |
|---|---|---|
| `whatsapp` | Número del consultorio, formato `52` + 10 dígitos, sin `+` ni espacios | listo |
| `doctoralia` | URL del perfil | **pendiente** |
| `maps` | Enlace de Google Maps | listo |
| `social` | Instagram, TikTok, Facebook | listo |

Mientras `whatsapp` siga en `52XXXXXXXXXX`, el botón flotante se oculta solo y
el formulario escribe el mensaje en consola en lugar de abrir un enlace roto.
Lo mismo con Doctoralia: si está vacío, esos botones no se pintan. Nunca queda
un `href="#"` a la vista.

También hay que cambiar `dearblanc.mx` por el dominio real en `index.html`
(canonical, Open Graph y los dos bloques JSON-LD) y en `sitemap.xml`.

## Fotografía

Las fotos del estudio salieron del PDF de marca `ADN CREATIVO & DEAR BLANC.pdf`
y son del consultorio real. Vienen recortadas para dejar fuera el texto de la
campaña de apertura ("COMING SOON", "SOMETHING BEAUTIFUL IS COMING",
"GRAN APERTURA · 28 agosto"), que no puede aparecer en un sitio en vivo.

| Archivo | Dónde se usa | Origen |
|---|---|---|
| `estudio-bienvenida` | El estudio, hueco vertical 3/4 | arco de acceso |
| `estudio-espera` | El estudio, hueco 16/9 | sala en desenfoque |
| `estudio-consultorio` | El estudio, hueco 16/9 | cubierta de roble y lavabo |
| `instrumental` | Banda sobre Tratamientos | charola dorada |
| `unidad-dental` | Banda en Atención integral | radiografía y unidad |
| `filosofia-arco` | Filosofía, panel vertical (≥900px) | arco de yeso y roble |

**Pendiente:** el PDF trae las imágenes reducidas a 432 px de ancho. Alcanzan
para las cajas actuales, pero se ven blandas en pantallas 2x. Conviene pedir
los originales al estudio de diseño y regenerarlos con el mismo recorte.
Los `.webp` se generan con `cwebp -q 80`, los `.jpg` con `sips -s formatOptions 82`.

La foto de la portada ya no es esa: ahora es el primer plano de una sonrisa
que mandó el estudio (965x734). Se sirve en tres anchos, 640, 965 y 1930; el
de 1930 es el mismo material ampliado y enfocado, para que en pantallas de
densidad doble no lo estire el navegador con su escalador. Pesa 55 KB en
webp porque casi toda la imagen está fuera de foco y comprime muy bien.

Las seis fotos del estudio llevan la misma máscara de enfoque, más suave
(radio 1.3, 85%), porque se muestran casi a tamaño nativo.

El recorte anterior de la portada sigue en `assets/img/estudio-arco.jpg`.

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
| < 640 | Una columna. Barra inferior fija con "Cómo llegar" y "Agendar cita". Tratamientos como píldoras deslizables, tarjetas de servicio a 2 columnas. |
| ≥ 640 | Rejillas a 2 columnas, ritual a 3. |
| ≥ 768 | Hero y ubicación a dos columnas. Agenda al lado del texto. |
| ≥ 1024 | Menú completo en la barra, tratamientos como lista vertical más panel, experiencia a 4 columnas, se quita la barra inferior. |

Probado con Chrome sin cabeza de 320 a 1440 px, en claro y oscuro, sin
desbordes horizontales, sin imágenes rotas y sin errores de consola.

## La capa editorial

`css/editorial.css` se carga después de `styles.css` y hace dos cosas.

**Traduce el deck de 12 láminas.** Esquina recta en vez de radio, filete de 1px
en vez de sombra, cintillo numerado por sección (atributo `data-slide`), eje
izquierdo en todos los bloques y botones vino en versalitas. No define ningún
color nuevo: usa los tokens de `styles.css`.

**Compatibilidad de plataforma** (sección 20). `appearance:none` en los campos,
porque Safari en iOS y macOS impone su propio relleno y sombra; tamaño de texto
fijado en 16px en los campos, porque por debajo Safari iOS hace zoom al enfocar;
objetivos táctiles de 44px; bloques para `forced-colors` (alto contraste de
Windows), `prefers-reduced-transparency` y `prefers-contrast`.

Va todo en un archivo y no en varios a propósito: el sitio no tiene paso de
compilación y cada hoja extra es una petición bloqueante más en móvil.

**Verificado en WebKit, no en Safari.** Lo medido (desbordes, objetivos
táctiles, errores) se hizo con Chrome sin cabeza. Además se renderizó con
QuickLook (`qlmanage -t`), que usa WebKit, para comprobar en el motor de
Safari los componentes nuevos: el cintillo `data-slide` con `attr()`, la
rejilla de fotos con `aspect-ratio` y `object-fit`, el botón sólido en modo
noche y, sobre todo, los campos con `appearance:none`. Todo correcto.

Lo que sigue sin probar es **Safari real en un dispositivo**: QuickLook no
ejecuta JavaScript, así que las pestañas, la agenda, el menú y la barra
pegajosa no se han visto funcionar en iOS. Safari no se deja automatizar sin
permiso (`safaridriver --enable`, que pide contraseña de administrador) y la
captura de pantalla está bloqueada por permisos de Grabación de Pantalla.
Alguien tiene que abrir el sitio en un iPhone y recorrerlo.

## Precios, no en el sitio

En la página no se publica ningún precio. Cada tarjeta de tratamiento lleva
**Consultar precio**, que es un `wa.me` con el nombre del tratamiento ya
escrito: un toque y la conversación empieza con el contexto puesto. Los
enlaces los arma `js/main.js` a partir de `DB.servicios`; si algún día hace
falta cambiar el texto del mensaje, está en un solo sitio.

## Tres clics hasta WhatsApp

La agenda pasó de tres pasos a dos y perdió el campo del nombre. Ahora cada
elección avanza sola, así que el camino completo es: tocas tratamiento,
tocas horario, tocas enviar. Tres clics y WhatsApp abierto con el mensaje
armado; el nombre se resuelve en la conversación, que es donde ya estaba
pasando de todos modos. Hay una prueba en `test.js` (fuera del repo) que
cuenta los clics; si alguien vuelve a meter un "Continuar", se nota.

## Fotografía de los tratamientos

Las ocho fotos salieron de dos láminas de marca que mandó el estudio. Cada
mosaico traía el nombre del tratamiento sobrepuesto: se recortó esa franja y
de lo que quedó se tomó un 3:2 centrado, la proporción de la tarjeta.

No miden todas lo mismo, por eso el generador lee el tamaño real de cada jpg
(recorre los marcadores SOF de la cabecera) en lugar de escribir uno fijo:

| Foto | Tamaño |
|---|---|
| `limpieza-prevencion` | 721x481 |
| `ortodoncia-invisible` | 507x338 |
| las otras seis | 440x248 |

**No se puede inventar detalle que no está**, pero sí recuperar el contraste
de borde que se perdió en la cadena captura -> JPEG -> recorte. Eso hace
`scripts/preparar-fotos.py`: reescala con Lanczos y aplica una máscara de
enfoque moderada (radio 1.6, 110%, umbral 3). Con radio 2.2 y 190% aparecen
halos en el borde de los dientes y la piel se vuelve granulosa; se probó y se
descartó.

De cada foto salen dos anchos, 440 y 880, y el `<picture>` los reparte con
`srcset`. Comprobado: a dpr 1 el navegador se baja el de 440, a dpr 2 y 3 el
de 880. Un teléfono en 1x no carga el grande.

```bash
python3 scripts/preparar-fotos.py      # regenera las ocho, en los dos anchos
node scripts/gen-tratamientos.js       # actualiza el HTML con las medidas
```

Las fuentes viven en `scripts/fotos-fuente/` y son la copia buena. El script
**nunca lee de la carpeta a la que escribe**: si lo hiciera, cada corrida
reprocesaría su propia salida y las fotos se irían degradando sola tras otra.
Ahí es donde hay que dejar los originales si algún día aparecen.

Dos tratamientos siguen sin foto: **periodoncia** y **guardas oclusales**.
No estaban en la lámina. Sus tarjetas se pintan con el fondo de la paleta y
la inicial del tratamiento, que es una cara válida de la baraja y no un
hueco. En cuanto existan `periodoncia.jpg` y `guardas.jpg` en
`assets/img/tratamientos/`, hay que volver a generar el bloque (ver abajo) y
las tarjetas se encienden solas.

El HTML de la sección **se genera**. Al cambiar el catálogo o al añadir una
foto hay que correr:

```bash
node scripts/gen-tratamientos.js
```

Lee `DB.servicios` y la carpeta de imágenes, y reescribe el bloque dentro de
`index.html`. Solo emite el `<picture>` si el archivo existe en disco, así
que ningún tratamiento sin foto pide una imagen que devuelve 404. Es lo
único del proyecto que se genera; el resto del HTML se edita a mano.

Mismo trato para `DB.equipo`: mientras `foto` esté vacío se pinta un avatar
con las iniciales, no una cara inventada.

## Las tarjetas que se voltean

Delante va la fotografía y el nombre; detrás, la descripción y "Consultar
precio". Es la forma de que el servicio se explique sin llenar la página de
texto: la descripción existe, pero solo cuando se pide.

Al entrar la rejilla en pantalla hace **una pasada**: las tarjetas giran una
tras otra con 230 ms de diferencia, enseñan el reverso y vuelven. Una, no un
bucle; repetirla sin parar convierte la sección en un letrero luminoso. Si
alguien toca una tarjeta a media pasada, se cancelan sus temporizadores y el
control pasa a quien mira.

Después el giro lo manda el cursor (hover, en CSS) o el dedo. En táctil hay
un botón invisible que cubre la tarjeta; cuando el reverso está a la vista
ese botón baja por debajo de "Consultar precio", de modo que tocar el texto
devuelve la tarjeta al frente y tocar el botón abre WhatsApp. Sin eso la
tarjeta se quedaba volteada sin forma de regresarla.

La proporción es 3:2 y no 16:9 como las fotos: el reverso necesita ese alto
extra para que quepan la descripción y el botón. A 210 px de ancho el texto
se cortaba a media frase y el botón quedaba fuera de la tarjeta, por eso la
rejilla va a dos columnas anchas y no a tres angostas.

Con `prefers-reduced-motion` no hay pasada automática y el giro es
instantáneo: la descripción tiene que seguir siendo alcanzable.

## Horario

Lunes a viernes de 9:00 a 14:00 y de 16:00 a 20:00. Sábados de 9:00 a 14:00.
Domingos cerrado. Está en cuatro sitios y los cuatro tienen que coincidir:
`DB.atencion` en `config.js`, la ficha de Ubicación, la ficha de la agenda y
el `openingHoursSpecification` del JSON-LD en `index.html`.

## La paleta es la del manual, no una aproximación

Los colores salen de la p.10 de `ADN CREATIVO & DEAR BLANC.pdf`, que es el
manual de marca real. Son cinco neutros y **ninguno es un acento cálido**;
el manual dice literalmente "blanco, negro y tonos neutros (beige, arena o
gris)".

| Token | Valor | En el manual |
|---|---|---|
| `--blanco` / `--paper` | `#FDF9F4` | "limpieza, simplicidad, transparencia" |
| `--nude` / `--paper-2` | `#E8DAD4` | neutro nude |
| `--arena` / `--paper-3` | `#D0C7BD` | neutro arena/gris |
| `--vino` / `--ink` | `#2F1116` | el color del logotipo |
| `--negro` | `#000000` | "elegancia, fuerza, carácter" |

El sitio venía con un dorado `#AB8657` como acento único, y de él colgaban
79 reglas. **Ese dorado no existe en la marca**: se inventó. Los tokens
`--oak` se conservan porque están por todo el CSS, pero ahora apuntan al
vino y a los dos neutros. Si alguna vez aparece un dorado en el sitio, es un
error.

**No hay tema oscuro.** Se declara `color-scheme: light` y se quitaron los
seis bloques de `prefers-color-scheme: dark`. Invertir la paleta con el
ajuste del sistema convertía la página en un muro vino y peleaba con la
identidad; además dejó rotos, durante un tiempo, el texto del ritual y los
enlaces de la barra, que se quedaron en crema sobre fondo claro.

## El logotipo es el de verdad

`assets/logo-dear-blanc.svg` es el trazado vectorial extraído de la p.3 del
manual con `pdftocairo -svg`, reducido a 21 `<path>` limpios (de 47 KB a 15).
Va inline en el sprite del `index.html` como `#i-logo`, así hereda el color
con `currentColor` y sirve igual en la barra, en el pie y en la cortina.

Antes el lockup se dibujaba con Cormorant Garamond **en cursiva**. El
logotipo real es vertical y de otra tipografía (TAN St Canard, p.9 del
manual): no se parecía.

**Pendiente de tipografía.** El manual usa tres fuentes y el sitio ninguna:

| Rol | Marca | Sitio |
|---|---|---|
| Logotipo | TAN St Canard Display | resuelto con el SVG |
| Titulares | CMU Serif | Cormorant Garamond |
| Texto | Codec Pro | Instrument Sans |

CMU Serif es libre (OFL) y se puede auto-hospedar sin coste. **Codec Pro es
comercial** (Zetafonts) y necesita licencia web: hay que comprarla o pedirla
al cliente. Hasta entonces Instrument Sans es un sustituto provisional, no
la tipografía de la marca.

## El espacio muerto y cómo se midió

El síntoma que reportó el cliente ("mucho espacio muerto, falta de diseño")
tenía una causa concreta: `.head { max-width: 34rem }` dentro de un
contenedor de 1120 px dejaba **576 px de papel vacío a la derecha**, nueve
veces al bajar. No faltaba aire: estaba mal puesto, en horizontal donde
tocaba en vertical.

A partir de 62em la cabecera pasa a dos columnas (titular a la izquierda,
bajada alineada abajo a la derecha). Se arregla con una sola regla y sin
HTML nuevo. Los huecos restantes del cierre, las preguntas, la valoración y
la experiencia se resolvieron uno a uno en la sección 44 de `editorial.css`.

Medición antes y después, con `medir.js` (fuera del repo), a 1280 px:

| Sección | antes | después |
|---|---|---|
| `#diferencia` | 656 px | 40 px |
| `#valoracion` | 637 px | 40 px |
| `#preguntas` | 621 px | 40 px |
| `#contacto` | 584 px | 80 px |
| `#atencion` | 560 px | 40 px |

El objetivo es que ninguna sección pase de 140 px. Si alguien vuelve a
limitar `.head`, esto se rompe y se nota.

También había trece `h2` **del mismo tamaño exacto** (53.6 px) y un `h1`
solo un 10% mayor. Una página sin escala de tamaños se lee como una lista,
no como una composición. Ahora hay tres secciones ancla (`--hito`) con
titular grande, y la escala es 82 / 58 / 41.

