import React, { useMemo } from "react";
import { Easing } from "remotion";
import { stagger } from "../../lib/anim";
import { COLORS } from "../../theme";
import { DrawPath } from "./DrawPath";

type Props = {
  /** 0→1: los elementos se dibujan de izquierda a derecha. */
  progress: number;
  /** Línea de suelo. */
  base?: number;
  /** Desplazamiento horizontal del conjunto. */
  x?: number;
  scale?: number;
  color?: string;
  soft?: string;
  opacity?: number;
};

type Piece = { d: string; at: number; soft?: boolean; width?: number };

const tree = (x: number, b: number, r: number) =>
  `M ${x} ${b} V ${b - r * 1.2} M ${x - r} ${b - r * 1.9} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;

const building = (x: number, b: number, w: number, h: number, floors = 0) => {
  let d = `M ${x} ${b} V ${b - h} H ${x + w} V ${b}`;
  for (let i = 1; i <= floors; i++) {
    const y = b - (h * i) / (floors + 1);
    d += ` M ${x + 6} ${y} H ${x + w - 6}`;
  }
  return d;
};

/**
 * Ilustración a línea de Bogotá: templete, catedral, torres, cerro con capilla
 * y teleférico, puente atirantado, bus articulado y arbolado.
 * Coordenadas pensadas para una base en y≈985 y x entre ~880 y ~1900.
 */
const buildPieces = (b: number): Piece[] => {
  const p: Piece[] = [];

  // Cerro con capilla y teleférico (fondo).
  p.push({ d: `M 1460 ${b - 236} C 1500 ${b - 262}, 1540 ${b - 286}, 1600 ${b - 296} C 1690 ${b - 314}, 1780 ${b - 262}, 1905 ${b - 190}`, at: 0.05, soft: true, width: 1.2 });
  p.push({ d: `M 1586 ${b - 298} V ${b - 318} L 1600 ${b - 330} L 1614 ${b - 318} V ${b - 300} M 1592 ${b - 318} V ${b - 340} L 1597 ${b - 348} L 1602 ${b - 340} V ${b - 324} M 1597 ${b - 348} V ${b - 358} M 1593 ${b - 354} H 1601`, at: 0.42, width: 1 });
  p.push({ d: `M 1616 ${b - 304} L 1905 ${b - 238} M 1616 ${b - 298} L 1905 ${b - 232}`, at: 0.5, soft: true, width: 0.8 });
  for (const t of [0.32, 0.68]) {
    const cx = 1616 + (1905 - 1616) * t;
    const cy = b - 301 + 66 * t;
    p.push({ d: `M ${cx} ${cy} V ${cy + 10} M ${cx - 8} ${cy + 10} h 16 v 14 a 4 4 0 0 1 -4 4 h -8 a 4 4 0 0 1 -4 -4 Z M ${cx - 8} ${cy + 17} H ${cx + 8}`, at: 0.6 + t * 0.1, width: 1 });
  }

  // Templete (rotonda con cúpula).
  p.push({
    d: `M 900 ${b} V ${b - 18} H 992 V ${b} M 908 ${b - 18} V ${b - 84} H 984 V ${b - 18} M 921 ${b - 18} V ${b - 84} M 934 ${b - 18} V ${b - 84} M 946 ${b - 18} V ${b - 84} M 958 ${b - 18} V ${b - 84} M 971 ${b - 18} V ${b - 84} M 904 ${b - 92} H 988 M 912 ${b - 92} A 34 32 0 0 1 980 ${b - 92} M 946 ${b - 124} V ${b - 138} M 941 ${b - 132} H 951`,
    at: 0.08,
    width: 1.1,
  });
  p.push({ d: tree(1012, b, 13), at: 0.14, soft: true });

  // Catedral Primada: fachada, frontón y dos torres con cúpula.
  p.push({
    d: `M 1046 ${b} V ${b - 112} H 1144 V ${b} M 1046 ${b - 112} L 1095 ${b - 146} L 1144 ${b - 112} M 1082 ${b} V ${b - 40} A 13 13 0 0 1 1108 ${b - 40} V ${b} M 1028 ${b} V ${b - 176} H 1060 V ${b} M 1130 ${b} V ${b - 176} H 1162 V ${b} M 1028 ${b - 176} A 16 18 0 0 1 1060 ${b - 176} M 1130 ${b - 176} A 16 18 0 0 1 1162 ${b - 176} M 1044 ${b - 194} V ${b - 210} M 1039 ${b - 204} H 1049 M 1146 ${b - 194} V ${b - 210} M 1141 ${b - 204} H 1151 M 1034 ${b - 140} H 1054 M 1136 ${b - 140} H 1156`,
    at: 0.2,
    width: 1.1,
  });
  p.push({ d: tree(1180, b, 11), at: 0.27, soft: true });

  // Torres y edificios del centro.
  p.push({ d: building(1196, b, 52, 210, 5), at: 0.3 });
  p.push({ d: building(1254, b, 44, 270, 7), at: 0.34 });
  p.push({ d: building(1302, b, 40, 170, 3), at: 0.37 });
  // Torre alta con remate escalonado y aguja.
  p.push({
    d: `M 1350 ${b} V ${b - 350} H 1402 V ${b} M 1356 ${b - 350} V ${b - 372} H 1396 V ${b - 350} M 1366 ${b - 372} V ${b - 388} H 1386 V ${b - 372} M 1376 ${b - 388} V ${b - 430} M 1364 ${b - 20} V ${b - 330} M 1376 ${b - 20} V ${b - 330} M 1388 ${b - 20} V ${b - 330}`,
    at: 0.4,
    width: 1.2,
  });
  p.push({ d: building(1412, b, 48, 240, 6), at: 0.45 });
  p.push({ d: building(1466, b, 40, 190, 4), at: 0.48 });
  p.push({ d: building(1512, b, 56, 150, 3), at: 0.51 });
  p.push({ d: building(1574, b, 42, 118, 2), at: 0.54 });
  p.push({ d: tree(1636, b, 12), at: 0.57, soft: true });

  // Puente atirantado: pilón y abanico de tirantes.
  const pyX = 1790;
  const top = b - 250;
  const deck = b - 64;
  let cables = `M 1670 ${deck} H 1905 M ${pyX - 6} ${b} L ${pyX} ${top} L ${pyX + 6} ${b}`;
  for (const dx of [-110, -80, -50, 40, 70, 100]) cables += ` M ${pyX} ${top + 22} L ${pyX + dx} ${deck}`;
  p.push({ d: cables, at: 0.62, width: 1 });

  // Bus articulado bajo el puente.
  p.push({
    d: `M 1676 ${b - 8} V ${b - 38} a 6 6 0 0 1 6 -6 H 1834 a 8 8 0 0 1 8 8 V ${b - 8} Z M 1684 ${b - 34} H 1834 V ${b - 22} H 1684 Z M 1756 ${b - 44} V ${b - 8} M 1700 ${b - 8} a 6 6 0 0 0 12 0 M 1806 ${b - 8} a 6 6 0 0 0 12 0`,
    at: 0.7,
    width: 1,
  });

  // Suelo y vías curvas.
  p.push({ d: `M 860 ${b} H 1910`, at: 0, soft: true, width: 0.9 });
  p.push({ d: `M 880 ${b + 18} C 1150 ${b + 2}, 1420 ${b + 30}, 1910 ${b + 10}`, at: 0.1, soft: true, width: 0.8 });

  return p;
};

export const BogotaSkyline: React.FC<Props> = ({
  progress,
  base = 985,
  x = 0,
  scale = 1,
  color = COLORS.gold,
  soft = COLORS.goldSoft,
  opacity = 1,
}) => {
  const pieces = useMemo(() => buildPieces(base), [base]);
  if (progress <= 0) return null;
  return (
    <g opacity={opacity} transform={`translate(${x} 0) translate(1390 ${base}) scale(${scale}) translate(-1390 ${-base})`}>
      {pieces.map((piece, i) => (
        <DrawPath
          key={i}
          d={piece.d}
          progress={Easing.inOut(Easing.cubic)(stagger(progress, piece.at * 0.75, 0.3))}
          stroke={piece.soft ? soft : color}
          strokeWidth={piece.width ?? 1.1}
          linecap="round"
        />
      ))}
    </g>
  );
};
