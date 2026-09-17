'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Lock, LockOpen } from '@phosphor-icons/react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { RoadmapPixiGraph, EdgeDesign, EdgeStyle, NodeStyle, UnlockStyle } from '../../RoadmapPixiGraph';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';
import { LUA_ACCENT } from '../route-helpers';

interface ProposalProps {
  style: EdgeStyle;
  design?: EdgeDesign;
  nodes?: NodeStyle;
  unlock?: UnlockStyle | null;
  tagline: string;
  onAction: (msg: string) => void;
}

const ALL_IDS = LUA_COURSES_DATASET.nodes.map((n) => n.id);
const REAL_UNLOCKED = new Set(LUA_COURSES_DATASET.nodes.filter((n) => n.isUnlocked).map((n) => n.id));

/** Marco común para las propuestas del grafo, con control de candados y cinemática opcional. */
export const RouteEdgeStyle: React.FC<ProposalProps> = ({ style, design, nodes, unlock, tagline, onAction }) => {
  const [activeId, setActiveId] = useState<string | null>('lua-m01');
  const [unlocked, setUnlocked] = useState<Set<string>>(REAL_UNLOCKED);
  const [unlocking, setUnlocking] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const dataset = useMemo(
    () => ({
      ...LUA_COURSES_DATASET,
      nodes: LUA_COURSES_DATASET.nodes.map((n) => {
        const on = unlocked.has(n.id);
        const boss = n.variant === 'boss';
        return {
          ...n,
          isUnlocked: on,
          variant: on ? (n.variant === 'locked' ? 'unlocked' : n.variant) : boss ? 'boss' : 'locked',
          iconType: on ? (boss ? 'skull' : n.iconType === 'lock' ? 'code' : n.iconType) : boss ? 'skull' : 'lock',
          statusText: on ? 'DISPONIBLE · LAB' : 'BLOQUEADO · LAB',
        } as typeof n;
      }),
      connections: LUA_COURSES_DATASET.connections.map((c) => ({
        ...c,
        isDashed: !(unlocked.has(c.fromId) && unlocked.has(c.toId)),
      })),
    }),
    [unlocked]
  );

  const active = dataset.nodes.find((n) => n.id === activeId);
  const activeUnlocked = active ? unlocked.has(active.id) : false;

  const toggle = (id: string) => {
    if (unlocking) return;
    if (unlocked.has(id)) {
      setUnlocked((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      onAction(`🔒 ${id} bloqueado · sin energía en sus conexiones`);
      return;
    }
    if (unlock) {
      setUnlocking(id);
      onAction(`⚡ ${id} desbloqueando…`);
      timerRef.current = setTimeout(() => {
        setUnlocked((prev) => new Set(prev).add(id));
        setUnlocking(null);
        onAction(`🔓 ${id} desbloqueado · la energía vuelve a fluir`);
      }, 1150);
    } else {
      setUnlocked((prev) => new Set(prev).add(id));
      onAction(`🔓 ${id} desbloqueado · la energía vuelve a fluir`);
    }
  };

  return (
    <div className="relative h-[75vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <AsciiVortexBackground density={120} />
      <div className="absolute inset-0 z-10">
        <RoadmapPixiGraph
          dataset={dataset}
          branchColor={LUA_ACCENT}
          activeNodeId={activeId}
          onSelect={(node) => {
            setActiveId(node.id);
            onAction(`◉ ${node.code} · ${node.label} (${unlocked.has(node.id) ? 'disponible' : 'bloqueado'})`);
          }}
          edgeStyle={style}
          edgeDesign={design}
          nodeStyle={nodes}
          unlockingNodeId={unlock ? unlocking : null}
          unlockStyle={unlock ?? undefined}
        />
      </div>
      <div className="absolute left-4 top-4 z-20 pointer-events-none">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          Lua · {tagline}
        </p>
        <p className="font-mono text-[10px] text-slate-600">solo las conexiones desbloqueadas llevan energía</p>
      </div>
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setUnlocked(new Set(ALL_IDS));
            onAction('🔓 todo desbloqueado · pipeline a máxima energía');
          }}
          className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 font-mono text-[10px] font-bold text-slate-300 backdrop-blur-md transition-colors hover:border-emerald-400/60 hover:text-emerald-300"
        >
          TODO ON
        </button>
        <button
          type="button"
          onClick={() => {
            setUnlocked(new Set());
            onAction('🔒 todo bloqueado · red apagada');
          }}
          className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 font-mono text-[10px] font-bold text-slate-300 backdrop-blur-md transition-colors hover:border-rose-400/60 hover:text-rose-300"
        >
          TODO OFF
        </button>
      </div>
      {active && (
        <div className="absolute bottom-4 left-1/2 z-20 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-2.5 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-500">{active.code}</span>
          <span className="max-w-44 truncate text-xs font-bold text-white sm:max-w-56">{active.label}</span>
          <button
            type="button"
            onClick={() => toggle(active.id)}
            aria-pressed={activeUnlocked}
            aria-label={activeUnlocked ? `Bloquear ${active.label}` : `Desbloquear ${active.label}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-300 transition-colors hover:border-amber-400/60 hover:text-amber-300"
          >
            {activeUnlocked ? (
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <LockOpen aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {activeUnlocked ? 'Bloquear' : unlocking === active.id ? 'Desbloqueando…' : 'Desbloquear'}
          </button>
          <button
            type="button"
            onClick={() => onAction(`→ abriría lecciones de ${active.label}`)}
            disabled={!activeUnlocked}
            className="rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: LUA_ACCENT }}
          >
            Abrir
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteEdgeStyle;
