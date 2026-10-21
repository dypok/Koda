'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowCounterClockwise, Heart } from '@phosphor-icons/react';
import { TransitionLink } from '@/components/ui/transition-link';
import { KodaPeek } from '@/components/landing/KodaPeek';
import { cn } from '@/lib/utils';
import { getAppUrl } from '@/lib/domain';
import { reveal } from '@/lib/reveal';

const FREE = [
  'Temario completo de Python y Lua',
  'Micro-lecciones + práctica en navegador',
  'XP, rachas, logros y cuaderno',
  'Certificado con QR verificable',
];

const PREMIUM = [
  'Todo lo del plan gratuito',
  'Sin anuncios entre secciones',
  'Mismo contenido, cero interrupciones',
];

const FeatureCheck: React.FC<{ color: string; index: number; runId: number; reduceMotion: boolean | null }> = ({
  color,
  index,
  runId,
  reduceMotion,
}) => (
  <span aria-hidden="true" className={cn('flex-shrink-0 mt-0.5', color)}>
    <motion.svg
      key={`check-${runId}-${index}`}
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <motion.polyline
        points="20 6 9 17 4 12"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.05 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.svg>
  </span>
);

export const PricingSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [runId, setRunId] = useState(0);

  return (
    <section id="planes" aria-labelledby="planes-title" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20">
      <KodaPeek align="left" size={64} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          {...reveal(reduceMotion)}
          className="text-center space-y-4 max-w-2xl mx-auto mb-12"
        >
          <h2 id="planes-title" className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Gratis de verdad,{' '}
            <span className="text-amber-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.35)]">premium sin truco</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            La misma educación para todos. Premium solo quita los anuncios.
          </p>
        </motion.div>

        <div className="relative">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            <motion.section
              aria-label="Plan gratuito"
              {...reveal(reduceMotion, { variant: 'left', distance: 12 })}
              className="relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 border border-white/[0.08] bg-gradient-to-b from-slate-900/90 to-slate-950 transition-colors duration-300 hover:border-slate-600/50"
            >
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">Gratuito</p>
                <p className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">$0</p>
                <p className="text-sm font-medium text-slate-400 mt-2">Para siempre, sin tarjeta.</p>
                <div aria-hidden="true" className="w-full h-px bg-slate-800/80 my-6" />
                <ul className="space-y-4 text-sm font-medium text-slate-300">
                  {FREE.map((f, i) => (
                    <li key={f} className="flex items-start gap-3.5">
                      <FeatureCheck color="text-emerald-400" index={i} runId={runId} reduceMotion={reduceMotion} />
                      <span className="leading-snug text-slate-200">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-2">
                <TransitionLink
                  href={getAppUrl('/register')}
                  aria-label="Empezar gratis en Koda"
                  className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/60 border border-slate-700/80 transition-all duration-200 hover:bg-slate-700/60 hover:text-white hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
                >
                  Empezar gratis
                </TransitionLink>
              </div>
            </motion.section>

            <motion.section
              aria-label="Plan premium"
              {...reveal(reduceMotion, { variant: 'right', delay: 0.06, distance: 12 })}
              className="relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-gradient-to-b from-slate-900/95 to-slate-950"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-10 w-[380px] h-[380px] blur-[45px]"
                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.03) 60%, transparent 80%)' }}
              />
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="1" y="1" width="98" height="98" rx="6" fill="none" stroke="rgba(245,158,11,0.28)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <rect x="1" y="1" width="98" height="98" rx="6" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1000} className="beam-stroke opacity-70 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
                <rect x="1" y="1" width="98" height="98" rx="6" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1000} className="beam-stroke-core drop-shadow-[0_0_4px_#fff]" />
              </svg>
              <div className="absolute -top-3.5 left-8 z-30">
                <motion.span
                  key={`badge-${runId}`}
                  {...reveal(reduceMotion, { variant: 'scale', delay: 0.1, distance: 3 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 shadow-[0_2px_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-300/40"
                >
                  <Heart aria-hidden="true" className="w-3 h-3 animate-pulse" weight="fill" />
                  Apoya a Koda
                </motion.span>
              </div>

              <div className="relative z-10">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-400/90 mb-4 mt-1">Premium</p>
                <p className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">
                  $1<span className="text-lg font-medium text-slate-400">/mes</span>
                </p>
                <p className="text-sm font-medium text-slate-400 mt-2">Sin anuncios. Nada más cambia.</p>
                <div aria-hidden="true" className="w-full h-px bg-amber-500/20 my-6" />
                <ul className="space-y-4 text-sm font-medium text-slate-200">
                  {PREMIUM.map((f, i) => (
                    <li key={f} className="flex items-start gap-3.5">
                      <FeatureCheck color="text-amber-400" index={i} runId={runId} reduceMotion={reduceMotion} />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-2 relative z-10">
                <TransitionLink
                  href={getAppUrl('/register')}
                  aria-label="Probar premium en Koda"
                  className="btn-shimmer flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-200 hover:from-amber-300 hover:to-amber-400 shadow-[0_4px_22px_rgba(245,158,11,0.38)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.55)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                >
                  Probar premium
                </TransitionLink>
              </div>
            </motion.section>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setRunId((n) => n + 1)}
              title="Reiniciar la animación de los trazos"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg text-slate-400 hover:text-amber-400 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 transition-colors duration-200"
            >
              <ArrowCounterClockwise aria-hidden="true" className="w-3.5 h-3.5" />
              Replay animación
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
