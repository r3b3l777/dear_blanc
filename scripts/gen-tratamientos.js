/* Genera el bloque de la sección Tratamientos dentro de index.html a partir
   de DB.servicios y de las fotos que existan en assets/img/tratamientos/.
   No hay paso de compilación en el sitio: esto se corre a mano cuando cambia
   el catálogo o cuando llegan fotos nuevas.

       node scripts/gen-tratamientos.js

   Solo emite el <picture> de los tratamientos cuyo archivo existe, así que
   ninguna tarjeta pide una imagen que devuelve 404. */

const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

global.window = {};
require(path.join(raiz, 'js/config.js'));
const DB = global.window.DB;

const cat = {
  estetica: 'Estética dental',
  rehabilitacion: 'Rehabilitación oral',
  salud: 'Salud y prevención'
};
const primera = 'estetica';
const rutaFoto = n => path.join(raiz, 'assets/img/tratamientos', n + '.jpg');
const hayFoto = n => fs.existsSync(rutaFoto(n));

/* Lee el tamaño real del jpg recorriendo los marcadores SOF de la cabecera.
   Las fotos no miden todas lo mismo y poner 440x248 a mano era mentira; con
   el tamaño correcto el navegador reserva la caja antes de descargarla. */
function medidas(n) {
  const b = fs.readFileSync(rutaFoto(n));
  let i = 2;                                  // saltamos el SOI (FFD8)
  while (i < b.length - 9) {
    if (b[i] !== 0xFF) { i++; continue; }
    const marca = b[i + 1];
    // SOF0..SOF15, menos DHT (C4), JPG (C8) y DAC (CC), que no son SOF.
    if (marca >= 0xC0 && marca <= 0xCF && marca !== 0xC4 && marca !== 0xC8 && marca !== 0xCC) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);           // siguiente segmento
  }
  throw new Error('no pude leer el tamaño de ' + n + '.jpg');
}

let tabs = '', paneles = '';
for (const clave of Object.keys(cat)) {
  const g = DB.servicios[clave], on = clave === primera;
  tabs += `          <button class="tx__tab" role="tab" id="tab-${clave}" aria-controls="panel-${clave}" aria-selected="${on}"${on ? '' : ' tabindex="-1"'}>${cat[clave]}</button>\n`;

  let tarjetas = '';
  g.items.forEach((it, i) => {
    const m = hayFoto(it.img) ? medidas(it.img) : null;
    const foto = m ? `
              <picture>
                <source type="image/webp" srcset="/assets/img/tratamientos/${it.img}.webp">
                <img src="/assets/img/tratamientos/${it.img}.jpg" alt="${it.nombre}" width="${m.w}" height="${m.h}" loading="lazy" decoding="async">
              </picture>` : '';
    tarjetas += `              <article class="svc" data-svc="${it.slug}" style="--i:${i}">
              <div class="svc__flip">
                <div class="svc__face svc__front"${foto ? ' data-foto' : ''} data-ghost="${it.nombre[0]}">${foto}
                  <h4 class="svc__name">${it.nombre}</h4>
                </div>
                <div class="svc__face svc__back">
                  <h4 class="svc__name">${it.nombre}</h4>
                  <p class="svc__desc">${it.desc}</p>
                  <a class="svc__cta" href="#agenda" data-precio="${it.slug}" data-nombre="${it.nombre}">
                    <span>Consultar precio</span>
                    <svg aria-hidden="true"><use href="#i-whatsapp-logo"></use></svg>
                  </a>
                </div>
              </div>
              <button type="button" class="svc__girar" aria-label="Ver la descripción de ${it.nombre}"></button>
              </article>\n`;
  });

  paneles += `          <div class="tx__panel" id="panel-${clave}" role="tabpanel" aria-labelledby="tab-${clave}" tabindex="0"${on ? ' data-active' : ''}>
            <div class="tx__card">
              <p class="tx__kicker">${cat[clave]}</p>
              <h3>${g.titulo}</h3>
              <div class="svcs">
${tarjetas}              </div>
              <p class="tx__note">${g.cierre}</p>
            </div>
          </div>\n`;
}

const bloque = `      <div class="tx rv">
        <div class="tx__tabs" role="tablist" aria-label="Tratamientos">
${tabs}          <span class="tx__ink" aria-hidden="true"></span>
        </div>

        <div class="tx__panels">
${paneles}        </div>
      </div>
`;

const destino = path.join(raiz, 'index.html');
const html = fs.readFileSync(destino, 'utf8');
const ini = html.indexOf('      <div class="tx rv">');
const fin = html.indexOf('  </section>', ini);
if (ini < 0 || fin < 0) throw new Error('no encontré el bloque .tx en index.html');
fs.writeFileSync(destino, html.slice(0, ini) + bloque + html.slice(fin));

const total = (bloque.match(/class="svc"/g) || []).length;
const conFoto = (bloque.match(/data-foto/g) || []).length;
console.log(`index.html actualizado: ${total} tarjetas, ${conFoto} con fotografía, ${total - conFoto} sin ella`);
