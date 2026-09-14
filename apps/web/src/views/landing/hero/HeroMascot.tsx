import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame, LightningA } from '@phosphor-icons/react';
import { TerminalBadge } from '@/components/landing/TerminalBadge';

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
        <Image
          src="/brand/koda-mascot-cartoon-2d-transparent.png"
          alt="Koda — Mascota Oficial KodaAcademy"
          width={420}
          height={420}
          style={{ width: 'auto', height: 'auto' }}
          className="relative z-10 max-h-[200px] sm:max-h-[280px] lg:max-h-[320px] object-contain animate-float select-none transform-gpu will-change-transform drop-shadow-[0_20px_45px_rgba(249,115,22,0.35)]"
          priority
        />
        <div className="absolute -left-1 top-6 sm:left-2">
          <TerminalBadge
            tone="emerald"
            prefix="$"
            text="+10 XP"
            icon={<LightningA aria-hidden="true" className="h-3.5 w-3.5" weight="fill" />}
          />
        </div>
        <div className="absolute -right-1 bottom-8 sm:right-2">
          <TerminalBadge
            tone="amber"
            prefix=">"
            text="racha_diaria --on"
            icon={<Flame aria-hidden="true" className="h-3.5 w-3.5" weight="fill" />}
          />
        </div>
      </div>
      <p className="mt-3 text-xs sm:text-sm text-slate-400">
        Koda te acompaña: celebra tus aciertos y te da pistas sin spoilers.
      </p>
    </motion.div>
  );
};
