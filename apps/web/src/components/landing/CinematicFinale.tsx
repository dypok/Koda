'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { TransitionLink } from '@/components/ui/transition-link';
import { Magnetic } from '@/components/ui/magnetic';
import { SplitText } from '@/components/ui/split-text';
import { ArrowRight } from 'lucide-react';

/** Cierre de película: negro total, frase letra por letra, Koda y un solo CTA. */
export const CinematicFinale: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="finale-title" className="relative overflow-hidden bg-black py-28 md:py-40 border-t border-slate-900">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.10)_0%,transparent_70%)] pointer-events-none" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8 relative z-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Image
            src="/brand/koda-mascot-cartoon-2d-transparent.png"
            alt=""
            width={168}
            height={168}
            className="object-contain animate-float select-none drop-shadow-[0_16px_40px_rgba(249,115,22,0.35)]"
          />
        </motion.div>

        <h2
          id="finale-title"
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]"
        >
          <SplitText text="Tu racha empieza hoy." mode="words" stagger={0.06} />
        </h2>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center pt-2"
        >
          <Magnetic className="w-full sm:w-auto">
            <TransitionLink
              href="/register"
              aria-label="Empezar mi racha gratis en Koda"
              className="group relative inline-flex min-h-[64px] w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-amber-400 px-10 py-4 text-lg font-black text-slate-950 transition-all hover:bg-amber-300"
            >
              {!reduceMotion && (
                <span aria-hidden="true" className="absolute inset-0 rounded-2xl border-2 border-amber-300 animate-ping [animation-duration:2s] opacity-30" />
              )}
              Empezar mi racha
              <ArrowRight aria-hidden="true" className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" />
            </TransitionLink>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
};

export default CinematicFinale;
