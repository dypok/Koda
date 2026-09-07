'use client';

import React from 'react';
import {
  IconFlame,
  IconRoute,
  IconCode,
  IconSparkles,
} from '@tabler/icons-react';

export const MethodologySection: React.FC = () => {
  return (
    <section id="metodologia" className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
      {/* Resplandor ambiental de fondo integrado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent_70%)] pointer-events-none" />

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

        {/* Distribución integrada abierta con divisores arquitectónicos tipo cruz */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-slate-800/60">
          {/* 01: Rachas y Hábito */}
          <div className="py-10 md:py-14 md:pr-10 lg:pr-14 border-b md:border-r border-slate-800/60 flex flex-col justify-between space-y-8 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconFlame className="w-7 h-7 text-orange-400 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400/90">
                    Constancia & Hábito
                  </span>
                </div>
                <span className="font-mono text-2xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                  01
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Rachas que encienden tu progreso diario
              </h3>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                Aprender a programar es como entrenar un idioma: 15 minutos al día con práctica constante superan por completo a un atracón de fin de semana. Mantén tu fuego encendido cada día y consolida tu memoria sin agotarte.
              </p>
            </div>

            {/* Micro-visual: Rachas semanales */}
            <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      idx < 5
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                        : 'bg-slate-900/60 text-slate-600 border border-slate-800/80'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono font-bold">
                <IconFlame className="w-3.5 h-3.5 fill-orange-400" />
                <span>5 días seguidos · +15 min hoy</span>
              </div>
            </div>
          </div>

          {/* 02: Roadmap Guiado */}
          <div className="py-10 md:py-14 md:pl-10 lg:pl-14 border-b border-slate-800/60 flex flex-col justify-between space-y-8 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconRoute className="w-7 h-7 text-amber-400 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400/90">
                    Ruta Estructurada
                  </span>
                </div>
                <span className="font-mono text-2xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                  02
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Un roadmap claro, sin perderte en el camino
              </h3>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                Se acabó la parálisis por análisis y los tutoriales dispersos. Sigue una ruta paso a paso donde cada lección desbloquea la siguiente en orden pedagógico, guiándote desde cero hasta escribir tus propios programas.
              </p>
            </div>

            {/* Micro-visual: Roadmap secuencial */}
            <div className="pt-6 border-t border-slate-900 flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold whitespace-nowrap">
                <span className="text-amber-400">01</span>
                <span>Fundamentos</span>
              </div>
              <span className="text-slate-600 font-bold">➔</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300/80 border border-amber-500/20 whitespace-nowrap">
                <span className="text-amber-400/70">02</span>
                <span>Lógica</span>
              </div>
              <span className="text-slate-600 font-bold">➔</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 text-slate-400 border border-slate-800/80 whitespace-nowrap">
                <span className="text-slate-500">03</span>
                <span>Proyectos</span>
              </div>
            </div>
          </div>

          {/* 03: Código Real y Práctica Activa */}
          <div className="py-10 md:py-14 md:pr-10 lg:pr-14 border-b md:border-b-0 md:border-r border-slate-800/60 flex flex-col justify-between space-y-8 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconCode className="w-7 h-7 text-orange-400 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400/90">
                    Aprender Haciendo
                  </span>
                </div>
                <span className="font-mono text-2xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                  03
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                1 concepto = 1 reto en código real
              </h3>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                Nadie aprende a programar mirando videos pasivamente. En Koda cada lección dura menos de 2 minutos y te pide resolver un reto con código real en tu navegador. Comprobando tu lógica en vivo retienes 4 veces más.
              </p>
            </div>

            {/* Micro-visual: Ejecución interactiva */}
            <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300">
                <span className="text-orange-400 font-bold">&gt;</span>
                <span className="text-amber-300">python main.py</span>
                <span className="text-slate-500">→</span>
                <span className="text-orange-400 font-semibold">✓ Test superado</span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                <strong className="text-white font-semibold">4x</strong> retención activa
              </span>
            </div>
          </div>

          {/* 04: Pistas Inteligentes */}
          <div className="py-10 md:py-14 md:pl-10 lg:pl-14 flex flex-col justify-between space-y-8 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconSparkles className="w-7 h-7 text-amber-400 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400/90">
                    Pedagogía Guiada
                  </span>
                </div>
                <span className="font-mono text-2xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                  04
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Pistas inteligentes que te enseñan a pensar
              </h3>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                Si te equivocas, Koda no te da la respuesta directamente ni te deja atascado. Te ofrece pistas constructivas que estimulan tu razonamiento para que descubras el error y entrenes tu pensamiento algorítmico.
              </p>
            </div>

            {/* Micro-visual: Pista guiada */}
            <div className="pt-6 border-t border-slate-900 flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <IconSparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-sans text-xs text-slate-300">
                <strong className="text-amber-400 font-medium">Pista guiada:</strong> Recuerda verificar el tipo de dato antes de concatenar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
