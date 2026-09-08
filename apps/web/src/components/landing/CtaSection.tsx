'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CtaActions } from '@/views/landing/cta/CtaActions';
import { CtaTrustPoints } from '@/views/landing/cta/CtaTrustPoints';

interface CtaSectionProps {
  onOpenLogin?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="py-24 md:py-36 bg-gradient-to-b from-slate-950 via-[#120e17] to-slate-950 relative overflow-hidden border-t border-slate-800/80">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.18)_0%,rgba(234,88,12,0.06)_45%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[450px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Mascota oficial Koda */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full -z-10 transform scale-75 animate-pulse transform-gpu" />
            <Image
              src="/brand/koda-mascot.png"
              alt="Mascota Koda"
              width={220}
              height={158}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain animate-float select-none"
              priority
            />
          </div>
        </motion.div>

        {/* Encabezado Principal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Comienza a programar{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-sans">
            Construye bases lógicas universales y domina la programación paso a paso. Sin configuraciones complejas, a tu propio ritmo y con práctica directa en tu navegador.
          </p>
        </motion.div>

        <CtaActions onOpenLogin={onOpenLogin} />
        <CtaTrustPoints />
      </div>
    </section>
  );
};

export default CtaSection;
