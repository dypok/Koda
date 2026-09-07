import { useEffect, useRef } from 'react';
import { StarData, PointerState, RippleState, NEAR_RADIUS, HOVER_RADIUS, RIPPLE_DURATION, clamp } from '@/models/landing/hero-sky.model';
import { renderSkyFrame } from '@/models/landing/hero-sky.renderer';

interface CanvasLoopOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  realCoreRef: React.RefObject<HTMLSpanElement | null>;
  realBloomRef: React.RefObject<HTMLSpanElement | null>;
  pointerRef: React.MutableRefObject<PointerState>;
  rippleRef: React.MutableRefObject<RippleState>;
  rectRef: React.MutableRefObject<{ left: number; top: number; width: number; height: number }>;
  stars: StarData[];
  realStar: StarData;
  interactive: boolean;
  reduceMotion: boolean;
  discovered: boolean;
  onDiscover: () => void;
}

export function useHeroSkyCanvasLoop(opts: CanvasLoopOptions) {
  const {
    containerRef, canvasRef, realCoreRef, realBloomRef, pointerRef, rippleRef,
    rectRef, stars, realStar, interactive, reduceMotion, discovered, onDiscover,
  } = opts;

  const nearAmountRef = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current, canvas = canvasRef.current;
    if (!container || !canvas) return;
    let rafId = 0, last = performance.now(), isRunning = false;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const render = (now: number) => {
      if (!isVisibleRef.current) { isRunning = false; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { width: w, height: h } = rectRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ptr = pointerRef.current;
      const px = ptr.inside ? ptr.x / w : -1, py = ptr.inside ? ptr.y / h : -1;
      const dist = ptr.inside ? Math.hypot(px - realStar.x, py - realStar.y) : 1;

      const nearT = ptr.inside ? clamp(1 - dist / NEAR_RADIUS, 0, 1) : 0;
      nearAmountRef.current += (nearT - nearAmountRef.current) * 0.08;
      if (!discovered && ptr.inside && dist < HOVER_RADIUS) onDiscover();

      if (rippleRef.current.active) {
        rippleRef.current.t += dt;
        if (rippleRef.current.t > RIPPLE_DURATION) rippleRef.current.active = false;
      }

      if (realCoreRef.current && realBloomRef.current) {
        const glow = nearAmountRef.current;
        realCoreRef.current.style.transform = `scale(${1 + glow * 0.2})`;
        realCoreRef.current.style.opacity = String(0.75 + glow * 0.25);
        realBloomRef.current.style.opacity = String(0.35 + glow * 0.55);
        realBloomRef.current.style.transform = `scale(${0.8 + glow * 0.6})`;
      }

      renderSkyFrame({
        ctx, stars, realStar, w, h, dpr, now, px, py, ptrInside: ptr.inside,
        interactive, reduceMotion, nearAmt: nearAmountRef.current,
        rippleActive: rippleRef.current.active, rippleTime: rippleRef.current.t,
        rippleX: rippleRef.current.x, rippleY: rippleRef.current.y,
      });
      rafId = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = isVisibleRef.current;
      isVisibleRef.current = e?.isIntersecting ?? false;
      if (isVisibleRef.current && !was && !isRunning) {
        last = performance.now(); isRunning = true; rafId = requestAnimationFrame(render);
      }
    }, { threshold: 0.01 });

    io.observe(container);
    if (isVisibleRef.current) { isRunning = true; rafId = requestAnimationFrame(render); }
    return () => { io.disconnect(); cancelAnimationFrame(rafId); isRunning = false; };
  }, [stars, realStar, reduceMotion, interactive, discovered, onDiscover]);
}
