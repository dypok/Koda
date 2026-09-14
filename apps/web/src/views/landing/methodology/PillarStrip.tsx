'use client';

import React from 'react';
import { Pillar } from '@/models/landing/methodology.model';
import { cn } from '@/lib/utils';

interface PillarStripProps {
  pillars: Pillar[];
  activeId: string | null;
  onScrollTo: (id: string) => void;
}

/** Mini-nav pineada del viaje de metodología: los 4 pilares te acompañan. */
export const PillarStrip: React.FC<PillarStripProps> = ({ pillars, activeId, onScrollTo }) => (
  <div className="sticky top-16 z-30 border-y border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div role="tablist" aria-label="Pilares de la metodología" className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          const active = activeId === pillar.id;
          return (
            <React.Fragment key={pillar.id}>
              <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onScrollTo(pillar.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 min-h-[40px] text-xs font-bold transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60',
                  active
                    ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                <Icon aria-hidden="true" className="w-4 h-4" />
                <span className="hidden sm:inline">{pillar.title}</span>
                <span className="sm:hidden">{`0${i + 1}`}</span>
              </button>
              {i < pillars.length - 1 && (
                <span aria-hidden="true" className="h-px w-4 sm:w-8 shrink-0 bg-slate-700/80" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
);

export default PillarStrip;
