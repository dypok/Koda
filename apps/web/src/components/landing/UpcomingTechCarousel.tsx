'use client';

import React from 'react';
import { UPCOMING_TECHS } from '@/models/landing/technologies.model';

export const UpcomingTechCarousel: React.FC = () => {
  const duplicatedTechs = [...UPCOMING_TECHS, ...UPCOMING_TECHS];

  return (
    <div className="relative w-full overflow-hidden select-none py-4">
      {/* Máscara de difuminado lateral suave */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10" />

      {/* Riel de marquesina continua */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-8 sm:gap-12">
        {duplicatedTechs.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div
              key={`${tech.name}-${index}`}
              className="flex items-center gap-2.5 opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer group shrink-0"
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-800/80 group-hover:border-slate-700 transition-colors shadow-sm"
                style={{ color: tech.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-sans font-medium text-slate-300 group-hover:text-white transition-colors">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingTechCarousel;
