import "./fonts";
import { Composition, Folder } from "remotion";
import { MemoryTimeline } from "./components/MemoryTimeline";
import { CTPD35Video, TOTAL_DURATION } from "./CTPD35Video";
import { SCENES } from "./data/storyboard";
import { LAYOUT_IDS, LAYOUTS, TEMPLATE_DURATION } from "./photo/layouts";
import { PhotoCollage, photoTemplateSchema } from "./photo/PhotoCollage";
import { Closing, CLOSING_DURATION } from "./scenes/Closing";
import { Intro, INTRO_DURATION } from "./scenes/Intro";
import { VIDEO } from "./theme";

/** Texto de muestra de cada plantilla: la primera escena del guion que la usa. */
const sampleText = (id: string) => {
  const scene = SCENES.find((s) => s.type === "photo" && s.layout === id);
  return scene && scene.type === "photo" ? { kicker: scene.kicker, caption: scene.caption } : { kicker: "", caption: "" };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="CTPD-35-Anos" component={CTPD35Video} durationInFrames={TOTAL_DURATION} {...VIDEO} />

      <Folder name="Escenas">
        <Composition id="Introduccion" component={Intro} durationInFrames={INTRO_DURATION} {...VIDEO} />
        <Composition id="Cierre" component={Closing} durationInFrames={CLOSING_DURATION} {...VIDEO} />
        <Composition
          id="Memoria-35-Anos"
          component={MemoryTimeline}
          durationInFrames={330}
          {...VIDEO}
          defaultProps={{
            kicker: "Durante estos 35 años",
            text: "Generaciones de consejeras y consejeros han asumido una responsabilidad profundamente ciudadana.",
          }}
        />
      </Folder>

      {/* Capas gráficas con ventanas transparentes, para exportar con canal alfa. */}
      <Folder name="Plantillas-Fotos">
        {LAYOUT_IDS.map((id) => (
          <Composition
            key={id}
            id={LAYOUTS[id].compositionId}
            component={PhotoCollage}
            schema={photoTemplateSchema}
            durationInFrames={TEMPLATE_DURATION}
            {...VIDEO}
            defaultProps={{
              layout: id,
              photos: [],
              ...sampleText(id),
              showPlaceholder: false,
              background: "paper" as const,
            }}
          />
        ))}
      </Folder>
    </>
  );
};
