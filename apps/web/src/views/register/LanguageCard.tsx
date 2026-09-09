'use client';

import React from 'react';
import { LanguageOption } from '@/models/register/register.model';
import { GlareHover } from '@/components/ui/glare-hover';
import { cn } from '@/lib/utils';

interface LanguageCardProps {
  option: LanguageOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;
  const isClickable = option.isAvailable;

  return (
    <GlareHover
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-pressed={isSelected}
      aria-disabled={!isClickable}
      onClick={() => isClickable && onSelect(option.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && isClickable && onSelect(option.id)}
      glareColor={isClickable ? '#F97316' : '#64748B'}
      glareOpacity={isClickable ? 0.3 : 0}
      transitionDuration={600}
      className={cn(
        'group relative flex items-start gap-4 p-4.5 sm:p-5 rounded-2xl border select-none text-left outline-none min-h-[102px] h-full transform-gpu',
        'transition-[border-color,background-color,box-shadow,transform] duration-150',
        isClickable && 'active:scale-[0.985]',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50 cursor-pointer'
          : isClickable
          ? 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 cursor-pointer'
          : 'border-slate-800/40 bg-slate-900/30 opacity-60 cursor-not-allowed'
      )}
    >
      {/* Icono con aceleración GPU */}
      <IconComponent
        className={cn(
          'w-8 h-8 shrink-0 mt-0.5 transition-transform duration-200 transform-gpu will-change-transform',
          isClickable ? 'group-hover:scale-110' : 'grayscale-[40%]'
        )}
        style={{ color: option.color }}
      />

      {/* Contenido con nombre y badge */}
      <div className="flex-1 min-w-0 pr-2 relative z-0">
        <div className="flex items-center gap-2 mb-1.5 flex-nowrap">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none whitespace-nowrap">
            {option.name}
          </h3>
          {option.badge && (
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide whitespace-nowrap shrink-0',
                option.isAvailable
                  ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40'
                  : 'text-slate-400 bg-slate-800/70 border-slate-700/50'
              )}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-[13px] text-slate-300/85 leading-relaxed">
          {option.description}
        </p>
      </div>
    </GlareHover>
  );
};
