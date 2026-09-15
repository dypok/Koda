'use client';

import React, { useState } from 'react';
import { Flame, Star } from '@phosphor-icons/react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';
import { cn } from '@/lib/utils';

interface ProposalProps {
  onAction: (msg: string) => void;
}

const NODES = LUA_COURSES_DATASET.nodes;
const DONE = NODES.filter((n) => n.isUnlocked).length;
const PCT = Math.round((DONE / NODES.length) * 100);

/** R14 — Sin barras: píldoras flotantes (título, racha, XP, dots navegables). */
export const ChromePills: React.FC<ProposalProps> = ({ onAction }) => {
  const [sel, setSel] = useState(0);
  const current = NODES[sel];

  return (
    <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <AsciiVortexBackground density={60} />
      <div className="absolute left-1/2 top-4 z-20 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-slate-800 bg-slate-950/90 py-2 pl-4 pr-2 backdrop-blur-md">
        <span className="max-w-44 truncate font-display text-xs font-black uppercase tracking-wide text-white sm:max-w-xs">
          {LUA_COURSES_DATASET.sectorTitle}
        </span>
        <span className="font-mono text-[11px] font-bold tabular-nums text-slate-400">{PCT}%</span>
        <button
          type="button"
          onClick={() => onAction('→ continuaría en el módulo activo')}
          className="rounded-full bg-[#8FA8FF] px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95"
        >
          →
        </button>
      </div>

      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-2 backdrop-blur-md">
        {NODES.map((n, i) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              setSel(i);
              onAction(`◉ ${n.code} · ${n.label}`);
            }}
            aria-label={`Ir a ${n.label}`}
            title={n.label}
            className={cn(
              'h-2 rounded-full transition-all',
              i === sel ? 'w-5 bg-[#8FA8FF]' : 'w-2 bg-slate-700 hover:bg-slate-500'
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-1.5 font-mono text-[11px] font-bold text-orange-300 backdrop-blur-md">
        <Flame aria-hidden="true" className="h-3.5 w-3.5" weight="fill" />
        7D
      </div>
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-1.5 font-mono text-[11px] font-bold text-amber-300 backdrop-blur-md">
        <Star aria-hidden="true" className="h-3.5 w-3.5" />
        +250
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <p className="max-w-48 truncate font-mono text-[11px] text-slate-600">
          {current ? `${current.code} · ${current.label}` : 'lienzo del roadmap'}
        </p>
      </div>
    </div>
  );
};

export default ChromePills;
