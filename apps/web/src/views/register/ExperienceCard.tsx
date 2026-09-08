'use client';

import React from 'react';
import { ExperienceOption } from '@/models/register/register.model';
import { cn } from '@/lib/utils';

interface ExperienceCardProps {
  option: ExperienceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(option.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(option.id)}
      className={cn(
        'group relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left outline-none',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50'
          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
      )}
    >
      {/* Icono flotante con su color oficial sin burbuja */}
      <IconComponent
        className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ color: option.color }}
      />

      {/* Contenido limpio: titulo y descripcion sin spans informativos */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-base font-bold text-white tracking-tight leading-tight mb-1">
          {option.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {option.description}
        </p>
      </div>
    </div>
  );
};
