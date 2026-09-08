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
  const isClickable = option.isAvailable;

  const handleClick = () => {
    if (isClickable) {
      onSelect(option.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-pressed={isSelected}
      aria-disabled={!isClickable}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className={cn(
        'group relative flex items-start gap-4 p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 select-none text-left outline-none min-h-[96px]',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50 cursor-pointer'
          : isClickable
          ? 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 cursor-pointer'
          : 'border-slate-800/40 bg-slate-900/30 opacity-60 cursor-not-allowed'
      )}
    >
      {/* Icono directo sin burbuja con su color oficial */}
      <IconComponent
        className={cn(
          'w-8 h-8 shrink-0 mt-0.5 transition-transform duration-300',
          isClickable ? 'group-hover:scale-110' : 'grayscale-[40%]'
        )}
        style={{ color: option.color }}
      />

      {/* Contenido con badge visible y resumen completo */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
            {option.name}
          </h3>
          {option.badge && (
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide whitespace-nowrap',
                option.isAvailable
                  ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40'
                  : 'text-slate-400 bg-slate-800/70 border-slate-700/50'
              )}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-[13px] text-slate-300/80 leading-relaxed">
          {option.description}
        </p>
      </div>

      {/* Indicador de seleccionado */}
      {isSelected && (
        <div className="absolute top-4 right-4 text-amber-400 animate-in zoom-in-50 duration-200">
          <IconCircleCheckFilled className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
