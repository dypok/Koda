'use client';

import React from 'react';
import {
  IconBatteryCharging,
  IconHierarchy2,
  IconDeviceDesktopCode,
  IconPuzzle,
} from '@tabler/icons-react';

export const MethodologySection: React.FC = () => {
  return (
    <section id="metodologia" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Resplandor ambiental de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06),transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 md:mb-20">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            ¿Por qué nuestro método{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              es el mejor
            </span>
            ?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Aprender a programar no tiene por qué ser aburrido ni abrumador. Un enfoque directo y gamificado diseñado para construir el hábito diario y avanzar sin frustración.
          </p>
        </div>

        {/* Textos bien organizados y limpios sin cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 lg:gap-x-16 lg:gap-y-14 max-w-5xl mx-auto">
          {/* 01: Rachas */}
          <div className="space-y-3">
            <IconBatteryCharging className="w-8 h-8 text-orange-400" />
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              Rachas que encienden tu hábito diario
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              Aprender a programar es como entrenar un idioma: 15 minutos al día con práctica constante superan por completo a un atracón de fin de semana. Mantén tu fuego encendido cada día y consolida tu memoria sin agotarte.
            </p>
          </div>

          {/* 02: Roadmap */}
          <div className="space-y-3">
            <IconHierarchy2 className="w-8 h-8 text-amber-400" />
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              Un roadmap claro, paso a paso
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              Se acabó la parálisis por análisis y los tutoriales dispersos. Sigue una ruta secuencial donde cada lección desbloquea la siguiente en orden pedagógico, guiándote desde cero hasta escribir tus propios programas.
            </p>
          </div>

          {/* 03: Código Real */}
          <div className="space-y-3">
            <IconDeviceDesktopCode className="w-8 h-8 text-orange-400" />
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              1 concepto = 1 reto en código real
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              Nadie aprende a programar mirando videos pasivamente. En Koda cada lección dura 2 minutos y te pide resolver un reto escribiendo y ejecutando código directamente en tu navegador. Comprobando tu lógica en vivo retienes 4 veces más.
            </p>
          </div>

          {/* 04: Pistas */}
          <div className="space-y-3">
            <IconPuzzle className="w-8 h-8 text-amber-400" />
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              Pistas que te enseñan a pensar
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              Si te equivocas, Koda no te da la respuesta directamente ni te deja atascado con un error críptico. Te ofrece pistas constructivas que estimulan tu razonamiento para que descubras la solución y pienses como ingeniero.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
