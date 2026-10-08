import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, WEIGHT } from "../fonts";
import { prog } from "../lib/anim";
import { circlePath } from "../lib/svg";
import { COLORS, EASE } from "../theme";
import { CartographicGrid } from "./graphics/CartographicGrid";
import { DrawPath } from "./graphics/DrawPath";
import { PaperLayer } from "./graphics/PaperLayer";
import { GraphicFrame } from "./GraphicFrame";
import { RevealText } from "./RevealText";
import { Kicker } from "./TextCard";

type Props = { kicker: string; intro: string; steps: string[]; outro: string };

const Y = 560;

/** Secuencia de transformación: cada paso se convierte en el siguiente. */
export const ProcessChain: React.FC<Props> = ({ kicker, intro, steps, outro }) => {
  const frame = useCurrentFrame();
  const x0 = 320;
  const x1 = 1600;
  const gap = (x1 - x0) / (steps.length - 1);
  const stepStart = (i: number) => 70 + i * 42;
  const outroStart = stepStart(steps.length) + 10;

  return (
    <AbsoluteFill>
      <PaperLayer>
        <CartographicGrid progress={prog(frame, 0, 160, EASE.inOut)} opacity={0.1} seed="chain-grid" />
        {steps.map((_, i) => {
          const x = x0 + i * gap;
          const p = prog(frame, stepStart(i), 36, EASE.out);
          const linkP = prog(frame, stepStart(i) + 20, 34, EASE.inOut);
          return (
            <g key={i}>
              <DrawPath d={circlePath(x, Y, 28)} progress={p} stroke={COLORS.goldSoft} strokeWidth={1} />
              <circle cx={x} cy={Y} r={7 * p} fill={COLORS.gold} />
              {i < steps.length - 1 ? (
                <>
                  <DrawPath d={`M ${x + 40} ${Y} H ${x + gap - 40}`} progress={linkP} stroke={COLORS.gold} strokeWidth={1.1} />
                  <path
                    d={`M ${x + gap - 50} ${Y - 6} L ${x + gap - 42} ${Y} L ${x + gap - 50} ${Y + 6}`}
                    fill="none"
                    stroke={COLORS.gold}
                    strokeWidth={1.1}
                    opacity={linkP >= 1 ? 1 : 0}
                  />
                </>
              ) : null}
            </g>
          );
        })}
      </PaperLayer>
      <GraphicFrame progress={prog(frame, 0, 80, EASE.inOut)} compass={false} />
      <div style={{ position: "absolute", left: 0, width: "100%", top: 230, textAlign: "center" }}>
        <Kicker text={kicker} start={6} align="center" />
        <RevealText
          text={intro}
          start={24}
          stagger={2}
          style={{ margin: "26px auto 0", maxWidth: 1180, fontFamily: FONT, fontWeight: WEIGHT.regular, fontSize: 34, lineHeight: 1.35, color: COLORS.inkSoft }}
        />
      </div>
      {steps.map((s, i) => {
        const p = prog(frame, stepStart(i) + 8, 36, EASE.out);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + i * gap - 220,
              width: 440,
              top: Y + 52,
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: WEIGHT.bold,
              fontSize: 34,
              color: COLORS.ink,
              opacity: p,
              transform: `translateY(${(1 - p) * 12}px)`,
            }}
          >
            {s}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: "100%", top: 800, textAlign: "center" }}>
        <RevealText
          text={outro}
          start={outroStart}
          stagger={3}
          style={{ fontFamily: FONT, fontWeight: WEIGHT.regular, fontSize: 30, color: COLORS.muted }}
        />
      </div>
    </AbsoluteFill>
  );
};
