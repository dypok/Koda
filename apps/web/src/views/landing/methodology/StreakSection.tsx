import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const StreakSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
  <section id="rachas" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20">
    <div aria-hidden="true" className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

    {/* Ascuas vivas de fuego flotantes (GPU Accelerated) */}
    <div aria-hidden="true" className="absolute right-8 lg:right-28 bottom-6 w-72 h-72 pointer-events-none overflow-hidden select-none">
      <span className="absolute bottom-4 left-8 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-[emberRise_4.5s_ease-out_infinite] transform-gpu will-change-transform" style={{ animationDelay: '0s' }} />
      <span className="absolute bottom-2 left-24 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#f97316] animate-[emberRise_5.2s_ease-out_infinite] transform-gpu will-change-transform" style={{ animationDelay: '1.2s' }} />
      <span className="absolute bottom-6 left-44 w-1 h-1 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24] animate-[emberRise_3.8s_ease-out_infinite] transform-gpu will-change-transform" style={{ animationDelay: '2.1s' }} />
      <span className="absolute bottom-0 left-16 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ea580c] animate-[emberRise_6s_ease-out_infinite] transform-gpu will-change-transform" style={{ animationDelay: '0.8s' }} />
      <span className="absolute bottom-5 left-36 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-[emberRise_4.8s_ease-out_infinite] transform-gpu will-change-transform" style={{ animationDelay: '3.3s' }} />
    </div>

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -35, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-5 text-left"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-400">
            Pilar 1 · Constancia
          </p>
          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Rachas que encienden tu hábito diario
          </h3>
          <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
            15 minutos al día son suficientes. La constancia diaria vence a cualquier maratón de fin de semana y convierte la programación en una segunda naturaleza.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center text-left lg:text-right space-y-2"
        >
          <AnimatedCounter
            to={15}
            suffix="m"
            duration={1.6}
            delay={0.2}
            className="font-display text-7xl sm:text-8xl lg:text-9xl font-black text-amber-400 leading-none select-none"
          />
          <span className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
            Al día para crear el hábito
          </span>
        </motion.div>
      </div>
    </div>
  </section>
  );
};
