'use client';

import React from 'react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';
import { cn } from '@/lib/utils';

interface ProposalProps {
  onAction: (msg: string) => void;
}

const NODES = LUA_COURSES_DATASET.nodes;
const DONE = NODES.filter((n) => n.isUnlocked).length;
const PCT = Math.round((DONE / NODES.length) * 100);

/** R15 — Statusline estilo terminal: modo, rama, segmentos y métricas en una línea. */
export const ChromeTerminal: React.FC<ProposalProps> = ({ onAction }) => (
  <div className="relative flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 font-mono">
    <AsciiVortexBackground density={60} />
    <header className="relative z-10 flex h-10 shrink-0 items-center justify-between px-4 text-[11px]">
      <p className="truncate text-slate-500">
        <span className="text-slate-300">koda</span>
        <span aria-hidden="true"> ~/lua/ruta</span>
      </p>
      <p className="shrink-0 text-slate-500">
        rama: <span className="font-bold text-[#8FA8FF]">lua</span>
        {' · '}
        <span className="font-bold tabular-nums text-slate-300">{PCT}%</span>
      </p>
    </header>
    <div className="relative z-10 flex flex-1 items-center justify-center">
      <button
        type="button"
        onClick={() => onAction('→ continuaría en el módulo activo')}
        className="rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs font-bold text-slate-200 backdrop-blur-md transition-colors hover:border-[#8FA8FF]/60 hover:text-white"
      >
        :continuar
      </button>
    </div>
    <footer className="relative z-10 flex h-9 shrink-0 items-stretch border-t border-slate-800 bg-slate-950 text-[11px]">
      <span className="flex items-center bg-amber-400 px-3 font-bold uppercase tracking-wider text-slate-950">
        Ruta
      </span>
      <span className="hidden items-center px-3 font-bold text-slate-300 sm:flex">lua · 12 módulos</span>
      <span className="flex flex-1 items-center gap-1 px-3" aria-hidden="true">
        {NODES.map((n) => (
          <span key={n.id} className={cn('h-3.5 flex-1 rounded-[2px]', n.isUnlocked ? 'bg-[#8FA8FF]' : 'bg-slate-800')} />
        ))}
      </span>
      <span className="hidden items-center px-3 tabular-nums text-slate-400 md:flex">racha 7d · +250 xp</span>
      <button
        type="button"
        onClick={() => onAction('→ continuaría en el módulo activo')}
        className="flex items-center bg-slate-900 px-3 font-bold text-[#8FA8FF] transition-colors hover:bg-slate-800"
      >
        {PCT}% ▸
      </button>
    </footer>
  </div>
);

export default ChromeTerminal;
