'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/** Tu primera semana con Koda: 7 llamas que se encienden al entrar en viewport. */
export const StreakPreview: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Simulación: racha de 7 días encendida, protegida por un freeze"
      className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Tu primera semana
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[11px] font-bold text-sky-300" title="El freeze guarda tu racha si fallas un día">
          <Shield aria-hidden="true" className="w-3.5 h-3.5" />
          freeze ×1
        </span>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {DAYS.map((day, i) => (
          <motion.div
            key={day}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0.25, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.18, type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border',
                'border-orange-400/40 bg-orange-500/15'
              )}
            >
              <Flame aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" />
            </span>
            <span className="text-[11px] font-bold text-slate-400">{day}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs sm:text-sm text-slate-400">
        15 minutos al día y Koda prende tu racha. <span className="text-amber-300 font-semibold">Día 7: cofre bonus.</span>
      </p>
    </div>
  );
};

export default StreakPreview;
