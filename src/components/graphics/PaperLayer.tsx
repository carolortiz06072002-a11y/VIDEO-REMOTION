import React from "react";
import { AbsoluteFill } from "remotion";
import { useSafeId } from "../../lib/anim";
import { rotateAbout, type Rect } from "../../lib/svg";
import { COLORS, VIDEO } from "../../theme";

export type Hole = Rect & {
  /** 0 = cerrado (papel encima), 1 = ventana totalmente abierta. */
  reveal?: number;
  revealMode?: "fade" | "wipe" | "line";
};

type Props = {
  /** Ventanas transparentes recortadas en el papel. */
  holes?: Hole[];
  /** false = solo las capas decorativas, sin fondo de papel. */
  paper?: boolean;
  /** Elementos SVG (coordenadas 1920×1080) que también se recortan con las ventanas. */
  children?: React.ReactNode;
};

const holeShape = (h: Hole, key: number) => {
  const reveal = h.reveal ?? 1;
  const mode = h.revealMode ?? "fade";
  const transform = rotateAbout(h);
  if (reveal <= 0) return null;
  if (mode === "wipe") {
    return (
      <rect key={key} x={h.x} y={h.y} width={h.w * reveal} height={h.h} fill="black" transform={transform} />
    );
  }
  if (mode === "line") {
    const hh = h.h * reveal;
    return (
      <rect key={key} x={h.x} y={h.y + (h.h - hh) / 2} width={h.w} height={hh} fill="black" transform={transform} />
    );
  }
  const v = Math.round(255 * (1 - reveal));
  return (
    <rect key={key} x={h.x} y={h.y} width={h.w} height={h.h} fill={`rgb(${v},${v},${v})`} transform={transform} />
  );
};

/**
 * Fondo de papel marfil (vectorial + grano procedural) con ventanas
 * realmente transparentes donde irán las fotografías.
 */
export const PaperLayer: React.FC<Props> = ({ holes = [], paper = true, children }) => {
  const id = useSafeId("paper");
  const { width, height } = VIDEO;
  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute" }}>
        <defs>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <rect width={width} height={height} fill="white" />
            {holes.map(holeShape)}
          </mask>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={11} stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.36  0 0 0 0 0.29  0 0 0 0 0.21  1.3 0 0 0 -0.45"
            />
          </filter>
          <filter id={`${id}-fiber`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves={2} seed={4} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.55  0 0 0 0 0.46  0 0 0 0 0.33  1.6 0 0 0 -0.75"
            />
          </filter>
          <radialGradient id={`${id}-vignette`} cx="50%" cy="46%" r="72%">
            <stop offset="55%" stopColor={COLORS.inkSoft} stopOpacity={0} />
            <stop offset="100%" stopColor={COLORS.inkSoft} stopOpacity={0.14} />
          </radialGradient>
          <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={COLORS.paperLight} stopOpacity={0.8} />
            <stop offset="60%" stopColor={COLORS.ivory} stopOpacity={0} />
            <stop offset="100%" stopColor={COLORS.cream} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          {paper ? (
            <>
              <rect width={width} height={height} fill={COLORS.ivory} />
              <rect width={width} height={height} fill={`url(#${id}-wash)`} />
              <rect width={width} height={height} filter={`url(#${id}-fiber)`} opacity={0.12} />
              <rect width={width} height={height} filter={`url(#${id}-grain)`} opacity={0.1} />
              <rect width={width} height={height} fill={`url(#${id}-vignette)`} />
            </>
          ) : null}
          {children}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
