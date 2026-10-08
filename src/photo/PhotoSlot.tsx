import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT, WEIGHT } from "../fonts";
import { pad2 } from "../lib/anim";
import { COLORS, EASE } from "../theme";
import type { PhotoWindow } from "./layouts";
import { revealProgress } from "./PhotoFrame";

const resolveSrc = (src: string) => (/^(https?:|data:|blob:)/.test(src) ? src : staticFile(src));

type Props = {
  window: PhotoWindow;
  index: number;
  src?: string;
  /** Muestra una zona de referencia cuando no hay fotografía (solo para previsualizar). */
  showPlaceholder: boolean;
  /** true cuando no hay papel encima: la propia foto debe hacer la entrada. */
  selfReveal: boolean;
};

/** Zona neutra que indica dónde irá una fotografía. */
const Placeholder: React.FC<{ index: number }> = ({ index }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: COLORS.placeholder,
      backgroundImage: `repeating-linear-gradient(135deg, rgba(168,136,90,0.16) 0 1px, transparent 1px 18px)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontWeight: WEIGHT.medium,
        fontSize: 15,
        letterSpacing: "0.34em",
        color: COLORS.gold,
        padding: "10px 18px",
        border: `1px solid ${COLORS.goldSoft}`,
        background: "rgba(247,242,232,0.6)",
      }}
    >
      FOTOGRAFÍA {pad2(index + 1)}
    </div>
  </div>
);

/**
 * Capa inferior: la fotografía (o su marcador) con movimiento de cámara lento.
 * Va SIEMPRE por debajo del papel y del marco gráfico.
 */
export const PhotoSlot: React.FC<Props> = ({ window: w, index, src, showPlaceholder, selfReveal }) => {
  const frame = useCurrentFrame();
  const f = frame - w.delay;
  if (!src && !showPlaceholder) return null;

  // Movimiento interno, dentro de la ventana fija.
  const scale =
    w.entrance === "zoom"
      ? interpolate(f, [0, 110, 420], [1.22, 1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out })
      : interpolate(f, [0, 420], [1.08, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftX = w.entrance === "drift" ? interpolate(f, [0, 420], [-26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Entrada propia solo si no hay papel encima (fondo "none").
  const p = revealProgress(w, frame);
  let clipPath: string | undefined;
  let opacity = 1;
  if (selfReveal) {
    if (w.entrance === "mask") clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
    else if (w.entrance === "line") clipPath = `inset(${(1 - p) * 50}% 0 ${(1 - p) * 50}% 0)`;
    else opacity = p;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: w.x,
        top: w.y,
        width: w.w,
        height: w.h,
        overflow: "hidden",
        transform: w.rotate ? `rotate(${w.rotate}deg)` : undefined,
        clipPath,
        opacity,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${driftX}px) scale(${scale})` }}>
        {src ? (
          <Img src={resolveSrc(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Placeholder index={index} />
        )}
      </div>
    </div>
  );
};
