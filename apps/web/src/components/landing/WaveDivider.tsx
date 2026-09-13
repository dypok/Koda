'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';

/** Onda ámbar que respira entre secciones, en vez de un border plano. */
export const WaveDivider: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="relative h-16 sm:h-20 overflow-hidden bg-slate-950 select-none">
      <svg
        className={`absolute bottom-0 left-0 w-[200%] h-full ${reduceMotion ? '' : 'koda-wave'}`}
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 48 C 240 20, 480 20, 720 48 S 1200 76, 1440 48 S 1920 20, 2160 48 S 2640 76, 2880 48"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="1.5"
        />
        <path
          d="M0 58 C 240 34, 480 34, 720 58 S 1200 82, 1440 58 S 1920 34, 2160 58 S 2640 82, 2880 58"
          stroke="rgba(249,115,22,0.18)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
