import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, WEIGHT } from "../fonts";
import { stagger } from "../lib/anim";
import { linePath, rectPath } from "../lib/svg";
import { COLORS, VIDEO } from "../theme";
import { DrawPath } from "./graphics/DrawPath";

export type FrameLabels = {
  topLeft?: string;
  bottomLeft?: string;
  bottomRight?: string;
};

type Props = {
  /** 0→1: dibujo del marco. */
  progress: number;
  /** 0→1: las esquinas llegan desde fuera de cuadro (usado en el cierre). */
  converge?: number;
  tone?: "dark" | "light";
  inset?: number;
  labels?: FrameLabels;
  compass?: boolean;
  opacity?: number;
};

export const DEFAULT_LABELS: FrameLabels = {
  topLeft: "Consejo Territorial de Planeación Distrital",
  bottomRight: "35 años · 1991 – 2026",
};

/**
 * Marco institucional de pantalla completa: línea perimetral, esquinas doradas,
 * reglas milimetradas, rosa de los vientos mínima y rótulos.
 * Es transparente: puede ir sobre papel o sobre fotografía.
 */
export const GraphicFrame: React.FC<Props> = ({
  progress,
  converge = 1,
  tone = "dark",
  inset = 44,
  labels = DEFAULT_LABELS,
  compass = true,
  opacity = 1,
}) => {
  const { width: W, height: H } = VIDEO;
  const line = tone === "dark" ? COLORS.beigeDeep : COLORS.ivory;
  const gold = tone === "dark" ? COLORS.gold : COLORS.goldSoft;
  const text = tone === "dark" ? COLORS.muted : COLORS.ivory;
  const away = (1 - converge) * 140;
  const cornerP = stagger(progress, 0.35, 0.5) * converge;
  const tickP = stagger(progress, 0.5, 0.5);
  const labelP = stagger(progress, 0.65, 0.35);
  const L = 56;

  const corners = [
    { x: inset, y: inset, sx: 1, sy: 1 },
    { x: W - inset, y: inset, sx: -1, sy: 1 },
    { x: inset, y: H - inset, sx: 1, sy: -1 },
    { x: W - inset, y: H - inset, sx: -1, sy: -1 },
  ];

  const ticks: string[] = [];
  const t0 = inset + 160;
  const t1 = W - inset - 160;
  for (let x = t0, i = 0; x <= t1; x += 24, i++) {
    const len = i % 5 === 0 ? 9 : 4;
    ticks.push(linePath(x, inset, x, inset + len));
    ticks.push(linePath(x, H - inset, x, H - inset - len));
  }
  const visibleTicks = Math.floor(ticks.length * tickP);

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    fontFamily: FONT,
    fontWeight: WEIGHT.medium,
    fontSize: 13,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: text,
    opacity: labelP * 0.9,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", overflow: "visible" }}>
        <DrawPath
          d={rectPath(inset, inset, W - inset * 2, H - inset * 2)}
          progress={progress * converge}
          stroke={line}
          strokeWidth={1}
          opacity={tone === "dark" ? 0.9 : 0.55}
        />
        <g opacity={0.55}>
          {ticks.slice(0, visibleTicks).map((d, i) => (
            <path key={i} d={d} stroke={line} strokeWidth={0.8} />
          ))}
        </g>
        {corners.map((c, i) => (
          <g
            key={i}
            opacity={cornerP}
            transform={`translate(${c.x - c.sx * away} ${c.y - c.sy * away}) scale(${c.sx} ${c.sy})`}
          >
            <path d={`M -8 ${L} V -8 H ${L}`} fill="none" stroke={gold} strokeWidth={1.4} />
            <circle cx={12} cy={12} r={2.4} fill={gold} />
            <path d={`M 22 -8 V -14 M -8 22 H -14`} stroke={gold} strokeWidth={1} />
          </g>
        ))}
        {compass ? (
          <g opacity={labelP} transform={`translate(${W - inset - 52} ${inset + 52})`}>
            <circle r={18} fill="none" stroke={line} strokeWidth={0.8} />
            <circle r={2} fill={gold} />
            <path d="M 0 -26 L 4 -6 L 0 -9 L -4 -6 Z" fill={gold} />
            <path d="M 0 26 V 8 M -26 0 H -8 M 26 0 H 8" stroke={line} strokeWidth={0.8} />
          </g>
        ) : null}
      </svg>
      {labels.topLeft ? <div style={{ ...labelStyle, left: inset + 32, top: inset + 22 }}>{labels.topLeft}</div> : null}
      {labels.bottomLeft ? (
        <div style={{ ...labelStyle, left: inset + 32, bottom: inset + 22 }}>{labels.bottomLeft}</div>
      ) : null}
      {labels.bottomRight ? (
        <div style={{ ...labelStyle, right: inset + 32, bottom: inset + 22 }}>{labels.bottomRight}</div>
      ) : null}
    </AbsoluteFill>
  );
};
