'use client';

import React from 'react';
import { CosmicRoadmap } from './CosmicRoadmap';

export const MethodologySection: React.FC = () => {
  return (
    <div id="metodologia" className="bg-slate-950">
      {/* Cabecera Principal */}
      <section className="py-20 md:py-28 relative overflow-hidden border-t border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            ¿Por qué nuestro método{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              es el mejor
            </span>
            ?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-sans">
            Cuatro principios simples diseñados para que aprendas a programar de verdad.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 01: Rachas (Texto a la Izquierda / Stat a la Derecha)
          ========================================================= */}
      <section id="rachas" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Texto Izquierda */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Rachas que encienden tu hábito diario
              </h3>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                15 minutos al día son suficientes. La constancia diaria vence a cualquier maratón de fin de semana y convierte la programación en una segunda naturaleza.
              </p>

              <p className="text-xs font-mono text-slate-500 pt-1">
                Constancia diaria · 15 min al día para avanzar sin quemarte
              </p>
            </div>

            {/* Métrica Derecha */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center text-left lg:text-right space-y-2">
              <span className="font-display text-7xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent leading-none select-none">
                15m
              </span>
              <span className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                Al día para crear el hábito
              </span>
              <span className="text-xs font-mono text-slate-500">
                Micro-sesiones progresivas diseñadas para no abandonar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 02: Roadmap Cósmico Gamificado (Skill Tree)
          ========================================================= */}
      <section id="roadmap" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative">
          <div className="space-y-4 text-left max-w-3xl">
            <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Un roadmap claro, paso a paso
            </h3>

            <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans">
              Sabes exactamente qué aprender hoy y qué sigue mañana. Una ruta estructurada inspirada en árboles de habilidades que te permite visualizar tu dominio, desbloquear nuevos sectores técnicos y avanzar con dirección sin perderte en tutoriales infinitos.
            </p>
          </div>

          {/* Canvas Cósmico Interactivo */}
          <CosmicRoadmap />
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 03: Código Real (Texto a la Izquierda / Stat 4X a la Derecha)
          ========================================================= */}
      <section id="codigo-real" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Texto Izquierda */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                1 concepto = 1 reto en código real
              </h3>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Nadie aprende a programar mirando videos pasivamente. Cada explicación dura 2 minutos y te reta a escribir y ejecutar código en vivo directamente en tu navegador.
              </p>

              <p className="text-xs font-mono text-slate-500 pt-1">
                Aprendizaje activo · Escribiendo y ejecutando en tu navegador
              </p>
            </div>

            {/* Métrica 4X Derecha */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center text-left lg:text-right space-y-2">
              <span className="font-display text-7xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-br from-amber-400 via-orange-400 to-orange-600 bg-clip-text text-transparent leading-none select-none">
                4x
              </span>
              <span className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                Mayor retención activa
              </span>
              <span className="text-xs font-mono text-slate-500">
                Frente al consumo pasivo de tutoriales en video
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 04: Pistas Inteligentes (Centrado Amplio y Contundente)
          ========================================================= */}
      <section id="pistas" className="py-28 md:py-36 relative overflow-hidden border-t border-slate-900/80">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_70%)] blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Pistas que te enseñan a pensar, no spoilers
          </h3>

          <p className="text-slate-400 text-base sm:text-xl leading-relaxed font-sans max-w-2xl mx-auto">
            Si te equivocas, Koda no te regala la respuesta ni te deja frustrado con un error incomprensible. Te orienta con preguntas guía para que descubras la lógica por ti mismo y pienses como ingeniero.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            <p className="text-xs sm:text-sm font-mono text-slate-500 border-t border-slate-900 pt-4">
              "El objetivo no es que copies código, es que entiendas cómo resolverlo."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MethodologySection;
