'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Lock } from '@phosphor-icons/react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { cn } from '@/lib/utils';
import { partitionRoute, routeStatusOf } from '../route-helpers';

interface ProposalProps {
  onAction: (msg: string) => void;
}

const STATUS_PILL: Record<string, string> = {
  done: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  active: 'bg-[#8FA8FF]/15 border-[#8FA8FF]/50 text-[#8FA8FF]',
  open: 'bg-slate-800 border-slate-700 text-slate-300',
  locked: 'bg-slate-900 border-slate-800 text-slate-500',
};

const STATUS_LABEL: Record<string, string> = {
  done: 'COMPLETADO',
  active: 'EN PROGRESO',
  open: 'DISPONIBLE',
  locked: 'BLOQUEADO',
};

const Brackets: React.FC<{ color: string }> = ({ color }) => (
  <span aria-hidden="true" className="pointer-events-none absolute inset-0">
    <span className={cn('absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2', color)} />
    <span className={cn('absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2', color)} />
    <span className={cn('absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2', color)} />
    <span className={cn('absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2', color)} />
  </span>
);

const DeckCard: React.FC<{
  node: GraphNode;
  index: number;
  reduceMotion: boolean | null;
  onOpen: (node: GraphNode) => void;
}> = ({ node, index, reduceMotion, onOpen }) => {
  const status = routeStatusOf(node);
  const locked = status === 'locked';
  const isBoss = node.variant === 'boss';
  const bracketColor = status === 'active' ? 'border-[#8FA8FF]' : isBoss ? 'border-rose-500/70' : 'border-slate-700';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative rounded-xl border bg-slate-900/60 p-4',
        locked ? 'border-slate-800/80 opacity-70' : 'border-slate-700',
        status === 'active' && 'border-[#8FA8FF]/50 shadow-[0_0_24px_rgba(143,168,255,0.15)]',
        isBoss && 'border-rose-500/50'
      )}
    >
      <Brackets color={bracketColor} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-bold tracking-widest text-slate-500">{node.code}</span>
        <span className={cn('rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider', STATUS_PILL[status])}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className={cn('mt-2 text-sm font-bold tracking-wide', locked ? 'text-slate-500' : 'text-white')}>{node.label}</p>
      <p className="mt-0.5 truncate text-xs text-slate-500">{node.subtitle}</p>
      <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-slate-500">
        <span>+{node.xp ?? 0} XP</span>
        {typeof node.maxStars === 'number' && (
          <span className="tabular-nums">
            ★ {node.stars ?? 0}/{node.maxStars}
          </span>
        )}
        {node.routeLabel && (
          <span className="rounded border border-slate-800 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider">
            {node.routeLabel}
          </span>
        )}
      </div>
      <button
        type="button"
        disabled={locked}
        onClick={() => onOpen(node)}
        aria-label={locked ? `${node.label}, bloqueado` : `Abrir ${node.label}`}
        className={cn(
          'mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[11px] font-bold transition-all',
          locked
            ? 'cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-600'
            : 'bg-[#8FA8FF] text-slate-950 hover:scale-[1.02] active:scale-95'
        )}
      >
        {status === 'done' ? (
          <Check aria-hidden="true" className="h-3.5 w-3.5" weight="bold" />
        ) : locked ? (
          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
        ) : null}
        {locked ? node.statusText || 'Bloqueado' : status === 'done' ? 'Repasar' : 'Abrir módulo'}
      </button>
    </motion.div>
  );
};

/** R3 — Tarjetas HUD con brackets de mira, agrupadas por carril. */
export const RouteDeck: React.FC<ProposalProps> = ({ onAction }) => {
  const reduceMotion = useReducedMotion();
  const { trunkPre, flow, data, trunkPost } = partitionRoute(LUA_COURSES_DATASET.nodes);
  const open = (node: GraphNode) => onAction(`→ abriría lecciones de ${node.label}`);
  let order = 0;

  const laneSection = (title: string, nodes: GraphNode[]) =>
    nodes.length > 0 && (
      <section aria-label={title}>
        <p className="mb-2 px-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {nodes.map((n) => (
            <DeckCard key={n.id} node={n} index={order++} reduceMotion={reduceMotion} onOpen={open} />
          ))}
        </div>
      </section>
    );

  return (
    <div className="space-y-6">
      {laneSection('Tronco común', trunkPre)}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {laneSection('Ruta flujo', flow)}
        {laneSection('Ruta datos', data)}
      </div>
      {laneSection('Convergencia', trunkPost)}
    </div>
  );
};

export default RouteDeck;
