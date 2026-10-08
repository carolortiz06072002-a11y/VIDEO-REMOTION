# 35 años · Consejo Territorial de Planeación Distrital

Video institucional en [Remotion](https://www.remotion.dev): 1920×1080, 30 fps.
La línea gráfica es marfil y beige, con un disco central, una media luna dorada mate, el "35" en oro y una ilustración de Bogotá a línea fina.

## Uso

```bash
npm install
npm run dev              # Remotion Studio: previsualizar y editar textos/fotos
npm run render           # video final → out/CTPD-35-anos.mp4
npm run plantillas:png   # plantillas con transparencia → out/plantillas/png/
npm run plantillas:mov   # plantillas animadas ProRes 4444 con alfa → out/plantillas/mov/
```

## Composiciones

| Carpeta en Studio | Composición | Qué es |
|---|---|---|
| — | `CTPD-35-Anos` | Pieza completa: introducción → bloque narrativo → cierre (~3:27) |
| Escenas | `Introduccion`, `Cierre`, `Memoria-35-Anos` | Escenas sueltas |
| Plantillas-Fotos | `Plantilla-A-Horizontal` … `Plantilla-I-Archivo-Memoria` | Capas gráficas con ventanas transparentes |

Las plantillas fotográficas:

| | Plantilla | Entrada de la foto |
|---|---|---|
| A | Fotografía horizontal principal | máscara (barrido) |
| B | Fotografía vertical | línea gráfica que se abre |
| C | Collage de 2 fotografías | máscara + desplazamiento leve |
| D | Collage de 3 fotografías | zoom cinematográfico + máscaras |
| E | Mosaico de 5 fotografías | fundidos escalonados |
| F | Pantalla completa con marco | fundido |
| G | Borde dorado sutil | zoom cinematográfico |
| H | Líneas cartográficas superpuestas | línea gráfica |
| I | Elementos de archivo y memoria | fundido |

## Poner las fotografías

**Opción 1: dentro de Remotion.**
1. Copie las fotos en `public/fotos/`.
2. En `src/data/storyboard.ts`, en cada escena de tipo `photo`, llene `photos`, por ejemplo `photos: ["fotos/reunion-01.jpg"]`.
   El orden corresponde a las ventanas (`FOTOGRAFÍA 01`, `02`, …).
Las fotos quedan debajo de la capa gráfica, con movimiento de cámara lento.

**Opción 2: en un editor de video** (Premiere, DaVinci, After Effects, Final Cut).
Exporte las plantillas con `npm run plantillas:mov` (o `:png`), ponga cada fotografía en la pista inferior y la plantilla encima.
Las ventanas son transparentes de verdad (canal alfa). El papel que rodea las ventanas es opaco, y al empezar se abre para revelar la foto.

En Studio, cada plantilla tiene controles a la derecha:
- `photos`: las fotos de la plantilla.
- `kicker` y `caption`: los textos.
- `showPlaceholder`: marcadores para ubicar las fotos.
- `background`: `paper` (papel con ventanas) o `none` (solo líneas y textos).

## Textos y duración

`src/data/storyboard.ts` reúne el orden de las escenas, los textos en pantalla (tomados literalmente del guion) y la duración de cada escena.
Para sincronizar con la narración y la música, ajuste `duration` en frames (30 = 1 segundo). La duración total se recalcula sola.

## Tipografía

Gotham es una fuente comercial, así que el proyecto usa **Montserrat** (licencia SIL OFL, en `public/fonts/`), la alternativa libre más cercana.
Si tiene la licencia de Gotham, copie los archivos en `public/fonts/` y cambie `FONT_FAMILY` y `FONT_FILES` en `src/fonts.ts`.

## Estructura

```
src/
  Root.tsx                 registro de composiciones
  CTPD35Video.tsx          pieza completa (TransitionSeries con fundidos)
  data/storyboard.ts       guion visual: escenas, textos, fotos, duraciones
  scenes/Intro.tsx         introducción
  scenes/Closing.tsx       cierre
  components/
    AnniversaryTitle.tsx   "35", AÑOS, nombre institucional, años y lema
    GraphicFrame.tsx       marco institucional de pantalla completa
    MemoryTimeline.tsx     línea de tiempo de 35 marcas
    TextCard.tsx           pausas tipográficas
    ProcessChain.tsx       preocupaciones → preguntas → propuestas → recomendaciones
    RevealText.tsx         aparición de texto palabra por palabra / por máscara
    graphics/              papel, disco y media luna, plano urbano, curvas de nivel, Bogotá a línea
  photo/
    layouts.ts             geometría de las plantillas A–I
    PhotoCollage.tsx       plantilla completa (capas foto → papel → marcos → textos)
    PhotoFrame.tsx         marco gráfico de cada ventana
    PhotoSlot.tsx          fotografía o marcador, debajo de todo
```

Todo es vectorial (SVG y CSS). La textura del papel es procedural y no se usan imágenes rasterizadas.
