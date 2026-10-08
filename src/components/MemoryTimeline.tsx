import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT, WEIGHT } from "../fonts";
import { pad2, prog } from "../lib/anim";
import { circlePath } from "../lib/svg";
import { COLORS, EASE } from "../theme";
import { CartographicGrid } from "./graphics/CartographicGrid";
import { DrawPath } from "./graphics/DrawPath";
import { PaperLayer } from "./graphics/PaperLayer";
import { GraphicFrame } from "./GraphicFrame";
import { RevealText } from "./RevealText";
import { Kicker } from "./TextCard";

type Props = { kicker: string; text: string; years?: number };

const X0 = 210;
const X1 = 1710;
const Y = 700;

/**
 * Línea de tiempo de memoria: una marca por año, que se van sumando.
 * Solo usa el número de años (35); no inventa hitos ni fechas intermedias.
 */
export const MemoryTimeline: React.FC<Props> = ({ kicker, text, years = 35 }) => {
  const frame = useCurrentFrame();
  const baseP = prog(frame, 20, 60, EASE.inOut);
  const ticksStart = 60;
  const perTick = 4.2;
  const step = (X1 - X0) / (years - 1);
  const count = interpolate(frame, [ticksStart, ticksStart + perTick * years], [0, years], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const markerX = X0 + Math.max(0, Math.min(years - 1, count - 1)) * step;
  const finalP = prog(frame, ticksStart + perTick * years, 40, EASE.out);

  return (
    <AbsoluteFill>
      <PaperLayer>
        <CartographicGrid progress={prog(frame, 0, 160, EASE.inOut)} opacity={0.1} seed="memory-grid" />
        <DrawPath d={`M ${X0 - 40} ${Y} H ${X1 + 40}`} progress={baseP} stroke={COLORS.beigeDeep} strokeWidth={1} />
        {Array.from({ length: years }, (_, i) => {
          const p = Math.min(1, Math.max(0, count - i));
          if (p <= 0) return null;
          const major = (i + 1) % 5 === 0 || i === 0;
          const h = major ? 34 : 16;
          const x = X0 + i * step;
          return (
            <g key={i} opacity={p}>
              <path d={`M ${x} ${Y} V ${Y - h * p}`} stroke={major ? COLORS.gold : COLORS.sand} strokeWidth={major ? 1.4 : 1} />
              {major ? (
                <text x={x} y={Y + 34} textAnchor="middle" fontFamily={FONT} fontWeight={WEIGHT.medium} fontSize={14} letterSpacing={2} fill={COLORS.muted}>
                  {pad2(i + 1)}
                </text>
              ) : null}
            </g>
          );
        })}
        {count > 0 ? <circle cx={markerX} cy={Y} r={4.5} fill={COLORS.gold} /> : null}
        <DrawPath d={circlePath(X1, Y, 22)} progress={finalP} stroke={COLORS.gold} strokeWidth={1.2} />
        <DrawPath d={circlePath(X1, Y, 34)} progress={finalP} stroke={COLORS.goldSoft} strokeWidth={0.8} opacity={0.7} />
      </PaperLayer>
      <GraphicFrame progress={prog(frame, 0, 80, EASE.inOut)} compass={false} />
      <div style={{ position: "absolute", left: X0, top: 250, width: 1300 }}>
        <Kicker text={kicker} start={10} />
        <RevealText
          text={text}
          start={40}
          stagger={4}
          style={{ marginTop: 30, fontFamily: FONT, fontWeight: WEIGHT.bold, fontSize: 54, lineHeight: 1.22, color: COLORS.ink }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: X1 - 120,
          top: Y + 56,
          width: 240,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: WEIGHT.semibold,
          fontSize: 18,
          letterSpacing: "0.34em",
          color: COLORS.gold,
          opacity: finalP,
        }}
      >
        {years} AÑOS
      </div>
    </AbsoluteFill>
  );
};
