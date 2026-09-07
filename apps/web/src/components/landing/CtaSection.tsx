'use client';

import React from 'react';
import Image from 'next/image';
import { LogIn, BookOpen, Sparkles } from 'lucide-react';

interface CtaSectionProps {
  onOpenLogin?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenLogin }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 p-8 sm:p-14 shadow-2xl backdrop-blur-2xl text-center relative">
          {/* Mascot in Official 3D Form */}
          <div className="flex justify-center -mt-8 mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <Image
              src="/brand/koda-mascot.png"
              alt="Koda"
              width={220}
              height={160}
              className="relative z-10 object-contain drop-shadow-[0_15px_30px_rgba(245,158,11,0.3)] animate-float"
            />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Formación Activa en Programación
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Comienza a programar hoy mismo
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Inicia con el track oficial de Python 3.12 y sienta las bases lógicas universales. Sin configuraciones complejas, a tu propio ritmo y con práctica directa en tu navegador.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 px-8 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[length:200%_auto] hover:bg-right"
              >
                <LogIn className="w-5 h-5 text-slate-950" />
                Iniciar Sesión
              </button>

              <button
                onClick={() => scrollTo('temario')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-7 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-sm"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                Explorar Tracks Formativos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
