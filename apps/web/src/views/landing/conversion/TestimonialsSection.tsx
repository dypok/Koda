'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Quotes, Flame, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Highlight } from '@/components/ui/highlight';
import { cn } from '@/lib/utils';
import { reveal } from '@/lib/reveal';

const TESTIMONIALS = [
  {
    name: 'Valentina R.',
    meta: 'Racha 21 días · Módulo 04',
    quote: 'Nunca había programado. Las lecciones de 2 minutos me engancharon y ya hago mis propios scripts.',
    initial: 'V',
  },
  {
    name: 'Diego M.',
    meta: 'Racha 45 días · Certificado Python',
    quote: 'Las pistas sin spoilers me obligaron a pensar de verdad. El certificado con QR me sirvió en entrevistas.',
    initial: 'D',
  },
  {
    name: 'Camila T.',
    meta: 'Racha 12 días · Módulo 02',
    quote: 'Probé la demo sin registrarme y a los 10 minutos ya había creado mi cuenta. Así de fácil entra.',
    initial: 'C',
  },
];

/** Carrusel 3D arrastrable con autoplay pausable. */
export const TestimonialsSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    const n = TESTIMONIALS.length;
    setIndex(((i % n) + n) % n);
  }, []);

  useEffect(() => {
    // Solo mueve el carrusel en horizontal: jamás la página (scrollIntoView la arrastraría).
    const track = trackRef.current;
    const child = track?.children[index] as HTMLElement | undefined;
    if (!track || !child) return;
    const left = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2;
    track.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [index, reduceMotion]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  return (
    <section id="testimonios" aria-labelledby="testimonios-title" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          {...reveal(reduceMotion)}
          className="text-center space-y-4 max-w-2xl mx-auto mb-10"
        >
          <h2 id="testimonios-title" className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
            Gente real, <Highlight>rachas reales</Highlight>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Miles de estudiantes mantienen su hábito diario con Koda.
          </p>
        </motion.div>

        <div
          className="[perspective:1200px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                animate={reduceMotion ? {} : i === index ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden={i !== index || undefined}
                className={cn(
                  'rounded-2xl border bg-slate-900/60 p-6 flex flex-col gap-4 transition-all duration-300',
                  'min-w-[85%] sm:min-w-[60%] lg:min-w-[31%] snap-center',
                  i === index
                    ? 'border-amber-400/40 shadow-[0_16px_50px_-16px_rgba(245,158,11,0.4)]'
                    : 'border-slate-800 opacity-70'
                )}
              >
                <Quotes aria-hidden="true" className="w-6 h-6 text-amber-400/60" />
                <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed flex-1">
                  {t.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-slate-800/80 pt-4">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/15 border border-amber-400/30 font-display font-bold text-amber-300">
                    {t.initial}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">{t.name}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Flame aria-hidden="true" className="w-3.5 h-3.5 text-orange-400" />
                      {t.meta}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Testimonio anterior"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
            >
              <CaretLeft aria-hidden="true" className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Elegir testimonio">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonio de ${t.name}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Testimonio siguiente"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
            >
              <CaretRight aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
