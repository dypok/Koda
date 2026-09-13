import { create } from 'zustand';
import { GraphViewMode, GraphDataset, NodeVariant, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_BASIC_LESSONS_DATASET } from '@/models/roadmap/python-lessons-graph.mock';
import { CareerBranchId, CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { FRONTEND_COURSES_DATASET } from '@/models/roadmap/tracks/frontend-track.mock';
import { RoadmapService } from '@/services/roadmap/roadmap.service';

const PROGRESS_KEY = 'koda_roadmap_progress';

function persistProgress(dataset: GraphDataset) {
  try {
    const unlockedIds = dataset.nodes.filter((n) => n.isUnlocked).map((n) => n.id);
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ progressPercent: dataset.progressPercent, unlockedIds })
    );
  } catch {
    // sin almacenamiento, el avance vive solo en memoria
  }
}

function restoreProgress(dataset: GraphDataset): GraphDataset {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return dataset;
    const saved = JSON.parse(raw) as { progressPercent?: number; unlockedIds?: string[] };
    if (!Array.isArray(saved.unlockedIds)) return dataset;
    const unlocked = new Set(saved.unlockedIds);
    return {
      ...dataset,
      progressPercent: typeof saved.progressPercent === 'number' ? saved.progressPercent : dataset.progressPercent,
      nodes: dataset.nodes.map((n) =>
        unlocked.has(n.id) && !n.isUnlocked
          ? { ...n, isUnlocked: true, variant: (n.variant === 'locked' ? 'unlocked' : n.variant) as NodeVariant }
          : n
      ),
    };
  } catch {
    return dataset;
  }
}

interface RoadmapStoreState {
  viewMode: GraphViewMode;
  activeBranchId: CareerBranchId;
  selectedCourseId: string;
  activeNodeId: string | null;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  isLoading: boolean;
  coursesDataset: GraphDataset;
  lessonsDataset: GraphDataset;
  retreatTrigger: number;
  triggerRetreatToCourses: () => void;
  animatingConnectionId: string | null;
  unlockingNodeId: string | null;
  simulateCompleteAndUnlockNext: () => void;
  toggleNodeLock: (nodeId: string) => void;
  unlockNodeWithCinematic: (nodeId: string) => void;
  openCourseLessons: (courseId: string) => Promise<void>;
  returnToCourses: () => void;
  setActiveNode: (id: string | null) => void;
  setBranch: (branchId: CareerBranchId) => void;
  setPanOffset: (pan: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  getCurrentDataset: () => GraphDataset;
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  viewMode: 'courses',
  activeBranchId: 'frontend',
  selectedCourseId: 'fe-html',
  activeNodeId: 'fe-html',
  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  isLoading: false,
  coursesDataset: typeof window !== 'undefined' ? restoreProgress(FRONTEND_COURSES_DATASET) : FRONTEND_COURSES_DATASET,
  lessonsDataset: PYTHON_BASIC_LESSONS_DATASET,
  retreatTrigger: 0,
  triggerRetreatToCourses: () => set((s) => ({ retreatTrigger: s.retreatTrigger + 1 })),
  animatingConnectionId: null,
  unlockingNodeId: null,
  simulateCompleteAndUnlockNext: () => {
    const dataset = get().coursesDataset;
    const activeNode = dataset.nodes.find((n) => n.variant === 'active');
    if (!activeNode) return;

    // Encontrar conexión saliente desde el nodo activo hacia el siguiente nodo bloqueado
    const nextConnection = dataset.connections.find((c) => c.fromId === activeNode.id);
    if (!nextConnection) return;
    const targetNodeId = nextConnection.toId;

    // 1. Iniciar encendido del haz láser
    set({ animatingConnectionId: nextConnection.id });

    // 2. Al llegar el rayo (0.85s), marcar el nodo anterior como completado y activar la rotura de candado del nodo destino
    setTimeout(() => {
      set({ unlockingNodeId: targetNodeId });

      // Actualizar los datos del dataset
      const updatedNodes = dataset.nodes.map((n) => {
        if (n.id === activeNode.id) {
          return { ...n, variant: 'completed' as const, stars: n.maxStars || 9, statusText: 'DOMINADO • 100%' };
        }
        if (n.id === targetNodeId) {
          return {
            ...n,
            isUnlocked: true,
            variant: 'active' as const,
            iconType: 'brackets' as const,
            statusText: 'ACTIVO • EN PROGRESO',
          };
        }
        return n;
      });

      const updatedConnections = dataset.connections.map((c) => {
        if (c.id === nextConnection.id) {
          return { ...c, isDashed: false };
        }
        return c;
      });

      set({
        coursesDataset: {
          ...dataset,
          progressPercent: Math.min(100, dataset.progressPercent + 20),
          nodes: updatedNodes,
          connections: updatedConnections,
        },
        activeNodeId: targetNodeId,
      });
      persistProgress({
        ...dataset,
        progressPercent: Math.min(100, dataset.progressPercent + 20),
        nodes: updatedNodes,
        connections: updatedConnections,
      });

      // 3. Limpiar banderas de animación tras completarse la cinemática
      setTimeout(() => {
        set({ animatingConnectionId: null, unlockingNodeId: null });
      }, 1200);
    }, 850);
  },
  toggleNodeLock: (nodeId: string) => {
    const isCourses = get().viewMode === 'courses';
    const dataset = isCourses ? get().coursesDataset : get().lessonsDataset;

    const targetNode = dataset.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const willUnlock = !targetNode.isUnlocked;

    const updatedNodes: GraphNode[] = dataset.nodes.map((n) => {
      if (n.id === nodeId) {
        if (willUnlock) {
          // Desbloquear nodo
          return {
            ...n,
            isUnlocked: true,
            variant: (n.variant === 'locked' || n.variant === 'branch' ? 'unlocked' : n.variant) as NodeVariant,
            iconType: n.iconType === 'lock' ? 'code' : n.iconType,
            statusText: 'DISPONIBLE • DESBLOQUEADO',
          };
        } else {
          // Bloquear nodo
          return {
            ...n,
            isUnlocked: false,
            variant: n.variant === 'boss' ? 'boss' : ('locked' as const),
            iconType: n.variant === 'boss' ? 'skull' : ('lock' as const),
            statusText: 'BLOQUEADO • RESTRINGIDO',
          };
        }
      }
      return n;
    });

    if (isCourses) {
      const next = {
        ...dataset,
        nodes: updatedNodes,
      };
      set({ coursesDataset: next });
      persistProgress(next);
    } else {
      set({
        lessonsDataset: {
          ...dataset,
          nodes: updatedNodes,
        },
      });
    }
  },
  unlockNodeWithCinematic: (nodeId: string) => {
    const isCourses = get().viewMode === 'courses';
    const dataset = isCourses ? get().coursesDataset : get().lessonsDataset;
    const target = dataset.nodes.find((n) => n.id === nodeId);
    // Solo anima desbloqueos; si ya está abierto o hay cinemática en curso, no hace nada.
    if (!target || target.isUnlocked || get().unlockingNodeId) return;
    set({ unlockingNodeId: nodeId });

    // La animación del nodo dura ~1.35s (shake + flash + estallido + rebote).
    setTimeout(() => {
      const current = isCourses ? get().coursesDataset : get().lessonsDataset;
      const updatedNodes: GraphNode[] = current.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              isUnlocked: true,
              variant: (n.variant === 'locked' || n.variant === 'branch' ? 'unlocked' : n.variant) as NodeVariant,
              iconType: n.iconType === 'lock' ? 'code' : n.iconType,
              statusText: 'DISPONIBLE • DESBLOQUEADO',
            }
          : n
      );
      if (isCourses) {
        const next = { ...current, nodes: updatedNodes };
        set({ coursesDataset: next, unlockingNodeId: null });
        persistProgress(next);
      } else {
        set({ lessonsDataset: { ...current, nodes: updatedNodes }, unlockingNodeId: null });
      }
    }, 1400);
  },
  openCourseLessons: async (courseId) => {
    const courseNode = get().coursesDataset.nodes.find((n) => n.targetCourseId === courseId || n.id === courseId);
    if (courseNode && !courseNode.isUnlocked) return;
    set({ viewMode: 'lessons', selectedCourseId: courseId, isLoading: true, panOffset: { x: 0, y: 0 } });
    const dataset = await RoadmapService.getCourseLessonsGraph(courseId);
    set({ lessonsDataset: dataset, isLoading: false });
  },
  returnToCourses: () => set({ viewMode: 'courses', panOffset: { x: 0, y: 0 } }),
  setActiveNode: (id) => set({ activeNodeId: id }),
  setBranch: (branchId) => {
    const branch = CAREER_BRANCHES.find((b) => b.id === branchId) || CAREER_BRANCHES[0];
    set({
      activeBranchId: branchId,
      coursesDataset: branch.dataset,
      viewMode: 'courses',
      panOffset: { x: 0, y: 0 },
      selectedCourseId: branch.dataset.nodes[0]?.targetCourseId || branch.dataset.nodes[0]?.id || '',
      activeNodeId: branch.dataset.nodes[0]?.id || null,
    });
  },
  setPanOffset: (pan) => set({ panOffset: pan }),
  setZoomLevel: (zoom) =>
    set((s) => ({
      zoomLevel: Math.max(50, Math.min(200, typeof zoom === 'function' ? zoom(s.zoomLevel) : zoom)),
    })),
  zoomIn: () => set((s) => ({ zoomLevel: Math.min(200, s.zoomLevel + 15) })),
  zoomOut: () => set((s) => ({ zoomLevel: Math.max(50, s.zoomLevel - 15) })),
  resetZoom: () => set({ zoomLevel: 100, panOffset: { x: 0, y: 0 } }),
  getCurrentDataset: () => (get().viewMode === 'courses' ? get().coursesDataset : get().lessonsDataset),
}));
