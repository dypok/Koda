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
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'bottom bottom', scrub: 0.6 },
      });
      tl.fromTo(
        ringRef.current,
        { scale: 0.65, opacity: 0.3, transformOrigin: '50% 50%' },
        { scale: 1.08, opacity: 1, duration: 1 }
      );
    }, sectionRef);
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
      <div
        aria-hidden="true"
        data-glow="8"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[720px] h-[320px] sm:h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none"
      />
      <div ref={contentRef} className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8 relative z-10 will-change-transform">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center"
        >
          <div
            ref={ringRef}
            aria-hidden="true"
            className="st-eclipse-ring pointer-events-none absolute inset-0 m-auto h-52 w-52 sm:h-60 sm:w-60 rounded-full bg-black border border-amber-400/70 shadow-[0_0_80px_10px_rgba(245,158,11,0.25)] will-change-transform"
          />
          <KodaMascot
            state="streak_active"
            size={156}
            animate="none"
            glow
            className="relative z-10 h-36 w-36 sm:h-44 sm:w-44"
          />
        </motion.div>

        <h2
          id="finale-title"
          className="font-display text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]"
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
