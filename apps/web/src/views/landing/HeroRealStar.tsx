import React from 'react';
import { motion } from 'framer-motion';
import { StarData } from '@/models/landing/hero-sky.model';

interface HeroRealStarProps {
  realStar: StarData;
  realCoreRef: React.RefObject<HTMLSpanElement | null>;
  realBloomRef: React.RefObject<HTMLSpanElement | null>;
  reduceMotion: boolean | null;
  onDiscover: () => void;
}

export const HeroRealStar: React.FC<HeroRealStarProps> = ({
  realStar,
  realCoreRef,
  realBloomRef,
  reduceMotion,
  onDiscover,
}) => (
  <button
    type="button"
    tabIndex={-1}
    aria-hidden="true"
    title="Estrella cósmica de Koda"
    onClick={onDiscover}
    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none cursor-pointer group transform-gpu"
    style={{
      left: `${realStar.x * 100}%`,
      top: `${realStar.y * 100}%`,
      width: 32,
      height: 32,
    }}
  >
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
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    />

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
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  </button>
);
