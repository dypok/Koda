'use client';

import React from 'react';
import Image from 'next/image';
import { IconLogin, IconRocket, IconCheck } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface CtaSectionProps {
  onOpenLogin?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="py-24 md:py-36 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      {/* Resplandor ambiental de fondo integrado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12),transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
        {/* Mascota oficial Koda flotando directamente en la página */}
        <div className="flex justify-center relative">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full -z-10 transform scale-75" />
            <Image
              src="/brand/koda-mascot.png"
              alt="Mascota Koda"
              width={220}
              height={160}
              className="object-contain animate-float select-none"
              priority
            />
          </div>
        </div>

        {/* Textos y encabezados principales */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Comienza a programar{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-sans">
            Inicia con el track oficial de Python 3.12 y sienta las bases lógicas universales. Sin configuraciones complejas, a tu propio ritmo y con práctica directa en tu navegador.
          </p>
        </div>

        {/* Acciones principales */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <GradientButton
            onClick={onOpenLogin}
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold gap-2.5 shadow-[0_0_30px_rgba(249,115,22,0.25)]"
          >
            <IconRocket className="w-5 h-5" />
            Comenzar Ahora — Es Gratis
          </GradientButton>

          <GradientButton
            variant="secondary"
            size="lg"
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold gap-2.5"
          >
            <IconLogin className="w-5 h-5 text-amber-400" />
            Ya tengo una cuenta
          </GradientButton>
        </div>

        {/* Micro-puntos de confianza */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <IconCheck className="w-4 h-4 text-orange-400" />
            100% Gratuito
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck className="w-4 h-4 text-orange-400" />
            Sin tarjeta ni suscripción
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck className="w-4 h-4 text-orange-400" />
            Práctica en navegador
          </span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
