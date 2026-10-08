// Exporta las plantillas fotográficas con transparencia real (canal alfa).
//
//   node scripts/render-plantillas.mjs png   → out/plantillas/png/*.png   (último frame, PNG con alfa)
//   node scripts/render-plantillas.mjs mov   → out/plantillas/mov/*.mov   (animadas, ProRes 4444 con alfa)
//   node scripts/render-plantillas.mjs webm  → out/plantillas/webm/*.webm (animadas, VP9 con alfa)
//
// Cualquier argumento adicional se pasa a Remotion (p. ej. --browser-executable=...).
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const TEMPLATES = [
  "Plantilla-A-Horizontal",
  "Plantilla-B-Vertical",
  "Plantilla-C-Collage-2",
  "Plantilla-D-Collage-3",
  "Plantilla-E-Mosaico",
  "Plantilla-F-Pantalla-Completa",
  "Plantilla-G-Borde-Dorado",
  "Plantilla-H-Cartografia",
  "Plantilla-I-Archivo-Memoria",
];
const LAST_FRAME = 299;

const [format = "png", ...extra] = process.argv.slice(2);
const dir = `out/plantillas/${format}`;
mkdirSync(dir, { recursive: true });

const args = {
  png: (id) => ["still", id, `${dir}/${id}.png`, `--frame=${LAST_FRAME}`, "--image-format=png"],
  mov: (id) => [
    "render", id, `${dir}/${id}.mov`,
    "--codec=prores", "--prores-profile=4444", "--pixel-format=yuva444p10le", "--image-format=png",
  ],
  webm: (id) => ["render", id, `${dir}/${id}.webm`, "--codec=vp9", "--pixel-format=yuva420p", "--image-format=png"],
}[format];

if (!args) {
  console.error(`Formato desconocido: ${format}. Use png, mov o webm.`);
  process.exit(1);
}

for (const id of TEMPLATES) {
  console.log(`→ ${id}`);
  execFileSync("npx", ["remotion", ...args(id), ...extra], { stdio: "inherit" });
}
