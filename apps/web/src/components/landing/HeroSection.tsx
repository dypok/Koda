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
    <section className="relative isolate overflow-hidden min-h-[80vh] flex flex-col justify-center items-center py-12 md:py-16">
      {/* Interactive Starry Night Sky Background */}
      <HeroSkyBackground starCount={260} interactive={true} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col items-center text-center space-y-8">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] max-w-3xl">
          Aprende a programar{' '}
          <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            como juegas
          </span>
          . Cero frustración.
        </h1>

        {/* Call to Action Button */}
        <div className="pt-2">
          <GradientButton
            onClick={onOpenLogin}
            size="lg"
            className="gap-2.5 px-10 py-4 text-base shadow-none"
          >
            Comenzar Ahora
            <IconArrowRight className="w-5 h-5" />
          </GradientButton>
        </div>

        {/* Mascot Koda - Centered with speech bubble */}
        <div className="relative flex flex-col items-center pt-2">
          {/* Koda Mascot Image */}
          <div className="relative z-10 flex items-center justify-center">
            <Image
              src="/brand/koda-mascot.png"
              alt="Koda — Mascota Oficial KodaAcademy"
              width={280}
              height={200}
              className="relative z-10 object-contain animate-float select-none"
              priority
            />
          </div>

          {/* Speech Bubble / Mascot Message */}
          <div className="relative z-10 mt-3 max-w-sm sm:max-w-md rounded-2xl bg-slate-900/90 border border-amber-500/30 p-4 backdrop-blur-md text-center shadow-lg">
            {/* Speech triangle pointer towards Koda */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-t border-l border-amber-500/30 rotate-45" />

            <p className="text-sm font-semibold text-slate-100 leading-snug">
              «¡Hola! Soy Koda. Te guiaré paso a paso para dominar la lógica de programación y escribir código real sin miedo a equivocarte.»
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
