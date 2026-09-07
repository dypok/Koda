'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Code2, Terminal, Sparkles } from 'lucide-react';
import { KodaMascot } from '../mascot/KodaMascot';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-orange-500/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm backdrop-blur-sm">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Python 3.12 · Aprendizaje Interactivo y Gamificado</span>
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

          {/* Right Column: PixiJS Mascot & Visual Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-xl pointer-events-none" />

              {/* Card Container */}
              <div className="relative w-full max-w-sm rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
                {/* Status Indicator & View Mode Selector */}
                <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Mascota Oficial Koda</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setViewMode('3d')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        viewMode === '3d'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3D Oficial
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('2d')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        viewMode === '2d'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      WebGL 2D
                    </button>
                  </div>
                </div>

                {/* Mascot Visual Display */}
                {viewMode === '3d' ? (
                  <div className="relative py-3 flex items-center justify-center min-h-[250px] w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/15 via-amber-500/10 to-transparent rounded-2xl blur-xl pointer-events-none" />
                    <Image
                      src="/brand/koda-mascot.png"
                      alt="Koda — Mascota Oficial KodaAcademy"
                      width={280}
                      height={200}
                      className="relative z-10 object-contain drop-shadow-[0_15px_25px_rgba(245,158,11,0.3)] animate-float"
                      priority
                    />
                  </div>
                ) : (
                  <div className="py-2 cursor-pointer transition-transform hover:scale-105 active:scale-95" title="¡Mueve el cursor para que Koda te siga con la mirada!">
                    <KodaMascot size={260} mood="idle" interactive={true} />
                  </div>
                )}

                {/* Speech Bubble / Mascot Message */}
                <div className="relative -mt-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 p-3.5 shadow-inner">
                  <p className="text-sm font-semibold text-slate-100">
                    «¡Hola! Soy Koda. Te acompañaré paso a paso en KodaAcademy para que domines Python sin miedo a equivocarte.»
                  </p>
                  <p className="text-[11px] text-amber-300/90 mt-1 font-medium">
                    100% interactivo · En tu navegador · Código real de Python 3.12
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
