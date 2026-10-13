'use client';
import { ArrowLeft } from '@phosphor-icons/react';

import React, { useMemo } from 'react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';

interface RoadmapTopHudProps {
  sectorTitle: string;
  progressPercent?: number;
}

/** HUD superior en píldoras flotantes: título + continuar al centro. */
export function RoadmapTopHud({
  sectorTitle,
  progressPercent = 0,
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
    </>
  );
}
