'use client';

import React from 'react';
import {
  IconFlame,
  IconRoute,
  IconCode,
  IconSparkles,
} from '@tabler/icons-react';
import { BorderGlow } from '@/components/ui/border-glow';

const FEATURES = [
  {
    id: 'rachas',
    icon: IconFlame,
    tag: 'Hábito & Constancia',
    title: 'Rachas que encienden tu progreso',
    description:
      'Aprender a programar es como entrenar un nuevo hábito: 15 minutos al día superan a 5 horas de atracón el fin de semana. Mantén tu fuego diario encendido y avanza a paso firme.',
    glowColor: '24 95 60',
    colors: ['#F97316', '#FB923C', '#EA580C'],
    iconBg: 'bg-orange-500/10 border-orange-500/25 text-orange-400',
    visual: (
      <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold transition-all ${
                idx < 5
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.15)]'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-bold">
          <IconFlame className="w-3.5 h-3.5 fill-orange-400" />
          <span>5 días seguidos</span>
        </div>
      </div>
    ),
  },
  {
    id: 'roadmap',
    icon: IconRoute,
    tag: 'Ruta Guiada',
    title: 'Un roadmap claro, paso a paso',
    description:
      'Sin saltos imposibles ni perderte en cientos de tutoriales desordenados. Cada lección desbloquea la siguiente en el momento exacto, guiándote desde cero hasta escribir tus propios programas.',
    glowColor: '45 95 60',
    colors: ['#F59E0B', '#FBBF24', '#D97706'],
    iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
    visual: (
      <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold whitespace-nowrap">
          <span>01</span>
          <span>Bases</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400/80 border border-amber-500/20 whitespace-nowrap">
          <span>02</span>
          <span>Lógica</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap">
          <span>03</span>
          <span>Proyectos</span>
        </div>
      </div>
    ),
  },
  {
    id: 'practica',
    icon: IconCode,
    tag: 'Aprender Haciendo',
    title: '1 concepto = 1 reto interactivo',
    description:
      'Nadie aprende a programar mirando a otros. Cada explicación dura 2 minutos y te pone a resolver retos de inmediato con código real directamente en el navegador.',
    glowColor: '15 95 60',
    colors: ['#EA580C', '#F97316', '#FB923C'],
    iconBg: 'bg-orange-600/10 border-orange-600/25 text-orange-400',
    visual: (
      <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-orange-400 font-bold">&gt;</span>
          <span className="text-amber-300">koda.run()</span>
          <span className="text-slate-500">→</span>
          <span className="text-orange-400 font-bold">✓ 100% OK</span>
        </div>
        <span className="text-[11px] text-slate-400 font-sans">Retención 4x superior</span>
      </div>
    ),
  },
  {
    id: 'pistas',
    icon: IconSparkles,
    tag: 'Sin Frustración',
    title: 'Pistas inteligentes que te orientan',
    description:
      'Si te equivocas, Koda no te regala la respuesta ni te deja solo. Te ofrece pistas que estimulan tu razonamiento para que descubras el error y aprendas a pensar como programador.',
    glowColor: '38 95 60',
    colors: ['#FBBF24', '#F59E0B', '#EA580C'],
    iconBg: 'bg-amber-400/10 border-amber-400/25 text-amber-400',
    visual: (
      <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <IconSparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-sans text-[12px] text-slate-300 line-clamp-1">
          <strong className="text-amber-400 font-semibold">Pista:</strong> Comprueba el tipo de dato antes de concatenar.
        </span>
      </div>
    ),
  },
];

export const MethodologySection: React.FC = () => {
  return (
    <section id="metodologia" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
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

        {/* 4 Cards Grid with Individual BorderGlow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <BorderGlow
                key={item.id}
                borderRadius={20}
                backgroundColor="#0B0F19"
                glowColor={item.glowColor}
                colors={item.colors}
                className="h-full"
                contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${item.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Micro-visual preview */}
                {item.visual}
              </BorderGlow>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
