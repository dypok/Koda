'use client';

import React from 'react';
import { ExperienceOption } from '@/models/register/register.model';
import { GlareHover } from '@/components/ui/glare-hover';
import { cn } from '@/lib/utils';

interface ExperienceCardProps {
  option: ExperienceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;

  return (
    <GlareHover
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(option.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(option.id)}
      glareColor="#F97316"
      glareOpacity={0.25}
      transitionDuration={600}
      className={cn(
        'group relative flex items-center gap-4 p-5 rounded-2xl border cursor-pointer select-none text-left outline-none transform-gpu',
        'transition-[border-color,background-color,box-shadow,transform] duration-150 active:scale-[0.985]',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50'
          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
      )}
    >
      {/* Icono con aceleración GPU */}
      <IconComponent
        className="w-8 h-8 shrink-0 transition-transform duration-200 transform-gpu will-change-transform group-hover:scale-110"
        style={{ color: option.color }}
      />

      {/* Contenido limpio: titulo y descripcion */}
      <div className="flex-1 min-w-0 pr-2 relative z-0">
        <h3 className="text-base font-bold text-white tracking-tight leading-tight mb-1">
          {option.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {option.description}
        </p>
      </div>
    </GlareHover>
  );
};
