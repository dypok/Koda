'use client';

import React from 'react';
import { UPCOMING_TECHS } from '@/models/landing/technologies.model';

export const UpcomingTechCarousel: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center select-none overflow-hidden">
      {/* Indicador integrado sin bordes ni cajas */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
          Próximamente
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-xs text-slate-500 hidden sm:inline font-medium">
          Nuevos lenguajes y tecnologías en desarrollo
        </span>
      </div>

      {/* Carrusel a ancho completo (100% viewport horizontal sin barras opacas) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div className="animate-marquee flex items-center gap-8 sm:gap-10 py-2 w-max will-change-transform hover:[animation-play-state:paused]">
          {/* Duplicamos la lista para crear un bucle visual continuo e infinito */}
          {[...UPCOMING_TECHS, ...UPCOMING_TECHS].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`${tech.name}-${idx}`}
                className="group flex items-center gap-2.5 px-2 py-1 transition-all duration-300 cursor-default flex-shrink-0 select-none opacity-65 hover:opacity-100"
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-125"
                  style={{ color: tech.color }}
                />
                <span className="text-sm font-semibold tracking-tight text-slate-300 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
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
