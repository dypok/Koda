'use client';

import React from 'react';
import { Zap, Target, Lightbulb, BookMarked, Check, X, ShieldCheck } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const pillars = [
    {
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      tag: 'Micro-Lecciones Atómicas',
      title: 'Dosis de 40 a 70 palabras',
      description:
        'Cero muros de texto intimidantes. Cada lección enseña exactamente una sola idea conceptual que puedes leer y entender en menos de 90 segundos.',
    },
    {
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      tag: 'Práctica Instantánea',
      title: '1 Concepto = 1 Desafío en Vivo',
      description:
        'Nunca te dejamos solo con teoría abstracta. Inmediatamente después de cada concepto, resuelves un reto interactivo para consolidar la memoria muscular.',
    },
    {
      icon: Lightbulb,
      color: 'from-blue-500 to-indigo-500',
      tag: 'Pedagogía Constructiva',
      title: 'Pistas Inteligentes Sin Spoilers',
      description:
        'Si te equivocas, no te regalamos la respuesta ni te castigamos. Koda te da una pista analógica que estimula tu razonamiento para que descubras la solución.',
    },
    {
      icon: BookMarked,
      color: 'from-purple-500 to-pink-500',
      tag: 'Práctica Deliberada',
      title: 'Cuaderno de Errores Persistente',
      description:
        'Tus fallos se guardan en un cuaderno de laboratorio personal. Puedes repasarlos cuando quieras y ganar +5 XP extra al demostrar que ya dominas el concepto.',
    },
  ];

  return (
    <section id="metodologia" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            La Ciencia de Aprender Sin Frustración
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            El Método Koda 🦊
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Diseñado especialmente para personas que intentaron aprender a programar y lo abandonaron por aburrimiento o complejidad innecesaria.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 hover:border-amber-500/40 transition-all hover:-translate-y-1 shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${pillar.color} shadow-lg shadow-black/40 mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-slate-950 font-bold" />
                  </div>
                  <span className="block text-xs font-bold text-amber-400/90 tracking-wide uppercase mb-1">
                    {pillar.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table / Box: Traditional vs Koda */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
            ¿Por qué Koda funciona cuando otros cursos fallan?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional courses */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base pb-2 border-b border-rose-500/20">
                <X className="w-5 h-5 text-rose-500" />
                <span>Cursos Tradicionales</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Videos pasivos de 45 minutos donde solo miras a alguien más tipear.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Instalaciones complejas de terminal y entornos que fallan el primer día.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Errores crípticos que te dejan atascado durante horas sin saber qué hiciste mal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Tasa de abandono superior al 90% antes del segundo módulo.</span>
                </li>
              </ul>
            </div>

            {/* Koda Experience */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-4 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base pb-2 border-b border-emerald-500/20">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>La Experiencia Koda 🦊</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Micro-lecciones de 2 minutos donde tú eres quien escribe y prueba código.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cero instalaciones: todo corre en tu navegador con latencia instantánea.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Koda te acompaña con pistas constructivas y celebración a cada paso.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gamificación con rachas diarias, estrellas y un certificado final verificable.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
