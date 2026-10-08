export const rectPath = (x: number, y: number, w: number, h: number) =>
  `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;

export const circlePath = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;

export const linePath = (x1: number, y1: number, x2: number, y2: number) =>
  `M ${x1} ${y1} L ${x2} ${y2}`;

export type Rect = { x: number; y: number; w: number; h: number; rotate?: number };

export const rotateAbout = (r: Rect) =>
  r.rotate ? `rotate(${r.rotate} ${r.x + r.w / 2} ${r.y + r.h / 2})` : undefined;
