'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

// Elipses aproximadas de masa continental en grid 60x30 (x: 0-60, y: 0-30)
const LAND = [
  // Norteamérica
  { cx: 11, cy: 8, rx: 7, ry: 4.5 }, { cx: 13, cy: 14, rx: 4, ry: 4 },
  // Sudamérica
  { cx: 17, cy: 21, rx: 3.5, ry: 5 },
  // Europa
  { cx: 30, cy: 7, rx: 4, ry: 3 },
  // África
  { cx: 30, cy: 15, rx: 4, ry: 5.5 },
  // Asia
  { cx: 42, cy: 8, rx: 9, ry: 4.5 }, { cx: 44, cy: 15, rx: 4, ry: 3.5 },
  // Oceanía
  { cx: 53, cy: 22, rx: 3.5, ry: 2.5 },
];

const HOTSPOTS = [
  { x: 10, y: 9 }, { x: 14, y: 16 }, { x: 17, y: 22 }, { x: 29, y: 7 },
  { x: 30, y: 13 }, { x: 31, y: 18 }, { x: 38, y: 8 }, { x: 45, y: 10 },
  { x: 46, y: 16 }, { x: 53, y: 22 }, { x: 12, y: 12 }, { x: 41, y: 13 },
];

function isLand(x: number, y: number): boolean {
  return LAND.some(({ cx, cy, rx, ry }) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);
}

/** Mapa de rachas mundial: puntos que pulsan + contador de activos. */
export const WorldMap: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [online, setOnline] = useState(2431);
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.st-hotspot',
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const dots = useMemo(() => {
    const out: { x: number; y: number; hot: boolean }[] = [];
    for (let gx = 0; gx < 60; gx++) {
      for (let gy = 0; gy < 30; gy++) {
        if (isLand(gx, gy)) {
          const hot = HOTSPOTS.some((h) => Math.abs(h.x - gx) < 1.6 && Math.abs(h.y - gy) < 1.6);
          out.push({ x: gx, y: gy, hot });
        }
      }
    }
    return out;
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setOnline((n) => Math.max(2300, n + Math.round((Math.random() - 0.45) * 14)));
    }, 2800);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} id="mapa" aria-labelledby="mapa-title" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-2xl mx-auto mb-10"
        >
          <h2 id="mapa-title" className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
            El mundo <span className="text-amber-400">no duerme</span>, programa
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            <span className="font-display font-black text-white tabular-nums" aria-live="off">
              {online.toLocaleString('es')}
            </span>{' '}
            estudiantes practicando ahora mismo.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          role="img"
          aria-label="Mapa mundial de puntos con focos de estudiantes activos en América, Europa, África, Asia y Oceanía"
          className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6"
        >
          <svg viewBox="0 0 60 30" className="w-full h-auto" aria-hidden="true">
            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.hot ? 0.55 : 0.32}
                fill={d.hot ? '#f59e0b' : '#334155'}
                opacity={d.hot ? 1 : 0.7}
                className={d.hot ? 'st-hotspot' : undefined}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default WorldMap;
