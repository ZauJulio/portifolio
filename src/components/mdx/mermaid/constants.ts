export const MIN_SCALE = 0.2;
export const MAX_SCALE = 8;
export const ZOOM_STEP = 1.2;
export const PAD = 16;
export const FIT_MAX = 2;
export const PAN_THRESHOLD = 3;

export interface View {
  scale: number;
  x: number;
  y: number;
}

export const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
