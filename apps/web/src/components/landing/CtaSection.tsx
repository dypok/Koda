'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { CtaActions } from '@/views/landing/cta/CtaActions';
import { CtaTrustPoints } from '@/views/landing/cta/CtaTrustPoints';

export const CtaSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-36 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      <div aria-hidden="true" className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Mascota oficial Koda */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center relative"
        >
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full -z-10 transform scale-75 animate-pulse transform-gpu" />
            <Image
              src="/brand/koda-mascot-cartoon-2d-transparent.png"
              alt="Mascota Koda"
              width={220}
              height={220}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain animate-float select-none drop-shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
              priority
            />
          </div>
        </motion.div>

        {/* Encabezado Principal */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Comienza a programar{' '}
            <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-8">
              hoy mismo
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-sans">
            Construye bases lógicas universales y domina la programación paso a paso. Sin configuraciones complejas, a tu propio ritmo y con práctica directa en tu navegador.
          </p>
        </motion.div>

        <CtaActions />
        <CtaTrustPoints />
      </div>
    </section>
  );
};

export default CtaSection;
