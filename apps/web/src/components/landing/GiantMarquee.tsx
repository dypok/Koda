'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getLenisInstance } from '@/lib/scroll';

const WORDS = ['APRENDE', 'PRACTICA', 'DOMINA'];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex shrink-0 items-center">
          <span className="font-display text-6xl sm:text-8xl font-black tracking-tight text-transparent whitespace-nowrap [-webkit-text-stroke:1px_rgba(245,158,11,0.35)]">
            {w}
          </span>
          <span aria-hidden="true" className="mx-6 h-3 w-3 rounded-full bg-amber-400/60 shrink-0" />
        </span>
      ))}
    </div>
  );
}

/** Banda tipográfica gigante que acelera con la velocidad del scroll. */
export const GiantMarquee: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    if (reduceMotion || !trackRef.current) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const velocity = Math.abs(getLenisInstance()?.velocity ?? 0);
      const boost = Math.min(6, velocity * 0.35);
      xRef.current -= (30 + boost * 60) * dt;
      const half = (trackRef.current?.scrollWidth ?? 0) / 2;
      if (half > 0 && -xRef.current >= half) xRef.current += half;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  return (
    <div aria-label="Aprende, practica, domina" className="relative overflow-hidden border-y border-slate-900/80 bg-slate-950 py-6 sm:py-8 select-none">
      <div ref={trackRef} className="flex w-max will-change-transform">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
};

export default GiantMarquee;
