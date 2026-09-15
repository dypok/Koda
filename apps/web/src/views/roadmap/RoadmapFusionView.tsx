'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CaretDown, CaretUp, Lock, LockOpen, Sidebar, SidebarSimple, Star } from '@phosphor-icons/react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { RoadmapPixiGraph } from './RoadmapPixiGraph';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
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
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goTo]);

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
      <OrbitFieldBackground />

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
          edgeStyle="pulse"
          edgeDesign="twin"
          nodeStyle="hex"
          unlockingNodeId={unlockingNodeId}
          unlockStyle="shockwave"
        />
      </div>

      {activeNode && (
        <aside
          className={cn(
            'absolute right-4 sm:right-6 top-16 sm:top-16 z-20 w-80 sm:w-96 max-w-[calc(100%-2rem)] max-h-[calc(100%-9rem)] overflow-y-auto rounded-2xl border bg-slate-950/90 backdrop-blur-md p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300',
            showPanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          )}
          style={{ borderColor: isBoss ? 'rgba(244,63,94,0.5)' : `${branchColor}40` }}
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
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                )}
              >
                {isBoss ? 'PROYECTO FINAL' : isLocked ? 'BLOQUEADO' : activeNode.statusText || 'DISPONIBLE'}
              </span>
              <button
                type="button"
                onClick={() => setShowPanel(false)}
                aria-label="Ocultar detalle"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
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
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                <Star className="w-3 h-3 fill-amber-400 text-amber-300" />
                <span className="tabular-nums">
                  {activeNode.stars ?? 0}/{activeNode.maxStars ?? 9}
                </span>
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            {isLocked ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-[11px] font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>{activeNode.statusText || 'Bloqueado'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onDeploy(activeNode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold text-slate-950 transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
                style={{ backgroundColor: isBoss ? '#F43F5E' : branchColor, color: isBoss ? '#fff' : '#020617' }}
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 font-mono text-[11px] font-bold text-slate-300 transition-colors hover:border-amber-400/60 hover:text-amber-300 disabled:cursor-wait disabled:opacity-50 cursor-pointer"
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
          className="absolute right-4 top-16 z-20 p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Sidebar className="w-4 h-4" />
        </button>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/85 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold tabular-nums" style={{ color: themeAccentColor }}>
            0{activeIndex + 1} / 0{nodes.length}
          </span>
          <div
            role="progressbar"
            aria-label={`Paso ${activeIndex + 1} de ${nodes.length}`}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-20 sm:w-28 h-[3px] rounded-full bg-slate-800 overflow-hidden"
          >
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%`, backgroundColor: themeAccentColor }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Paso anterior"
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <CaretUp className="w-3.5 h-3.5" />
          </button>
          {nodes.map((n, i) => (
            <button
              key={n.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a ${n.label}`}
              className={cn('h-1.5 rounded-full transition-all cursor-pointer', i === activeIndex ? 'w-5' : 'w-1.5 bg-slate-700 hover:bg-slate-500')}
              style={{ backgroundColor: i === activeIndex ? (n.variant === 'boss' ? '#F43F5E' : branchColor) : undefined }}
            />
          ))}
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === nodes.length - 1}
            aria-label="Paso siguiente"
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <CaretDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapFusionView;
