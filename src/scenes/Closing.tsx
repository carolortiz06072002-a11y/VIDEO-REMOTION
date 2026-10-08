import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnniversaryTitle } from "../components/AnniversaryTitle";
import { GraphicFrame } from "../components/GraphicFrame";
import { BogotaSkyline } from "../components/graphics/BogotaSkyline";
import { CartographicGrid } from "../components/graphics/CartographicGrid";
import { ContourRings } from "../components/graphics/ContourRings";
import { DiscMotif } from "../components/graphics/DiscMotif";
import { PaperLayer } from "../components/graphics/PaperLayer";
import { lerp, prog } from "../lib/anim";
import { EASE } from "../theme";
import { DISC, TITLE_FRAME_LABELS } from "./Intro";

export const CLOSING_DURATION = 900; // 30 s, con ~8 s de lectura final
const TITLE_START = 240;

/**
 * Cierre: retoma los elementos de la introducción, que vuelven lentamente
 * desde fuera de cuadro para recomponer la misma composición central.
 */
export const Closing: React.FC = () => {
  const frame = useCurrentFrame();

  const converge = prog(frame, 0, 260, EASE.cinematic);
  const gridP = prog(frame, 0, 220, EASE.inOut);
  const ringP = prog(frame, 10, 190, EASE.inOut);
  const fillP = prog(frame, 50, 150);
  const crescentP = prog(frame, 120, 160, EASE.cinematic);
  const orbitsP = prog(frame, 20, 220);
  const skylineP = prog(frame, 150, 240, EASE.inOut);
  const frameP = prog(frame, 40, 170);
  const frameConverge = prog(frame, 40, 220, EASE.cinematic);

  return (
    <AbsoluteFill>
      <PaperLayer>
        <CartographicGrid
          progress={gridP}
          opacity={0.13 * converge}
          scale={lerp(1.5, 1, converge)}
          rotate={lerp(-24, -14, converge)}
          seed="intro-grid"
        />
        <ContourRings
          cx={DISC.cx}
          cy={DISC.cy}
          progress={orbitsP}
          r0={DISC.r + 70}
          step={46}
          rings={3}
          rotation={-30 + frame * 0.03}
          scale={lerp(1.6, 1, converge)}
          dots={14}
          gather={converge}
          opacity={0.45}
          seed="intro-rings"
        />
        <DiscMotif {...DISC} ring={ringP} fill={fillP} crescent={crescentP} scale={lerp(1.3, 1, converge)} />
        <BogotaSkyline progress={skylineP} />
      </PaperLayer>
      <GraphicFrame progress={frameP} converge={frameConverge} labels={TITLE_FRAME_LABELS} compass={false} />
      <AnniversaryTitle start={TITLE_START} variant="final" tagline={"35 años pensando, representando\ny construyendo Bogotá."} />
    </AbsoluteFill>
  );
};
