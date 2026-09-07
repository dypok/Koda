'use client';

import React from 'react';
import Image from 'next/image';
import { IconArrowRight } from '@tabler/icons-react';
import { FloatingLines } from './FloatingLines';
import { GradientButton } from '@/components/ui/gradient-button';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative isolate overflow-hidden min-h-[80vh] flex flex-col justify-center py-12 md:py-20">
      {/* Background Floating Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-85">
        <FloatingLines
          linesGradient={['#ea580c', '#f97316', '#f59e0b', '#fbbf24']}
          animationSpeed={1}
          interactive={true}
          bendRadius={5}
          bendStrength={-0.5}
          parallax={true}
          parallaxStrength={0.2}
          mixBlendMode="screen"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Aprende a programar{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                como juegas
              </span>
              . Cero frustración.
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
              Domina el pensamiento computacional y escribe código real con micro-lecciones interactivas, práctica inmediata en tu navegador y acompañamiento paso a paso. Comienza hoy con nuestro track oficial de <strong>Python 3.12</strong>, la puerta de entrada a nuestro ecosistema formativo.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 w-full sm:w-auto">
              <GradientButton
                onClick={onOpenLogin}
                className="w-full sm:w-auto gap-2.5 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Comenzar Ahora
                <IconArrowRight className="w-5 h-5" />
              </GradientButton>
            </div>
          </div>

          {/* Right Column: Mascota Oficial Koda integrada orgánicamente sin card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md flex flex-col items-center">
              {/* Koda Mascot 3D Image */}
              <div className="relative z-10 py-2 flex items-center justify-center w-full">
                <Image
                  src="/brand/koda-mascot.png"
                  alt="Koda — Mascota Oficial KodaAcademy"
                  width={360}
                  height={260}
                  className="relative z-10 object-contain animate-float select-none"
                  priority
                />
              </div>

              {/* Speech Bubble / Mascot Message */}
              <div className="relative z-10 w-full max-w-sm rounded-2xl bg-slate-900/90 border border-amber-500/30 p-4 backdrop-blur-md text-center">
                {/* Speech triangle pointer towards Koda */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-t border-l border-amber-500/30 rotate-45" />

                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  «¡Hola! Soy Koda. Te guiaré paso a paso para dominar la lógica de programación y escribir código real sin miedo a equivocarte.»
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
