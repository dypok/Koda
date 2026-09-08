import { StarData, clamp, PARALLAX_RADIUS, PARALLAX_STRENGTH, NEAR_DIM_RADIUS, RIPPLE_DURATION } from './hero-sky.model';

export interface SkyRenderContext {
  ctx: CanvasRenderingContext2D;
  stars: StarData[];
  realStar: StarData;
  w: number;
  h: number;
  dpr: number;
  now: number;
  px: number;
  py: number;
  ptrInside: boolean;
  interactive: boolean;
  reduceMotion: boolean;
  nearAmt: number;
  rippleActive: boolean;
  rippleTime: number;
  rippleX: number;
  rippleY: number;
}

export function renderSkyFrame(p: SkyRenderContext) {
  p.ctx.clearRect(0, 0, p.ctx.canvas.width, p.ctx.canvas.height);
  const time = p.now / 1000, ripRad = p.rippleTime * 0.65;

  for (let i = 0; i < p.stars.length; i++) {
    const star = p.stars[i];
    if (!star || star.isReal) continue;

    let opacity = star.baseOpacity;
    if (!p.reduceMotion) {
      opacity *= 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase);
    }

    let sx = star.x * p.w, sy = star.y * p.h, sSize = star.size;

    if (p.ptrInside && p.interactive && !p.reduceMotion) {
      const dx = star.x - p.px, dy = star.y - p.py, dist = Math.hypot(dx, dy);
      const influence = clamp(1 - dist / PARALLAX_RADIUS, 0, 1);
      if (dist > 0.001) {
        const par = influence * PARALLAX_STRENGTH;
        sx += (dx / dist) * par;
        sy += (dy / dist) * par;
      }
      opacity *= 1 + influence * 0.6;
      sSize *= 1 + influence * 0.15;
      if (p.nearAmt > 0) {
        const toReal = Math.hypot(star.x - p.realStar.x, star.y - p.realStar.y);
        if (toReal < NEAR_DIM_RADIUS) opacity *= 1 - p.nearAmt * 0.5 * (1 - toReal / NEAR_DIM_RADIUS);
      }
    }

    if (p.rippleActive) {
      const toRip = Math.hypot(star.x - p.rippleX, star.y - p.rippleY);
      const ring = Math.abs(toRip - ripRad);
      if (ring < 0.05) {
        opacity *= 1 + (1 - ring / 0.05) * 1.2 * (1 - p.rippleTime / RIPPLE_DURATION);
      } else if (toRip < ripRad) {
        opacity *= 0.8 + 0.2 * (p.rippleTime / RIPPLE_DURATION);
      }
    }

    const rad = (sSize / 2) * p.dpr, x = sx * p.dpr, y = sy * p.dpr;
    p.ctx.fillStyle = `rgba(255, 255, 255, ${clamp(opacity, 0.04, 1)})`;
    if (sSize > 1.8) {
      p.ctx.beginPath();
      p.ctx.arc(x, y, rad, 0, Math.PI * 2);
      p.ctx.fill();
    } else {
      p.ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  }
}
