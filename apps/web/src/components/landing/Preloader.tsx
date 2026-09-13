'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'koda-preloaded';
const RING = 2 * Math.PI * 44;

/** Preloader cinematográfico: anillo que se dibuja + contador + wipe. 1x por sesión. */
export const Preloader: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let skip = false;
    try {
      skip = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      skip = false;
    }
    if (skip) return;
    setShow(true);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1200);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem(SESSION_KEY, '1');
          } catch {
            // sin sesión, se repite la próxima visita
          }
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => setShow(false), 2500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-label="Cargando Koda"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-5 bg-slate-950"
        >
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="5" />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={RING}
                initial={{ strokeDashoffset: RING }}
                animate={{ strokeDashoffset: RING - (RING * count) / 100 }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </svg>
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-2xl font-black text-white tabular-nums">
              {count}
            </span>
          </div>
          <p className="font-display text-lg font-bold text-amber-300">Encendiendo tu racha…</p>
          <p className="font-mono text-2xl font-black text-white" aria-hidden="true">
            k<span className="text-amber-400">{'{ }'}</span>da
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
