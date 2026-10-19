'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export type KodaMascotState =
  | 'idle'
  | 'sad'
  | 'thinking'
  | 'streak_lost'
  | 'streak_active';

export const KODA_MASCOT_PATHS: Record<KodaMascotState, string> = {
  idle: '/brand/mascot/koda-idle.svg',
  sad: '/brand/mascot/koda-sad.svg',
  thinking: '/brand/mascot/koda-thinking.svg',
  streak_lost: '/brand/mascot/koda-streak-lost.svg',
  streak_active: '/brand/mascot/koda-streak-active.svg',
};

const DEFAULT_ALTS: Record<KodaMascotState, string> = {
  idle: 'Koda, la mascota oficial de Koda Academy',
  sad: 'Koda con expresion de tristeza por un tropiezo o error',
  thinking: 'Koda evaluando y analizando con atencion',
  streak_lost: 'Koda triste con llama apagada por racha interrumpida',
  streak_active: 'Koda triunfante con ojos brillantes y llama de racha encendida',
};

export interface KodaMascotProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
  state?: KodaMascotState;
  alt?: string;
  size?: number;
  width?: number;
  height?: number;
  animate?: 'float' | 'bounce' | 'pulse' | 'none';
  glow?: boolean;
}

export const KodaMascot: React.FC<KodaMascotProps> = ({
  state = 'idle',
  alt,
  size = 128,
  width,
  height,
  animate = 'none',
  glow = false,
  className,
  fill = false,
  priority = false,
  ...restProps
}) => {
  const src = KODA_MASCOT_PATHS[state] || KODA_MASCOT_PATHS.idle;
  const resolvedAlt = alt || DEFAULT_ALTS[state] || DEFAULT_ALTS.idle;

  const animationClass = (() => {
    switch (animate) {
      case 'float':
        return 'animate-float motion-reduce:animate-none';
      case 'bounce':
        return 'animate-bounce motion-reduce:animate-none';
      case 'pulse':
        return 'animate-pulse motion-reduce:animate-none';
      default:
        return '';
    }
  })();

  const glowClass = (() => {
    if (!glow) return '';
    switch (state) {
      case 'streak_active':
        return 'drop-shadow-[0_12px_36px_rgba(245,158,11,0.45)]';
      case 'sad':
      case 'streak_lost':
        return 'drop-shadow-[0_12px_32px_rgba(56,189,248,0.30)]';
      case 'thinking':
        return 'drop-shadow-[0_12px_32px_rgba(168,85,247,0.30)]';
      default:
        return 'drop-shadow-[0_12px_32px_rgba(249,115,22,0.35)]';
    }
  })();

  if (fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        priority={priority}
        className={cn('object-contain select-none', animationClass, glowClass, className)}
        {...restProps}
      />
    );
  }

  const finalWidth = width ?? size;
  const finalHeight = height ?? size;

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      width={finalWidth}
      height={finalHeight}
      priority={priority}
      className={cn('object-contain select-none', animationClass, glowClass, className)}
      style={{ width: finalWidth, height: 'auto', ...restProps.style }}
      {...restProps}
    />
  );
};

export default KodaMascot;
