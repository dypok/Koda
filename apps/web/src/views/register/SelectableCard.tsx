'use client';

import React from 'react';
import { Check } from '@phosphor-icons/react';
import { GlareHover } from '@/components/ui/glare-hover';
import { cn } from '@/lib/utils';

export interface SelectableCardOption {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string;
  meta?: string;
}

interface SelectableCardProps {
  option: SelectableCardOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/** Card seleccionable única (radio real) para experiencia, estilo y meta. */
export const SelectableCard: React.FC<SelectableCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;

  return (
    <GlareHover
      role="radio"
      tabIndex={0}
      aria-checked={isSelected}
      aria-label={option.title}
      onClick={() => onSelect(option.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(option.id))}
      glareColor="#F97316"
      glareOpacity={0.25}
      transitionDuration={600}
      className={cn(
        'group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer select-none text-left transform-gpu',
        'transition-[border-color,background-color,box-shadow,transform] duration-150 active:scale-[0.985]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50'
          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
      )}
    >
      <IconComponent
        className="w-8 h-8 shrink-0 transition-transform duration-200 transform-gpu will-change-transform group-hover:scale-105 group-hover:brightness-110"
        style={{ color: option.color }}
      />

      <div className="flex-1 min-w-0 pr-2 relative z-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-base font-bold text-white tracking-tight leading-tight">
            {option.title}
          </h3>
          {option.meta && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {option.meta}
            </span>
          )}
          {option.badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {option.description}
        </p>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 flex h-6 w-6 items-center justify-center rounded-full border transition-all',
          isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 text-transparent'
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    </GlareHover>
  );
};

export default SelectableCard;
