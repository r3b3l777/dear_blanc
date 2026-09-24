#!/usr/bin/env python3
"""Genera las fotos de los tratamientos a partir de scripts/fotos-fuente/.

Las fotos salieron de las láminas de marca y son chicas. No se puede inventar
detalle que no está, pero sí recuperar el contraste de borde que se perdió en
la cadena captura -> JPEG -> recorte: eso es una máscara de enfoque, no un
invento.

De cada foto salen dos anchos: 440 px para pantallas normales y 880 px para
las de densidad doble, que el <picture> reparte con srcset. Un teléfono en 1x
no se baja el grande.

    python3 scripts/preparar-fotos.py
    node scripts/gen-tratamientos.js     # después, para actualizar el HTML

Las fuentes viven en scripts/fotos-fuente/ y son la copia buena: el script
nunca lee de la carpeta a la que escribe, porque entonces cada corrida
reprocesaría su propia salida y las fotos se irían degradando.

Necesita Pillow y cwebp.
"""
import os, subprocess, sys, glob
from PIL import Image, ImageFilter

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FUENTE = os.path.join(RAIZ, 'scripts/fotos-fuente')
DESTINO = os.path.join(RAIZ, 'assets/img/tratamientos')
ANCHOS = ((440, '', 86, 82), (880, '@2x', 84, 80))   # ancho, sufijo, q jpg, q webp

# Enfoque moderado. Con radio 2.2 y 190% aparecen halos en el borde de los
# dientes y la piel se vuelve granulosa: se probó y se descartó.
ENFOQUE = dict(radius=1.6, percent=110, threshold=3)


def preparar(origen):
    nombre = os.path.splitext(os.path.basename(origen))[0]
    im = Image.open(origen).convert('RGB')
    for ancho, sufijo, q_jpg, q_webp in ANCHOS:
        alto = round(ancho * im.height / im.width)
        # Lanczos siempre: al ampliar es el que menos emborrona y al reducir
        # el que menos alias deja.
        salida = im.resize((ancho, alto), Image.LANCZOS)
        salida = salida.filter(ImageFilter.UnsharpMask(**ENFOQUE))
        jpg = os.path.join(DESTINO, f'{nombre}{sufijo}.jpg')
        salida.save(jpg, 'JPEG', quality=q_jpg, optimize=True)
        subprocess.run(['cwebp', '-quiet', '-q', str(q_webp), jpg,
                        '-o', jpg[:-4] + '.webp'], check=True)
    print(f'  {nombre:<26} fuente {im.width}x{im.height}')


if __name__ == '__main__':
    fuentes = sorted(glob.glob(os.path.join(FUENTE, '*.png')) +
                     glob.glob(os.path.join(FUENTE, '*.jpg')))
    if not fuentes:
        sys.exit(f'no hay fuentes en {FUENTE}')
    os.makedirs(DESTINO, exist_ok=True)
    print(f'{len(fuentes)} fotos -> 440 px y 880 px:')
    for f in fuentes:
        preparar(f)
