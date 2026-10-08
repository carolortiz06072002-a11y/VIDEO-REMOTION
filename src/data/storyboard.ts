/**
 * GUION VISUAL DEL VIDEO
 * ======================
 * Este archivo es el único lugar que hay que tocar para:
 *   - poner las fotografías (rutas dentro de public/, p. ej. "fotos/reunion-01.jpg"),
 *   - ajustar textos en pantalla,
 *   - alargar o acortar escenas para sincronizar con la narración y la música.
 *
 * Los textos provienen literalmente del guion. No se agregan nombres, cifras ni fechas.
 * Duraciones en frames (30 fps → 30 frames = 1 segundo).
 */
import type { LayoutId } from "../photo/layouts";

export type PhotoScene = {
  type: "photo";
  layout: LayoutId;
  photos: string[];
  kicker: string;
  caption: string;
  duration: number;
};

export type TextScene = {
  type: "text";
  kicker?: string;
  lines: string[];
  /** Texto secundario, en tipografía regular. */
  sub?: string;
  align: "center" | "left";
  duration: number;
};

export type MemoryScene = {
  type: "memory";
  kicker: string;
  text: string;
  duration: number;
};

export type ChainScene = {
  type: "chain";
  kicker: string;
  intro: string;
  steps: string[];
  outro: string;
  duration: number;
};

export type Scene = PhotoScene | TextScene | MemoryScene | ChainScene;

const PHOTO = 330; // 11 s
const TEXT = 270; // 9 s

export const SCENES: Scene[] = [
  {
    type: "text",
    lines: ["Hay trabajos que transforman una ciudad", "y que no siempre se ven."],
    align: "center",
    duration: TEXT,
  },
  {
    type: "photo",
    layout: "A",
    photos: [],
    kicker: "Tiempo entregado",
    caption: "Reuniones, recorridos, documentos estudiados, conversaciones difíciles y preguntas necesarias.",
    duration: PHOTO,
  },
  {
    type: "photo",
    layout: "B",
    photos: [],
    kicker: "Nuestra historia",
    caption: "Esa también es la historia del Consejo Territorial de Planeación Distrital.",
    duration: PHOTO,
  },
  {
    type: "memory",
    kicker: "Durante estos 35 años",
    text: "Generaciones de consejeras y consejeros han asumido una responsabilidad profundamente ciudadana.",
    duration: PHOTO,
  },
  {
    type: "photo",
    layout: "C",
    photos: [],
    kicker: "Una Bogotá diversa",
    caption: "Han llegado desde los barrios, las localidades y las organizaciones sociales.",
    duration: PHOTO,
  },
  {
    type: "text",
    lines: ["Cada uno con una historia diferente.", "Cada uno con una manera distinta", "de comprender la ciudad."],
    align: "left",
    duration: TEXT,
  },
  {
    type: "photo",
    layout: "E",
    photos: [],
    kicker: "Diálogo",
    caption: "Que esas diferencias se encuentren, dialoguen y aporten a una visión colectiva de Bogotá.",
    duration: PHOTO,
  },
  {
    type: "photo",
    layout: "H",
    photos: [],
    kicker: "Territorio",
    caption: "Hay recorridos por los territorios.",
    duration: PHOTO,
  },
  {
    type: "photo",
    layout: "D",
    photos: [],
    kicker: "Debate",
    caption: "Hay debates. Hay desacuerdos. Hay argumentos. Hay propuestas.",
    duration: PHOTO,
  },
  {
    type: "text",
    kicker: "Planear",
    lines: ["Planear también es", "reconocer a las personas."],
    align: "center",
    duration: TEXT,
  },
  {
    type: "photo",
    layout: "G",
    photos: [],
    kicker: "Escuchar",
    caption: "Es preguntarse quiénes están siendo escuchados.",
    duration: PHOTO,
  },
  {
    type: "chain",
    kicker: "Experiencia ciudadana",
    intro: "Llevar la experiencia ciudadana a los escenarios donde se piensa el futuro de Bogotá.",
    steps: ["Preocupaciones", "Preguntas", "Propuestas", "Recomendaciones"],
    outro: "Recomendaciones que permitan mejorar las decisiones públicas.",
    duration: PHOTO,
  },
  {
    type: "photo",
    layout: "I",
    photos: [],
    kicker: "Memoria",
    caption: "Queremos reconocer a las personas que la han hecho posible.",
    duration: PHOTO,
  },
  {
    type: "photo",
    layout: "F",
    photos: [],
    kicker: "Bogotá",
    caption: "Porque Bogotá todavía necesita de ustedes.",
    duration: PHOTO,
  },
  {
    type: "text",
    lines: ["Su trabajo ha dejado huella en Bogotá."],
    sub: "Una huella construida con participación, compromiso y servicio a la ciudad.",
    align: "center",
    duration: TEXT,
  },
  {
    type: "text",
    lines: ["Gracias por representar.", "Gracias por participar.", "Gracias por insistir."],
    align: "left",
    duration: TEXT,
  },
];

/** Duración de las transiciones (fundidos) entre escenas. */
export const TRANSITION = 30;
