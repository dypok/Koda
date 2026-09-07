'use client';

import React from 'react';
import {
  IconBrandPython,
  IconBrandJavascript,
  IconBrandTypescript,
  IconBrandRust,
  IconBrandGolang,
  IconBrandCpp,
  IconBrandCSharp,
  IconBrandReact,
  IconBrandDocker,
  IconBrandMysql,
  IconBrandKotlin,
  IconCoffee,
} from '@tabler/icons-react';

interface TechItem {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  category: string;
}

const UPCOMING_TECHNOLOGIES: TechItem[] = [
  {
    name: 'Python',
    icon: IconBrandPython,
    color: '#38BDF8',
    category: 'Track Activo',
  },
  {
    name: 'JavaScript',
    icon: IconBrandJavascript,
    color: '#FACC15',
    category: 'Próximamente',
  },
  {
    name: 'TypeScript',
    icon: IconBrandTypescript,
    color: '#60A5FA',
    category: 'Próximamente',
  },
  {
    name: 'Rust',
    icon: IconBrandRust,
    color: '#FB923C',
    category: 'Próximamente',
  },
  {
    name: 'Java',
    icon: IconCoffee,
    color: '#F97316',
    category: 'Próximamente',
  },
  {
    name: 'Go',
    icon: IconBrandGolang,
    color: '#22D3EE',
    category: 'Próximamente',
  },
  {
    name: 'C++',
    icon: IconBrandCpp,
    color: '#818CF8',
    category: 'Próximamente',
  },
  {
    name: 'C#',
    icon: IconBrandCSharp,
    color: '#C084FC',
    category: 'Próximamente',
  },
  {
    name: 'React',
    icon: IconBrandReact,
    color: '#67E8F9',
    category: 'Próximamente',
  },
  {
    name: 'Docker',
    icon: IconBrandDocker,
    color: '#38BDF8',
    category: 'Próximamente',
  },
  {
    name: 'SQL',
    icon: IconBrandMysql,
    color: '#FBBF24',
    category: 'Próximamente',
  },
  {
    name: 'Kotlin',
    icon: IconBrandKotlin,
    color: '#A855F7',
    category: 'Próximamente',
  },
];

export const UpcomingTechCarousel: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Badge Header: Próximamente */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Próximamente
        </span>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Nuevos lenguajes y tecnologías en desarrollo
        </span>
      </div>

      {/* Carrusel con Marquesina Infinita Continua */}
      <div className="relative w-full max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-3 py-1">
          {/* Duplicamos la lista para crear un bucle visual infinito sin cortes */}
          {[...UPCOMING_TECHNOLOGIES, ...UPCOMING_TECHNOLOGIES].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`${tech.name}-${idx}`}
                className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-slate-700 backdrop-blur-md text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 cursor-default flex-shrink-0 shadow-sm"
              >
                <Icon
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-115"
                  style={{ color: tech.color }}
                />
                <span className="tracking-tight">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTechCarousel;
