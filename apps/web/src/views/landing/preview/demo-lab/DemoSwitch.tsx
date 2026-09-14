'use client';

import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { DEMOS } from './demo-proposals';

interface DemoSwitchProps {
  active: number;
  onChange: (index: number) => void;
}

/** Switch segmentado P1..P12 con hash compartible y flechas de teclado. */
export const DemoSwitch: React.FC<DemoSwitchProps> = ({ active, onChange }) => {
  const go = (dir: 1 | -1) => onChange((active + dir + DEMOS.length) % DEMOS.length);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Propuesta anterior"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border border-slate-700 text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <CaretLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <div role="tablist" aria-label="Propuestas de estilo" className="grid flex-1 grid-cols-6 gap-1.5 sm:grid-cols-12">
          {DEMOS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              title={`${d.label}: ${d.blurb}`}
              onClick={() => onChange(i)}
              className={cn(
                'rounded-[6px] border px-1 py-2 font-mono text-[11px] font-bold transition-colors',
                i === active
                  ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                  : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-600 hover:text-slate-200'
              )}
            >
              P{d.num}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Propuesta siguiente"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border border-slate-700 text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <CaretRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <div className="rounded-[8px] border border-slate-800 border-l-2 border-l-amber-400 bg-slate-950 px-3 py-2">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300">
          P{DEMOS[active].num} — {DEMOS[active].label}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{DEMOS[active].blurb}</p>
      </div>
    </div>
  );
};

export default DemoSwitch;
