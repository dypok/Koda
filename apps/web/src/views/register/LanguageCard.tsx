'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Lock } from '@phosphor-icons/react';
import { LanguageOption } from '@/models/register/register.model';
import { cn } from '@/lib/utils';

const SCRAMBLE = '█▓▒░<>/\\|01';

function useScramble(text: string, active: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = 12;
    const id = window.setInterval(() => {
      frame += 1;
      const done = Math.floor((frame / total) * text.length);
      let s = text.slice(0, done);
      for (let i = done; i < text.length; i += 1) {
        s += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      }
      setOut(s);
      if (frame >= total) {
        setOut(text);
        window.clearInterval(id);
      }
    }, 36);
    return () => window.clearInterval(id);
  }, [active, text]);
  return out;
}

interface LanguageCardProps {
  option: LanguageOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/** Card del register: FlowButton terminal con scramble (V8) y success persistente (V12). */
export const LanguageCard: React.FC<LanguageCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;
  const locked = !option.isAvailable;
  const success = !locked && isSelected;
  const [hover, setHover] = useState(false);
  const name = useScramble(option.name, hover && !locked);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={btnRef}
      type="button"
      data-vrow
      disabled={locked}
      aria-pressed={isSelected}
      aria-disabled={locked}
      onClick={() => !locked && onSelect(option.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !locked && onSelect(option.id)}
      className={cn(
        'group relative flex w-full items-center gap-3 overflow-hidden border-[1.5px] px-7 py-3.5 text-left outline-none will-change-transform',
        'rounded-[100px] hover:rounded-[12px]',
        'transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70',
        locked
          ? 'cursor-not-allowed border-slate-800 bg-transparent text-slate-500'
          : success
            ? 'rounded-[12px] border-transparent bg-amber-400 text-slate-950'
            : 'cursor-pointer border-slate-700/60 bg-transparent text-slate-100 hover:border-transparent hover:text-slate-950 active:scale-[0.98]'
      )}
    >
      {!locked && !success && (
        <ArrowRight
          aria-hidden="true"
          className="absolute left-4 z-[9] h-4 w-4 text-amber-300 opacity-0 transition-opacity delay-150 duration-500 group-hover:opacity-100"
        />
      )}

      <span
        aria-hidden="true"
        className={cn(
          'relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border transition-colors duration-500',
          locked ? 'border-slate-800 bg-transparent' : 'border-slate-700 bg-black/40 group-hover:border-slate-950/30'
        )}
      >
        <IconComponent
          className={cn('h-5 w-5', locked && 'opacity-50 grayscale')}
          style={{ color: locked ? undefined : option.color }}
        />
      </span>

      <span className="relative z-[1] min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-mono text-sm font-bold">{name}</span>
          {option.badge && (
            <span
              className={cn(
                'shrink-0 rounded-[6px] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap',
                locked
                  ? 'border-slate-700 text-slate-500'
                  : success
                    ? 'border-slate-950/40 text-slate-950'
                    : 'border-current opacity-70 group-hover:border-slate-950/40'
              )}
            >
              {option.badge}
            </span>
          )}
        </span>
        <span
          className={cn(
            'mt-0.5 block truncate font-sans text-xs',
            locked ? 'text-slate-600' : success ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-800'
          )}
        >
          {option.description}
        </span>
      </span>

      <span className="relative z-[1] shrink-0">
        {locked ? (
          <Lock aria-hidden="true" className="h-4 w-4 text-slate-600" />
        ) : success ? (
          <Check aria-hidden="true" className="h-5 w-5 text-slate-950" weight="bold" />
        ) : null}
      </span>

      {!locked && !success && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-amber-400 opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[260px] group-hover:w-[260px] group-hover:opacity-100"
        />
      )}
    </button>
  );
};

export default LanguageCard;
