'use client';

import React from 'react';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { LanguageOption } from '@/models/register/register.model';
import { cn } from '@/lib/utils';

interface LanguageCardProps {
  option: LanguageOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(option.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(option.id)}
      className={cn(
        'group relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left outline-none',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50'
          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
      )}
    >
      {/* Icono directo sin burbuja con su color oficial */}
      <IconComponent
        className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ color: option.color }}
      />

      {/* Contenido con nombre y badge discreta si aplica */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-white tracking-tight leading-none">
            {option.name}
          </h3>
          {option.badge && (
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                option.isAvailable
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-slate-400 bg-slate-800/80 border-slate-700/50'
              )}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 leading-snug line-clamp-1">
          {option.description}
        </p>
      </div>

      {/* Indicador de seleccionado */}
      {isSelected && (
        <div className="absolute top-3.5 right-3.5 text-amber-400 animate-in zoom-in-50 duration-200">
          <IconCircleCheckFilled className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
