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
}

const UPCOMING_TECHNOLOGIES: TechItem[] = [
  {
    name: 'Python',
    icon: IconBrandPython,
    color: '#38BDF8',
  },
  {
    name: 'JavaScript',
    icon: IconBrandJavascript,
    color: '#FACC15',
  },
  {
    name: 'TypeScript',
    icon: IconBrandTypescript,
    color: '#60A5FA',
  },
  {
    name: 'Rust',
    icon: IconBrandRust,
    color: '#FB923C',
  },
  {
    name: 'Java',
    icon: IconCoffee,
    color: '#F97316',
  },
  {
    name: 'Go',
    icon: IconBrandGolang,
    color: '#22D3EE',
  },
  {
    name: 'C++',
    icon: IconBrandCpp,
    color: '#818CF8',
  },
  {
    name: 'C#',
    icon: IconBrandCSharp,
    color: '#C084FC',
  },
  {
    name: 'React',
    icon: IconBrandReact,
    color: '#67E8F9',
  },
  {
    name: 'Docker',
    icon: IconBrandDocker,
    color: '#38BDF8',
  },
  {
    name: 'SQL',
    icon: IconBrandMysql,
    color: '#FBBF24',
  },
  {
    name: 'Kotlin',
    icon: IconBrandKotlin,
    color: '#A855F7',
  },
];

export const UpcomingTechCarousel: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Indicador integrado sin bordes ni contenedor de tarjeta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
          Próximamente
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-xs text-slate-500 hidden sm:inline font-medium">
          Nuevos lenguajes y tecnologías en desarrollo
        </span>
      </div>

      {/* Carrusel integrado directamente con el fondo (sin burbujas ni cajas) */}
      <div className="relative w-full max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-2">
          {/* Duplicamos la lista para crear un bucle visual infinito continuo */}
          {[...UPCOMING_TECHNOLOGIES, ...UPCOMING_TECHNOLOGIES].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`${tech.name}-${idx}`}
                className="group flex items-center gap-2.5 px-3 py-1.5 transition-all duration-300 cursor-default flex-shrink-0 select-none opacity-65 hover:opacity-100"
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-120"
                  style={{ color: tech.color }}
                />
                <span className="text-sm font-semibold tracking-tight text-slate-300 group-hover:text-white transition-colors duration-300">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTechCarousel;
