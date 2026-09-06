'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Flame, Sparkles, Terminal } from 'lucide-react';
import { KodaMascot } from '../mascot/KodaMascot';

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-orange-500/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                La forma más divertida de aprender a programar
              </span>
            </div>

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
              Olvida los videos pasivos de 40 minutos y los muros de texto aburridos. En <strong>Koda</strong> dominas <strong>Python 3.12</strong> con micro-lecciones atómicas de 2 minutos, práctica inmediata con cero configuración y la compañía de Koda 🦊.
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
                onClick={() => scrollTo('waitlist')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 px-7 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[length:200%_auto] hover:bg-right"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                Reservar Mi Lugar Gratis
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                onClick={() => scrollTo('demo-interactiva')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-6 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-sm"
              >
                <Terminal className="w-5 h-5 text-amber-400" />
                Probar Demo en Vivo
              </button>
            </div>

            {/* Social Proof / Early Adopters counter */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950 bg-amber-500 flex items-center justify-center text-[11px] font-bold text-slate-950">🦊</div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950 bg-indigo-500 flex items-center justify-center text-[11px] font-bold text-white">🐍</div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950 bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-slate-950">⭐</div>
              </div>
              <span>Únete a más de <strong>500+ estudiantes</strong> esperando el lanzamiento oficial</span>
            </div>
          </div>

          {/* Right Column: PixiJS Mascot & Visual Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-xl pointer-events-none" />

              {/* Card Container */}
              <div className="relative w-full max-w-sm rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
                {/* Status Indicator */}
                <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Koda WebGL Engine</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px] font-semibold">60 FPS</span>
                </div>

                {/* PixiJS Fox Canvas */}
                <div className="py-2 cursor-pointer transition-transform hover:scale-105 active:scale-95" title="¡Mueve el cursor para que Koda te siga con la mirada!">
                  <KodaMascot size={260} mood="idle" interactive={true} />
                </div>

                {/* Speech Bubble / Mascot Message */}
                <div className="relative -mt-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 p-3.5 shadow-inner">
                  <p className="text-sm font-semibold text-slate-100">
                    «¡Hola! Soy Koda. Te acompañaré paso a paso para que domines Python sin miedo a equivocarte.»
                  </p>
                  <p className="text-[11px] text-amber-300/90 mt-1 font-medium">
                    100% interactivo · En tu navegador · Sin instalar nada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
