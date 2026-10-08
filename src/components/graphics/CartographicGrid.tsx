import React, { useMemo } from "react";
import { Easing } from "remotion";
import { rand, stagger, useSafeId } from "../../lib/anim";
import { type Rect } from "../../lib/svg";
import { COLORS, VIDEO } from "../../theme";
import { DrawPath } from "./DrawPath";

type Props = {
  progress: number;
  area?: Rect;
  rotate?: number;
  color?: string;
  accent?: string;
  opacity?: number;
  /** Separación mínima y máxima entre calles. */
  spacing?: [number, number];
  seed?: string;
  scale?: number;
  strokeWidth?: number;
};

type GridLine = { d: string; delay: number; major: boolean };

/**
 * Plano urbano abstracto: retícula de calles y carreras con avenidas diagonales
 * y un cauce curvo. Se dibuja línea por línea.
 */
export const CartographicGrid: React.FC<Props> = ({
  progress,
  area = { x: 0, y: 0, w: VIDEO.width, h: VIDEO.height },
  rotate = -14,
  color = COLORS.beigeDeep,
  accent = COLORS.goldSoft,
  opacity = 0.2,
  spacing = [70, 150],
  seed = "grid",
  scale = 1,
  strokeWidth = 1,
}) => {
  const clipId = useSafeId("grid-clip");
  const cx = area.x + area.w / 2;
  const cy = area.y + area.h / 2;

  const [s0, s1] = spacing;
  const { lines, avenues } = useMemo(() => {
    const half = Math.hypot(area.w, area.h) / 2 + 40;
    const out: GridLine[] = [];
    for (const axis of ["v", "h"] as const) {
      let p = -half + rand(`${seed}-${axis}-0`, 0, s0);
      let i = 0;
      while (p < half) {
        const major = rand(`${seed}-${axis}-m-${i}`) > 0.78;
        const d =
          axis === "v"
            ? `M ${cx + p} ${cy - half} L ${cx + p} ${cy + half}`
            : `M ${cx - half} ${cy + p} L ${cx + half} ${cy + p}`;
        out.push({ d, delay: rand(`${seed}-${axis}-d-${i}`, 0, 0.45), major });
        p += rand(`${seed}-${axis}-s-${i}`, s0, s1);
        i++;
      }
    }
    const av: string[] = [
      `M ${cx - half} ${cy + half * 0.55} L ${cx + half} ${cy - half * 0.35}`,
      `M ${cx - half * 0.2} ${cy - half} L ${cx + half * 0.45} ${cy + half}`,
      // Cauce / quebrada: curva suave que cruza el plano.
      `M ${cx - half} ${cy - half * 0.15} C ${cx - half * 0.4} ${cy - half * 0.45}, ${cx - half * 0.1} ${cy + half * 0.3}, ${cx + half * 0.3} ${cy + half * 0.05} S ${cx + half * 0.8} ${cy - half * 0.2}, ${cx + half} ${cy + half * 0.1}`,
    ];
    return { lines: out, avenues: av };
  }, [area.w, area.h, cx, cy, seed, s0, s1]);

  if (progress <= 0) return null;

  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={clipId}>
          <rect x={area.x} y={area.y} width={area.w} height={area.h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g transform={`rotate(${rotate} ${cx} ${cy}) translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
          {lines.map((l, i) => (
            <DrawPath
              key={i}
              d={l.d}
              progress={Easing.out(Easing.cubic)(stagger(progress, l.delay, 0.55))}
              stroke={color}
              strokeWidth={l.major ? strokeWidth * 1.6 : strokeWidth * 0.8}
            />
          ))}
          {avenues.map((d, i) => (
            <DrawPath
              key={`av-${i}`}
              d={d}
              progress={Easing.inOut(Easing.cubic)(stagger(progress, 0.25 + i * 0.1, 0.6))}
              stroke={accent}
              strokeWidth={strokeWidth * (i === 2 ? 1.4 : 1.2)}
            />
          ))}
        </g>
      </g>
    </g>
  );
};
