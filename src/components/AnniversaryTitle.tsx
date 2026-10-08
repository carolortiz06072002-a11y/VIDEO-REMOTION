import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, WEIGHT } from "../fonts";
import { lerp, prog, rand, useSafeId } from "../lib/anim";
import { COLORS, EASE } from "../theme";
import { DrawPath } from "./graphics/DrawPath";
import { MaskLine, RevealText } from "./RevealText";

/* ------------------------------------------------------------------ */
/* Tiempos (relativos a `start`)                                       */
/* ------------------------------------------------------------------ */

export const TITLE_TIMING = {
  outline: [0, 90],
  fill: [60, 80],
  orbit: [40, 110],
  anios: [110, 55],
  small: [140, 55],
  name1: [210, 50],
  name2: [228, 50],
  years: [270, 45],
  tagline: 330,
} as const;

/** Posición del "35" dentro del disco (centro del numeral). */
export const NUMERAL_CENTER = { x: 1205, y: 450 };

export const GOLD_TEXT = "#94733A";
export const YEARS = "1991 – 2026";

/* ------------------------------------------------------------------ */
/* Numeral 35                                                          */
/* ------------------------------------------------------------------ */

const NUM_W = 760;
const NUM_H = 320;

/**
 * "35" en oro mate: el contorno se dibuja, después llega el relleno con un
 * plano urbano muy tenue en su interior; dos órbitas lo rodean.
 */
export const Numeral35: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const id = useSafeId("n35");
  const t = TITLE_TIMING;
  const outlineP = prog(frame, start + t.outline[0], t.outline[1], EASE.inOut);
  const fillP = prog(frame, start + t.fill[0], t.fill[1]);
  const orbitP = prog(frame, start + t.orbit[0], t.orbit[1], EASE.inOut);

  const streets = useMemo(() => {
    const out: string[] = [];
    let i = 0;
    for (let x = -200; x < NUM_W + 200; x += rand(`n35-v-${i++}`, 12, 26)) out.push(`M ${x} -200 V ${NUM_H + 200}`);
    for (let y = -200; y < NUM_H + 200; y += rand(`n35-h-${i++}`, 12, 26)) out.push(`M -200 ${y} H ${NUM_W + 200}`);
    return out.join(" ");
  }, []);

  if (frame < start) return null;

  const ox = NUM_W / 2;
  const oy = NUM_H / 2;
  const textProps = {
    x: ox,
    y: oy + 105,
    textAnchor: "middle" as const,
    fontFamily: FONT,
    fontWeight: WEIGHT.bold,
    fontSize: 300,
    letterSpacing: -30,
  };

  // Órbitas: arcos de un círculo que envuelve el número, con un punto al final.
  const R = 200;
  const ocx = ox + 30;
  const arc = (a0: number, a1: number) => {
    const p0 = [ocx + R * Math.cos((a0 * Math.PI) / 180), oy + R * Math.sin((a0 * Math.PI) / 180)];
    const p1 = [ocx + R * Math.cos((a1 * Math.PI) / 180), oy + R * Math.sin((a1 * Math.PI) / 180)];
    return { d: `M ${p0[0]} ${p0[1]} A ${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}`, end: p1 };
  };
  const arcTop = arc(-112, -18);
  const arcBottom = arc(48, 150);

  return (
    <svg width={NUM_W} height={NUM_H} viewBox={`0 0 ${NUM_W} ${NUM_H}`} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <text {...textProps}>35</text>
        </clipPath>
        <linearGradient id={`${id}-gold`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#8C6A33" />
          <stop offset="32%" stopColor="#B8914F" />
          <stop offset="52%" stopColor="#D2B273" />
          <stop offset="72%" stopColor="#A9854A" />
          <stop offset="100%" stopColor="#7C5D2B" />
        </linearGradient>
      </defs>

      {/* Contorno: debajo del relleno, para que solo se vea el borde exterior */}
      <text
        {...textProps}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={2.6}
        strokeLinejoin="round"
        strokeDasharray={1900}
        strokeDashoffset={1900 * (1 - outlineP)}
      >
        35
      </text>

      <g clipPath={`url(#${id}-clip)`} opacity={fillP}>
        <rect x={0} y={0} width={NUM_W} height={NUM_H} fill={`url(#${id}-gold)`} />
        <path d={streets} transform={`rotate(-14 ${ox} ${oy})`} stroke="#F3E3BF" strokeWidth={0.6} opacity={0.16} fill="none" />
      </g>

      <DrawPath d={arcTop.d} progress={orbitP} stroke={COLORS.gold} strokeWidth={1.5} linecap="round" />
      <DrawPath d={arcBottom.d} progress={orbitP} stroke={COLORS.gold} strokeWidth={1.5} linecap="round" />
      <g opacity={Math.max(0, (orbitP - 0.9) * 10)} fill={COLORS.gold}>
        <circle cx={arcTop.end[0]} cy={arcTop.end[1]} r={5} />
        <circle cx={arcBottom.end[0]} cy={arcBottom.end[1]} r={5} />
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* AÑOS + nombre pequeño (dentro del disco)                            */
/* ------------------------------------------------------------------ */

export const AniosBlock: React.FC<{ start: number; left: number; top: number }> = ({ start, left, top }) => {
  const frame = useCurrentFrame();
  const t = TITLE_TIMING;
  const p = prog(frame, start + t.anios[0], t.anios[1], EASE.out);
  const s = prog(frame, start + t.small[0], t.small[1], EASE.out);
  const tracking = lerp(0.7, 0.42, p);
  const small: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: WEIGHT.medium,
    fontSize: 15,
    letterSpacing: "0.2em",
    lineHeight: 1.5,
    color: COLORS.muted,
  };
  return (
    <div style={{ position: "absolute", left, top, width: 310 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: WEIGHT.medium,
          fontSize: 40,
          letterSpacing: `${tracking}em`,
          color: GOLD_TEXT,
          opacity: p,
          transform: `translateX(${(1 - p) * -16}px)`,
        }}
      >
        AÑOS
      </div>
      <div style={{ height: 1, background: COLORS.goldSoft, width: `${s * 100}%`, margin: "16px 0 12px" }} />
      <div style={{ ...small, opacity: s }}>
        CONSEJO TERRITORIAL
        <br />
        DE PLANEACIÓN DISTRITAL
      </div>
      <div style={{ height: 1, background: COLORS.goldSoft, width: `${s * 100}%`, marginTop: 12 }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Título lateral: nombre, años y lema                                 */
/* ------------------------------------------------------------------ */

type SideProps = {
  start: number;
  tagline: string;
  variant: "regular" | "final";
  years: string;
};

export const InstitutionTitle: React.FC<SideProps> = ({ start, tagline, variant, years }) => {
  const frame = useCurrentFrame();
  const t = TITLE_TIMING;
  const yearsP = prog(frame, start + t.years[0], t.years[1], EASE.out);
  const final = variant === "final";
  const name: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: WEIGHT.bold,
    fontSize: 49,
    letterSpacing: "0.02em",
    lineHeight: 1.12,
    color: GOLD_TEXT,
  };
  return (
    <div style={{ position: "absolute", left: 140, top: 560, width: 980 }}>
      <MaskLine start={start + t.name1[0]} duration={t.name1[1]} style={name}>
        CONSEJO TERRITORIAL
      </MaskLine>
      <MaskLine start={start + t.name2[0]} duration={t.name2[1]} style={name}>
        DE PLANEACIÓN DISTRITAL
      </MaskLine>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginTop: 14,
          opacity: yearsP,
          transform: `translateY(${(1 - yearsP) * 10}px)`,
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: WEIGHT.bold, fontSize: 36, color: COLORS.inkSoft, letterSpacing: "0.04em" }}>
          {years}
        </div>
        <div style={{ height: 1, width: 160 * yearsP, background: COLORS.goldSoft }} />
      </div>
      <RevealText
        text={tagline}
        start={start + t.tagline}
        stagger={final ? 6 : 5}
        duration={final ? 36 : 30}
        style={{
          marginTop: final ? 34 : 30,
          fontFamily: FONT,
          fontWeight: final ? WEIGHT.semibold : WEIGHT.regular,
          fontSize: final ? 38 : 30,
          lineHeight: 1.3,
          color: final ? COLORS.ink : COLORS.inkSoft,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Conjunto                                                            */
/* ------------------------------------------------------------------ */

type Props = {
  start: number;
  tagline: string;
  variant?: "regular" | "final";
  years?: string;
};

/**
 * Bloque de título del aniversario según la línea gráfica: 35 + AÑOS dentro
 * del disco, y el nombre institucional con los años a la izquierda.
 * Lo comparten la introducción y el cierre.
 */
export const AnniversaryTitle: React.FC<Props> = ({ start, tagline, variant = "regular", years = YEARS }) => {
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: NUMERAL_CENTER.x - NUM_W / 2, top: NUMERAL_CENTER.y - NUM_H / 2 }}>
        <Numeral35 start={start} />
      </div>
      <AniosBlock start={start} left={1470} top={470} />
      <InstitutionTitle start={start} tagline={tagline} variant={variant} years={years} />
    </AbsoluteFill>
  );
};
