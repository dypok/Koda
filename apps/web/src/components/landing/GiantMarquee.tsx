'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getLenisInstance } from '@/lib/scroll';
import { reveal } from '@/lib/reveal';

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

/** Banda tipográfica gigante que acelera con la velocidad del scroll. Pausa su rAF fuera de pantalla. */
export const GiantMarquee: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const skewRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (reduceMotion || !wrap || !track) return;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let half = track.scrollWidth / 2;

    const ro = new ResizeObserver(() => {
      if (trackRef.current) half = trackRef.current.scrollWidth / 2;
    });
    ro.observe(track);

    const loop = (now: number) => {
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const vel = getLenisInstance()?.velocity ?? 0;
      const velocity = Math.abs(vel);
      const boost = Math.min(6, velocity * 0.35);
      xRef.current -= (30 + boost * 60) * dt;
      if (half > 0 && -xRef.current >= half) xRef.current += half;
      const targetSkew = Math.max(-6, Math.min(6, vel * 0.25));
      skewRef.current += (targetSkew - skewRef.current) * 0.08;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0) skewX(${skewRef.current}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const isNowVisible = entry?.isIntersecting ?? false;
        if (isNowVisible && !visible) {
          visible = true;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!isNowVisible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduceMotion]);

  return (
    <motion.div
      ref={wrapRef}
      {...reveal(reduceMotion, { variant: 'fade' })}
      aria-label="Aprende, practica, domina"
      className="relative overflow-hidden border-y border-slate-900/80 bg-slate-950 py-6 sm:py-8 select-none contain-paint"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <Row />
        <Row hidden />
      </div>
    </motion.div>
  );
};

export default GiantMarquee;
