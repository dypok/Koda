'use client';

import React from 'react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { PYTHON_COURSES_DATASET } from '@/models/roadmap/python-courses-graph.mock';
import { PYTHON_BASIC_LESSONS_DATASET } from '@/models/roadmap/python-lessons-graph.mock';
import { RoadmapSidebar } from './RoadmapSidebar';
import { RoadmapTopHud } from './RoadmapTopHud';
import { RoadmapCanvas } from './RoadmapCanvas';
import { RoadmapLegend } from './RoadmapLegend';

export const StudentRoadmapView: React.FC = () => {
  const { viewMode, openCourseLessons } = useRoadmapStore();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=lessons')) {
      openCourseLessons('py-basic');
    }
  }, [openCourseLessons]);

  const dataset = viewMode === 'courses' ? PYTHON_COURSES_DATASET : PYTHON_BASIC_LESSONS_DATASET;

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden select-none">
      <HeroSkyBackground starCount={160} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Asidebar de Navegación Lateral para cambiar de lenguaje */}
      <RoadmapSidebar />

      {/* Lienzo Central del Roadmap Estilo Constelación / Sci-Fi */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
        <RoadmapTopHud
          sectorTitle={dataset.sectorTitle}
          progressPercent={dataset.progressPercent}
        />

        <main className="flex-1 relative overflow-hidden flex items-center justify-center p-2">
          <RoadmapCanvas dataset={dataset} />
        </main>

        <RoadmapLegend />
      </div>
    </div>
  );
};
