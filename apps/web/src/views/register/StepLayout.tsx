'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

interface StepLayoutProps {
  title: string;
  subtitle: string;
  groupLabel: string;
  kodaSay?: string;
  children: React.ReactNode;
}

/** Armazón común de paso: Koda + título + subtítulo vivo + radiogroup con stagger. */
export const StepLayout: React.FC<StepLayoutProps> = ({ title, subtitle, groupLabel, kodaSay, children }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-4 text-left">
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16">
            <Image
              src="/brand/koda-mascot-cartoon-2d.svg"
              alt="Koda, tu guía de registro"
              width={64}
              height={64}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          {kodaSay && (
            <span aria-hidden="true" className="mt-1 max-w-[120px] rounded-xl rounded-tl-sm border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-center text-[10px] font-bold leading-tight text-amber-200">
              {kodaSay}
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p aria-live="polite" className="text-xs sm:text-sm text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <motion.div
        role="radiogroup"
        aria-label={groupLabel}
        layout
        initial="hidden"
        animate="show"
        variants={reduceMotion ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-col gap-3.5"
      >
        {React.Children.map(children, (child) => (
          <motion.div
            layout
            variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StepLayout;
