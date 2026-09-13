'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Quote, Flame } from 'lucide-react';
import { Highlight } from '@/components/ui/highlight';

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

export const TestimonialsSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="testimonios-title" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 max-w-2xl mx-auto mb-12"
        >
          <h2 id="testimonios-title" className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
            Gente real, <Highlight>rachas reales</Highlight>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Miles de estudiantes mantienen su hábito diario con Koda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col gap-4 hover:border-amber-400/30 transition-colors"
            >
              <Quote aria-hidden="true" className="w-6 h-6 text-amber-400/60" />
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
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
