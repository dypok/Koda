'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Highlight } from '@/components/ui/highlight';
import { KodaPeek } from '@/components/landing/KodaPeek';
import { cn } from '@/lib/utils';

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

export const PricingSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="planes" aria-labelledby="planes-title" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20">
      <KodaPeek align="left" size={64} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 max-w-2xl mx-auto mb-12"
        >
          <h2 id="planes-title" className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
            Gratis de verdad, <Highlight>premium sin truco</Highlight>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            La misma educación para todos. Premium solo quita los anuncios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-5"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Gratuito</p>
              <p className="font-display text-5xl font-black text-white mt-1">$0</p>
              <p className="text-sm text-slate-400 mt-1">Para siempre, sin tarjeta.</p>
            </div>
            <ul className="space-y-2.5">
              {FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="flex min-h-[48px] items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-white transition-all hover:border-amber-400/50 hover:text-amber-300"
            >
              Empezar gratis
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-400/10 to-transparent',
              'p-6 sm:p-8 space-y-5 relative lg:-translate-y-3',
              'shadow-[0_24px_60px_-16px_rgba(245,158,11,0.35)]'
            )}
          >
            <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950">
              Apoya a Koda
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Premium</p>
              <p className="font-display text-5xl font-black text-white mt-1">
                $1<span className="text-lg font-bold text-slate-400">/mes</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">Sin anuncios. Nada más cambia.</p>
            </div>
            <ul className="space-y-2.5">
              {PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check aria-hidden="true" className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300"
            >
              Probar premium
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
