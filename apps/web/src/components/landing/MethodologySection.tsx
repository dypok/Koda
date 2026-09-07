'use client';

import React from 'react';
import {
  IconBatteryCharging,
  IconHierarchy2,
  IconDeviceDesktopCode,
  IconPuzzle,
} from '@tabler/icons-react';

const SECTIONS = [
  {
    id: 'rachas',
    tag: '01 · Rachas',
    icon: IconBatteryCharging,
    title: 'Rachas que encienden tu hábito diario',
    description:
      '15 minutos al día son suficientes. La constancia diaria vence a cualquier maratón de fin de semana y convierte la programación en una segunda naturaleza.',
    detail: 'Constancia diaria · 15 min al día',
    accentColor: 'text-orange-400',
    glowColor: 'from-orange-500/10 via-orange-500/5 to-transparent',
  },
  {
    id: 'roadmap',
    tag: '02 · Roadmap',
    icon: IconHierarchy2,
    title: 'Un roadmap claro, paso a paso',
    description:
      'Sabes exactamente qué aprender hoy y qué sigue mañana. Una ruta secuencial estructurada desde las bases hasta escribir tus propios programas sin perderte en tutoriales infinitos.',
    detail: 'Ruta progresiva · Sin saltos al vacío',
    accentColor: 'text-amber-400',
    glowColor: 'from-amber-500/10 via-amber-500/5 to-transparent',
  },
  {
    id: 'codigo-real',
    tag: '03 · Código Real',
    icon: IconDeviceDesktopCode,
    title: '1 concepto = 1 reto en código real',
    description:
      'Nadie aprende a programar mirando videos pasivamente. Cada explicación dura 2 minutos y te reta a escribir y ejecutar código en vivo directamente en tu navegador.',
    detail: 'Aprendizaje activo · Retención 4x superior',
    accentColor: 'text-orange-400',
    glowColor: 'from-orange-600/10 via-orange-500/5 to-transparent',
  },
  {
    id: 'pistas',
    tag: '04 · Pistas',
    icon: IconPuzzle,
    title: 'Pistas que te enseñan a pensar',
    description:
      'Si te equivocas, Koda no te regala la respuesta ni te deja frustrado. Te orienta con preguntas guía para que descubras la lógica por ti mismo y pienses como ingeniero.',
    detail: 'Razonamiento guiado · Cero spoilers',
    accentColor: 'text-amber-400',
    glowColor: 'from-amber-400/10 via-orange-500/5 to-transparent',
  },
];

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

      {/* 4 Secciones Diferentes, Limpias y al Grano */}
      {SECTIONS.map((sec, idx) => {
        const Icon = sec.icon;
        return (
          <section
            key={sec.id}
            id={sec.id}
            className="py-20 md:py-28 relative overflow-hidden border-t border-slate-900/80"
          >
            {/* Resplandor ambiental de fondo individual */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r ${sec.glowColor} blur-3xl pointer-events-none`}
            />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
              {/* Tag con Icono */}
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-semibold text-slate-400">
                <Icon className={`w-5 h-5 ${sec.accentColor}`} />
                <span>{sec.tag}</span>
              </div>

              {/* Titular Impactante */}
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                {sec.title}
              </h3>

              {/* Texto Simple y al Grano */}
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
                {sec.description}
              </p>

              {/* Micro-indicador limpio */}
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-500 tracking-wide">
                  {sec.detail}
                </span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MethodologySection;
