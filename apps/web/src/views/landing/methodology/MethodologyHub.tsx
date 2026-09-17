import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';
import { Pillar } from '@/models/landing/methodology.model';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';
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
    <AsciiVortexBackground />

    <div aria-hidden="true" className="flex flex-col items-center mb-6 md:mb-8 pointer-events-none relative z-10">
      <div className="w-[1.5px] h-[52px] bg-gradient-to-b from-transparent via-amber-500/55 to-amber-400" />
      <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_16px_4px_rgba(245,158,11,0.95),0_0_35px_8px_rgba(245,158,11,0.5)]" />
    </div>

    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-3xl mx-auto"
      >
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          ¿Por qué nuestro método{' '}
          <span className="relative z-0 inline-block whitespace-nowrap text-amber-400 after:absolute after:-left-1.5 after:-right-1.5 after:bottom-[2px] after:-z-10 after:h-[13px] after:rounded-md after:bg-emerald-500/40">
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
                aria-label={`Ir a ${pillar.title}`}
                aria-current={active ? 'location' : undefined}
                className="group relative flex flex-col items-center text-center cursor-pointer transition-all duration-300"
              >
                <div className="relative w-full flex items-center justify-center mb-4">
                  {index < pillars.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden md:block absolute left-1/2 w-[calc(100%+2rem)] top-8 -translate-y-1/2 h-px z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0)_0%)] bg-[length:8px_1px] bg-repeat-x bg-bottom"
                    />
                  )}
                  <div className={cn('relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl border bg-gradient-to-b from-slate-900/90 to-slate-950 flex items-center justify-center transition-all duration-300 group-hover:scale-105', active ? 'border-amber-500/80 text-amber-400 shadow-[0_0_32px_2px_rgba(245,158,11,0.45)] scale-105' : cn(pillar.badgeBorder, pillar.badgeText, pillar.hoverBorder, pillar.hoverShadow))}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
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
          className="group inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs md:text-sm font-medium font-sans text-slate-400 transition-all duration-200 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <span>Descubre cómo funciona</span>
          <CaretDown aria-hidden="true" className="w-4 h-4 text-slate-500 transition-all duration-300 group-hover:text-amber-400 group-hover:translate-y-0.5" />
        </button>
        <div aria-hidden="true" className="w-[1px] h-10 bg-gradient-to-b from-amber-500/40 to-transparent mt-3" />
      </motion.div>
    </div>
  </section>
  );
};
