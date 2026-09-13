import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Pillar } from '@/models/landing/methodology.model';
import { cn } from '@/lib/utils';

interface MethodologyHubProps {
  pillars: Pillar[];
  activeId: string | null;
  onScrollTo: (id: string) => void;
}

export const MethodologyHub: React.FC<MethodologyHubProps> = ({ pillars, activeId, onScrollTo }) => {
  const reduceMotion = useReducedMotion();

  return (
  <section className="pt-24 pb-20 md:pt-32 md:pb-28 relative overflow-hidden border-t border-slate-800/80 bg-slate-950">
    <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

    <div aria-hidden="true" className="flex flex-col items-center mb-8 pointer-events-none">
      <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-amber-400" />
      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] -mt-1 animate-pulse" />
    </div>

    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-3xl mx-auto"
      >
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
          ¿Por qué nuestro método{' '}
          <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-8">
            es el mejor
          </span>
          ?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-sans">
          Cuatro principios diseñados para dominar la programación de verdad: constancia diaria, ruta clara, práctica activa y razonamiento guiado.
        </p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const active = activeId === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => onScrollTo(pillar.id)}
                aria-current={active ? 'true' : undefined}
                className="group relative flex flex-col items-center text-center cursor-pointer transition-all duration-300 focus:outline-none"
              >
                <div className="relative w-full flex items-center justify-center mb-3.5">
                  {index < pillars.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 w-[calc(100%+2rem)] top-1/2 -translate-y-1/2 h-[1px] border-t border-dashed border-slate-700/80 z-0 pointer-events-none" aria-hidden="true" />
                  )}
                  <div className={cn('relative z-10 w-14 h-14 rounded-2xl bg-slate-950 border bg-gradient-to-b from-slate-900/90 to-slate-950 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-900', active ? 'border-amber-400/70 text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.45)] scale-110' : cn(pillar.badgeBorder, pillar.badgeText, pillar.hoverBorder, pillar.hoverShadow))}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <span className={cn('font-display text-base font-bold transition-colors', active ? 'text-amber-300' : 'text-white group-hover:text-amber-400')}>{pillar.title}</span>
                <span className="text-xs text-slate-400 mt-0.5 font-sans">{pillar.subtitle}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center pt-4"
      >
        <button
          onClick={() => onScrollTo('rachas')}
          className="inline-flex min-h-[44px] items-center gap-2 text-xs font-sans text-slate-400 hover:text-amber-400 transition-colors cursor-pointer group"
        >
          <span>Descubre cómo funciona</span>
          <ChevronDown aria-hidden="true" className="w-4 h-4 animate-bounce text-amber-400" />
        </button>
        <div aria-hidden="true" className="w-[1px] h-10 bg-gradient-to-b from-amber-500/40 to-transparent mt-3" />
      </motion.div>
    </div>
  </section>
  );
};
