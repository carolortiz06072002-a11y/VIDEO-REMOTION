import React from "react";
import { useSafeId } from "../../lib/anim";
import { circlePath } from "../../lib/svg";
import { COLORS } from "../../theme";
import { DrawPath } from "./DrawPath";

type Props = {
  cx: number;
  cy: number;
  r: number;
  /** Trazo de los anillos. */
  ring: number;
  /** Aparición del disco marfil. */
  fill: number;
  /** Entrada de la media luna dorada desde la derecha. */
  crescent: number;
  scale?: number;
};

/**
 * Motivo central de la línea gráfica: disco marfil con bordes dorados finos
 * y una media luna dorada mate que lo abraza por la derecha.
 */
export const DiscMotif: React.FC<Props> = ({ cx, cy, r, ring, fill, crescent, scale = 1 }) => {
  const id = useSafeId("disc");
  const shift = (1 - crescent) * 260;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <defs>
        <radialGradient id={`${id}-disc`} cx="42%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FDFAF4" />
          <stop offset="75%" stopColor="#F8F1E4" />
          <stop offset="100%" stopColor="#EFE3CC" />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1={cx - r * 0.2} y1={cy - r} x2={cx + r * 1.3} y2={cy + r} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9D6AE" stopOpacity={0} />
          <stop offset="45%" stopColor="#D4B47A" />
          <stop offset="70%" stopColor="#B88E4C" />
          <stop offset="100%" stopColor="#8E6A31" />
        </linearGradient>
        <mask id={`${id}-cut`} maskUnits="userSpaceOnUse">
          <rect x={cx - r * 3} y={cy - r * 3} width={r * 6} height={r * 6} fill="white" />
          <circle cx={cx} cy={cy} r={r * 1.035} fill="black" />
        </mask>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={28} />
        </filter>
      </defs>

      {/* Media luna dorada */}
      <g mask={`url(#${id}-cut)`} opacity={crescent}>
        <circle cx={cx + r * 0.24 + shift} cy={cy - r * 0.03} r={r * 1.2} fill={`url(#${id}-gold)`} />
      </g>

      {/* Sombra suave y disco */}
      <circle cx={cx + 14} cy={cy + 22} r={r} fill={COLORS.inkSoft} opacity={0.1 * fill} filter={`url(#${id}-shadow)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-disc)`} opacity={fill} />

      {/* Anillos */}
      <DrawPath d={circlePath(cx, cy, r)} progress={ring} stroke={COLORS.goldSoft} strokeWidth={1.6} />
      <DrawPath d={circlePath(cx, cy, r * 0.962)} progress={ring} stroke={COLORS.gold} strokeWidth={0.9} opacity={0.7} />
      <DrawPath d={circlePath(cx, cy, r * 1.035)} progress={ring} stroke={COLORS.goldSoft} strokeWidth={0.8} opacity={0.6} />
    </g>
  );
};
