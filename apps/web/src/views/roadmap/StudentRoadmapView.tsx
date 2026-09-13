'use client';

import React from 'react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { RoadmapSidebar } from './RoadmapSidebar';
import { RoadmapTopHud } from './RoadmapTopHud';
import { RoadmapCanvas } from './RoadmapCanvas';
import { RoadmapLegend } from './RoadmapLegend';
import { LessonRail } from './LessonRail';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

export const StudentRoadmapView: React.FC = () => {
  const { openCourseLessons, getCurrentDataset, viewMode, retreatTrigger, returnToCourses, setActiveNode, isLoading } = useRoadmapStore();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=lessons')) {
      openCourseLessons('py-basic');
    }
  }, [openCourseLessons]);

  // Sin canvas montado (vista rail), el retorno se resuelve directo.
  const retreatSeen = React.useRef(0);
  React.useEffect(() => {
    if (retreatTrigger > retreatSeen.current) {
      retreatSeen.current = retreatTrigger;
      if (viewMode === 'lessons') returnToCourses();
    }
  }, [retreatTrigger, viewMode, returnToCourses]);

  const dataset = getCurrentDataset();

  const handleDeployLesson = (node: GraphNode) => {
    setActiveNode(node.id);
    if (node.targetCourseId) {
      void openCourseLessons(node.targetCourseId);
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden select-none">
      <HeroSkyBackground starCount={60} interactive={false} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Asidebar de Navegación Lateral para cambiar de lenguaje */}
      <RoadmapSidebar />

      {/* Lienzo Central del Roadmap Estilo Constelación / Sci-Fi */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
        <RoadmapTopHud
          sectorTitle={dataset.sectorTitle}
          progressPercent={dataset.progressPercent}
        />

        <main className="flex-1 relative overflow-hidden flex items-center justify-center p-2">
          {viewMode === 'lessons' ? (
            <div className="absolute inset-0 overflow-y-auto">
              <LessonRail dataset={dataset} onDeploy={handleDeployLesson} />
            </div>
          ) : (
            <RoadmapCanvas dataset={dataset} />
          )}
          {isLoading ? (
            <div
              role="status"
              aria-label="Cargando lecciones"
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-slate-950/70 backdrop-blur-sm"
            >
              <div aria-hidden="true" className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />
              <p className="font-mono text-xs text-cyan-300 tracking-widest">CARGANDO LECCIONES…</p>
            </div>
          ) : null}
        </main>

        <RoadmapLegend />
      </div>
    </div>
  );
};
