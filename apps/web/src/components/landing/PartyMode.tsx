'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Confetti, X } from '@phosphor-icons/react';
import { sound } from '@/lib/sound';
import { KodaMascot } from '@/components/brand/KodaMascot';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];

/** Easter egg konami: 30s de fiesta global. */
export const PartyMode: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      setProgress((p) => {
        const next = e.key === KONAMI[p] ? p + 1 : e.key === KONAMI[0] ? 1 : 0;
        if (next === KONAMI.length) {
          setActive(true);
          sound.party();
          timer = setTimeout(() => setActive(false), 30000);
          return 0;
        }
        return next;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    document.body.classList.toggle('koda-party', active);
    return () => document.body.classList.remove('koda-party');
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          role="status"
          className="fixed bottom-20 right-4 z-50 flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-slate-950/95 backdrop-blur px-4 py-3 shadow-2xl"
        >
          <KodaMascot state="streak_active" size={32} animate="bounce" />
          <div>
            <p className="text-sm font-black text-amber-300">MODO FIESTA</p>
            <p className="text-xs text-slate-400">Koda celebra contigo · 30s</p>
          </div>
          <button
            type="button"
            onClick={() => setActive(false)}
            aria-label="Terminar modo fiesta"
            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
          <Confetti aria-hidden="true" className="w-5 h-5 text-amber-400 absolute -top-2 -right-2" />
          <span className="sr-only">Secuencia konami {progress} de {KONAMI.length}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PartyMode;
