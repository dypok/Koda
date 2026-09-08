'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeroSkyBackground } from './HeroSkyBackground';
import { UpcomingTechCarousel } from './UpcomingTechCarousel';
import { HeroCtaGroup } from '@/views/landing/hero/HeroCtaGroup';
import { HeroMascot } from '@/views/landing/hero/HeroMascot';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative isolate overflow-hidden min-h-screen min-h-[100dvh] flex flex-col justify-between pt-20 pb-4 md:pt-24 md:pb-6">
      <HeroSkyBackground starCount={140} interactive={true} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] transform-gpu"
            >
              Aprende a programar{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                como juegas
              </span>
              . Cero frustración.
            </motion.h1>

            <HeroCtaGroup onOpenLogin={onOpenLogin} />
          </div>

          {/* Right Column: Mascota Oficial Koda */}
          <HeroMascot />
        </div>
      </div>

      {/* Carrusel de Tecnologías */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full mt-auto pt-6 pb-2"
      >
        <UpcomingTechCarousel />
      </motion.div>
    </section>
  );
};

export default HeroSection;
