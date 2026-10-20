'use client';

import React, { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isLowEndDevice, saveDataMode } from '@/lib/pixi/engine';

export type WeatherType = 'embers' | 'fireflies' | 'dust';

const PRESETS: Record<WeatherType, { color: string; animClass: string }> = {
  embers: { color: 'rgba(251, 146, 60, 0.75)', animClass: 'wx-rise' },
  fireflies: { color: 'rgba(74, 222, 128, 0.7)', animClass: 'wx-drift' },
  dust: { color: 'rgba(251, 191, 36, 0.55)', animClass: 'wx-float' },
};

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
}

/** Clima ambiental ligero en CSS puro (0 contextos WebGL extra): se desactiva en gama baja o ahorro de datos. */
export const WeatherLayer: React.FC<{ type: WeatherType; count?: number; className?: string }> = ({
  type,
  count = 8,
  className,
}) => {
  const reduceMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    if (typeof window !== 'undefined' && (isLowEndDevice() || saveDataMode())) return [];
    const safeCount = Math.min(8, count);
    return Array.from({ length: safeCount }).map((_, i) => ({
      id: i,
      left: `${((i * 37 + 13) % 88) + 6}%`,
      top: `${((i * 53 + 19) % 80) + 10}%`,
      size: 3 + (i % 3),
      delay: `${(i * 0.7).toFixed(1)}s`,
      duration: `${5 + (i % 4)}s`,
    }));
  }, [count]);

  if (reduceMotion || particles.length === 0) return null;

  const preset = PRESETS[type];

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none contain-strict', className)}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={cn('absolute rounded-full', preset.animClass)}
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: preset.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default WeatherLayer;
