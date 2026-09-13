'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type WeatherType = 'embers' | 'fireflies' | 'dust';

const PRESETS: Record<WeatherType, { cls: string; color: string; shadow: string; dur: [number, number] }> = {
  embers: { cls: 'wx-rise', color: '#fb923c', shadow: '0 0 8px #f97316', dur: [4, 7] },
  fireflies: { cls: 'wx-drift', color: '#4ade80', shadow: '0 0 8px #22c55e', dur: [5, 8] },
  dust: { cls: 'wx-float', color: '#fbbf24', shadow: '0 0 6px #f59e0b', dur: [6, 9] },
};

interface Particle {
  left: number;
  size: number;
  delay: number;
  dur: number;
}

/** Clima ambiental por sección: solo vive mientras es visible (máx 14 partículas). */
export const WeatherLayer: React.FC<{ type: WeatherType; count?: number; className?: string }> = ({
  type,
  count = 12,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.1 });
  const [seen, setSeen] = useState(false);
  if (inView && !seen) setSeen(true);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: Math.min(14, count) }).map(() => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 6,
        dur: PRESETS[type].dur[0] + Math.random() * (PRESETS[type].dur[1] - PRESETS[type].dur[0]),
      })),
    [count, type]
  );

  if (reduceMotion) return null;

  const preset = PRESETS[type];
  return (
    <div ref={ref} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none', className)}>
      {seen &&
        particles.map((p, i) => (
          <span
            key={i}
            className={cn('absolute bottom-0 rounded-full', preset.cls)}
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: preset.color,
              boxShadow: preset.shadow,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
    </div>
  );
};

export default WeatherLayer;
