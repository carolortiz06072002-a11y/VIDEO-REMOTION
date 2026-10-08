import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, WEIGHT } from "../fonts";
import { prog } from "../lib/anim";
import { COLORS, EASE } from "../theme";
import { CartographicGrid } from "./graphics/CartographicGrid";
import { ContourRings } from "./graphics/ContourRings";
import { DiscMotif } from "./graphics/DiscMotif";
import { DrawPath } from "./graphics/DrawPath";
import { PaperLayer } from "./graphics/PaperLayer";
import { GraphicFrame } from "./GraphicFrame";
import { RevealText } from "./RevealText";

export const Kicker: React.FC<{ text: string; start: number; align?: "left" | "center" }> = ({ text, start, align = "left" }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, start, 40, EASE.out);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: p, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <div style={{ width: 44 * p, height: 1, background: COLORS.gold }} />
      <div
        style={{
          fontFamily: FONT,
          fontWeight: WEIGHT.semibold,
          fontSize: 16,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: COLORS.gold,
        }}
      >
        {text}
      </div>
      {align === "center" ? <div style={{ width: 44 * p, height: 1, background: COLORS.gold }} /> : null}
    </div>
  );
};

type Props = {
  lines: string[];
  kicker?: string;
  sub?: string;
  align: "center" | "left";
};

/** Pausa tipográfica: frases del guion sobre papel, con la línea gráfica de fondo. */
export const TextCard: React.FC<Props> = ({ lines, kicker, sub, align }) => {
  const frame = useCurrentFrame();
  const left = align === "left";
  const lineGap = 34;
  const subStart = 40 + lines.length * lineGap + 20;

  return (
    <AbsoluteFill>
      <PaperLayer>
        <CartographicGrid progress={prog(frame, 0, 160, EASE.inOut)} opacity={0.1} seed={`card-${lines[0]}`} />
        {left ? (
          <DiscMotif cx={1810} cy={540} r={300} ring={prog(frame, 0, 100, EASE.inOut)} fill={prog(frame, 10, 80)} crescent={prog(frame, 30, 100)} />
        ) : (
          <ContourRings cx={960} cy={540} progress={prog(frame, 0, 180)} r0={330} step={56} rings={4} rotation={frame * 0.015} dots={8} opacity={0.4} seed="card-rings" />
        )}
        {left ? (
          <DrawPath d="M 200 330 V 750" progress={prog(frame, 10, 70, EASE.inOut)} stroke={COLORS.goldSoft} strokeWidth={1.2} />
        ) : null}
      </PaperLayer>
      <GraphicFrame progress={prog(frame, 0, 80, EASE.inOut)} compass={false} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: left ? "flex-start" : "center",
          paddingLeft: left ? 250 : 0,
        }}
      >
        <div style={{ maxWidth: left ? 1240 : 1500, textAlign: align }}>
          {kicker ? (
            <div style={{ marginBottom: 34 }}>
              <Kicker text={kicker} start={10} align={align} />
            </div>
          ) : null}
          {lines.map((line, i) => (
            <RevealText
              key={i}
              text={line}
              start={30 + i * lineGap}
              stagger={4}
              style={{
                fontFamily: FONT,
                fontWeight: WEIGHT.bold,
                fontSize: left ? 54 : 66,
                lineHeight: 1.22,
                color: COLORS.ink,
              }}
            />
          ))}
          {sub ? (
            <RevealText
              text={sub}
              start={subStart}
              stagger={3}
              style={{
                marginTop: 36,
                fontFamily: FONT,
                fontWeight: WEIGHT.regular,
                fontSize: 32,
                lineHeight: 1.4,
                color: COLORS.inkSoft,
              }}
            />
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
