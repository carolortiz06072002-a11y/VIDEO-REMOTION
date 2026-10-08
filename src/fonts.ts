import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Tipografía del proyecto.
 *
 * Gotham es una fuente comercial y no puede incluirse en el repositorio,
 * así que se usa Montserrat (SIL OFL), la alternativa libre más cercana.
 *
 * Para usar Gotham con licencia:
 *   1. Copie los archivos en public/fonts/ (p. ej. Gotham-Book.otf y Gotham-Bold.otf).
 *   2. Cambie FONT_FAMILY a "Gotham" y FONT_FILES a esos archivos y pesos.
 * Todo el video toma la fuente desde aquí.
 */
export const FONT_FAMILY = "Montserrat";

const FONT_FILES: { file: string; weight: string }[] = [
  { file: "fonts/montserrat-300.woff2", weight: "300" },
  { file: "fonts/montserrat-400.woff2", weight: "400" },
  { file: "fonts/montserrat-500.woff2", weight: "500" },
  { file: "fonts/montserrat-600.woff2", weight: "600" },
  { file: "fonts/montserrat-700.woff2", weight: "700" },
];

for (const { file, weight } of FONT_FILES) {
  loadFont({ family: FONT_FAMILY, url: staticFile(file), weight });
}

export const FONT = `"${FONT_FAMILY}", "Gotham", "Helvetica Neue", Arial, sans-serif`;

// Gotham Bold: frases importantes. Gotham Book/Regular: información institucional.
export const WEIGHT = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
