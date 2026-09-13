'use client';

import React from 'react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { RoadmapSidebar } from './RoadmapSidebar';
import { RoadmapTopHud } from './RoadmapTopHud';
import { RoadmapCanvas } from './RoadmapCanvas';
import { RoadmapLegend } from './RoadmapLegend';

export const StudentRoadmapView: React.FC = () => {
  const { openCourseLessons, getCurrentDataset, isLoading } = useRoadmapStore();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=lessons')) {
      openCourseLessons('py-basic');
    }
  }, [openCourseLessons]);

  const dataset = getCurrentDataset();

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
