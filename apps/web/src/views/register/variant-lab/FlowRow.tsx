'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Check, Lock } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { LanguageOption } from '@/models/register/register.model';
import type { VariantTokens } from './variant-styles';

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

const FILL: Record<string, string> = {
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400',
  slate: 'bg-slate-600',
};

interface FlowRowProps {
  option: LanguageOption;
  selected: boolean;
  tokens: VariantTokens;
  onSelect: (id: string) => void;
  roleProps?: { role: 'radio'; 'aria-checked': boolean; tabIndex: number };
}

/**
 * Fila derivada de FlowButton: flechas deslizantes + círculo expansivo +
 * morph de radio, adaptada a tema oscuro terminal con Phosphor.
 */
export const FlowRow: React.FC<FlowRowProps> = ({ option, selected, tokens, onSelect, roleProps }) => {
  const Icon = option.icon;
  const locked = !option.isAvailable;
  const [hover, setHover] = useState(false);
  const [fxy, setFxy] = useState({ x: '50%', y: '50%' });
  const rootRef = useRef<HTMLButtonElement>(null);
  const name = useScramble(option.name, tokens.flowText === 'scramble' && hover && !locked);
  const success = !locked && selected && tokens.flowSuccess;

  const radius =
    tokens.flowRadius === 'pill'
      ? 'rounded-[100px]'
      : tokens.flowRadius === 'morph6'
        ? 'rounded-[100px] hover:rounded-[6px]'
        : 'rounded-[100px] hover:rounded-[12px]';

  const speed = tokens.flowRadius === 'morph6' ? 'duration-300' : 'duration-[600ms]';

  const onMove = (e: React.MouseEvent) => {
    if (tokens.flowFill !== 'cursor' || !rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    setFxy({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  const circlePos =
    tokens.flowFill === 'cursor'
      ? { left: fxy.x, top: fxy.y, transform: 'translate(-50%,-50%)' }
      : tokens.flowFrom === 'left'
        ? { left: '20px', top: '50%', transform: 'translateY(-50%)' }
        : tokens.flowFrom === 'right'
          ? { right: '20px', top: '50%', transform: 'translateY(-50%)' }
          : { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' };

  const arrows =
    tokens.flowArrows === 'vertical' ? (
      <>
        <ArrowDown
          aria-hidden="true"
          className="absolute left-4 top-[-30%] z-[9] h-4 w-4 text-amber-300 transition-all duration-500 group-hover:top-3"
        />
        <ArrowUp
          aria-hidden="true"
          className="absolute bottom-[-30%] left-4 z-[9] h-4 w-4 text-amber-300 transition-all duration-500 group-hover:bottom-3"
        />
      </>
    ) : tokens.flowArrows === 'fade' ? (
      <ArrowRight
        aria-hidden="true"
        className="absolute left-4 z-[9] h-4 w-4 text-amber-300 opacity-0 transition-opacity delay-150 duration-500 group-hover:opacity-100"
      />
    ) : tokens.flowArrows === 'none' ? null : (
      <>
        <ArrowRight
          aria-hidden="true"
          className={cn(
            'absolute z-[9] h-4 w-4 text-amber-300 transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            tokens.flowStagger
              ? 'left-[-25%] duration-500 group-hover:left-4'
              : 'left-[-25%] duration-[800ms] group-hover:left-4'
          )}
        />
        <ArrowRight
          aria-hidden="true"
          className="absolute right-4 z-[9] h-4 w-4 text-slate-200 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]"
        />
      </>
    );

  return (
    <>
      {tokens.flowShake && (
        <style>{`.flow-shake:hover{animation:flow-shake .4s ease}@keyframes flow-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}`}</style>
      )}
      <button
        ref={rootRef}
        type="button"
        data-vrow
        disabled={locked}
        onClick={() => !locked && onSelect(option.id)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={onMove}
        {...roleProps}
        aria-label={roleProps ? undefined : option.name}
        className={cn(
          'group relative flex w-full items-center gap-3 overflow-hidden border-[1.5px] px-7 py-3.5 text-left outline-none',
          'transition-all ease-[cubic-bezier(0.23,1,0.32,1)]',
          speed,
          radius,
          tokens.flowShake && locked && 'flow-shake',
          locked
            ? 'cursor-not-allowed border-slate-800 bg-transparent text-slate-500'
            : success
              ? 'rounded-[12px] border-transparent bg-amber-400 text-slate-950'
              : 'cursor-pointer border-slate-700/60 bg-transparent text-slate-100 hover:border-transparent hover:text-slate-950 active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-amber-400/70'
        )}
      >
        {!locked && arrows}

        <span
          aria-hidden="true"
          className={cn(
            'relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border transition-colors duration-500',
            locked ? 'border-slate-800 bg-transparent' : 'border-slate-700 bg-black/40 group-hover:border-slate-950/30'
          )}
        >
          <Icon
            className={cn('h-5 w-5', locked && 'opacity-50 grayscale')}
            style={{ color: locked ? undefined : option.color }}
          />
        </span>

        <span
          className={cn(
            'relative z-[1] min-w-0 flex-1 transition-all',
            tokens.flowText === 'static'
              ? ''
              : tokens.flowStagger
                ? '-translate-x-2 duration-500 group-hover:translate-x-2'
                : '-translate-x-3 duration-[800ms] group-hover:translate-x-3'
          )}
        >
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-bold">{name}</span>
            <span
              className={cn(
                'shrink-0 rounded-[6px] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest',
                locked
                  ? 'border-slate-700 text-slate-500'
                  : success
                    ? 'border-slate-950/40 text-slate-950'
                    : 'border-current opacity-70 group-hover:border-slate-950/40'
              )}
            >
              {option.badge ?? (option.isAvailable ? 'Disponible' : 'Próximamente')}
            </span>
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
            style={circlePos as React.CSSProperties}
            className={cn(
              'absolute h-4 w-4 rounded-[50%] opacity-0 transition-all ease-[cubic-bezier(0.19,1,0.22,1)]',
              FILL[tokens.flowFill],
              tokens.flowStagger
                ? 'delay-150 duration-500 group-hover:h-[260px] group-hover:w-[260px] group-hover:opacity-100'
                : 'duration-[800ms] group-hover:h-[260px] group-hover:w-[260px] group-hover:opacity-100'
            )}
          />
        )}
        {!locked && !success && tokens.flowRings && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-amber-300/60 opacity-0 transition-all delay-300 duration-500 group-hover:h-[300px] group-hover:w-[300px] group-hover:opacity-60"
          />
        )}
      </button>
    </>
  );
};

export default FlowRow;
