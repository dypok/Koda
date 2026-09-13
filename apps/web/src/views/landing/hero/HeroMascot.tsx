import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export const HeroMascot: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 25 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="order-first lg:order-none lg:col-span-5 flex flex-col items-center justify-center transform-gpu"
    >
      <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full bg-amber-500/15 blur-3xl"
        />
        <Image
          src="/brand/koda-mascot-cartoon-2d-transparent.png"
          alt="Koda — Mascota Oficial KodaAcademy"
          width={420}
          height={420}
          style={{ width: 'auto', height: 'auto' }}
          className="relative z-10 max-h-[200px] sm:max-h-[280px] lg:max-h-[320px] object-contain animate-float select-none transform-gpu will-change-transform drop-shadow-[0_20px_45px_rgba(249,115,22,0.35)]"
          priority
        />
        <div
          aria-hidden="true"
          className="absolute -left-1 top-6 sm:left-2 rounded-full border border-emerald-400/30 bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur"
        >
          +10 XP
        </div>
        <div
          aria-hidden="true"
          className="absolute -right-1 bottom-8 sm:right-2 rounded-full border border-amber-400/30 bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur"
        >
          🔥 racha diaria
        </div>
      </div>
      <p className="mt-3 text-xs sm:text-sm text-slate-400">
        Koda te acompaña: celebra tus aciertos y te da pistas sin spoilers.
      </p>
    </motion.div>
  );
};
