'use client';

import React from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { IconLayoutList, IconAffiliate, IconLayersIntersect } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface RoadmapTopHudProps {
  sectorTitle: string;
  progressPercent?: number;
  coursesDisplayMode?: 'pin-rail' | 'canvas' | 'fusion';
  onToggleCoursesDisplayMode?: (mode: 'pin-rail' | 'canvas' | 'fusion') => void;
}

export function RoadmapTopHud({
  sectorTitle,
  progressPercent,
  coursesDisplayMode = 'pin-rail',
  onToggleCoursesDisplayMode,
}: RoadmapTopHudProps) {
  const { viewMode, triggerRetreatToCourses, openCourseLessons, coursesDataset, activeNodeId } = useRoadmapStore();
  const activeNode = coursesDataset.nodes.find((n) => n.id === activeNodeId);
  const activeCourseId =
    activeNode?.targetCourseId ||
    coursesDataset.nodes.find((n) => n.isUnlocked)?.targetCourseId ||
    coursesDataset.nodes[0]?.targetCourseId ||
    '';

  const displayTitle = sectorTitle.replace(/^SECTOR\s+\d+:\s*/i, '');

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
            onClick={triggerRetreatToCourses}
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider gap-1.5"
          >
            <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Volver a Cursos</span>
          </GradientButton>
        ) : null}
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-100 font-bold uppercase">
            {displayTitle}
          </div>
        </div>

        {/* View Switcher between Pin Lateral and Constellation Canvas */}
        {viewMode === 'courses' && onToggleCoursesDisplayMode && (
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono ml-2 shadow-inner">
            <button
              type="button"
              onClick={() => onToggleCoursesDisplayMode('pin-rail')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
                coursesDisplayMode === 'pin-rail'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
              title="Vista de cursos estilo GSAP Lateral Pin"
            >
              <IconLayoutList className="w-3.5 h-3.5" />
              <span>Pin Lateral</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleCoursesDisplayMode('canvas')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
                coursesDisplayMode === 'canvas'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
              title="Vista libre de mapa estelar interactivo"
            >
              <IconAffiliate className="w-3.5 h-3.5" />
              <span>Constelación</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleCoursesDisplayMode('fusion')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
                coursesDisplayMode === 'fusion'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
              title="Fusión interactiva: Riel Lateral y Constelación espacial sincronizados"
            >
              <IconLayersIntersect className="w-3.5 h-3.5" />
              <span>Fusión</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-4">
        <GradientButton
          variant="default"
          size="sm"
          onClick={() => activeCourseId && openCourseLessons(activeCourseId)}
          className="h-9 px-4 text-xs tracking-wider uppercase font-bold gap-2"
        >
          <Zap aria-hidden="true" className="w-4 h-4 fill-slate-950" />
          <span>{viewMode === 'courses' ? 'Continuar Curso →' : 'Resume Jump Point →'}</span>
        </GradientButton>
      </div>
    </header>
  );
}
