'use client';

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RoadmapDynamicBackground } from '@/components/roadmap/RoadmapDynamicBackground';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { RoadmapBranchPill } from './RoadmapBranchPill';
import { RoadmapProfilePill } from './RoadmapProfilePill';
import { RoadmapTopHud } from './RoadmapTopHud';
import { RoadmapFusionView } from './RoadmapFusionView';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { AdminRoadmapToolbar } from '@/components/admin/AdminRoadmapToolbar';
import { AddSelectorModal } from '@/components/admin/AddSelectorModal';
import { DeleteSelectorModal } from '@/components/admin/DeleteSelectorModal';
import { AdminDashboardDrawer } from '@/components/admin/AdminDashboardDrawer';

export const StudentRoadmapView: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = Boolean(user?.role === 'admin' || user?.email?.toLowerCase().includes('admin'));

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addModalInitialType, setAddModalInitialType] = React.useState<'track' | 'module' | 'section' | undefined>(undefined);
  const [addModalTargetIndex, setAddModalTargetIndex] = React.useState<number | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = React.useState(false);

  const {
    openCourseLessons,
    getCurrentDataset,
    viewMode,
    retreatTrigger,
    returnToCourses,
    setActiveNode,
    activeNodeId,
    isLoading,
    hydrateProgress,
    selectedCourseId,
    insertModuleNode,
    insertSectionNode,
    registerTrack,
  } = useRoadmapStore();

  React.useEffect(() => {
    hydrateProgress();
  }, [hydrateProgress]);

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
    if (!isAdmin && !node.isUnlocked) return;
    // En cursos abre el sub-roadmap de secciones; en secciones navega a la lección.
    if (viewMode === 'courses') {
      void openCourseLessons(node.targetCourseId ?? node.id, isAdmin);
      return;
    }
    const currentCourse = selectedCourseId || node.targetCourseId || useRoadmapStore.getState().activeBranchId || 'fe-html';
    const tail = node.id.split('-').pop() ?? '';
    const sectionRef = /^s\d+$/.test(tail) ? tail : node.id;
    router.push(`/app/curso/${currentCourse}/seccion/${sectionRef}`);
  };

  const handleDropNewItem = (type: 'module' | 'section', targetIdx: number) => {
    setAddModalInitialType(type);
    setAddModalTargetIndex(targetIdx);
    setIsAddModalOpen(true);
  };

  const handleCreatedItem = (type: 'track' | 'module' | 'section', data: any, targetIndex?: number) => {
    if (type === 'track') {
      registerTrack({
        slug: data.slug,
        name: data.name || data.title || 'NUEVA RUTA',
        color: data.color || '#F59E0B',
        description: data.description,
      });
    } else if (type === 'module') {
      insertModuleNode(
        {
          id: data.slug || `mod-${Date.now()}`,
          label: (data.title || 'NUEVO MODULO').toUpperCase(),
          subtitle: data.objective || 'OBJETIVO PEDAGOGICO',
          targetCourseId: data.slug,
        },
        targetIndex
      );
    } else if (type === 'section') {
      insertSectionNode(
        {
          id: data.slug || `sec-${Date.now()}`,
          label: (data.title || 'NUEVA SECCION').toUpperCase(),
          subtitle: `RECOMPENSA: +${data.xp_reward || 50} XP`,
          xp: data.xp_reward || 50,
        },
        targetIndex
      );
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden select-none">
      <RoadmapDynamicBackground />

      {/* Barra de Herramientas de Administrador si la sesion es admin */}
      {isAdmin && (
        <AdminRoadmapToolbar
          onOpenAddModal={() => {
            setAddModalInitialType(undefined);
            setAddModalTargetIndex(undefined);
            setIsAddModalOpen(true);
          }}
          onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
          onModifyNode={() => {
            const node = dataset.nodes.find((n) => n.id === activeNodeId) || dataset.nodes[0];
            if (node) handleDeployLesson(node);
          }}
          isPreviewMode={isPreviewMode}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          onToggleDashboard={() => setIsDashboardOpen(!isDashboardOpen)}
          viewMode={viewMode}
          nodes={dataset.nodes}
          nodesCount={dataset.nodes.length}
          onDropNewItem={handleDropNewItem}
        />
      )}

      {/* Lienzo a todo ancho: la navegación vive en píldoras flotantes */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
        {viewMode === 'courses' && (
          <RoadmapBranchPill
            isAdmin={Boolean(isAdmin && !isPreviewMode)}
            onOpenAddRoute={() => {
              setAddModalInitialType('track');
              setIsAddModalOpen(true);
            }}
            onOpenDeleteRoute={() => setIsDeleteModalOpen(true)}
          />
        )}
        <RoadmapProfilePill />
        <RoadmapTopHud
          sectorTitle={dataset.sectorTitle}
          progressPercent={dataset.progressPercent}
          hasAdminToolbar={Boolean(isAdmin)}
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
              <RoadmapFusionView
                dataset={dataset}
                onDeploy={handleDeployLesson}
                isAdminMode={isAdmin && !isPreviewMode}
              />
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
      </div>

      {/* Drawer Deslizable con la Dashboard y opciones para el administrador */}
      {isAdmin && (
        <AdminDashboardDrawer
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
        />
      )}

      {/* Modales de Alta y Baja en la Interfaz Real */}
      <AddSelectorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddModalInitialType(undefined);
          setAddModalTargetIndex(undefined);
        }}
        initialType={addModalInitialType}
        initialTargetIndex={addModalTargetIndex}
        onCreated={handleCreatedItem}
      />
      <DeleteSelectorModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
};
