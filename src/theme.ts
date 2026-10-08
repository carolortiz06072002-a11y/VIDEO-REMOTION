import { Easing } from "remotion";

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// Paleta: marfil y beige dominan; el dorado es solo acento; el café oscuro da contraste.
export const COLORS = {
  ivory: "#F7F2E8",
  paperLight: "#FBF8F1",
  cream: "#EFE6D3",
  beige: "#E3D6BF",
  beigeDeep: "#CDBC9C",
  sand: "#B8A47F",
  gold: "#A8885A",
  goldSoft: "#C4A877",
  ink: "#2A221C",
  inkSoft: "#4A3F35",
  muted: "#7D6E5D",
  placeholder: "#DDD1BB",
} as const;

export const EASE = {
  // Curva lenta y simétrica, para movimientos de cámara y trazos largos.
  cinematic: Easing.bezier(0.45, 0, 0.15, 1),
  // Salida suave, para apariciones.
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
} as const;
