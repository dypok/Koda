'use client';

import React from 'react';
import { IconArrowLeft, IconBolt } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { GradientButton } from '@/components/ui/gradient-button';
import gsap from 'gsap';

interface RoadmapTopHudProps {
  sectorTitle: string;
  progressPercent: number;
}

export function RoadmapTopHud({ sectorTitle, progressPercent }: RoadmapTopHudProps) {
  const { viewMode, returnToCourses, openCourseLessons, coursesDataset } = useRoadmapStore();
  const activeCourseId =
    coursesDataset.nodes.find((n) => n.isUnlocked)?.targetCourseId ||
    coursesDataset.nodes[0]?.targetCourseId ||
    '';

  const displayTitle = sectorTitle.replace(/^SECTOR\s+\d+:\s*/i, '');
  const barSegments = 10;
  const activeSegments = Math.round((progressPercent / 100) * barSegments);

  const headerRef = React.useRef<HTMLElement | null>(null);

  // Animación sutil de inicialización con GSAP
  React.useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="h-16 px-6 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between z-20 shrink-0 select-none"
    >
      {/* Sector Title and Navigation */}
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
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-100 font-bold uppercase">
            {displayTitle}
          </div>
        </div>
      </div>

      {/* Telemetry Power Cells & Actions */}
      <div className="flex items-center gap-6">
        {/* Segmented Power/Progress Meter */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
              TELEMETRY SYNC
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{progressPercent}% SYNC</span>
          </div>

          {/* Segmented HUD Cells */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded">
            {Array.from({ length: barSegments }).map((_, idx) => {
              const isFilled = idx < activeSegments;
              return (
                <div
                  key={idx}
                  className={`w-2 h-3.5 rounded-xs transition-colors duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                      : 'bg-slate-800/80'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <GradientButton
          variant="default"
          size="sm"
          onClick={() => activeCourseId && openCourseLessons(activeCourseId)}
          className="h-9 px-4 text-xs tracking-wider uppercase font-bold gap-2"
        >
          <IconBolt className="w-4 h-4 fill-slate-950" />
          <span>{viewMode === 'courses' ? 'Continuar Curso →' : 'Resume Jump Point →'}</span>
        </GradientButton>
      </div>
    </header>
  );
}
