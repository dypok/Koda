'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
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

type CardSize = {
  width: number;
  height: number;
};

const STAR_COUNT_DEFAULT = 240;
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
      size: isReal ? 3.6 : 0.75 + rand() * 1.6,
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
  const count = clamp(Math.round(starCount), 120, 350);

  const { stars, realStar } = useMemo(
    () => generateStars(count, seed),
    [count, seed]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const starElsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const realStarRef = useRef<HTMLButtonElement>(null);
  const realCoreRef = useRef<HTMLSpanElement>(null);
  const realBloomRef = useRef<HTMLSpanElement>(null);

  const pointerRef = useRef<PointerState>({ x: -1, y: -1, inside: false });
  const rippleRef = useRef<RippleState>({ active: false, t: 0, x: 0, y: 0 });
  const containerSizeRef = useRef<CardSize>({ width: 1, height: 1 });
  const nearAmountRef = useRef(0);
  const skyDimRef = useRef(0);

  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      containerSizeRef.current = {
        width: rect.width || 1,
        height: rect.height || 1,
      };
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
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

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let last = performance.now();
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const { width: w, height: h } = containerSizeRef.current;
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

      const dim = skyDimRef.current;
      if (atmosphereRef.current) {
        atmosphereRef.current.style.opacity = String(1 - dim * 0.25);
      }
      if (skyRef.current) {
        skyRef.current.style.opacity = String(1 - dim * 0.15);
      }

      if (realCoreRef.current && realBloomRef.current) {
        const glow = nearAmountRef.current;
        const scale = 1 + glow * 0.2;
        realCoreRef.current.style.transform = `scale(${scale})`;
        realCoreRef.current.style.opacity = String(0.75 + glow * 0.25);
        realBloomRef.current.style.opacity = String(0.35 + glow * 0.55);
        realBloomRef.current.style.transform = `scale(${0.8 + glow * 0.6})`;
      }

      const nearAmt = nearAmountRef.current;
      const time = now / 1000;
      const els = starElsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!star || star.isReal) continue;
        const el = els[i];
        if (!el) continue;

        const twinkle =
          0.5 +
          0.5 *
            Math.sin(
              time * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase
            );
        let opacity = star.baseOpacity * twinkle;
        let tx = 0;
        let ty = 0;
        let scale = 1;

        if (ptr.inside && interactive) {
          const dx = star.x - px;
          const dy = star.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = clamp(1 - dist / PARALLAX_RADIUS, 0, 1);

          if (dist > 0.001) {
            const parallax = influence * PARALLAX_STRENGTH;
            tx = (dx / dist) * parallax;
            ty = (dy / dist) * parallax;
          }

          opacity *= 1 + influence * 0.6;
          scale = 1 + influence * 0.15;

          if (nearAmt > 0) {
            const toReal = Math.hypot(star.x - rx, star.y - ry);
            if (toReal < NEAR_DIM_RADIUS) {
              opacity *= 1 - nearAmt * 0.5 * (1 - toReal / NEAR_DIM_RADIUS);
            }
          }
        }

        if (rippleRef.current.active) {
          const rt = rippleRef.current.t;
          const radius = rt * 0.65;
          const toRipple = Math.hypot(
            star.x - rippleRef.current.x,
            star.y - rippleRef.current.y
          );
          const ring = Math.abs(toRipple - radius);
          if (ring < 0.05) {
            opacity *=
              1 + (1 - ring / 0.05) * 1.2 * (1 - rt / RIPPLE_DURATION);
          } else if (toRipple < radius) {
            opacity *= 0.8 + 0.2 * (rt / RIPPLE_DURATION);
          }
        }

        el.style.opacity = String(clamp(opacity, 0.04, 1));
        el.style.transform = `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) scale(${scale})`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [stars, realStar, reduceMotion, interactive, discovered, triggerStarDiscovery]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      containerSizeRef.current = {
        width: rect.width || 1,
        height: rect.height || 1,
      };
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        inside: true,
      };
    },
    []
  );

  const onPointerLeave = useCallback(() => {
    pointerRef.current = { x: -1, y: -1, inside: false };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={reduceMotion ? undefined : onPointerMove}
      onPointerLeave={reduceMotion ? undefined : onPointerLeave}
      className={cn(
        'absolute inset-0 overflow-hidden select-none pointer-events-auto',
        'bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(245,158,11,0.08),transparent_55%),linear-gradient(165deg,rgba(11,15,25,0.98),rgba(4,5,10,1))]',
        className
      )}
      aria-hidden="true"
    >
      {/* Atmosphere Glow */}
      <div
        ref={atmosphereRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(234,88,12,0.06), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(245,158,11,0.04), transparent 60%)',
        }}
      />

      {/* Background Starfield */}
      <div
        ref={skyRef}
        className="pointer-events-none absolute inset-0"
      >
        {stars.map((star, i) => {
          if (star.isReal) return null;
          return (
            <span
              key={star.id}
              ref={(el) => {
                starElsRef.current[i] = el;
              }}
              className="absolute rounded-full bg-white will-change-transform"
              style={{
                left: `${star.x * 100}%`,
                top: `${star.y * 100}%`,
                width: star.size,
                height: star.size,
                opacity: reduceMotion ? star.baseOpacity : star.baseOpacity * 0.7,
                transform: 'translate3d(-50%, -50%, 0)',
                boxShadow:
                  star.size > 1.8
                    ? `0 0 ${star.size * 1.8}px rgba(254,240,138,0.4)`
                    : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Real Cosmic Star (Pulsing Golden Star) */}
      <button
        ref={realStarRef}
        type="button"
        tabIndex={-1}
        aria-label="Cosmic Star"
        onClick={triggerStarDiscovery}
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none cursor-pointer group"
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
            filter: 'blur(4px)',
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
