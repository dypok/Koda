export type StarData = {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  isReal: boolean;
};

export type PointerState = {
  x: number;
  y: number;
  inside: boolean;
};

export type RippleState = {
  active: boolean;
  t: number;
  x: number;
  y: number;
};

export const STAR_COUNT_DEFAULT = 140;
export const NEAR_RADIUS = 0.14;
export const HOVER_RADIUS = 0.035;
export const PARALLAX_RADIUS = 0.25;
export const PARALLAX_STRENGTH = 4.5;
export const NEAR_DIM_RADIUS = 0.2;
export const RIPPLE_DURATION = 1.6;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateStars(count: number, seed: number) {
  const rand = mulberry32(seed);
  const stars: StarData[] = [];
  const realIndex = Math.floor(rand() * count);
  let realStar: StarData | undefined;

  for (let i = 0; i < count; i++) {
    const isReal = i === realIndex;
    const margin = isReal ? 0.15 : 0.02;
    const star: StarData = {
      id: i,
      x: margin + rand() * (1 - margin * 2),
      y: margin + rand() * (1 - margin * 2),
      size: isReal ? 3.6 : 0.8 + rand() * 1.5,
      baseOpacity: isReal ? 0.85 : 0.15 + rand() * 0.5,
      twinkleSpeed: 0.35 + rand() * 1.2,
      twinklePhase: rand() * Math.PI * 2,
      isReal,
    };
    stars.push(star);
    if (isReal) realStar = star;
  }

  if (!realStar) {
    realStar = stars[0] || { id: 0, x: 0.5, y: 0.5, size: 3.6, baseOpacity: 0.85, twinkleSpeed: 0.5, twinklePhase: 0, isReal: true };
    realStar.isReal = true;
  }

  return { stars, realStar };
}
