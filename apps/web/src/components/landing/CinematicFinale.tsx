'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { TransitionLink } from '@/components/ui/transition-link';
import { Magnetic } from '@/components/ui/magnetic';
import { SplitText } from '@/components/ui/split-text';
import { ArrowRight, Check, SignIn } from '@phosphor-icons/react';
import Link from 'next/link';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

/** Cierre de película: negro total, frase letra por letra, Koda y un solo CTA. */
export const CinematicFinale: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const eclipseRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.st-eclipse-ring',
        { scale: 0.55, opacity: 0.25 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: eclipseRef.current, start: 'top 80%', end: 'top 35%', scrub: 0.6 },
        }
      );
      // Salida: el eclipse crece tapando todo y el contenido se funde; el footer emerge del brillo.
      gsap.to('.st-eclipse-ring', {
        scale: 3.2,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'bottom 85%', end: 'bottom 15%', scrub: 0.6 },
      });
      gsap.to(contentRef.current, {
        opacity: 0.15,
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'bottom 85%', end: 'bottom 15%', scrub: 0.6 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="finale" aria-labelledby="finale-title" className="relative overflow-hidden bg-black py-28 md:py-40 border-t border-slate-900 scroll-mt-20">
      <div aria-hidden="true" data-glow="8" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.10)_0%,transparent_70%)] pointer-events-none" />
      <div ref={eclipseRef} aria-hidden="true" className="absolute left-1/2 top-24 -translate-x-1/2 pointer-events-none">
        <div className="st-eclipse-ring relative h-60 w-60 rounded-full bg-black border border-amber-400/70 shadow-[0_0_80px_10px_rgba(245,158,11,0.25)] will-change-transform" />
      </div>
      <div ref={contentRef} className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8 relative z-10 will-change-transform">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Image
            src="/brand/koda-mascot-cartoon-2d-transparent.png"
            alt=""
            width={168}
            height={168}
            className="object-contain animate-float select-none drop-shadow-[0_16px_40px_rgba(249,115,22,0.35)]"
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
            <TransitionLink
              href="/register"
              aria-label="Empezar mi racha gratis en Koda"
              className="group relative inline-flex min-h-[64px] w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-amber-400 px-10 py-4 text-lg font-black text-slate-950 transition-all hover:bg-amber-300"
            >
              {!reduceMotion && (
                <span aria-hidden="true" className="absolute inset-0 rounded-2xl border-2 border-amber-300 animate-ping [animation-duration:2s] opacity-30" />
              )}
              Empezar mi racha
              <ArrowRight aria-hidden="true" className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" />
            </TransitionLink>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-4 pt-2"
        >
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-700 px-5 text-sm font-bold text-slate-200 transition-all hover:border-amber-400/50 hover:text-amber-300"
          >
            <SignIn aria-hidden="true" className="w-4 h-4 text-amber-400" />
            Ya tengo una cuenta
          </Link>
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
