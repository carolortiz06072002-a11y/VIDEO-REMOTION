import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { MemoryTimeline } from "./components/MemoryTimeline";
import { ProcessChain } from "./components/ProcessChain";
import { TextCard } from "./components/TextCard";
import { SCENES, TRANSITION, type Scene } from "./data/storyboard";
import { PhotoCollage } from "./photo/PhotoCollage";
import { Closing, CLOSING_DURATION } from "./scenes/Closing";
import { Intro, INTRO_DURATION } from "./scenes/Intro";
import { COLORS, EASE } from "./theme";

/** Duración total: suma de escenas menos los solapamientos de los fundidos. */
export const TOTAL_DURATION =
  INTRO_DURATION + SCENES.reduce((acc, s) => acc + s.duration, 0) + CLOSING_DURATION - TRANSITION * (SCENES.length + 1);

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "photo":
      return (
        <PhotoCollage
          layout={scene.layout}
          photos={scene.photos}
          kicker={scene.kicker}
          caption={scene.caption}
          showPlaceholder
          background="paper"
        />
      );
    case "text":
      return <TextCard lines={scene.lines} kicker={scene.kicker} sub={scene.sub} align={scene.align} />;
    case "memory":
      return <MemoryTimeline kicker={scene.kicker} text={scene.text} />;
    case "chain":
      return <ProcessChain kicker={scene.kicker} intro={scene.intro} steps={scene.steps} outro={scene.outro} />;
  }
};

const transition = (key: string) => (
  <TransitionSeries.Transition
    key={key}
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION, easing: EASE.inOut })}
  />
);

/** Pieza completa: introducción → bloque narrativo con fotografías → cierre. */
export const CTPD35Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ivory }}>
      <TransitionSeries>
        <TransitionSeries.Sequence key="intro" durationInFrames={INTRO_DURATION}>
          <Intro />
        </TransitionSeries.Sequence>
        {SCENES.flatMap((scene, i) => [
          transition(`t-${i}`),
          <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={scene.duration}>
            <SceneView scene={scene} />
          </TransitionSeries.Sequence>,
        ])}
        {transition("t-closing")}
        <TransitionSeries.Sequence key="closing" durationInFrames={CLOSING_DURATION}>
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
