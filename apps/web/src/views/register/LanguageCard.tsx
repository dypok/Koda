'use client';

import React from 'react';
import {
  IconBrandPython,
  IconBrandJavascript,
  IconBrandGolang,
  IconBrandRust,
  IconCircleCheckFilled,
  IconClock,
} from '@tabler/icons-react';
import { LanguageOption } from '@/models/register/register.model';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  python: IconBrandPython,
  javascript: IconBrandJavascript,
  go: IconBrandGolang,
  rust: IconBrandRust,
};

interface LanguageCardProps {
  option: LanguageOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = iconMap[option.id] || IconBrandPython;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(option.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(option.id)}
      className={cn(
        'group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left outline-none',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50'
          : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900/90'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors',
          isSelected
            ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
            : 'border-slate-800 bg-slate-950 text-slate-400 group-hover:text-slate-200'
        )}
      >
        <IconComponent className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-bold text-white tracking-tight">{option.name}</h3>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
            v{option.version}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{option.description}</p>
        <div className="mt-2.5 flex items-center gap-2">
          {option.isAvailable ? (
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {option.badge}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/50">
              <IconClock className="w-3 h-3" />
              {option.badge}
            </span>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-4 right-4 text-amber-400 animate-in zoom-in-50 duration-200">
          <IconCircleCheckFilled className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
