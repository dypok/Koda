'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useElementVisible } from '@/lib/pixi/engine';
import { createEngine } from '@/views/roadmap/route-lab/bg-lab/ascii-engines';

/** Fondo del roadmap: órbita kepleriana + espiral ASCII en un solo canvas contenido. */
export const OrbitFieldBackground: React.FC<{ className?: string }> = ({ className }) => {
  const reduceMotion = useReducedMotion();
  const [mountRef, visible] = useElementVisible<HTMLDivElement>();
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mount.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let engine = createEngine('kepler-spiral', ctx, 1, 1);
    const fit = () => {
      const r = mount.getBoundingClientRect();
      const W = Math.max(1, Math.round(r.width));
      const H = Math.max(1, Math.round(r.height));
      canvas.width = W;
      canvas.height = H;
      engine = createEngine('kepler-spiral', ctx, W, H);
      engine.frame(0, 0);
    };
    fit();

    if (reduceMotion) return () => canvas.remove();

    let raf = 0;
    let running = false;
    let last = performance.now();
    const loop = (now: number) => {
      if (!visibleRef.current) {
        running = false;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      engine.frame(now / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!running && visibleRef.current) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    kick();
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) kick();
    });
    io.observe(mount);
    window.addEventListener('resize', fit);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', fit);
      canvas.remove();
    };
  }, [reduceMotion, mountRef]);

  if (reduceMotion) return null;

  return (
    <div ref={mountRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} />
  );
};

export default OrbitFieldBackground;
