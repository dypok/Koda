'use client';

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RoadmapDynamicBackground } from '@/components/roadmap/RoadmapDynamicBackground';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { RoadmapBranchPill } from './RoadmapBranchPill';
import { RoadmapProfilePill } from './RoadmapProfilePill';
import { RoadmapTopHud } from './RoadmapTopHud';
import { RoadmapCanvas } from './RoadmapCanvas';
import { RoadmapLegend } from './RoadmapLegend';
import { CoursePinRail } from './CoursePinRail';
import { RoadmapFusionView } from './RoadmapFusionView';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRouter } from 'next/navigation';

export const StudentRoadmapView: React.FC = () => {
  const router = useRouter();
  const { openCourseLessons, getCurrentDataset, viewMode, retreatTrigger, returnToCourses, setActiveNode, isLoading, hydrateProgress, selectedCourseId } = useRoadmapStore();

  React.useEffect(() => {
    hydrateProgress();
  }, [hydrateProgress]);
  const [coursesDisplayMode, setCoursesDisplayMode] = React.useState<'pin-rail' | 'canvas' | 'fusion'>('fusion');

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
  const reduceMotion = useReducedMotion();
  const slide = reduceMotion ? 0 : 48;

  const handleDeployLesson = (node: GraphNode) => {
    setActiveNode(node.id);
    if (!node.isUnlocked) return;
    // En cursos abre el sub-roadmap de secciones; en secciones navega a la lección.
    if (viewMode === 'courses') {
      void openCourseLessons(node.targetCourseId ?? node.id);
      return;
    }
    const tail = node.id.split('-').pop() ?? '';
    const sectionRef = /^s\d+$/.test(tail) ? tail : node.id;
    router.push(`/app/curso/${selectedCourseId}/seccion/${sectionRef}`);
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden select-none">
      <RoadmapDynamicBackground />

      {/* Lienzo a todo ancho: la navegación vive en píldoras flotantes */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
        {viewMode === 'courses' && <RoadmapBranchPill />}
        <RoadmapProfilePill />
        <RoadmapTopHud
          sectorTitle={dataset.sectorTitle}
          progressPercent={dataset.progressPercent}
          coursesDisplayMode={coursesDisplayMode}
          onToggleCoursesDisplayMode={setCoursesDisplayMode}
        />

        <main className="flex-1 relative overflow-hidden flex items-center justify-center p-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewMode}
              className="absolute inset-0"
              initial={{ opacity: 0, x: viewMode === 'lessons' ? slide : -slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: viewMode === 'lessons' ? -slide : slide }}
              transition={{ duration: reduceMotion ? 0.2 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {viewMode === 'lessons' || coursesDisplayMode === 'fusion' ? (
                <RoadmapFusionView dataset={dataset} onDeploy={handleDeployLesson} />
              ) : coursesDisplayMode === 'pin-rail' ? (
                <CoursePinRail dataset={dataset} onDeploy={handleDeployLesson} />
              ) : (
                <RoadmapCanvas dataset={dataset} />
              )}
            </motion.div>
          </AnimatePresence>

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
