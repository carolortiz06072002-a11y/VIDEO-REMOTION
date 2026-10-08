import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { z } from "zod";
import { GraphicFrame } from "../components/GraphicFrame";
import { CartographicGrid } from "../components/graphics/CartographicGrid";
import { ContourRings } from "../components/graphics/ContourRings";
import { DiscMotif } from "../components/graphics/DiscMotif";
import { DrawPath } from "../components/graphics/DrawPath";
import { PaperLayer, type Hole } from "../components/graphics/PaperLayer";
import { RevealText } from "../components/RevealText";
import { FONT, WEIGHT } from "../fonts";
import { prog, useSafeId } from "../lib/anim";
import { linePath } from "../lib/svg";
import { COLORS, EASE } from "../theme";
import { LAYOUT_IDS, LAYOUTS, type PhotoLayout, type TextZone } from "./layouts";
import { PhotoFrame, revealMode, revealProgress } from "./PhotoFrame";
import { PhotoSlot } from "./PhotoSlot";

export const photoTemplateSchema = z.object({
  layout: z.enum(LAYOUT_IDS as [string, ...string[]]),
  /** Rutas dentro de public/ (p. ej. "fotos/reunion-01.jpg") o URLs. Vacío = ventana transparente. */
  photos: z.array(z.string()),
  kicker: z.string(),
  caption: z.string(),
  /** Muestra marcadores "FOTOGRAFÍA 01" donde aún no hay foto. */
  showPlaceholder: z.boolean(),
  /** "paper": papel marfil con ventanas recortadas. "none": solo líneas y textos. */
  background: z.enum(["paper", "none"]),
});

export type PhotoTemplateProps = z.infer<typeof photoTemplateSchema>;

/* ------------------------------------------------------------------ */

const Caption: React.FC<{ zone: TextZone; kicker: string; caption: string }> = ({ zone, kicker, caption }) => {
  const frame = useCurrentFrame();
  const kp = prog(frame, 45, 40, EASE.out);
  const light = zone.tone === "light";
  const kickerEl = kicker ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        justifyContent: zone.align === "center" ? "center" : "flex-start",
        opacity: kp,
        flexShrink: 0,
        width: zone.arrangement === "row" ? 360 : undefined,
        marginBottom: zone.arrangement === "row" ? 0 : 20,
      }}
    >
      <div style={{ width: 44 * kp, height: 1, background: light ? COLORS.goldSoft : COLORS.gold }} />
      <div
        style={{
          fontFamily: FONT,
          fontWeight: WEIGHT.semibold,
          fontSize: 15,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: light ? COLORS.goldSoft : COLORS.gold,
        }}
      >
        {kicker}
      </div>
    </div>
  ) : null;

  return (
    <div
      style={{
        position: "absolute",
        left: zone.x,
        top: zone.y,
        width: zone.w,
        height: zone.h,
        display: "flex",
        flexDirection: zone.arrangement === "row" ? "row" : "column",
        alignItems: zone.arrangement === "row" ? "center" : undefined,
        justifyContent: zone.arrangement === "row" ? "flex-start" : { top: "flex-start", center: "center", bottom: "flex-end" }[zone.valign],
        textAlign: zone.align,
      }}
    >
      {kickerEl}
      {caption ? (
        <RevealText
          text={caption}
          start={60}
          stagger={3}
          style={{
            fontFamily: FONT,
            fontWeight: WEIGHT.bold,
            fontSize: zone.size,
            lineHeight: 1.22,
            color: light ? COLORS.paperLight : COLORS.ink,
            textShadow: light ? "0 2px 24px rgba(20,16,12,0.35)" : undefined,
          }}
        />
      ) : null}
    </div>
  );
};

/** Decoración sobre el papel (queda recortada por las ventanas). */
const Decor: React.FC<{ layout: PhotoLayout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { decor } = layout;
  const shadowId = useSafeId("shadow");
  return (
    <>
      {decor.grid ? (
        <CartographicGrid progress={prog(frame, 0, 150, EASE.inOut)} opacity={0.1} seed={`tpl-${layout.id}`} />
      ) : null}
      {decor.disc ? (
        <DiscMotif {...decor.disc} ring={prog(frame, 0, 90, EASE.inOut)} fill={prog(frame, 10, 70)} crescent={prog(frame, 30, 90)} />
      ) : null}
      {decor.rings ? (
        <ContourRings
          {...decor.rings}
          progress={prog(frame, 15, 150)}
          step={40}
          rotation={frame * 0.02}
          opacity={0.4}
          dots={6}
          seed={`tpl-rings-${layout.id}`}
        />
      ) : null}
      {decor.rule ? (
        <DrawPath
          d={linePath(decor.rule.x1, decor.rule.y1, decor.rule.x2, decor.rule.y2)}
          progress={prog(frame, 20, 80, EASE.inOut)}
          stroke={COLORS.goldSoft}
          strokeWidth={1}
        />
      ) : null}
      {/* Sombras de las copias de archivo */}
      {layout.windows
        .filter((w) => w.variant === "archive")
        .map((w, i) => (
          <g key={i} opacity={revealProgress({ ...w, entrance: "fade" }, frame)}>
            <defs>
              <filter id={`${shadowId}-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={14} />
              </filter>
            </defs>
            <rect
              x={w.x - 24 + 10}
              y={w.y - 24 + 16}
              width={w.w + 48}
              height={w.h + 24 + 84}
              fill={COLORS.inkSoft}
              opacity={0.22}
              filter={`url(#${shadowId}-${i})`}
              transform={w.rotate ? `rotate(${w.rotate} ${w.x + w.w / 2} ${w.y + w.h / 2})` : undefined}
            />
          </g>
        ))}
    </>
  );
};

/**
 * Plantilla fotográfica. Capas, de abajo hacia arriba:
 *   1. Fotografías (o nada: transparente)
 *   2. Papel con ventanas recortadas + decoración
 *   3. Marcos de cada ventana
 *   4. Marco institucional y textos
 */
export const PhotoCollage: React.FC<PhotoTemplateProps> = ({
  layout: layoutId,
  photos,
  kicker,
  caption,
  showPlaceholder,
  background,
}) => {
  const frame = useCurrentFrame();
  const layout = LAYOUTS[layoutId as keyof typeof LAYOUTS];
  const paper = background === "paper";

  const holes: Hole[] = layout.windows.map((w) => ({
    ...w,
    reveal: revealProgress(w, frame),
    revealMode: revealMode(w),
  }));

  return (
    <AbsoluteFill>
      {layout.windows.map((w, i) => (
        <PhotoSlot key={i} window={w} index={i} src={photos[i] || undefined} showPlaceholder={showPlaceholder} selfReveal={!paper} />
      ))}

      <PaperLayer holes={holes} paper={paper}>
        <Decor layout={layout} />
      </PaperLayer>

      {layout.id === "F" ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(30,24,18,0.66) 0%, rgba(30,24,18,0.28) 32%, rgba(30,24,18,0) 58%), linear-gradient(to bottom, rgba(30,24,18,0.3) 0%, rgba(30,24,18,0) 18%)",
            opacity: revealProgress(layout.windows[0], frame),
          }}
        />
      ) : null}

      {layout.windows.map((w, i) => (
        <PhotoFrame key={i} window={w} index={i} seed={`${layout.id}-${i}`} />
      ))}

      <GraphicFrame progress={prog(frame, 0, 80, EASE.inOut)} tone={layout.frameTone} compass={false} />
      <Caption zone={layout.text} kicker={kicker} caption={caption} />
    </AbsoluteFill>
  );
};
