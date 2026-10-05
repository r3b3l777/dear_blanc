/* Pone ?v=<hash del contenido> en cada URL de /assets que aparezca en
   index.html y en css/*.css.

   Por qué hace falta: vercel.json marca /assets como `immutable`, que le
   dice al navegador que esa URL no va a cambiar nunca. Es correcto siempre
   que el nombre del archivo cambie cuando cambia el contenido, y aquí no
   cambia: las fotos se reemplazan conservando el nombre. Resultado, el
   navegador se queda con la versión vieja para siempre, y ni recargando
   con Cmd+Shift+R la suelta.

   Sellando la URL con el hash, cada contenido nuevo es una URL nueva, el
   navegador la pide, y `immutable` pasa a ser verdad.

       node scripts/sellar-assets.js

   Hay que correrlo después de tocar cualquier imagen o fuente y antes de
   publicar. Es idempotente: vuelve a calcular el sello cada vez. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const raiz = path.join(__dirname, '..');

const sello = new Map();
function hash(rutaWeb) {
  if (sello.has(rutaWeb)) return sello.get(rutaWeb);
  const abs = path.join(raiz, rutaWeb.replace(/^\//, ''));
  let v = null;
  if (fs.existsSync(abs)) {
    v = crypto.createHash('sha1').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);
  }
  sello.set(rutaWeb, v);
  return v;
}

// /assets, /css y /js. Los tres, lleven ya ?v= o no.
//
// El CSS y el JS también: index.html los pedía como "editorial.css?v=1", un
// número puesto a mano que nunca se tocaba, y vercel.json les da una hora de
// frescura sin revalidar. Resultado: un cambio de CSS publicado podía tardar
// una hora en verse, y el navegador ni preguntaba. Mismo fallo que con las
// imágenes, solo que con una hora de techo en vez de un año.
const PATRON = /(\/(?:assets\/[A-Za-z0-9._\-/@]+\.(?:webp|jpg|jpeg|png|svg|woff2|ico)|(?:css|js)\/[A-Za-z0-9._\-]+\.(?:css|js)))(\?v=[0-9a-z]+)?/g;

let tocados = 0, sinArchivo = new Set();
for (const rel of ['index.html', 'css/styles.css', 'css/editorial.css', 'css/fonts.css', 'site.webmanifest']) {
  const abs = path.join(raiz, rel);
  if (!fs.existsSync(abs)) continue;
  const antes = fs.readFileSync(abs, 'utf8');
  const despues = antes.replace(PATRON, (_, ruta) => {
    const h = hash(ruta);
    if (!h) { sinArchivo.add(ruta); return ruta; }
    return `${ruta}?v=${h}`;
  });
  if (despues !== antes) { fs.writeFileSync(abs, despues); tocados++; }
}

// styles.css importa fonts.css con una ruta relativa, que el patrón de
// arriba no coge por no llevar barra inicial. Va aparte.
const stylesAbs = path.join(raiz, 'css/styles.css');
if (fs.existsSync(stylesAbs)) {
  const antes = fs.readFileSync(stylesAbs, 'utf8');
  const h = hash('/css/fonts.css');
  const despues = antes.replace(/@import url\("fonts\.css(?:\?v=[0-9a-z]+)?"\)/,
    h ? `@import url("fonts.css?v=${h}")` : '@import url("fonts.css")');
  if (despues !== antes) { fs.writeFileSync(stylesAbs, despues); tocados++; }
}

console.log(`sellados ${[...sello.values()].filter(Boolean).length} archivos en ${tocados} fuentes`);
if (sinArchivo.size) {
  console.log('referencias sin archivo en disco:');
  for (const r of sinArchivo) console.log('  ' + r);
  process.exitCode = 1;
}
