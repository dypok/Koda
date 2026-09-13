import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const FreeTierSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="propuesta-valor"
      className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950"
    >
      <div aria-hidden="true" className="absolute top-1/2 right-6 lg:right-24 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-5 text-left"
          >
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Aprende{' '}
              <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-8">
                100% gratis
              </span>{' '}
              con los mejores resultados
            </h2>

            <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
              Sin suscripciones ocultas ni muros de pago. Un método interactivo de micro-lecciones y práctica deliberada diseñado para que domines la lógica de programación y alcances tu máximo potencial.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center text-left lg:text-right space-y-3 w-full"
          >
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
              <span className="relative font-display text-8xl sm:text-9xl font-black text-amber-400 leading-none select-none tracking-tight">
                $0
              </span>
            </div>

            <div className="space-y-2 max-w-sm">
              <p className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider">
                Acceso Libre Permanente
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                Aprende programación desde cero con el temario completo, sin membresías ni cobros sorpresa.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
