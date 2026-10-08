import React from "react";
import { useCurrentFrame } from "remotion";
import { CartographicGrid } from "../components/graphics/CartographicGrid";
import { DrawPath } from "../components/graphics/DrawPath";
import { FONT, WEIGHT } from "../fonts";
import { pad2, prog, rand, useSafeId } from "../lib/anim";
import { circlePath, linePath, rectPath } from "../lib/svg";
import { COLORS, EASE } from "../theme";
import type { PhotoWindow } from "./layouts";

/** Progreso de apertura de una ventana (compartido por papel, foto y marco). */
export const revealProgress = (w: PhotoWindow, frame: number) => {
  const f = frame - w.delay;
  if (w.entrance === "line") return prog(f, 18, 50, EASE.inOut);
  if (w.entrance === "mask") return prog(f, 0, 55, EASE.inOut);
  return prog(f, 0, 40, EASE.inOut);
};

export const revealMode = (w: PhotoWindow) =>
  w.entrance === "mask" ? ("wipe" as const) : w.entrance === "line" ? ("line" as const) : ("fade" as const);

/** Coordenadas gráficas abstractas (no corresponden a lugares reales). */
const coordinates = (seed: string, index: number) => {
  const a = Math.floor(rand(`${seed}-a`, 10, 99));
  const b = Math.floor(rand(`${seed}-b`, 10, 99));
  const c = Math.floor(rand(`${seed}-c`, 10, 99));
  return `${String.fromCharCode(65 + index)}-${pad2(Math.floor(rand(`${seed}-n`, 1, 40)))}  ·  ${a}.${b} / ${c}.35`;
};

const smallLabel: React.CSSProperties = {
  position: "absolute",
  fontFamily: FONT,
  fontWeight: WEIGHT.medium,
  fontSize: 12,
  letterSpacing: "0.26em",
  color: COLORS.muted,
  whiteSpace: "nowrap",
};

type Props = {
  window: PhotoWindow;
  index: number;
  seed: string;
};

/**
 * Capa gráfica de una ventana fotográfica: filetes, esquinas, puntos,
 * coordenadas y detalles de archivo o cartografía. No tapa la fotografía.
 */
export const PhotoFrame: React.FC<Props> = ({ window: w, index, seed }) => {
  const frame = useCurrentFrame();
  const id = useSafeId("pf");
  const f = frame - w.delay;
  const fp = prog(f, 8, 70, EASE.inOut);
  const cornerP = prog(f, 40, 30, EASE.out);
  const labelP = prog(f, 55, 30, EASE.out);
  const reveal = revealProgress(w, frame);
  const { w: W, h: H } = w;

  const wrap: React.CSSProperties = {
    position: "absolute",
    left: w.x,
    top: w.y,
    width: W,
    height: H,
    transform: w.rotate ? `rotate(${w.rotate}deg)` : undefined,
  };

  // Línea gráfica que abre la ventana (entrada "line").
  const lineIntro =
    w.entrance === "line" ? (
      <g opacity={1 - prog(f, 60, 20)}>
        <DrawPath d={linePath(0, H / 2, W, H / 2)} progress={prog(f, 0, 22, EASE.inOut)} stroke={COLORS.goldSoft} strokeWidth={1.4} />
        {reveal > 0 ? (
          <>
            <path d={linePath(0, H / 2 - (H / 2) * reveal, W, H / 2 - (H / 2) * reveal)} stroke={COLORS.goldSoft} strokeWidth={1.4} />
            <path d={linePath(0, H / 2 + (H / 2) * reveal, W, H / 2 + (H / 2) * reveal)} stroke={COLORS.goldSoft} strokeWidth={1.4} />
          </>
        ) : null}
      </g>
    ) : null;

  // Borde que acompaña la máscara (entrada "mask").
  const maskEdge =
    w.entrance === "mask" && reveal > 0 && reveal < 1 ? (
      <path d={linePath(W * reveal, 0, W * reveal, H)} stroke={COLORS.goldSoft} strokeWidth={1.4} />
    ) : null;

  const corners = (o: number, len: number, color: string) =>
    [
      [-o, -o, 1, 1],
      [W + o, -o, -1, 1],
      [-o, H + o, 1, -1],
      [W + o, H + o, -1, -1],
    ].map(([x, y, sx, sy], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`} opacity={cornerP}>
        <path d={`M 0 ${len} V 0 H ${len}`} fill="none" stroke={color} strokeWidth={1.5} />
        <circle cx={-7} cy={-7} r={2.4} fill={color} />
      </g>
    ));

  const coord = (
    <div
      style={{
        ...smallLabel,
        left: -30,
        top: H,
        transform: "rotate(-90deg)",
        transformOrigin: "0 0",
        opacity: labelP,
      }}
    >
      {coordinates(seed, index)}
    </div>
  );

  if (w.variant === "none") return null;

  if (w.variant === "archive") {
    const cardP = prog(f, 0, 30, EASE.out);
    const B = 24;
    const bottom = 84;
    const card = `${rectPath(-B, -B, W + 2 * B, H + B + bottom)} ${rectPath(0, 0, W, H)}`;
    return (
      <div style={wrap}>
        <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <path id={`${id}-ring`} d={circlePath(0, 0, 34)} />
          </defs>
          <path d={card} fillRule="evenodd" fill={COLORS.paperLight} opacity={cardP} />
          <path d={rectPath(-B + 6, -B + 6, W + 2 * B - 12, H + B + bottom - 12)} fill="none" stroke={COLORS.beige} strokeWidth={1} opacity={cardP} />
          <DrawPath d={rectPath(0, 0, W, H)} progress={fp} stroke={COLORS.beigeDeep} strokeWidth={1} />
          {/* Cintas */}
          {[
            [-6, -4, -38],
            [W + 6, -4, 38],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} opacity={cornerP * 0.9}>
              <rect x={-52} y={-15} width={104} height={30} fill="rgba(226,214,190,0.72)" />
              <path d="M -52 -15 H 52 M -52 15 H 52" stroke="rgba(184,164,127,0.4)" strokeWidth={0.8} />
            </g>
          ))}
          {/* Sello circular */}
          {index === 0 ? (
            <g transform={`translate(${W - 52} ${H + 44}) rotate(${-18 + f * 0.05})`} opacity={labelP * 0.85}>
              <circle r={40} fill="none" stroke={COLORS.gold} strokeWidth={1} />
              <circle r={27} fill="none" stroke={COLORS.gold} strokeWidth={0.7} />
              <text fontFamily={FONT} fontSize={8} fontWeight={WEIGHT.semibold} letterSpacing={1.3} fill={COLORS.gold}>
                <textPath href={`#${id}-ring`}>MEMORIA · 35 AÑOS · CTPD ·</textPath>
              </text>
              <text textAnchor="middle" y={5} fontFamily={FONT} fontWeight={WEIGHT.bold} fontSize={15} fill={COLORS.gold}>
                35
              </text>
            </g>
          ) : null}
        </svg>
        <div style={{ ...smallLabel, left: 0, top: H + 30, opacity: labelP }}>ARCHIVO · CTPD</div>
        {index !== 0 ? (
          <div style={{ ...smallLabel, right: 0, top: H + 30, opacity: labelP }}>Nº {pad2(index + 1)}</div>
        ) : null}
      </div>
    );
  }

  const isGold = w.variant === "gold";
  const isMinimal = w.variant === "minimal";

  return (
    <div style={wrap}>
      <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
        {w.variant === "cartography" ? <CartographyOverlay w={W} h={H} f={f} seed={seed} /> : null}
        <DrawPath d={rectPath(0, 0, W, H)} progress={fp} stroke={COLORS.goldSoft} strokeWidth={1} opacity={isMinimal ? 0.75 : 0.9} />
        {isMinimal ? (
          [
            [-8, -8],
            [W + 8, -8],
            [-8, H + 8],
            [W + 8, H + 8],
          ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill={COLORS.gold} opacity={cornerP} />)
        ) : isGold ? (
          <>
            <DrawPath d={rectPath(-10, -10, W + 20, H + 20)} progress={fp} stroke={COLORS.gold} strokeWidth={1.1} />
            <DrawPath d={rectPath(-17, -17, W + 34, H + 34)} progress={fp} stroke={COLORS.goldSoft} strokeWidth={0.7} opacity={0.75} />
            {[
              [W / 2, -17],
              [W / 2, H + 17],
              [-17, H / 2],
              [W + 17, H / 2],
            ].map(([x, y], i) => (
              <rect key={i} x={x - 4} y={y - 4} width={8} height={8} transform={`rotate(45 ${x} ${y})`} fill={COLORS.ivory} stroke={COLORS.gold} strokeWidth={1} opacity={cornerP} />
            ))}
            {corners(17, 0, COLORS.gold)}
          </>
        ) : (
          <>
            <DrawPath d={rectPath(-14, -14, W + 28, H + 28)} progress={fp} stroke={COLORS.beigeDeep} strokeWidth={1} />
            {corners(14, 30, COLORS.gold)}
          </>
        )}
        {lineIntro}
        {maskEdge}
      </svg>
      {!isMinimal ? coord : null}
    </div>
  );
};

/** Plano superpuesto a la fotografía: retícula, recorrido y puntos de referencia. */
const CartographyOverlay: React.FC<{ w: number; h: number; f: number; seed: string }> = ({ w, h, f, seed }) => {
  const clip = useSafeId("carto");
  const gridP = prog(f, 40, 140, EASE.inOut);
  const routeP = prog(f, 80, 110, EASE.inOut);
  const pts = [
    [0.16 * w, 0.66 * h],
    [0.44 * w, 0.36 * h],
    [0.76 * w, 0.58 * h],
  ];
  const route = `M ${pts[0][0]} ${pts[0][1]} C ${pts[0][0] + 160} ${pts[0][1] - 40}, ${pts[1][0] - 180} ${pts[1][1] + 60}, ${pts[1][0]} ${pts[1][1]} S ${pts[2][0] - 160} ${pts[2][1] - 70}, ${pts[2][0]} ${pts[2][1]}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <CartographicGrid
          progress={gridP}
          area={{ x: 0, y: 0, w, h }}
          color={COLORS.paperLight}
          accent={COLORS.goldSoft}
          opacity={0.38}
          spacing={[90, 180]}
          seed={`${seed}-carto`}
        />
        <DrawPath d={route} progress={routeP} stroke={COLORS.goldSoft} strokeWidth={2} linecap="round" />
        {pts.map(([x, y], i) => {
          const p = prog(f, 90 + i * 30, 30, EASE.out);
          if (p <= 0) return null;
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={p}>
              <circle r={22 * p} fill="none" stroke={COLORS.paperLight} strokeWidth={1.2} />
              <circle r={4} fill={COLORS.goldSoft} />
              <path d="M -36 0 H -26 M 26 0 H 36 M 0 -36 V -26 M 0 26 V 36" stroke={COLORS.paperLight} strokeWidth={1.2} />
              <text x={30} y={-28} fontFamily={FONT} fontWeight={WEIGHT.medium} fontSize={12} letterSpacing={2.5} fill={COLORS.paperLight}>
                {coordinates(`${seed}-pt-${i}`, i)}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};
