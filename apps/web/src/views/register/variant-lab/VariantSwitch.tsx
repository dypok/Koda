'use client';

import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { VARIANTS } from './variant-styles';

interface VariantSwitchProps {
  active: number;
  onChange: (index: number) => void;
}

/** Switch segmentado V1..V12 con hash compartible y flechas de teclado. */
export const VariantSwitch: React.FC<VariantSwitchProps> = ({ active, onChange }) => {
  const go = (dir: 1 | -1) => onChange((active + dir + VARIANTS.length) % VARIANTS.length);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Variante anterior"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border border-slate-700 text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <CaretLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <div role="tablist" aria-label="Variantes de estilo" className="grid flex-1 grid-cols-6 gap-1.5 sm:grid-cols-12">
          {VARIANTS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              title={`${v.label}: ${v.blurb}`}
              onClick={() => onChange(i)}
              className={cn(
                'rounded-[6px] border px-1 py-2 font-mono text-[11px] font-bold transition-colors',
                i === active
                  ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                  : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-600 hover:text-slate-200'
              )}
            >
              V{v.num}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Variante siguiente"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border border-slate-700 text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <CaretRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <div className="rounded-[8px] border border-slate-800 border-l-2 border-l-amber-400 bg-slate-950 px-3 py-2">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300">
          V{VARIANTS[active].num} — {VARIANTS[active].label}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{VARIANTS[active].blurb}</p>
      </div>
    </div>
  );
};

export default VariantSwitch;
