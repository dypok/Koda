'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import { LightRays } from './LightRays';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative isolate overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Ambient Light Rays from top center */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#f59e0b"
          raysSpeed={0.8}
          lightSpread={1.2}
          rayLength={2.5}
          pulsating={true}
          fadeDistance={1.2}
          saturation={1.3}
          followMouse={true}
          mouseInfluence={0.12}
          noiseAmount={0.02}
          distortion={0.03}
        />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Aprende a programar{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                como juegas
              </span>
              . Cero frustración.
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
              Olvida los videos pasivos de 40 minutos y los muros de texto aburridos. En <strong>KodaAcademy</strong> dominas <strong>Python 3.12</strong> con micro-lecciones atómicas de 2 minutos, práctica inmediata con cero configuración y la compañía de Koda.
            </p>

            {/* Value Proposition Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left pt-2">
              <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">1 Concepto = 1 Práctica inmediata</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Pistas inteligentes sin spoilers</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Certificado con código QR</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 px-7 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[length:200%_auto] hover:bg-right"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                onClick={() => scrollTo('temario')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-6 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-sm"
              >
                <Terminal className="w-5 h-5 text-amber-400" />
                Explorar Temario Oficial
              </button>
            </div>
          </div>

          {/* Right Column: Mascota Oficial Koda integrada orgánicamente sin card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md flex flex-col items-center">
              {/* Ambient Backlight Glow for Koda */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-b from-amber-500/25 via-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Floating Badge above Mascot */}
              <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-lg text-xs font-medium text-slate-300 backdrop-blur-md mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Mascota Oficial Koda</span>
              </div>

              {/* Koda Mascot 3D Image */}
              <div className="relative z-10 py-2 flex items-center justify-center w-full">
                <Image
                  src="/brand/koda-mascot.png"
                  alt="Koda — Mascota Oficial KodaAcademy"
                  width={340}
                  height={240}
                  className="relative z-10 object-contain drop-shadow-[0_20px_35px_rgba(245,158,11,0.35)] animate-float select-none"
                  priority
                />
              </div>

              {/* Speech Bubble / Mascot Message */}
              <div className="relative z-10 w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 p-4 shadow-xl backdrop-blur-md text-center">
                {/* Speech triangle pointer towards Koda */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-t border-l border-amber-500/30 rotate-45" />

                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  «¡Hola! Soy Koda. Te acompañaré paso a paso en KodaAcademy para que domines Python sin miedo a equivocarte.»
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2">
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    100% interactivo · En tu navegador · Código real de Python 3.12
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
