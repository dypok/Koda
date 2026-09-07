'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HeroSkyBackgroundProps {
  className?: string;
  starCount?: number;
  seed?: number;
  interactive?: boolean;
}

type StarData = {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  isReal: boolean;
};

type PointerState = {
  x: number;
  y: number;
  inside: boolean;
};

type RippleState = {
  active: boolean;
  t: number;
  x: number;
  y: number;
};

const STAR_COUNT_DEFAULT = 140;
const NEAR_RADIUS = 0.14;
const HOVER_RADIUS = 0.035;
const PARALLAX_RADIUS = 0.25;
const PARALLAX_STRENGTH = 4.5;
const NEAR_DIM_RADIUS = 0.2;
const RIPPLE_DURATION = 1.6;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count: number, seed: number) {
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
    realStar = stars[0];
    realStar.isReal = true;
  }

  return { stars, realStar };
}

export const HeroSkyBackground: React.FC<HeroSkyBackgroundProps> = ({
  className,
  starCount = STAR_COUNT_DEFAULT,
  seed = 88,
  interactive = true,
}) => {
  const reduceMotion = useReducedMotion();
  const count = clamp(Math.round(starCount), 80, 200);

  const { stars, realStar } = useMemo(
    () => generateStars(count, seed),
    [count, seed]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const realStarRef = useRef<HTMLButtonElement>(null);
  const realCoreRef = useRef<HTMLSpanElement>(null);
  const realBloomRef = useRef<HTMLSpanElement>(null);

  const pointerRef = useRef<PointerState>({ x: -1, y: -1, inside: false });
  const rippleRef = useRef<RippleState>({ active: false, t: 0, x: 0, y: 0 });
  const containerRectRef = useRef<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: 1,
    height: 1,
  });
  const nearAmountRef = useRef(0);
  const skyDimRef = useRef(0);
  const isVisibleRef = useRef(true);

  const [discovered, setDiscovered] = useState(false);

  // Resize & Bounding Rect Observer (sin getBoundingClientRect en mousemove)
  useEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const updateDimensions = () => {
      const rect = el.getBoundingClientRect();
      containerRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width || 1,
        height: rect.height || 1,
      };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((rect.width || 1) * dpr);
      canvas.height = Math.round((rect.height || 1) * dpr);
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const triggerStarDiscovery = useCallback(() => {
    setDiscovered(true);
    rippleRef.current = {
      active: true,
      t: 0,
      x: realStar.x,
      y: realStar.y,
    };
    skyDimRef.current = 0.6;
  }, [realStar.x, realStar.y]);

  // Canvas 2D Loop con Auto-Pausa via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let rafId = 0;
    let last = performance.now();
    let isRunning = false;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const render = (now: number) => {
      if (!isVisibleRef.current) {
        isRunning = false;
        return;
      }

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const { width: w, height: h } = containerRectRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ptr = pointerRef.current;
      const px = ptr.inside ? ptr.x / w : -1;
      const py = ptr.inside ? ptr.y / h : -1;

      const rx = realStar.x;
      const ry = realStar.y;
      let distToReal = 1;
      if (ptr.inside) {
        const dx = px - rx;
        const dy = py - ry;
        distToReal = Math.sqrt(dx * dx + dy * dy);
      }

      const nearT = ptr.inside ? clamp(1 - distToReal / NEAR_RADIUS, 0, 1) : 0;
      nearAmountRef.current += (nearT - nearAmountRef.current) * 0.08;

      if (!discovered && ptr.inside && distToReal < HOVER_RADIUS) {
        triggerStarDiscovery();
      }

      if (rippleRef.current.active) {
        rippleRef.current.t += dt;
        if (rippleRef.current.t > RIPPLE_DURATION) {
          rippleRef.current.active = false;
        }
      }

      if (skyDimRef.current > 0) {
        skyDimRef.current = Math.max(0, skyDimRef.current - dt * 0.35);
      }

      if (realCoreRef.current && realBloomRef.current) {
        const glow = nearAmountRef.current;
        const scale = 1 + glow * 0.2;
        realCoreRef.current.style.transform = `scale(${scale})`;
        realCoreRef.current.style.opacity = String(0.75 + glow * 0.25);
        realBloomRef.current.style.opacity = String(0.35 + glow * 0.55);
        realBloomRef.current.style.transform = `scale(${0.8 + glow * 0.6})`;
      }

      // Limpiar lienzo
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nearAmt = nearAmountRef.current;
      const time = now / 1000;
      const rippleActive = rippleRef.current.active;
      const rippleTime = rippleRef.current.t;
      const rippleX = rippleRef.current.x;
      const rippleY = rippleRef.current.y;
      const rippleRadius = rippleTime * 0.65;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!star || star.isReal) continue;

        let opacity = star.baseOpacity;
        if (!reduceMotion) {
          const twinkle =
            0.5 +
            0.5 *
              Math.sin(
                time * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase
              );
          opacity *= twinkle;
        }

        let sx = star.x * w;
        let sy = star.y * h;
        let sSize = star.size;

        if (ptr.inside && interactive && !reduceMotion) {
          const dx = star.x - px;
          const dy = star.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = clamp(1 - dist / PARALLAX_RADIUS, 0, 1);

          if (dist > 0.001) {
            const parallax = influence * PARALLAX_STRENGTH;
            sx += (dx / dist) * parallax;
            sy += (dy / dist) * parallax;
          }

          opacity *= 1 + influence * 0.6;
          sSize *= 1 + influence * 0.15;

          if (nearAmt > 0) {
            const toReal = Math.hypot(star.x - rx, star.y - ry);
            if (toReal < NEAR_DIM_RADIUS) {
              opacity *= 1 - nearAmt * 0.5 * (1 - toReal / NEAR_DIM_RADIUS);
            }
          }
        }

        if (rippleActive) {
          const toRipple = Math.hypot(star.x - rippleX, star.y - rippleY);
          const ring = Math.abs(toRipple - rippleRadius);
          if (ring < 0.05) {
            opacity *=
              1 + (1 - ring / 0.05) * 1.2 * (1 - rippleTime / RIPPLE_DURATION);
          } else if (toRipple < rippleRadius) {
            opacity *= 0.8 + 0.2 * (rippleTime / RIPPLE_DURATION);
          }
        }

        const finalOpacity = clamp(opacity, 0.04, 1);
        const radius = (sSize / 2) * dpr;
        const posX = sx * dpr;
        const posY = sy * dpr;

        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;

        if (sSize > 1.8) {
          // Destello cálido para estrellas más brillantes
          ctx.beginPath();
          ctx.arc(posX, posY, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // fillRect ultra-rápido para estrellas pequeñas de 1-2px (10x más rápido que arc)
          ctx.fillRect(posX - radius, posY - radius, radius * 2, radius * 2);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    // Auto-Pausa inteligente con IntersectionObserver
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry?.isIntersecting ?? false;

        if (isVisibleRef.current && !wasVisible && !isRunning) {
          last = performance.now();
          isRunning = true;
          rafId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.01 }
    );

    io.observe(container);

    if (isVisibleRef.current) {
      isRunning = true;
      rafId = requestAnimationFrame(render);
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
      isRunning = false;
    };
  }, [stars, realStar, reduceMotion, interactive, discovered, triggerStarDiscovery]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRectRef.current;
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inside: true,
    };
  }, []);

  const onPointerLeave = useCallback(() => {
    pointerRef.current = { x: -1, y: -1, inside: false };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={reduceMotion ? undefined : onPointerMove}
      onPointerLeave={reduceMotion ? undefined : onPointerLeave}
      className={cn(
        'absolute inset-0 overflow-hidden select-none pointer-events-auto transform-gpu',
        'bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(245,158,11,0.08),transparent_55%),linear-gradient(165deg,rgba(11,15,25,0.98),rgba(4,5,10,1))]',
        className
      )}
      aria-hidden="true"
    >
      {/* Atmosphere Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 contain-paint"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(234,88,12,0.06), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(245,158,11,0.04), transparent 60%)',
        }}
      />

      {/* Canvas Starfield (Cero elementos DOM, 60 FPS nativo) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full block"
      />

      {/* Real Cosmic Star (Pulsing Golden Star Interactive) */}
      <button
        ref={realStarRef}
        type="button"
        tabIndex={-1}
        aria-label="Cosmic Star"
        onClick={triggerStarDiscovery}
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none cursor-pointer group transform-gpu"
        style={{
          left: `${realStar.x * 100}%`,
          top: `${realStar.y * 100}%`,
          width: 32,
          height: 32,
        }}
      >
        {/* Core */}
        <motion.span
          ref={realCoreRef}
          className="absolute inset-0 m-auto block rounded-full will-change-transform"
          style={{
            width: realStar.size + 1.5,
            height: realStar.size + 1.5,
            background:
              'radial-gradient(circle, rgba(255,248,230,1) 0%, rgba(251,191,36,0.95) 45%, rgba(234,88,12,0.8) 75%)',
            boxShadow: '0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(234,88,12,0.5)',
          }}
          animate={
            reduceMotion
              ? { scale: 1, opacity: 0.9 }
              : { scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Bloom Halo */}
        <motion.span
          ref={realBloomRef}
          className="pointer-events-none absolute inset-0 m-auto rounded-full will-change-transform"
          style={{
            width: 44,
            height: 44,
            background:
              'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(234,88,12,0.15) 50%, transparent 70%)',
          }}
          animate={
            reduceMotion
              ? { opacity: 0.5, scale: 1.1 }
              : { opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.3, 0.9] }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </button>

      {/* Ambient Vignette & Edge Shadow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 120px rgba(0,0,0,0.7), inset 0 0 1px rgba(255,255,255,0.03)',
        }}
      />
    </div>
  );
};

export default HeroSkyBackground;
