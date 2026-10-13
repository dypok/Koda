'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowCounterClockwise, Check, Lock } from '@phosphor-icons/react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { cn } from '@/lib/utils';
import { partitionRoute, routeStatusOf, shortHash } from '../route-helpers';

interface ProposalProps {
  onAction: (msg: string) => void;
}

const CommitRow: React.FC<{
  node: GraphNode;
  index: number;
  runId: number;
  reduceMotion: boolean | null;
  onInspect: (node: GraphNode) => void;
}> = ({ node, index, runId, reduceMotion, onInspect }) => {
  const status = routeStatusOf(node);
  const locked = status === 'locked';
  const isBoss = node.variant === 'boss';

  return (
    <motion.div
      key={`${runId}-${node.id}`}
      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.6), ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={() => onInspect(node)}
        disabled={locked}
        aria-label={`${node.code} ${node.label}, ${locked ? 'bloqueado' : 'ver commit'}`}
        className={cn(
          'group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left font-mono transition-colors',
          locked
            ? 'cursor-not-allowed border-transparent opacity-50'
            : 'cursor-pointer border-transparent hover:border-slate-800 hover:bg-white/[0.03]',
          isBoss && !locked && 'border-amber-400/40 hover:border-amber-400/70'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            status === 'done' && 'bg-emerald-400',
            status === 'active' && 'bg-[#8FA8FF] shadow-[0_0_8px_rgba(143,168,255,0.9)]',
            status === 'open' && 'bg-slate-400',
            locked && 'bg-slate-700'
          )}
        />
        <span className="shrink-0 text-[11px] font-bold text-amber-300">#{shortHash(node.id)}</span>
        <span className="min-w-0 flex-1">
          <span className={cn('block truncate text-xs font-bold', locked ? 'text-slate-500' : 'text-slate-100')}>
            {node.code} · {node.label}
          </span>
          <span className="block truncate text-[10px] text-slate-500">
            {locked ? node.statusText || 'BLOQUEADO' : `+${node.xp ?? 0} XP · ${node.routeLabel || 'tronco'}`}
          </span>
        </span>
        {status === 'done' ? (
          <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-emerald-400" weight="bold" />
        ) : locked ? (
          <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
        ) : (
          <span className="shrink-0 font-mono text-[10px] font-bold text-[#8FA8FF] opacity-0 transition-opacity group-hover:opacity-100">
            inspect →
          </span>
        )}
      </button>
    </motion.div>
  );
};

/** R2 — Módulos como commits secuenciales con consola git en vivo. */
export const RoutePipeline: React.FC<ProposalProps> = ({ onAction }) => {
  const reduceMotion = useReducedMotion();
  const [runId, setRunId] = useState(0);
  const [consoleLine, setConsoleLine] = useState('git route log --oneline · 12 módulos · 3 rutas');
  const { trunkPre, flow, data, trunkPost } = partitionRoute(LUA_COURSES_DATASET.nodes);
  let order = 0;

  const inspect = (node: GraphNode) => {
    const line = `inspect [${node.code}]: ${node.label} · +${node.xp ?? 0} XP`;
    setConsoleLine(line);
    onAction(`→ abriría lecciones de ${node.label}`);
  };

  const lane = (title: string, nodes: GraphNode[]) =>
    nodes.length > 0 && (
      <div>
        <p className="mb-1 px-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <div className="space-y-1 border-l-2 border-slate-800 pl-2">
          {nodes.map((n) => (
            <CommitRow key={n.id} node={n} index={order++} runId={runId} reduceMotion={reduceMotion} onInspect={inspect} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-3">
        <p className="font-mono text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
          route log · lua
        </p>
        <button
          type="button"
          onClick={() => {
            setRunId((n) => n + 1);
            setConsoleLine('git route log --oneline · 12 módulos · 3 rutas');
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <ArrowCounterClockwise aria-hidden="true" className="h-3.5 w-3.5" />
          Replay
        </button>
      </div>
      <div className="space-y-1 p-4" key={`pipe-${runId}`}>
        {trunkPre.map((n) => (
          <CommitRow key={n.id} node={n} index={order++} runId={runId} reduceMotion={reduceMotion} onInspect={inspect} />
        ))}
        <p className="py-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          ── fork: flujo / datos ──
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lane('ruta flujo', flow)}
          {lane('ruta datos', data)}
        </div>
        <p className="py-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          ── join: convergen ──
        </p>
        {trunkPost.map((n) => (
          <CommitRow key={n.id} node={n} index={order++} runId={runId} reduceMotion={reduceMotion} onInspect={inspect} />
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-slate-800 px-4 py-3 font-mono text-xs">
        <span aria-hidden="true" className="font-bold text-[#8FA8FF]">&gt;_</span>
        <span role="status" className="truncate text-slate-300">
          {consoleLine}
        </span>
      </div>
    </div>
  );
};

export default RoutePipeline;
