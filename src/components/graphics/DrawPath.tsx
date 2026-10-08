import React from "react";

type Props = {
  d: string;
  /** 0 = invisible, 1 = trazo completo. */
  progress: number;
  stroke: string;
  strokeWidth?: number;
  opacity?: number;
  transform?: string;
  linecap?: "butt" | "round" | "square";
};

/** Trazo vectorial que se dibuja progresivamente (pathLength normalizado). */
export const DrawPath: React.FC<Props> = ({
  d,
  progress,
  stroke,
  strokeWidth = 1,
  opacity = 1,
  transform,
  linecap = "butt",
}) => {
  if (progress <= 0) return null;
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - progress}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={linecap}
      opacity={opacity}
      transform={transform}
    />
  );
};
