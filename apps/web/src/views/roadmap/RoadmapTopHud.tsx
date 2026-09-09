'use client';

import React from 'react';
import { IconArrowLeft, IconBolt, IconShieldCheck } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';

interface RoadmapTopHudProps {
  sectorTitle: string;
  progressPercent: number;
}

export function RoadmapTopHud({ sectorTitle, progressPercent }: RoadmapTopHudProps) {
  const { viewMode, returnToCourses, openCourseLessons } = useRoadmapStore();

  return (
    <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-4">
        {viewMode === 'lessons' ? (
          <button
            onClick={returnToCourses}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-md"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Cursos</span>
          </button>
        ) : null}
        <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-slate-200">
          <span className="text-cyan-400 animate-pulse text-base">((o))</span>
          <span className="font-semibold uppercase">{sectorTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Progress</span>
          <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">{progressPercent}%</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
          <IconShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>LVL 4 ARCHITECT</span>
        </div>

        <button
          onClick={() => openCourseLessons('py-basic')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <IconBolt className="w-4 h-4 fill-slate-950" />
          <span>{viewMode === 'courses' ? 'Continuar Curso →' : 'Resume Jump Point →'}</span>
        </button>
      </div>
    </header>
  );
}
