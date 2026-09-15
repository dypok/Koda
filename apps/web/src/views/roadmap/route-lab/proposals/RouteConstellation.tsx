'use client';

import React, { useState } from 'react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { RoadmapPixiGraph } from '../../RoadmapPixiGraph';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';
import { LUA_ACCENT } from '../route-helpers';

interface ProposalProps {
  onAction: (msg: string) => void;
}

/** R1 — El dataset Lua en el grafo Pixi del roadmap con fondo ASCII. */
export const RouteConstellation: React.FC<ProposalProps> = ({ onAction }) => {
  const [activeId, setActiveId] = useState<string | null>('lua-m01');
  const active = LUA_COURSES_DATASET.nodes.find((n) => n.id === activeId);

  return (
    <div className="relative h-[75vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <AsciiVortexBackground density={120} />
      <div className="absolute inset-0 z-10">
        <RoadmapPixiGraph
          dataset={LUA_COURSES_DATASET}
          branchColor={LUA_ACCENT}
          activeNodeId={activeId}
          onSelect={(node) => {
            setActiveId(node.id);
            onAction(`◉ ${node.code} · ${node.label} (${node.isUnlocked ? 'disponible' : 'bloqueado'})`);
          }}
        />
      </div>
      <div className="absolute left-4 top-4 z-20 pointer-events-none">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          Lua · Constelación
        </p>
        <p className="font-mono text-[10px] text-slate-600">clic para inspeccionar · la cámara viaja al nodo</p>
      </div>
      {active && (
        <div className="absolute bottom-4 left-1/2 z-20 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-2.5 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-500">{active.code}</span>
          <span className="max-w-56 truncate text-xs font-bold text-white">{active.label}</span>
          <button
            type="button"
            onClick={() => onAction(`→ abriría lecciones de ${active.label}`)}
            disabled={!active.isUnlocked}
            className="rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: LUA_ACCENT }}
          >
            {active.isUnlocked ? 'Abrir' : 'Bloqueado'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteConstellation;
