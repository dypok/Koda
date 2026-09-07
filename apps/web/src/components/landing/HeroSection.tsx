'use client';

import React from 'react';
import Image from 'next/image';
import { IconArrowRight, IconLogin } from '@tabler/icons-react';
import { HeroSkyBackground } from './HeroSkyBackground';
import { GradientButton } from '@/components/ui/gradient-button';
import { UpcomingTechCarousel } from './UpcomingTechCarousel';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative isolate overflow-hidden min-h-screen min-h-[100dvh] flex flex-col justify-between pt-20 pb-4 md:pt-24 md:pb-6">
      {/* Interactive Starry Night Sky Background */}
      <HeroSkyBackground starCount={260} interactive={true} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
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

            {/* Call to Action: Comenzar Ahora & Ya tengo una cuenta */}
            <div className="pt-2 flex flex-col items-center lg:items-start gap-3.5 w-full sm:w-auto">
              <GradientButton
                onClick={onOpenLogin}
                size="lg"
                className="w-full sm:w-72 max-w-xs sm:max-w-none gap-2.5 px-8 py-4 text-base shadow-none justify-center font-black"
              >
                Comenzar Ahora
                <IconArrowRight className="w-5 h-5" />
              </GradientButton>

              <GradientButton
                onClick={onOpenLogin}
                variant="secondary"
                size="lg"
                className="w-full sm:w-72 max-w-xs sm:max-w-none gap-2.5 px-8 py-4 text-base shadow-none justify-center font-bold border border-slate-700/80 hover:border-slate-500"
              >
                <IconLogin className="w-5 h-5 text-amber-400/90" />
                Ya tengo una cuenta
              </GradientButton>
            </div>
          </div>

          {/* Right Column: Mascota Oficial Koda */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center">
              {/* Koda Mascot Image */}
              <Image
                src="/brand/koda-mascot.png"
                alt="Koda — Mascota Oficial KodaAcademy"
                width={420}
                height={302}
                className="relative z-10 w-auto h-auto max-h-[220px] sm:max-h-[260px] lg:max-h-[300px] object-contain animate-float select-none"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Próximamente: Carrusel de Tecnologías */}
      <div className="relative z-10 w-full mt-auto pt-6 pb-2">
        <UpcomingTechCarousel />
      </div>
    </section>
  );
};
