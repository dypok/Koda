'use client';
import { ArrowLeft, List, ShareNetwork, Stack } from '@phosphor-icons/react';

import React, { useMemo } from 'react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { cn } from '@/lib/utils';

interface RoadmapTopHudProps {
  sectorTitle: string;
  progressPercent?: number;
  coursesDisplayMode?: 'pin-rail' | 'canvas' | 'fusion';
  onToggleCoursesDisplayMode?: (mode: 'pin-rail' | 'canvas' | 'fusion') => void;
}

/** HUD superior en píldoras flotantes: título + continuar al centro, vistas a la derecha. */
export function RoadmapTopHud({
  sectorTitle,
  progressPercent = 0,
  coursesDisplayMode = 'fusion',
  onToggleCoursesDisplayMode,
}: RoadmapTopHudProps) {
  const {
    viewMode,
    triggerRetreatToCourses,
    openCourseLessons,
    coursesDataset,
    activeNodeId,
    activeBranchId,
  } = useRoadmapStore();

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const branchColor = activeBranch.color;

  const activeNode = coursesDataset.nodes.find((n) => n.id === activeNodeId);
  const activeCourseId =
    activeNode?.targetCourseId ||
    coursesDataset.nodes.find((n) => n.isUnlocked)?.targetCourseId ||
    coursesDataset.nodes[0]?.targetCourseId ||
    '';

  const displayTitle = sectorTitle.replace(/^SECTOR\s+\d+:\s*/i, '');
  const inLessons = viewMode === 'lessons';

  const modeTabs = (
    inLessons || !onToggleCoursesDisplayMode ? null : (
      <div
        role="tablist"
        aria-label="Vista del roadmap"
        className="hidden md:flex items-center gap-1 rounded-full border border-slate-700/50 bg-slate-900/40 p-1 backdrop-blur-xl shadow-xl"
      >
        {(
          [
            { id: 'pin-rail', label: 'Lista', Icon: List },
            { id: 'canvas', label: 'Mapa', Icon: ShareNetwork },
            { id: 'fusion', label: 'Fusión', Icon: Stack },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={coursesDisplayMode === id}
            onClick={() => onToggleCoursesDisplayMode(id)}
            title={`Vista ${label}`}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold transition-all cursor-pointer',
              coursesDisplayMode === id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,106,0,0.4)] font-black'
                : 'text-slate-400 hover:text-orange-300 hover:bg-slate-800/50'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    )
  );

  return (
    <>
      {inLessons ? (
        <div className="absolute left-4 top-4 z-20 flex w-max max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/40 py-1.5 pl-1.5 pr-4 backdrop-blur-xl shadow-xl">
          <button
            type="button"
            onClick={triggerRetreatToCourses}
            aria-label="Volver a los cursos"
            className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-orange-500/20 hover:text-orange-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="truncate font-display text-xs font-black uppercase tracking-wide text-white">
            {displayTitle}
          </span>
          <span className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-orange-400/90">
            {Math.round(progressPercent)}%
          </span>
        </div>
      ) : (
        <div className="absolute left-1/2 top-4 z-20 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-slate-700/50 bg-slate-900/40 py-1.5 pl-4 pr-1.5 backdrop-blur-xl shadow-xl">
          <span className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-orange-400/90">
            {Math.round(progressPercent)}%
          </span>
          <span className="max-w-40 truncate font-display text-xs font-black uppercase tracking-wide text-white sm:max-w-xs">
            {displayTitle}
          </span>
          <button
            type="button"
            onClick={() => activeCourseId && openCourseLessons(activeCourseId)}
            className="shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-black text-slate-950 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_14px_rgba(255,106,0,0.45)] hover:shadow-[0_0_20px_rgba(255,106,0,0.65)] hover:brightness-110"
          >
            Continuar →
          </button>
        </div>
      )}
      {modeTabs && (
        <div className="absolute right-28 top-4 z-20 hidden md:block">{modeTabs}</div>
      )}
    </>
  );
}
