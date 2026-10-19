'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { KodaMascot } from '@/components/brand/KodaMascot';
import { TransitionLink } from '@/components/ui/transition-link';
import { Magnetic } from '@/components/ui/magnetic';
import { SplitText } from '@/components/ui/split-text';
import { WipeButton } from '@/components/ui/wipe-button';
import { ArrowRight, Check, SignIn } from '@phosphor-icons/react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

/** Cierre de película: negro total, frase letra por letra, Koda y un solo CTA. */
export const CinematicFinale: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      // Una sola timeline y un solo ScrollTrigger: antes dos tweens con scrub
      // peleaban por el mismo `scale` en rangos solapados y el anillo saltaba.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'bottom 25%', scrub: 0.6 },
      });
      tl.fromTo(
        ringRef.current,
        { scale: 0.55, opacity: 0.25, transformOrigin: '50% 50%' },
        { scale: 1, opacity: 1, duration: 1 }
      );
      // Salida: el eclipse crece tapando todo y el contenido se funde; el footer emerge del brillo.
      tl.to(ringRef.current, { scale: 3.2, duration: 1.2 }, '>10%');
      tl.to(contentRef.current, { opacity: 0.15, y: -60, duration: 1.2 }, '<');
    }, sectionRef);
    // Las imágenes y fuentes mueven el layout tras medir los triggers:
    // recalcula al terminar la carga para que el anillo siga al scroll.
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="finale" aria-labelledby="finale-title" className="relative overflow-hidden bg-black py-28 md:py-40 border-t border-slate-900 scroll-mt-20">
      <div aria-hidden="true" data-glow="8" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.10)_0%,transparent_70%)] pointer-events-none" />
      <div aria-hidden="true" className="absolute left-1/2 top-24 -ml-[7.5rem] pointer-events-none">
        <div ref={ringRef} className="st-eclipse-ring relative h-60 w-60 rounded-full bg-black border border-amber-400/70 shadow-[0_0_80px_10px_rgba(245,158,11,0.25)] will-change-transform" />
      </div>
      <div ref={contentRef} className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8 relative z-10 will-change-transform">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <KodaMascot
            state="streak_active"
            size={168}
            animate="float"
            glow
          />
        </motion.div>

        <h2
          id="finale-title"
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]"
        >
          <SplitText text="Tu racha empieza hoy." mode="words" stagger={0.06} />
        </h2>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center pt-2"
        >
          <Magnetic className="w-full sm:w-auto">
            <WipeButton
              href="/register"
              LinkComponent={TransitionLink}
              ariaLabel="Empezar mi racha gratis en Koda"
              size="lg"
              className="w-full sm:w-auto px-10 py-4 text-lg font-black gap-3"
            >
              Empezar mi racha
              <ArrowRight aria-hidden="true" className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" />
            </WipeButton>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-4 pt-2"
        >
          <WipeButton
            href="/login"
            LinkComponent={TransitionLink}
            tone="ghost"
            size="sm"
            className="px-5 gap-2"
          >
            <SignIn aria-hidden="true" className="w-4 h-4 text-amber-400" />
            Ya tengo una cuenta
          </WipeButton>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            {['100% Gratuito', 'Sin tarjeta ni suscripción', 'Práctica en navegador'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check aria-hidden="true" className="w-4 h-4 text-emerald-400" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinematicFinale;
