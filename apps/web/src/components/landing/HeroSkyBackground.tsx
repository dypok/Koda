'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useHeroSkyController } from '@/controllers/landing/useHeroSkyController';
import { HeroRealStar } from '@/views/landing/HeroRealStar';

export interface HeroSkyBackgroundProps {
  className?: string;
  starCount?: number;
  seed?: number;
  interactive?: boolean;
}

export const HeroSkyBackground: React.FC<HeroSkyBackgroundProps> = ({
  className,
  starCount,
  seed,
  interactive = true,
}) => {
  const {
    containerRef,
    canvasRef,
    realCoreRef,
    realBloomRef,
    glowRef,
    realStar,
    reduceMotion,
    discovered,
    triggerStarDiscovery,
    onPointerMove,
    onPointerLeave,
  } = useHeroSkyController(starCount, seed, interactive);

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
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 contain-paint"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(234,88,12,0.06), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(245,158,11,0.04), transparent 60%)',
        }}
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full block"
      />

      {!reduceMotion && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden [@media(pointer:fine)]:block h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.10)_0%,transparent_70%)] will-change-transform"
        />
      )}

      <HeroRealStar
        realStar={realStar}
        realCoreRef={realCoreRef}
        realBloomRef={realBloomRef}
        reduceMotion={reduceMotion}
        discovered={discovered}
        onDiscover={triggerStarDiscovery}
      />

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
