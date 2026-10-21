'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroSkyBackground } from './HeroSkyBackground';
import { LightBeams } from './LightBeams';
import { UpcomingTechCarousel } from './UpcomingTechCarousel';
import { HeroCtaGroup } from '@/views/landing/hero/HeroCtaGroup';
import { HeroMascot } from '@/views/landing/hero/HeroMascot';
import { TypewriterCode } from '@/views/landing/hero/TypewriterCode';
import { SplitText } from '@/components/ui/split-text';
import { Highlight } from '@/components/ui/highlight';
import { useHeroStrings } from '@/lib/i18n';

const EASE = [0.16, 1, 0.3, 1] as const;

export const HeroSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const t = useHeroStrings();

  return (
    <section
      id="inicio"
      aria-labelledby="koda-hero-title"
      className="relative isolate overflow-hidden min-h-screen min-h-[100dvh] flex flex-col justify-between pt-20 pb-4 md:pt-24 md:pb-6"
    >
      <HeroSkyBackground starCount={140} interactive={true} />
      <LightBeams />
      <div aria-hidden="true" className="koda-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.08, ease: [...EASE] }}
              className="max-w-xl text-slate-300 text-base sm:text-lg leading-relaxed"
            >
              {t.sub}
            </motion.p>

            <HeroCtaGroup />
            <TypewriterCode />
          </div>

          {/* Right Column: Mascota Oficial Koda */}
          <div className="lg:col-span-5">
            <HeroMascot />
          </div>
        </div>
      </div>

      {/* Carrusel de Tecnologías */}
      <div className="relative z-10 w-full mt-auto pt-6 pb-2">
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
