'use client';

import React from 'react';
import Image from 'next/image';
import { IconArrowRight } from '@tabler/icons-react';
import { HeroSkyBackground } from './HeroSkyBackground';
import { GradientButton } from '@/components/ui/gradient-button';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative isolate overflow-hidden min-h-[80vh] flex flex-col justify-center pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Interactive Starry Night Sky Background */}
      <HeroSkyBackground starCount={260} interactive={true} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Aprende a programar{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                como juegas
              </span>
              . Cero frustración.
            </h1>

            {/* Call to Action */}
            <div className="pt-2 w-full sm:w-auto">
              <GradientButton
                onClick={onOpenLogin}
                size="lg"
                className="w-full sm:w-auto gap-2.5 px-9 py-4 text-base shadow-none"
              >
                Comenzar Ahora
                <IconArrowRight className="w-5 h-5" />
              </GradientButton>
            </div>
          </div>

          {/* Right Column: Mascota Oficial Koda */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md flex items-center justify-center">
              {/* Koda Mascot Image */}
              <Image
                src="/brand/koda-mascot.png"
                alt="Koda — Mascota Oficial KodaAcademy"
                width={380}
                height={280}
                className="relative z-10 object-contain animate-float select-none"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
