import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnniversaryTitle } from "../components/AnniversaryTitle";
import { GraphicFrame } from "../components/GraphicFrame";
import { BogotaSkyline } from "../components/graphics/BogotaSkyline";
import { CartographicGrid } from "../components/graphics/CartographicGrid";
import { ContourRings } from "../components/graphics/ContourRings";
import { DiscMotif } from "../components/graphics/DiscMotif";
import { PaperLayer } from "../components/graphics/PaperLayer";
import { prog } from "../lib/anim";
import { EASE } from "../theme";

export const INTRO_DURATION = 840; // 28 s
const TITLE_START = 300;

export const DISC = { cx: 1345, cy: 520, r: 455 };
export const TITLE_FRAME_LABELS = { topLeft: "Bogotá D.C." };

/**
 * Introducción: papel limpio → anillos dorados del disco → media luna →
 * ilustración de Bogotá → 35 AÑOS → nombre y años → lema.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const gridP = prog(frame, 30, 260, EASE.inOut);
  const ringP = prog(frame, 20, 150, EASE.inOut);
  const fillP = prog(frame, 70, 120);
  const crescentP = prog(frame, 120, 150, EASE.cinematic);
  const orbitsP = prog(frame, 90, 220);
  const skylineP = prog(frame, 170, 260, EASE.inOut);
  const frameP = prog(frame, 100, 160);
  // Empuje de cámara casi imperceptible.
  const push = 1 + frame * 0.00004;

  return (
    <AbsoluteFill>
      <PaperLayer>
        <CartographicGrid progress={gridP} opacity={0.13} seed="intro-grid" />
        <ContourRings
          cx={DISC.cx}
          cy={DISC.cy}
          progress={orbitsP}
          r0={DISC.r + 70}
          step={46}
          rings={3}
          rotation={frame * 0.01}
          dots={10}
          opacity={0.45}
          seed="intro-rings"
        />
        <DiscMotif {...DISC} ring={ringP} fill={fillP} crescent={crescentP} scale={push} />
        <BogotaSkyline progress={skylineP} />
      </PaperLayer>
      <GraphicFrame progress={frameP} labels={TITLE_FRAME_LABELS} compass={false} />
      <AnniversaryTitle start={TITLE_START} tagline="Pensando, representando y construyendo Bogotá." />
    </AbsoluteFill>
  );
};
