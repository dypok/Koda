import React from 'react';
import { Flame, Route, SquareTerminal, Lightbulb } from 'lucide-react';

export interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  blurb: string;
  icon: React.ElementType;
  badgeBorder: string;
  badgeText: string;
  hoverBorder: string;
  hoverShadow: string;
}

export const PILLARS: Pillar[] = [
  {
    id: 'rachas',
    title: 'Rachas Diarias',
    subtitle: '15 min al día',
    blurb: 'La constancia enciende tu racha y convierte 15 minutos diarios en un hábito que no se rompe.',
    icon: Flame,
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    hoverBorder: 'group-hover:border-orange-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]',
  },
  {
    id: 'roadmap',
    title: 'Roadmap Claro',
    subtitle: 'Paso a paso',
    blurb: 'Siempre sabes qué sigue: una ruta secuencial de 12 módulos, sin perderte en tutoriales infinitos.',
    icon: Route,
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    hoverBorder: 'group-hover:border-amber-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]',
  },
  {
    id: 'codigo-real',
    title: 'Código Real',
    subtitle: 'Retención 4x',
    blurb: 'Cada idea se practica al instante en tu navegador. Se aprende haciendo, no mirando videos.',
    icon: SquareTerminal,
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    hoverBorder: 'group-hover:border-orange-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]',
  },
  {
    id: 'pistas',
    title: 'Pistas Guiadas',
    subtitle: 'Sin spoilers',
    blurb: 'Si fallas, Koda te orienta con preguntas guía hasta que la lógica hace clic. Nunca regala respuestas.',
    icon: Lightbulb,
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    hoverBorder: 'group-hover:border-amber-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]',
  },
];
