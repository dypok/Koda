import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Check } from '@phosphor-icons/react';
import { MiniLessonPreview } from './MiniLessonPreview';
import { Highlight } from '@/components/ui/highlight';

export const LiveCodeComparisonSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="codigo-en-vivo"
      className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950"
    >
      <div aria-hidden="true" data-glow="-12" className="absolute top-1/2 right-6 lg:right-24 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.10)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

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
              Código Real{' '}
              <Highlight>
                en Vivo
              </Highlight>
            </h2>

            <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
              Sin instalaciones: lees una idea corta y la practicas al instante en tu
              navegador. Pruébalo aquí mismo, es una pregunta real del Módulo 01.
            </p>

            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-emerald-400">
                  Con KodaAcademy
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-sans">
                <li className="flex items-start gap-2.5">
                  <Check aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Abre el navegador en cualquier computadora</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Si fallas, recibes una pista — nunca se revela la respuesta</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Escribe y prueba código desde el primer segundo</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 pt-1">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-rose-500/80" />
                <p className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-rose-400">
                  Sin Koda: instalar compiladores <X aria-hidden="true" className="inline w-4 h-4 text-rose-500/80" /> · pelear con el PATH <X aria-hidden="true" className="inline w-4 h-4 text-rose-500/80" /> · horas antes del primer código
                </p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 w-full lg:sticky lg:top-24 self-start">
            <MiniLessonPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
