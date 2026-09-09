'use client';

import React from 'react';
import { GoalOption } from '@/models/register/register.model';
import { GlareHover } from '@/components/ui/glare-hover';
import { ClickSpark } from '@/components/ui/click-spark';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  option: GoalOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;

  return (
    <ClickSpark
      sparkColor="#F97316"
      sparkRadius={20}
      sparkSize={10}
      sparkCount={8}
      duration={400}
      className="w-full rounded-2xl"
    >
      <GlareHover
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={() => onSelect(option.id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(option.id)}
        glareColor="#F97316"
        glareOpacity={0.3}
        glareSize={280}
        transitionDuration={2000}
        playOnce={true}
        className={cn(
          'group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left outline-none',
          isSelected
            ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50'
            : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
        )}
      >
        {/* Icono flotante temático con escalado reactivo */}
        <IconComponent
          className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ color: option.color }}
        />

        {/* Contenido: título, tiempo por día y descripción */}
        <div className="flex-1 min-w-0 pr-2 relative z-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold text-white tracking-tight leading-tight">
              {option.title}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {option.timeText}
            </span>
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
      </GlareHover>
    </ClickSpark>
  );
};
