'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CaretRight, Check, Lock } from '@phosphor-icons/react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { cn } from '@/lib/utils';

const ACCENT = '#8FA8FF';

interface LuaRouteViewProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

function statusOf(node: GraphNode): 'done' | 'active' | 'open' | 'locked' {
  if (node.variant === 'completed') return 'done';
  if (node.variant === 'active') return 'active';
  if (node.isUnlocked) return 'open';
  return 'locked';
}

const STATUS_LABEL: Record<ReturnType<typeof statusOf>, string> = {
  done: 'Completado',
  active: 'En progreso',
  open: 'Disponible',
  locked: 'Bloqueado',
};

const NodeRow: React.FC<{
  node: GraphNode;
  index: number;
  reduceMotion: boolean | null;
  onDeploy: (node: GraphNode) => void;
}> = ({ node, index, reduceMotion, onDeploy }) => {
  const status = statusOf(node);
  const locked = status === 'locked';
  const isBoss = node.variant === 'boss';

  const body = (
    <>
      <span aria-hidden="true" className="relative flex flex-col items-center self-stretch w-5 shrink-0">
        <span
          className={cn(
            'mt-1.5 h-2.5 w-2.5 rounded-full border-2',
            status === 'done' && 'border-emerald-400 bg-emerald-400',
            status === 'active' && 'border-[#8FA8FF] bg-[#8FA8FF] shadow-[0_0_10px_rgba(143,168,255,0.8)]',
            status === 'open' && 'border-slate-500 bg-transparent',
            locked && 'border-slate-700 bg-transparent'
          )}
        />
      </span>
      <span className="flex-1 min-w-0 py-3">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-500">{node.code}</span>
          {isBoss && (
            <span className="font-mono text-[9px] font-bold tracking-widest text-amber-300 border border-amber-400/40 rounded px-1.5 py-px">
              PROYECTO FINAL
            </span>
          )}
          {node.routeLabel && (
            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-500 border border-slate-800 rounded px-1.5 py-px uppercase">
              {node.routeLabel}
            </span>
          )}
        </span>
        <span className={cn('block text-sm font-bold tracking-wide mt-0.5', locked ? 'text-slate-500' : 'text-slate-100')}>
          {node.label}
        </span>
        <span className="block text-xs text-slate-500 truncate mt-0.5">{node.subtitle}</span>
        <span className="flex items-center gap-3 mt-1.5 font-mono text-[10px] text-slate-500">
          {typeof node.xp === 'number' && <span>+{node.xp} XP</span>}
          {typeof node.maxStars === 'number' && (
            <span className="tabular-nums">
              ★ {node.stars ?? 0}/{node.maxStars}
            </span>
          )}
          {locked && node.statusText && <span className="truncate">{node.statusText}</span>}
          {!locked && status !== 'done' && <span>{STATUS_LABEL[status]}</span>}
        </span>
      </span>
      <span aria-hidden="true" className="flex items-center pr-1 shrink-0">
        {status === 'done' ? (
          <Check className="w-4 h-4 text-emerald-400" weight="bold" />
        ) : locked ? (
          <Lock className="w-4 h-4 text-slate-600" />
        ) : (
          <CaretRight className="w-4 h-4 text-slate-500" />
        )}
      </span>
    </>
  );

  const cls = cn(
    'w-full flex items-stretch gap-3 rounded-xl border px-3 text-left transition-colors',
    locked
      ? 'border-transparent cursor-not-allowed'
      : 'border-transparent hover:bg-white/[0.04] hover:border-slate-800 cursor-pointer',
    status === 'active' && 'bg-[#8FA8FF]/[0.06] border-[#8FA8FF]/30 hover:border-[#8FA8FF]/50'
  );

  const inner = (
    <motion.span
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="flex items-stretch gap-3 w-full"
    >
      {body}
    </motion.span>
  );

  if (locked) {
    return (
      <li aria-label={`${node.label}, bloqueado${node.statusText ? `, ${node.statusText}` : ''}`}>
        <div className={cls} aria-disabled="true">
          {inner}
        </div>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        onClick={() => onDeploy(node)}
        aria-label={`${node.label}, ${STATUS_LABEL[status]}${typeof node.xp === 'number' ? `, ${node.xp} XP` : ''}`}
        className={cls}
      >
        {inner}
      </button>
    </li>
  );
};

const Divider: React.FC<{ label: string }> = ({ label }) => (
  <li aria-hidden="true" className="flex items-center gap-3 py-1">
    <span className="h-px flex-1 bg-slate-800" />
    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">{label}</span>
    <span className="h-px flex-1 bg-slate-800" />
  </li>
);

/** Ruta Lua minimalista: tronco → bifurcación Flujo/Datos → convergencia. Solo para la rama Lua. */
export const LuaRouteView: React.FC<LuaRouteViewProps> = ({ dataset, onDeploy }) => {
  const reduceMotion = useReducedMotion();

  const { trunkPre, flow, data, trunkPost, doneCount } = useMemo(() => {
    const nodes = dataset.nodes;
    const firstBranch = nodes.findIndex((n) => n.route === 'flow' || n.route === 'data');
    const split = firstBranch < 0 ? nodes.length : firstBranch;
    const trunkPre = nodes.slice(0, split).filter((n) => (n.route ?? 'trunk') === 'trunk');
    const flow = nodes.filter((n) => n.route === 'flow');
    const data = nodes.filter((n) => n.route === 'data');
    const branchIds = new Set([...flow, ...data].map((n) => n.id));
    const trunkPost = nodes.slice(split).filter((n) => !branchIds.has(n.id));
    const doneCount = nodes.filter((n) => n.variant === 'completed').length;
    return { trunkPre, flow, data, trunkPost, doneCount };
  }, [dataset]);

  const progress = Math.round((doneCount / Math.max(1, dataset.nodes.length)) * 100);
  let order = 0;
  const laneOf = (route: 'flow' | 'data') => (route === 'flow' ? 'Rama Flujo · bucles y funciones' : 'Rama Datos · tablas y texto');

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-8 pb-16">
        <div className="mb-6">
          <div
            role="progressbar"
            aria-label={`Progreso de la ruta Lua: ${doneCount} de ${dataset.nodes.length} módulos`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1 rounded-full bg-slate-800 overflow-hidden"
          >
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: ACCENT }} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-slate-500">
            {dataset.nodes.length} módulos · 3 rutas · {doneCount} completados
          </p>
        </div>

        <ol className="space-y-1">
          {trunkPre.map((n) => (
            <NodeRow key={n.id} node={n} index={order++} reduceMotion={reduceMotion} onDeploy={onDeploy} />
          ))}

          {(flow.length > 0 || data.length > 0) && (
            <>
              <Divider label="Elige tu ruta · puedes hacer ambas" />
              <li>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      { route: 'flow' as const, nodes: flow },
                      { route: 'data' as const, nodes: data },
                    ]
                  ).map(
                    ({ route, nodes }) =>
                      nodes.length > 0 && (
                        <div key={route}>
                          <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 px-1 mb-1">
                            <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                            {route === 'flow' ? 'Flujo' : 'Datos'}
                          </p>
                          <p className="sr-only">{laneOf(route)}</p>
                          <ol className="space-y-1">
                            {nodes.map((n) => (
                              <NodeRow key={n.id} node={n} index={order++} reduceMotion={reduceMotion} onDeploy={onDeploy} />
                            ))}
                          </ol>
                        </div>
                      )
                  )}
                </div>
              </li>
              <Divider label="Las rutas convergen" />
            </>
          )}

          {trunkPost.map((n) => (
            <NodeRow key={n.id} node={n} index={order++} reduceMotion={reduceMotion} onDeploy={onDeploy} />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default LuaRouteView;
