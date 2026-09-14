'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

/** Onda + cortina ámbar que barre revelando la siguiente sección. */
export const WaveDivider: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.st-wipe-curtain',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: 0.4 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="relative h-16 sm:h-20 overflow-hidden bg-slate-950 select-none">
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
      {!reduceMotion && (
        <div className="st-wipe-curtain absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[linear-gradient(to_right,transparent,rgba(245,158,11,0.7),transparent)] will-change-transform" />
      )}
    </div>
  );
};

export default WaveDivider;
