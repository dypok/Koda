'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Flame, Lock, LockOpen, Sidebar, SidebarSimple, Star } from '@phosphor-icons/react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { RoadmapPixiGraph } from './RoadmapPixiGraph';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { cn } from '@/lib/utils';

interface RoadmapFusionViewProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

/** Vista Fusión minimalista: fondo ASCII + grafo Pixi + panel plano. Sin 3D ni láseres. */
export const RoadmapFusionView: React.FC<RoadmapFusionViewProps> = ({ dataset, onDeploy }) => {
  const {
    activeBranchId,
    activeNodeId,
    setActiveNode,
    setPanOffset,
    unlockingNodeId,
    toggleNodeLock,
    viewMode,
  } = useRoadmapStore();
  const inLessons = viewMode === 'lessons';

  const { user } = useAuthStore();
  const streak = user?.streak ?? 1;
  const xp = user?.totalXp ?? 100;

  const nodes = dataset.nodes;
  const [showPanel, setShowPanel] = useState(true);

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const branchColor = activeBranch.color;

  const activeIndex = useMemo(() => {
    const idx = nodes.findIndex((n) => n.id === activeNodeId);
    return idx >= 0 ? idx : 0;
  }, [nodes, activeNodeId]);

  const activeNode = nodes[activeIndex] || nodes[0];
  const isBossNode = activeNode?.variant === 'boss';
  const themeAccentColor = isBossNode ? '#F43F5E' : branchColor;

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(nodes.length - 1, index));
      const targetNode = nodes[clamped];
      if (targetNode) setActiveNode(targetNode.id);
    },
    [nodes, setActiveNode]
  );

  const lastWheelTime = useRef(0);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.no-course-scroll')) return;
      const now = Date.now();
      if (now - lastWheelTime.current < 280) return;
      if (e.deltaY > 20) {
        lastWheelTime.current = now;
        goTo(activeIndex + 1);
      } else if (e.deltaY < -20) {
        lastWheelTime.current = now;
        goTo(activeIndex - 1);
      }
    },
    [activeIndex, goTo]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(activeIndex - 1);
      } else if (e.key === 'Enter') {
        if (activeNode && activeNode.isUnlocked) {
          e.preventDefault();
          onDeploy(activeNode);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goTo, activeNode, onDeploy]);

  // Arrastre para paneo (el zoom vive en el store y lo consume el grafo Pixi).
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, [role="button"]')) return;
    const { panOffset } = useRoadmapStore.getState();
    dragRef.current = { px: e.clientX, py: e.clientY, ox: panOffset.x, oy: panOffset.y };
  }, []);
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = dragRef.current;
      if (!start) return;
      const { zoomLevel } = useRoadmapStore.getState();
      const scale = zoomLevel / 100;
      const boundX = 550 * scale;
      const boundY = 380 * scale;
      const x = Math.max(-boundX, Math.min(boundX, start.ox + (e.clientX - start.px)));
      const y = Math.max(-boundY, Math.min(boundY, start.oy + (e.clientY - start.py)));
      setPanOffset({ x, y });
    },
    [setPanOffset]
  );
  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleSelectNode = useCallback(
    (node: GraphNode) => {
      setActiveNode(node.id);
    },
    [setActiveNode]
  );

  const progressPercent = Math.round(((activeIndex + 1) / Math.max(1, nodes.length)) * 100);
  const isLocked = activeNode ? !activeNode.isUnlocked : true;
  const isBoss = activeNode?.variant === 'boss';

  return (
    <div onWheel={handleWheel} className="relative w-full h-full overflow-hidden select-none">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 z-10 touch-none cursor-grab active:cursor-grabbing"
      >
        <RoadmapCanvasControls />
        <RoadmapPixiGraph
          dataset={dataset}
          branchColor={branchColor}
          activeNodeId={activeNodeId}
          onSelect={handleSelectNode}
          edgeStyle="cylindrical"
          edgeDesign="twin"
          nodeStyle="hex"
          unlockingNodeId={unlockingNodeId}
          unlockStyle="shockwave"
        />
      </div>

      {activeNode && (
        <aside
          className={cn(
            'absolute right-4 sm:right-6 top-20 z-20 w-80 sm:w-96 max-w-[calc(100%-2rem)] max-h-[calc(100%-6.5rem)] overflow-y-auto rounded-2xl border bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300',
            showPanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          )}
          style={{ borderColor: isBoss ? 'rgba(244,63,94,0.5)' : 'rgba(255,106,0,0.35)' }}
          aria-label={`Detalle del módulo ${activeNode.label}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              {inLessons ? 'Lección' : 'Módulo'} // {activeNode.code}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border',
                  isBoss
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : isLocked
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                )}
              >
                {isBoss ? 'PROYECTO FINAL' : isLocked ? 'BLOQUEADO' : activeNode.statusText || 'DISPONIBLE'}
              </span>
              <button
                type="button"
                onClick={() => setShowPanel(false)}
                aria-label="Ocultar detalle"
                className="p-1.5 rounded-lg text-slate-300 hover:text-orange-400 bg-slate-800/60 border border-slate-700/60 hover:border-orange-500/50 transition-colors cursor-pointer"
              >
                <SidebarSimple className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className={cn('font-display text-xl font-black tracking-tight leading-snug', isBoss ? 'text-rose-200' : 'text-white')}>
              {activeNode.label}
            </h3>
            {activeNode.subtitle && (
              <p className="font-mono text-[10px] text-slate-400 mt-1 tracking-wider uppercase line-clamp-2">
                {activeNode.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {typeof activeNode.xp === 'number' && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border text-amber-300 bg-amber-500/10 border-amber-500/20">
                +{activeNode.xp} XP
              </span>
            )}
            {!isBoss && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/60">
                <Star className="w-3 h-3 fill-amber-400 text-amber-300" />
                <span className="tabular-nums">
                  {activeNode.stars ?? 0}/{activeNode.maxStars ?? 9}
                </span>
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
            {isLocked ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 font-mono text-[11px] font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>{activeNode.statusText || 'Bloqueado'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onDeploy(activeNode)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-black transition-all hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg hover:brightness-110',
                  isBoss
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-500/30 hover:shadow-rose-500/50'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_18px_rgba(255,106,0,0.45)] hover:shadow-[0_0_24px_rgba(255,106,0,0.65)]'
                )}
              >
                <span>{isBoss ? 'Abrir proyecto final' : inLessons ? 'Iniciar lección' : 'Abrir módulo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleNodeLock(activeNode.id)}
              disabled={unlockingNodeId === activeNode.id}
              aria-pressed={!isLocked}
              aria-label={isLocked ? `Desbloquear ${activeNode.label}` : `Bloquear ${activeNode.label}`}
              title="Bloquear o desbloquear a voluntad"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 font-mono text-[11px] font-bold text-orange-300 transition-all hover:bg-orange-500/20 hover:border-orange-500/60 hover:text-orange-200 disabled:cursor-wait disabled:opacity-50 cursor-pointer shadow-[0_0_10px_rgba(255,106,0,0.15)]"
            >
              {isLocked ? (
                <LockOpen aria-hidden="true" className="w-3.5 h-3.5" />
              ) : (
                <Lock aria-hidden="true" className="w-3.5 h-3.5" />
              )}
              <span>{unlockingNodeId === activeNode.id ? '…' : isLocked ? 'Abrir' : 'Cerrar'}</span>
            </button>
          </div>
        </aside>
      )}

      {!showPanel && (
        <button
          type="button"
          onClick={() => setShowPanel(true)}
          aria-label="Mostrar detalle"
          className="absolute right-4 top-20 z-20 p-2.5 rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl text-slate-300 hover:text-orange-400 hover:border-orange-500/50 shadow-xl transition-colors cursor-pointer"
        >
          <Sidebar className="w-4 h-4" />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tabular-nums text-orange-400">
            0{activeIndex + 1} / 0{nodes.length}
          </span>
          <div className="flex items-center gap-1.5" role="list" aria-label={`Paso ${activeIndex + 1} de ${nodes.length}`}>
            {nodes.map((n, i) => (
              <button
                key={n.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a ${n.label}`}
                role="listitem"
                className={cn(
                  'h-1.5 rounded-full transition-all cursor-pointer',
                  i === activeIndex
                    ? 'w-5 shadow-[0_0_8px_rgba(255,106,0,0.8)]'
                    : 'w-1.5 bg-slate-700/70 hover:bg-orange-500/50'
                )}
                style={{ backgroundColor: i === activeIndex ? (n.variant === 'boss' ? '#F43F5E' : '#FF6A00') : undefined }}
              />
            ))}
          </div>
        </div>
        <span aria-hidden="true" className="hidden sm:block w-px h-6 bg-slate-700/60" />
        <div className="flex items-center gap-2">
          <Flame aria-hidden="true" weight="fill" className="h-4 w-4 text-orange-500" />
          <span className="flex flex-col leading-none">
            <span className="font-mono text-xs font-black tracking-wider text-orange-300">
              {streak}D
            </span>
            <span className="font-mono text-[9px] font-bold tabular-nums tracking-wide text-amber-300/90">
              +{xp} XP
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapFusionView;
