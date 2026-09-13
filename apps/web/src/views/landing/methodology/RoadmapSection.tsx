import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MiniSkillTree } from '@/components/landing/MiniSkillTree';
import { KodaPeek } from '@/components/landing/KodaPeek';
import { WeatherLayer } from '@/components/landing/WeatherLayer';

export const RoadmapSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
  <section id="roadmap" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20">
    <KodaPeek align="right" />
    <WeatherLayer type="embers" count={10} />
    <div aria-hidden="true" className="absolute -top-24 left-1/4 -translate-x-1/2 w-[650px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.10)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start w-full"
        >
          <MiniSkillTree />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 order-1 lg:order-2 space-y-5 text-left"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
            Pilar 2 · Ruta
          </p>
          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Un roadmap claro, paso a paso
          </h3>
          <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
            Sabes exactamente qué aprender hoy y qué sigue mañana. Una ruta secuencial estructurada desde las bases hasta escribir tus propios programas sin perderte en tutoriales infinitos.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
  );
};
