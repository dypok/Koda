'use client';

import React from 'react';
import {
  IconBolt,
  IconTarget,
  IconBulb,
  IconBookmark,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

import { BorderGlow } from '@/components/ui/border-glow';

export const MethodologySection: React.FC = () => {
  const pillars = [
    {
      icon: IconBolt,
      color: 'from-amber-500 to-orange-500',
      tag: 'Micro-Lecciones Atómicas',
      title: 'Unidades de 1 a 2 Minutos',
      description:
        'Cada lección aborda un único concepto clave sin explicaciones redundantes, facilitando un aprendizaje progresivo y digerible.',
    },
    {
      icon: IconTarget,
      color: 'from-emerald-500 to-teal-500',
      tag: 'Práctica Inmediata',
      title: '1 Concepto = 1 Reto en Vivo',
      description:
        'Inmediatamente después de cada concepto, resuelves un ejercicio interactivo para consolidar la comprensión con código real.',
    },
    {
      icon: IconBulb,
      color: 'from-blue-500 to-indigo-500',
      tag: 'Pedagogía Constructiva',
      title: 'Asistencia Guiada',
      description:
        'Si cometes un error, Koda te orienta con pistas conceptuales que estimulan tu razonamiento sin darte la respuesta directamente.',
    },
    {
      icon: IconBookmark,
      color: 'from-purple-500 to-pink-500',
      tag: 'Práctica Deliberada',
      title: 'Cuaderno de Errores',
      description:
        'Los conceptos no superados se guardan en tu cuaderno de laboratorio para repasarlos y afianzar el dominio antes de avanzar.',
    },
  ];

  return (
    <section id="metodologia" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            El Método KodaAcademy
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Estructura pedagógica diseñada para retener conceptos mediante la práctica continua y el razonamiento lógico guiado.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <BorderGlow
                key={idx}
                borderRadius={24}
                backgroundColor="#0b0f19"
                glowColor="40 80 80"
                colors={['#FF8A4C', '#FFC18A', '#FF6B2C']}
                className="group transition-all hover:-translate-y-1 h-full"
                contentClassName="p-6 justify-between"
              >
                <div>
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${pillar.color} mb-4 group-hover:scale-105 transition-transform`}
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
              </BorderGlow>
            );
          })}
        </div>

        {/* Comparison Table / Box: Traditional vs Koda */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="#0b0f19"
          glowColor="40 80 80"
          colors={['#FF8A4C', '#FFC18A', '#FF6B2C']}
          className="max-w-4xl mx-auto"
          contentClassName="p-6 sm:p-8"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
            Diferencias con la enseñanza tradicional de programación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional courses */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base pb-2 border-b border-rose-500/20">
                <IconX className="w-5 h-5 text-rose-500" />
                <span>Enseñanza Convencional</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <IconX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Tutoriales en video donde el estudiante permanece como espectador pasivo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Fricción técnica inicial: configuración compleja de compiladores y dependencias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Mensajes de error crípticos que generan dudas sin orientación didáctica.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Falta de retroalimentación inmediata sobre la lógica aplicada.</span>
                </li>
              </ul>
            </div>

            {/* Koda Experience */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base pb-2 border-b border-emerald-500/20">
                <IconCheck className="w-5 h-5 text-emerald-400" />
                <span>Metodología KodaAcademy</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Aprendizaje activo: escribes y pruebas código en cada lección.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Entorno web instantáneo sin requerir configuraciones locales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pistas pedagógicas que te enseñan a razonar y corregir el error.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Progresión estructurada por módulos con evaluación y certificación oficial.</span>
                </li>
              </ul>
            </div>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
};
