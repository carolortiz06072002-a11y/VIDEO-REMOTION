import React, { useMemo } from "react";
import { Easing } from "remotion";
import { rand, stagger } from "../../lib/anim";
import { circlePath } from "../../lib/svg";
import { COLORS } from "../../theme";
import { DrawPath } from "./DrawPath";

type Props = {
  cx: number;
  cy: number;
  progress: number;
  rings?: number;
  r0?: number;
  step?: number;
  /** Ondulación de las curvas de nivel (0 = círculos perfectos). */
  wobble?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  color?: string;
  accent?: string;
  /** Puntos de referencia sobre los anillos. */
  dots?: number;
  /** 0 = puntos dispersos lejos del centro, 1 = en su lugar. */
  gather?: number;
  seed?: string;
};

const contour = (cx: number, cy: number, r: number, wobble: number, seed: string) => {
  const n = 120;
  const a = rand(`${seed}-a`, 0.4, 1) * wobble;
  const b = rand(`${seed}-b`, 0.2, 0.7) * wobble;
  const pa = rand(`${seed}-pa`, 0, Math.PI * 2);
  const pb = rand(`${seed}-pb`, 0, Math.PI * 2);
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const rr = r * (1 + a * Math.sin(3 * t + pa) + b * Math.sin(5 * t + pb));
    pts.push(`${(cx + rr * Math.cos(t)).toFixed(1)} ${(cy + rr * Math.sin(t)).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
};

/**
 * Anillos concéntricos tipo curvas de nivel, alternando círculos perfectos
 * (geometría) y contornos orgánicos (topografía).
 */
export const ContourRings: React.FC<Props> = ({
  cx,
  cy,
  progress,
  rings = 6,
  r0 = 120,
  step = 48,
  wobble = 0.035,
  rotation = 0,
  scale = 1,
  opacity = 0.6,
  color = COLORS.beigeDeep,
  accent = COLORS.gold,
  dots = 0,
  gather = 1,
  seed = "rings",
}) => {
  const paths = useMemo(
    () =>
      Array.from({ length: rings }, (_, i) => {
        const r = r0 + i * step;
        const organic = i % 2 === 1;
        return {
          d: organic ? contour(0, 0, r, wobble, `${seed}-${i}`) : circlePath(0, 0, r),
          organic,
          r,
        };
      }),
    [rings, r0, step, wobble, seed],
  );

  const dotList = useMemo(
    () =>
      Array.from({ length: dots }, (_, i) => ({
        angle: rand(`${seed}-dot-a-${i}`, 0, Math.PI * 2),
        r: r0 + Math.floor(rand(`${seed}-dot-r-${i}`, 0, rings)) * step,
        delay: rand(`${seed}-dot-d-${i}`, 0.3, 0.75),
        ring: rand(`${seed}-dot-ring-${i}`) > 0.6,
      })),
    [dots, seed, r0, rings, step],
  );

  if (progress <= 0) return null;

  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${scale}) rotate(${rotation})`}>
      {paths.map((p, i) => (
        <DrawPath
          key={i}
          d={p.d}
          progress={Easing.inOut(Easing.cubic)(stagger(progress, i * 0.07, 0.6))}
          stroke={i === 0 ? accent : color}
          strokeWidth={p.organic ? 0.9 : 1.1}
          opacity={p.organic ? 0.75 : 1}
        />
      ))}
      {dotList.map((d, i) => {
        const p = stagger(progress, d.delay, 0.2);
        if (p <= 0) return null;
        const dist = d.r * (1 + (1 - gather) * 1.6);
        const x = Math.cos(d.angle) * dist;
        const y = Math.sin(d.angle) * dist;
        return (
          <g key={`dot-${i}`} opacity={p} transform={`translate(${x} ${y}) rotate(${-rotation})`}>
            <circle r={2.6} fill={accent} />
            {d.ring ? <circle r={8 * p} fill="none" stroke={accent} strokeWidth={0.8} /> : null}
          </g>
        );
      })}
    </g>
  );
};
