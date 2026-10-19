import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { KodaMascot } from '@/components/brand/KodaMascot';

export const HeroMascot: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 25 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center transform-gpu"
    >
      <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full bg-amber-500/15 blur-3xl"
        />
        <KodaMascot
          state="idle"
          size={320}
          animate="float"
          glow
          priority
          className="relative z-10 max-h-[200px] sm:max-h-[280px] lg:max-h-[320px] transform-gpu will-change-transform"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -left-1 top-6 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:left-2">
          +10 XP
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -right-1 bottom-8 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:right-2">
          racha_diaria
        </div>
      </div>
      <p className="mt-3 text-xs sm:text-sm text-slate-300">
        Koda te acompaña: celebra tus aciertos y te da pistas sin spoilers.
      </p>
    </motion.div>
  );
};
