'use client';

import React, { useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react';
import { UPCOMING_TECHS, type TechItem } from '@/models/landing/technologies.model';
import { cn } from '@/lib/utils';

const TechPill: React.FC<{ tech: TechItem; hidden?: boolean }> = ({ tech, hidden }) => {
  const Icon = tech.icon;
  return (
    <div
      aria-hidden={hidden || undefined}
      className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-1.5 transition-all duration-300 cursor-default flex-shrink-0 select-none hover:border-amber-400/40 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(245,158,11,0.4)]"
    >
      <Icon
        className="w-5 h-5 transition-transform duration-300 group-hover:scale-125"
        style={{ color: tech.color }}
      />
      <span className="text-sm font-semibold tracking-tight text-slate-200 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
        {tech.name}
      </span>
      <span
        role="img"
        aria-label={`Avance ${tech.progress}%`}
        className="flex items-center gap-1.5"
      >
        <span className="h-1 w-8 overflow-hidden rounded-full bg-slate-700/80">
          <span className="block h-full rounded-full bg-amber-400" style={{ width: `${tech.progress}%` }} />
        </span>
        <span className="text-[11px] font-bold tabular-nums text-slate-300">{tech.progress}%</span>
      </span>
    </div>
  );
};

export const UpcomingTechCarousel: React.FC = () => {
  const [paused, setPaused] = useState(false);

  return (
    <div className="w-full flex flex-col items-center select-none overflow-hidden">
      {/* Indicador integrado sin bordes ni cajas */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
          Próximamente
        </span>
        <span aria-hidden="true" className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-xs text-slate-500 hidden sm:inline font-medium">
          Nuevos lenguajes y tecnologías en desarrollo
        </span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
          className="ml-2 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          {paused ? <Play aria-hidden="true" className="w-3.5 h-3.5" /> : <Pause aria-hidden="true" className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Carrusel a ancho completo (100% viewport horizontal sin barras opacas) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div
          className={cn(
            'animate-marquee flex items-center gap-3 sm:gap-4 py-2 w-max will-change-transform hover:[animation-play-state:paused]',
            '[animation-duration:28s] sm:[animation-duration:48s]',
            paused && '[animation-play-state:paused]'
          )}
        >
          {/* Duplicamos la lista para crear un bucle visual continuo e infinito */}
          {UPCOMING_TECHS.map((tech, idx) => (
            <TechPill key={`${tech.name}-${idx}`} tech={tech} />
          ))}
          {UPCOMING_TECHS.map((tech, idx) => (
            <TechPill key={`${tech.name}-dup-${idx}`} tech={tech} hidden />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTechCarousel;
