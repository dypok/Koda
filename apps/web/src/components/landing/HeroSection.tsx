'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroSkyBackground } from './HeroSkyBackground';
import { LightBeams } from './LightBeams';
import { UpcomingTechCarousel } from './UpcomingTechCarousel';
import { HeroCtaGroup } from '@/views/landing/hero/HeroCtaGroup';
import { HeroMascot } from '@/views/landing/hero/HeroMascot';
import { TypewriterCode } from '@/views/landing/hero/TypewriterCode';
import { SplitText } from '@/components/ui/split-text';
import { Highlight } from '@/components/ui/highlight';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { useHeroStrings } from '@/lib/i18n';

const EASE = [0.16, 1, 0.3, 1] as const;

export const HeroSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const t = useHeroStrings();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      };
      // Copy sube despacio y se atenúa; la mascota vuela más rápido (profundidad).
      gsap.to(copyRef.current, { y: -70, opacity: 0.15, ease: 'none', scrollTrigger: trigger });
      gsap.to(mascotRef.current, { y: -140, scale: 0.94, opacity: 0.35, ease: 'none', scrollTrigger: trigger });
      gsap.to(gridRef.current, { yPercent: 12, ease: 'none', scrollTrigger: trigger });
      gsap.to(carouselRef.current, { y: 40, opacity: 0, ease: 'none', scrollTrigger: trigger });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="koda-hero-title"
      className="relative isolate overflow-hidden min-h-screen min-h-[100dvh] flex flex-col justify-between pt-20 pb-4 md:pt-24 md:pb-6"
    >
      <HeroSkyBackground starCount={140} interactive={true} />
      <LightBeams />
      <div ref={gridRef} aria-hidden="true" className="koda-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div ref={copyRef} className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 will-change-transform">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [...EASE] }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-200"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {t.eyebrow}
            </motion.p>
            <h1
              id="koda-hero-title"
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] transform-gpu"
            >
              <SplitText text={t.titleA} mode="chars" delay={0.1} />{' '}
              <Highlight>
                <SplitText text={t.titleAccent} mode="words" delay={0.45} />
              </Highlight>
              <SplitText text={t.titleB} mode="chars" delay={0.7} />
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [...EASE] }}
              className="max-w-xl text-slate-300 text-base sm:text-lg leading-relaxed"
            >
              {t.sub}
            </motion.p>

            <HeroCtaGroup />
            <TypewriterCode />
          </div>

          {/* Right Column: Mascota Oficial Koda */}
          <div ref={mascotRef} className="order-first lg:order-none lg:col-span-5 will-change-transform">
            <HeroMascot />
          </div>
        </div>
      </div>

      {/* Carrusel de Tecnologías */}
      <div ref={carouselRef} className="relative z-10 w-full mt-auto pt-6 pb-2 will-change-transform">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <UpcomingTechCarousel />
      </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
