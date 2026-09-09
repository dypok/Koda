'use client';

import React from 'react';
import { IconArrowLeft, IconBolt } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { GradientButton } from '@/components/ui/gradient-button';

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
          <GradientButton
            variant="secondary"
            size="sm"
            onClick={returnToCourses}
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider gap-1.5"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Cursos</span>
          </GradientButton>
        ) : null}
        <div className="font-mono text-sm tracking-widest text-slate-200 font-semibold uppercase">
          {sectorTitle}
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

        <GradientButton
          variant="default"
          size="sm"
          onClick={() => openCourseLessons('py-basic')}
          className="h-9 px-4 text-xs tracking-wider uppercase font-bold gap-2"
        >
          <IconBolt className="w-4 h-4 fill-slate-950" />
          <span>{viewMode === 'courses' ? 'Continuar Curso →' : 'Resume Jump Point →'}</span>
        </GradientButton>
      </div>
    </header>
  );
}
