'use client';

import React from 'react';
import Image from 'next/image';
import { IconLogin, IconBook2 } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { BorderGlow } from '@/components/ui/border-glow';

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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <BorderGlow
          borderRadius={28}
          backgroundColor="#090d16"
          glowColor="40 80 80"
          colors={['#FF8A4C', '#FFC18A', '#FF6B2C']}
          className="relative text-center"
          contentClassName="p-8 sm:p-14 text-center items-center overflow-visible"
        >
          {/* Mascot in Official 3D Form */}
          <div className="flex justify-center -mt-8 mb-4 relative">
            <Image
              src="/brand/koda-mascot.png"
              alt="Koda"
              width={220}
              height={160}
              className="relative z-10 object-contain animate-float select-none"
            />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Comienza a programar hoy mismo
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Inicia con el track oficial de Python 3.12 y sienta las bases lógicas universales. Sin configuraciones complejas, a tu propio ritmo y con práctica directa en tu navegador.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <GradientButton
                onClick={onOpenLogin}
                className="w-full sm:w-auto gap-2.5 px-8 py-4 text-base font-extrabold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <IconLogin className="w-5 h-5" />
                Iniciar Sesión
              </GradientButton>

              <button
                onClick={() => scrollTo('temario')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-7 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-sm"
              >
                <IconBook2 className="w-5 h-5 text-amber-400" />
                Explorar Tracks Formativos
              </button>
            </div>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
};
