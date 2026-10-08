import React, { useMemo } from "react";
import { rand } from "../../lib/anim";
import { COLORS } from "../../theme";
import { DrawPath } from "./DrawPath";

type Props = {
  x0: number;
  x1: number;
  baseline: number;
  /** Progreso del trazo de la ciudad. */
  progress: number;
  /** Progreso del trazo de los cerros. */
  ridgeProgress: number;
  cityHeight?: number;
  ridgeHeight?: number;
  color?: string;
  ridgeColor?: string;
  opacity?: number;
  seed?: string;
};

type Kind = "flat" | "pitch" | "tower" | "dome" | "step" | "gap";

/** Silueta de ciudad a una sola línea continua: casas, torres, cúpulas y vacíos. */
const buildCity = (x0: number, x1: number, base: number, maxH: number, seed: string) => {
  const kinds: Kind[] = ["flat", "pitch", "tower", "flat", "step", "dome", "pitch", "flat", "gap"];
  const span = x1 - x0;
  const center = x0 + span * 0.58;
  let x = x0;
  let i = 0;
  let d = `M ${x0} ${base}`;
  while (x < x1 - 20) {
    const kind = kinds[Math.floor(rand(`${seed}-k-${i}`, 0, kinds.length))];
    const w = Math.min(x1 - x, rand(`${seed}-w-${i}`, 26, kind === "gap" ? 46 : 80));
    // Las alturas crecen hacia el centro: el perfil de la ciudad se concentra.
    const envelope = Math.exp(-(((x - center) / (span * 0.28)) ** 2));
    const h = maxH * (0.18 + 0.82 * envelope) * rand(`${seed}-h-${i}`, 0.45, 1);
    const top = base - h;
    switch (kind) {
      case "gap":
        d += ` L ${x + w} ${base}`;
        break;
      case "pitch":
        d += ` L ${x} ${top} L ${x + w / 2} ${top - w * 0.32} L ${x + w} ${top} L ${x + w} ${base}`;
        break;
      case "tower":
        d += ` L ${x} ${top} L ${x + w * 0.5} ${top} L ${x + w * 0.5} ${top - h * 0.28} L ${x + w * 0.5} ${top} L ${x + w} ${top} L ${x + w} ${base}`;
        break;
      case "dome":
        d += ` L ${x} ${top} A ${w / 2} ${w / 2.4} 0 0 1 ${x + w} ${top} L ${x + w} ${base}`;
        break;
      case "step": {
        const low = base - h * 0.62;
        d += ` L ${x} ${low} L ${x + w / 3} ${low} L ${x + w / 3} ${top} L ${x + (2 * w) / 3} ${top} L ${x + (2 * w) / 3} ${low} L ${x + w} ${low} L ${x + w} ${base}`;
        break;
      }
      default:
        d += ` L ${x} ${top} L ${x + w} ${top} L ${x + w} ${base}`;
    }
    x += w;
    i++;
  }
  d += ` L ${x1} ${base}`;
  return d;
};

/** Cerros orientales: una cresta suave con una pequeña capilla en la cima más alta. */
const buildRidge = (x0: number, x1: number, base: number, maxH: number, seed: string) => {
  const n = 9;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const shape = Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.8;
    const y = base - maxH * (0.25 + 0.75 * shape) * rand(`${seed}-r-${i}`, 0.7, 1);
    return { x, y };
  });
  pts[0].y = base - maxH * 0.2;
  let peak = pts[1];
  for (const p of pts) if (p.y < peak.y) peak = p;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const mx = (prev.x + pts[i].x) / 2;
    const my = (prev.y + pts[i].y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${mx} ${my}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return { d, peak };
};

export const CityLine: React.FC<Props> = ({
  x0,
  x1,
  baseline,
  progress,
  ridgeProgress,
  cityHeight = 110,
  ridgeHeight = 120,
  color = COLORS.gold,
  ridgeColor = COLORS.beigeDeep,
  opacity = 1,
  seed = "bogota",
}) => {
  const city = useMemo(() => buildCity(x0, x1, baseline, cityHeight, seed), [x0, x1, baseline, cityHeight, seed]);
  const ridge = useMemo(
    () => buildRidge(x0 + 40, x1 - 40, baseline - 18, ridgeHeight + cityHeight * 0.4, seed),
    [x0, x1, baseline, ridgeHeight, cityHeight, seed],
  );
  const { peak } = ridge;
  const chapelOpacity = Math.max(0, (ridgeProgress - 0.85) / 0.15);

  return (
    <g opacity={opacity}>
      <DrawPath d={ridge.d} progress={ridgeProgress} stroke={ridgeColor} strokeWidth={1.2} linecap="round" />
      {chapelOpacity > 0 ? (
        <g opacity={chapelOpacity} stroke={ridgeColor} strokeWidth={1} fill="none">
          <path d={`M ${peak.x - 6} ${peak.y - 2} V ${peak.y - 12} L ${peak.x} ${peak.y - 18} L ${peak.x + 6} ${peak.y - 12} V ${peak.y - 2}`} />
          <path d={`M ${peak.x} ${peak.y - 18} V ${peak.y - 26} M ${peak.x - 3} ${peak.y - 23} H ${peak.x + 3}`} />
        </g>
      ) : null}
      <DrawPath d={city} progress={progress} stroke={color} strokeWidth={1.3} />
      <DrawPath d={`M ${x0 - 60} ${baseline} L ${x1 + 60} ${baseline}`} progress={progress} stroke={color} strokeWidth={0.8} opacity={0.6} />
    </g>
  );
};
