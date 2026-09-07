'use client';

import React from 'react';
import {
  IconGift,
  IconTrophy,
  IconTerminal2,
} from '@tabler/icons-react';
import { BorderGlow } from '@/components/ui/border-glow';

export const InteractivePreview: React.FC = () => {
  return (
    <section id="propuesta-valor" className="py-20 md:py-28 border-y border-slate-800/80 bg-slate-950/80 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Principal con Rajdhani Display y tonos Naranja/Ámbar oficiales */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Aprende{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              100% gratis
            </span>{' '}
            con los mejores resultados
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Sin suscripciones ocultas ni muros de pago. Un método interactivo de micro-lecciones y práctica deliberada diseñado para que domines la lógica de programación y alcances tu máximo potencial.
          </p>
        </div>

        {/* 3 Cards con BorderGlow y colores individuales de la paleta cálida de Koda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: 100% Gratuito (Orange Brand Glow) */}
          <BorderGlow
            borderRadius={20}
            backgroundColor="#0B0F19"
            glowColor="24 95 60"
            colors={['#F97316', '#FB923C', '#EA580C']}
            className="h-full"
            contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 transition-transform group-hover:scale-110">
                <IconGift className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                100% Gratuito
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                Educación tecnológica de alta calidad accesible para todos. Acceso libre a lecciones, retos y proyectos sin costo alguno.
              </p>
            </div>
          </BorderGlow>

          {/* Card 2: Los Mejores Resultados (Amber Gold Glow) */}
          <BorderGlow
            borderRadius={20}
            backgroundColor="#0B0F19"
            glowColor="45 95 60"
            colors={['#F59E0B', '#FBBF24', '#D97706']}
            className="h-full"
            contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 transition-transform group-hover:scale-110">
                <IconTrophy className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Los Mejores Resultados
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                La práctica deliberada con código real genera una retención hasta 4x superior a mirar tutoriales pasivos en video.
              </p>
            </div>
          </BorderGlow>

          {/* Card 3: Código Real en Vivo (Sunset Flame Glow) */}
          <BorderGlow
            borderRadius={20}
            backgroundColor="#0B0F19"
            glowColor="15 95 60"
            colors={['#EA580C', '#F97316', '#FB923C']}
            className="h-full"
            contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-600/25 flex items-center justify-center text-orange-400 transition-transform group-hover:scale-110">
                <IconTerminal2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Código Real en Vivo
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                Consola y motor de ejecución en tu navegador. Comprueba de inmediato el funcionamiento de tu lógica sin instalaciones.
              </p>
            </div>
          </BorderGlow>
        </div>
      </div>
    </section>
  );
};

export default InteractivePreview;
