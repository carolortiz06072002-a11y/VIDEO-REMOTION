import { useId } from "react";
import { interpolate, random } from "remotion";
import { EASE } from "../theme";

type EasingFn = (t: number) => number;

/** Progreso 0→1 entre `start` y `start + duration`, con easing y extremos fijos. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFn = EASE.cinematic,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Progreso local escalonado: cada elemento empieza en `delay` (0–1) y dura `span`. */
export const stagger = (progress: number, delay: number, span: number) =>
  Math.min(1, Math.max(0, (progress - delay) / span));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Número determinista en [min, max). */
export const rand = (seed: string | number, min = 0, max = 1) =>
  lerp(min, max, random(seed));

/** id apto para url(#...) en SVG. */
export const useSafeId = (prefix: string) => {
  const raw = useId();
  return `${prefix}-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
};

export const pad2 = (n: number) => String(n).padStart(2, "0");
