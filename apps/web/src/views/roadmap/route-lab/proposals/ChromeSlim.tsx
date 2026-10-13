'use client';

import React from 'react';
import { Flame, Star } from '@phosphor-icons/react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';

interface ProposalProps {
  onAction: (msg: string) => void;
}

const NODES = LUA_COURSES_DATASET.nodes;
const DONE = NODES.filter((n) => n.isUnlocked).length;
const PCT = Math.round((DONE / NODES.length) * 100);

/** R13 — Barras delgadas: título + continuar arriba; racha, XP y progreso abajo. */
export const ChromeSlim: React.FC<ProposalProps> = ({ onAction }) => (
  <div className="relative flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
    <AsciiVortexBackground density={60} />
    <header className="relative z-10 flex h-12 shrink-0 items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/85 px-4">
      <p className="flex min-w-0 items-center gap-2">
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#8FA8FF]" />
        <span className="truncate font-display text-xs font-black uppercase tracking-wide text-white">
          {LUA_COURSES_DATASET.sectorTitle}
        </span>
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-mono text-[11px] font-bold tabular-nums text-slate-400">{PCT}%</span>
        <button
          type="button"
          onClick={() => onAction('→ continuaría en el módulo activo')}
          className="rounded-lg bg-[#8FA8FF] px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95"
        >
          Continuar →
        </button>
      </div>
    </header>
    <div className="relative z-10 flex flex-1 items-center justify-center">
      <p className="font-mono text-[11px] text-slate-600">lienzo del roadmap</p>
    </div>
    <footer className="relative z-10 flex h-12 shrink-0 items-center gap-4 border-t border-slate-800/80 bg-slate-950/85 px-4 font-mono text-[11px]">
      <span className="flex items-center gap-1.5 font-bold text-orange-300">
        <Flame aria-hidden="true" className="h-3.5 w-3.5" weight="fill" />
        7D
      </span>
      <span className="flex items-center gap-1.5 font-bold text-amber-300">
        <Star aria-hidden="true" className="h-3.5 w-3.5" />
        +250
      </span>
      <span
        role="progressbar"
        aria-label={`Progreso: ${DONE} de ${NODES.length} módulos`}
        aria-valuenow={PCT}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800"
      >
        <span className="block h-full rounded-full bg-[#8FA8FF]" style={{ width: `${PCT}%` }} />
      </span>
      <span className="font-bold tabular-nums text-slate-400">
        {String(DONE).padStart(2, '0')}/{String(NODES.length).padStart(2, '0')}
      </span>
    </footer>
  </div>
);

export default ChromeSlim;
