import React from 'react';
import { Flame, Path, TerminalWindow, Lightbulb } from '@phosphor-icons/react';

export interface Pillar {
  id: string;
  title: string;
  subtitle: string;
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
    icon: Path,
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    hoverBorder: 'group-hover:border-amber-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]',
  },
  {
    id: 'codigo-real',
    title: 'Código Real',
    subtitle: 'Retención 4x',
    icon: TerminalWindow,
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    hoverBorder: 'group-hover:border-orange-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]',
  },
  {
    id: 'pistas',
    title: 'Pistas Guiadas',
    subtitle: 'Sin spoilers',
    icon: Lightbulb,
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    hoverBorder: 'group-hover:border-amber-400',
    hoverShadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]',
  },
];
