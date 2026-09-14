import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const LiveCodeSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
  <section id="codigo-real" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20 sticky top-[168px] z-[20] rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
    <div aria-hidden="true" data-glow="-14" className="absolute top-1/2 left-4 lg:left-20 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          className="lg:col-span-5 order-2 lg:order-1 flex flex-col items-start lg:items-start justify-center text-left space-y-2"
        >
          <AnimatedCounter
            to={4}
            suffix="x"
            duration={1.2}
            delay={0.2}
            className="font-display text-7xl sm:text-8xl lg:text-9xl font-black text-amber-400 leading-none select-none"
          />
          <span className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
            Mayor retención activa
          </span>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 order-1 lg:order-2 space-y-5 text-left"
        >
          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            1 concepto = 1 reto en código real
          </h3>
          <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
            Nadie aprende a programar mirando videos pasivamente. Cada explicación dura 2 minutos y te reta a escribir y ejecutar código en vivo directamente en tu navegador.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
  );
};
