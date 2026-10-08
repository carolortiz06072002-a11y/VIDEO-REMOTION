/**
 * Geometría de las plantillas fotográficas (1920×1080).
 * Cada ventana es una zona transparente donde va una fotografía.
 * Para ajustar una plantilla basta con mover estos números.
 */

export type Entrance = "fade" | "drift" | "zoom" | "mask" | "line";

export type FrameVariant = "editorial" | "gold" | "minimal" | "archive" | "cartography" | "none";

export type PhotoWindow = {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  entrance: Entrance;
  /** Frame en que empieza a abrirse la ventana. */
  delay: number;
  variant: FrameVariant;
};

export type TextZone = {
  x: number;
  y: number;
  w: number;
  h: number;
  align: "left" | "center";
  valign: "top" | "center" | "bottom";
  /** "row": rótulo a la izquierda y frase a la derecha, en una franja. */
  arrangement: "stack" | "row";
  tone: "dark" | "light";
  size: number;
};

export type LayoutId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

export type PhotoLayout = {
  id: LayoutId;
  compositionId: string;
  name: string;
  windows: PhotoWindow[];
  text: TextZone;
  /** Decoración sobre el papel (no invade las ventanas). */
  decor: {
    grid?: boolean;
    rings?: { cx: number; cy: number; r0: number; rings: number };
    rule?: { x1: number; y1: number; x2: number; y2: number };
    /** Disco marfil con media luna dorada (motivo de la línea gráfica). */
    disc?: { cx: number; cy: number; r: number };
  };
  frameTone: "dark" | "light";
};

const stack = (z: Omit<TextZone, "arrangement" | "tone">): TextZone => ({ ...z, arrangement: "stack", tone: "dark" });
const row = (z: Omit<TextZone, "arrangement" | "tone" | "align" | "valign">): TextZone => ({
  ...z,
  arrangement: "row",
  tone: "dark",
  align: "left",
  valign: "top",
});

export const LAYOUTS: Record<LayoutId, PhotoLayout> = {
  A: {
    id: "A",
    compositionId: "Plantilla-A-Horizontal",
    name: "Fotografía horizontal principal",
    windows: [{ x: 140, y: 230, w: 1100, h: 620, entrance: "mask", delay: 10, variant: "editorial" }],
    text: stack({ x: 1330, y: 230, w: 450, h: 620, align: "left", valign: "bottom", size: 40 }),
    decor: {
      grid: true,
      rings: { cx: 1640, cy: 330, r0: 50, rings: 4 },
      rule: { x1: 1290, y1: 230, x2: 1290, y2: 850 },
    },
    frameTone: "dark",
  },
  B: {
    id: "B",
    compositionId: "Plantilla-B-Vertical",
    name: "Fotografía vertical",
    windows: [{ x: 1080, y: 120, w: 600, h: 840, entrance: "line", delay: 10, variant: "editorial" }],
    text: stack({ x: 240, y: 120, w: 700, h: 840, align: "left", valign: "center", size: 50 }),
    decor: { grid: true, disc: { cx: 560, cy: 540, r: 380 } },
    frameTone: "dark",
  },
  C: {
    id: "C",
    compositionId: "Plantilla-C-Collage-2",
    name: "Collage de 2 fotografías",
    windows: [
      { x: 200, y: 160, w: 900, h: 600, entrance: "mask", delay: 10, variant: "editorial" },
      { x: 1160, y: 240, w: 560, h: 700, entrance: "drift", delay: 40, variant: "editorial" },
    ],
    text: stack({ x: 200, y: 810, w: 900, h: 160, align: "left", valign: "top", size: 34 }),
    decor: { grid: true, rule: { x1: 200, y1: 790, x2: 1100, y2: 790 } },
    frameTone: "dark",
  },
  D: {
    id: "D",
    compositionId: "Plantilla-D-Collage-3",
    name: "Collage de 3 fotografías",
    windows: [
      { x: 150, y: 150, w: 1000, h: 700, entrance: "zoom", delay: 10, variant: "editorial" },
      { x: 1190, y: 150, w: 580, h: 330, entrance: "mask", delay: 35, variant: "minimal" },
      { x: 1190, y: 520, w: 580, h: 330, entrance: "mask", delay: 55, variant: "minimal" },
    ],
    text: row({ x: 150, y: 905, w: 1620, h: 90, size: 34 }),
    decor: { grid: true },
    frameTone: "dark",
  },
  E: {
    id: "E",
    compositionId: "Plantilla-E-Mosaico",
    name: "Mosaico de varias fotografías",
    windows: [
      { x: 150, y: 120, w: 640, h: 760, entrance: "fade", delay: 10, variant: "minimal" },
      { x: 830, y: 120, w: 455, h: 360, entrance: "fade", delay: 26, variant: "minimal" },
      { x: 1325, y: 120, w: 455, h: 360, entrance: "fade", delay: 38, variant: "minimal" },
      { x: 830, y: 520, w: 455, h: 360, entrance: "fade", delay: 50, variant: "minimal" },
      { x: 1325, y: 520, w: 455, h: 360, entrance: "fade", delay: 62, variant: "minimal" },
    ],
    text: row({ x: 150, y: 915, w: 1630, h: 90, size: 30 }),
    decor: { grid: true },
    frameTone: "dark",
  },
  F: {
    id: "F",
    compositionId: "Plantilla-F-Pantalla-Completa",
    name: "Fotografía a pantalla completa con marco",
    windows: [{ x: 0, y: 0, w: 1920, h: 1080, entrance: "fade", delay: 0, variant: "none" }],
    text: { x: 140, y: 700, w: 1100, h: 260, align: "left", valign: "bottom", arrangement: "stack", tone: "light", size: 54 },
    decor: {},
    frameTone: "light",
  },
  G: {
    id: "G",
    compositionId: "Plantilla-G-Borde-Dorado",
    name: "Fotografía con borde dorado sutil",
    windows: [{ x: 400, y: 120, w: 1120, h: 680, entrance: "zoom", delay: 10, variant: "gold" }],
    text: stack({ x: 400, y: 855, w: 1120, h: 150, align: "center", valign: "top", size: 36 }),
    decor: { grid: true, rings: { cx: 960, cy: 460, r0: 420, rings: 3 } },
    frameTone: "dark",
  },
  H: {
    id: "H",
    compositionId: "Plantilla-H-Cartografia",
    name: "Fotografía con líneas cartográficas",
    windows: [{ x: 140, y: 120, w: 1640, h: 740, entrance: "line", delay: 10, variant: "cartography" }],
    text: row({ x: 140, y: 905, w: 1640, h: 90, size: 34 }),
    decor: { grid: true },
    frameTone: "dark",
  },
  I: {
    id: "I",
    compositionId: "Plantilla-I-Archivo-Memoria",
    name: "Fotografía con elementos de archivo",
    windows: [
      { x: 230, y: 170, w: 860, h: 560, rotate: -2, entrance: "fade", delay: 10, variant: "archive" },
      { x: 1240, y: 240, w: 460, h: 600, rotate: 3, entrance: "fade", delay: 45, variant: "archive" },
    ],
    text: stack({ x: 230, y: 870, w: 900, h: 140, align: "left", valign: "top", size: 34 }),
    decor: { grid: true, rings: { cx: 1180, cy: 900, r0: 40, rings: 4 } },
    frameTone: "dark",
  },
};

export const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[];

/** Duración de cada plantilla exportada por separado. */
export const TEMPLATE_DURATION = 300;
