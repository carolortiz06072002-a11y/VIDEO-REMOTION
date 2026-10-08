import React from "react";
import { useCurrentFrame } from "remotion";
import { prog } from "../lib/anim";
import { EASE } from "../theme";

type Props = {
  text: string;
  /** Frame (relativo a la secuencia) en que aparece la primera palabra. */
  start: number;
  /** Frames entre palabra y palabra. */
  stagger?: number;
  duration?: number;
  rise?: number;
  style?: React.CSSProperties;
};

/**
 * Texto que aparece palabra por palabra: opacidad, leve ascenso y desenfoque
 * que se aclara. "\n" fuerza un salto de línea.
 */
export const RevealText: React.FC<Props> = ({ text, start, stagger = 4, duration = 28, rise = 14, style }) => {
  const frame = useCurrentFrame();
  let index = 0;
  return (
    <div style={style}>
      {text.split("\n").map((line, li) => (
        <div key={li}>
          {line.split(" ").map((word, wi, words) => {
            const p = prog(frame, start + index++ * stagger, duration, EASE.out);
            return (
              <React.Fragment key={wi}>
                <span
                  style={{
                    display: "inline-block",
                    opacity: p,
                    transform: `translateY(${(1 - p) * rise}px)`,
                    filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
                  }}
                >
                  {word}
                </span>
                {wi < words.length - 1 ? " " : null}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

type MaskProps = {
  start: number;
  duration?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/** Línea que emerge desde una máscara inferior (sin desvanecido). */
export const MaskLine: React.FC<MaskProps> = ({ start, duration = 45, children, style }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, start, duration, EASE.out);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: Math.min(1, p * 3) }}>{children}</div>
    </div>
  );
};
