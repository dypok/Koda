import { create } from 'zustand';
import { GraphViewMode, GraphDataset, NodeVariant, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_BASIC_LESSONS_DATASET, getLessonsDatasetForCourse } from '@/models/roadmap/python-lessons-graph.mock';
import { CareerBranchId, CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { RoadmapService, COURSE_MAX_STARS_MAP } from '@/services/roadmap/roadmap.service';

const PROGRESS_KEY = 'koda_roadmap_progress';
const SECTION_STARS_KEY = 'koda_section_stars';
const COMPLETED_LESSONS_KEY = 'koda_completed_lessons';

function getStoredSectionStars(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SECTION_STARS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSectionStar(sectionId: string, stars: number) {
  if (typeof window === 'undefined') return;
  try {
    const map = getStoredSectionStars();
    map[sectionId] = Math.max(map[sectionId] ?? 0, stars);
    window.localStorage.setItem(SECTION_STARS_KEY, JSON.stringify(map));
  } catch {}
}

function getStoredCompletedLessons(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(COMPLETED_LESSONS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

const INITIAL_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'PYTHON SPECIALIST: DE FUNDAMENTOS A AGENTES AUTÓNOMOS',
  progressPercent: 0,
  nodes: [],
  connections: [],
};

function persistProgress(dataset: GraphDataset) {
  if (typeof window === 'undefined') return;
  try {
    const unlockedIds = dataset.nodes.filter((n) => n.isUnlocked).map((n) => n.id);
    const nodeStarsMap: Record<string, { stars?: number; maxStars?: number }> = {};
    dataset.nodes.forEach((n) => {
      nodeStarsMap[n.id] = { stars: n.stars, maxStars: n.maxStars };
    });
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ progressPercent: dataset.progressPercent, unlockedIds, nodeStarsMap })
    );
  } catch {
    // sin almacenamiento, el avance vive solo en memoria
  }
}

function restoreProgress(dataset: GraphDataset): GraphDataset {
  if (typeof window === 'undefined') return dataset;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return dataset;
    const saved = JSON.parse(raw) as {
      progressPercent?: number;
      unlockedIds?: string[];
      nodeStarsMap?: Record<string, { stars?: number; maxStars?: number }>;
    };
    const unlocked = Array.isArray(saved.unlockedIds) ? new Set(saved.unlockedIds) : null;
    const nodeStarsMap = saved.nodeStarsMap || {};

    return {
      ...dataset,
      progressPercent: typeof saved.progressPercent === 'number' ? saved.progressPercent : dataset.progressPercent,
      nodes: dataset.nodes.map((n) => {
        const isUnlocked = unlocked ? (unlocked.has(n.id) || n.isUnlocked) : n.isUnlocked;
        const savedStarInfo = nodeStarsMap[n.id];
        return {
          ...n,
          isUnlocked,
          variant: (unlocked?.has(n.id) && n.variant === 'locked' ? 'unlocked' : n.variant) as NodeVariant,
          stars: savedStarInfo?.stars ?? n.stars,
          maxStars: savedStarInfo?.maxStars ?? n.maxStars,
        };
      }),
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
  setBranch: (branchId: CareerBranchId) => Promise<void> | void;
  setPanOffset: (pan: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  hydrateProgress: () => Promise<void> | void;
  completeSectionNode: (nodeId: string, stars: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  getCurrentDataset: () => GraphDataset;
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  viewMode: 'courses',
  activeBranchId: 'python',
  selectedCourseId: 'python-1',
  activeNodeId: 'python-1',
  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  isLoading: false,
  coursesDataset: INITIAL_COURSES_DATASET,
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

    if (willUnlock) {
      // Buscar la conexión entrante hacia este nodo para animar el láser
      const incomingConn = dataset.connections.find((c) => c.toId === nodeId);

      if (incomingConn) {
        // 1. Iniciar encendido del haz láser desde el predecesor
        set({ animatingConnectionId: incomingConn.id });

        // 2. Al llegar el láser al nodo (0.85s), activar rotura de candado y desbloquear
        setTimeout(() => {
          const currentDataset = isCourses ? get().coursesDataset : get().lessonsDataset;
          set({ unlockingNodeId: nodeId });

          const updatedNodes: GraphNode[] = currentDataset.nodes.map((n) => {
            if (n.id === nodeId) {
              return {
                ...n,
                isUnlocked: true,
                variant: (n.variant === 'locked' || n.variant === 'branch' ? 'unlocked' : n.variant) as NodeVariant,
                iconType: n.iconType === 'lock' ? 'code' : n.iconType,
                statusText: 'DISPONIBLE • DESBLOQUEADO',
              };
            }
            return n;
          });

          const updatedConnections = currentDataset.connections.map((c) => {
            if (c.id === incomingConn.id) {
              return { ...c, isDashed: false };
            }
            return c;
          });

          if (isCourses) {
            const next = { ...currentDataset, nodes: updatedNodes, connections: updatedConnections };
            set({ coursesDataset: next });
            persistProgress(next);
          } else {
            set({ lessonsDataset: { ...currentDataset, nodes: updatedNodes, connections: updatedConnections } });
          }

          // 3. Limpiar banderas tras culminar el pulso de rotura
          setTimeout(() => {
            set({ animatingConnectionId: null, unlockingNodeId: null });
          }, 1200);
        }, 850);
      } else {
        // Desbloqueo directo para nodos raíz sin conexión previa
        set({ unlockingNodeId: nodeId });
        const updatedNodes: GraphNode[] = dataset.nodes.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              isUnlocked: true,
              variant: (n.variant === 'locked' || n.variant === 'branch' ? 'unlocked' : n.variant) as NodeVariant,
              iconType: n.iconType === 'lock' ? 'code' : n.iconType,
              statusText: 'DISPONIBLE • DESBLOQUEADO',
            };
          }
          return n;
        });

        if (isCourses) {
          const next = { ...dataset, nodes: updatedNodes };
          set({ coursesDataset: next });
          persistProgress(next);
        } else {
          set({ lessonsDataset: { ...dataset, nodes: updatedNodes } });
        }

        setTimeout(() => {
          set({ unlockingNodeId: null });
        }, 1200);
      }
    } else {
      // Bloquear nodo manualmente: restablecer a estado restringido y desconectar haz
      const updatedNodes: GraphNode[] = dataset.nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            isUnlocked: false,
            variant: n.variant === 'boss' ? 'boss' : ('locked' as const),
            iconType: n.variant === 'boss' ? 'skull' : ('lock' as const),
            statusText: 'BLOQUEADO • RESTRINGIDO',
          };
        }
        return n;
      });

      const updatedConnections = dataset.connections.map((c) => {
        if (c.fromId === nodeId || c.toId === nodeId) {
          return { ...c, isDashed: true };
        }
        return c;
      });

      if (isCourses) {
        const next = { ...dataset, nodes: updatedNodes, connections: updatedConnections };
        set({ coursesDataset: next });
        persistProgress(next);
      } else {
        set({ lessonsDataset: { ...dataset, nodes: updatedNodes, connections: updatedConnections } });
      }
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
    const storedStars = getStoredSectionStars();
    const completedLessonsSet = getStoredCompletedLessons();

    const enrichedNodes = dataset.nodes.map((l) => {
      const earned = storedStars[l.id] ?? (completedLessonsSet.has(l.id) ? 3 : (l.stars ?? 0));
      return {
        ...l,
        stars: earned,
        variant: earned > 0 || l.variant === 'completed' ? ('completed' as const) : l.variant,
      };
    });
    const enrichedDataset = { ...dataset, nodes: enrichedNodes };
    const activeLesson = enrichedNodes.find((n) => n.variant === 'active' || n.isUnlocked) || enrichedNodes[0];

    set({
      lessonsDataset: enrichedDataset,
      activeNodeId: activeLesson ? activeLesson.id : null,
      isLoading: false,
    });
  },
  returnToCourses: () => {
    const courses = get().coursesDataset;
    const lessons = get().lessonsDataset;
    const currentCourseId = get().selectedCourseId;
    const totalEarnedInCourse = lessons.nodes.reduce((sum, n) => sum + (n.stars ?? 0), 0);

    const updatedNodes = courses.nodes.map((cn) => {
      if (cn.id === currentCourseId || cn.targetCourseId === currentCourseId) {
        return {
          ...cn,
          stars: Math.max(cn.stars ?? 0, totalEarnedInCourse),
        };
      }
      return cn;
    });

    const matchingCourse = updatedNodes.find((n) => n.targetCourseId === currentCourseId || n.id === currentCourseId);
    const activeCourse = matchingCourse || updatedNodes.find((n) => n.variant === 'active' || n.isUnlocked) || updatedNodes[0];

    const nextCourses = { ...courses, nodes: updatedNodes };
    set({
      viewMode: 'courses',
      coursesDataset: nextCourses,
      panOffset: { x: 0, y: 0 },
      activeNodeId: activeCourse ? activeCourse.id : null,
    });
    persistProgress(nextCourses);
  },
  setActiveNode: (id) => set({ activeNodeId: id }),
  setBranch: async (branchId) => {
    const branch = CAREER_BRANCHES.find((b) => b.id === branchId) || CAREER_BRANCHES[0];
    set({
      activeBranchId: branchId,
      viewMode: 'courses',
      panOffset: { x: 0, y: 0 },
      isLoading: true,
    });
    try {
      const coursesData = await RoadmapService.getCoursesGraph(branchId);
      const firstNode = coursesData.nodes.find((n) => n.variant === 'active' || n.isUnlocked) || coursesData.nodes[0];
      set({
        coursesDataset: coursesData,
        selectedCourseId: firstNode?.targetCourseId || firstNode?.id || 'python-1',
        activeNodeId: firstNode?.id || null,
        isLoading: false,
      });
      persistProgress(coursesData);
    } catch {
      set({
        coursesDataset: branch.dataset,
        selectedCourseId: 'python-1',
        activeNodeId: 'python-1',
        isLoading: false,
      });
    }
  },
  setPanOffset: (pan) => set({ panOffset: pan }),
  hydrateProgress: async () => {
    if (typeof window === 'undefined') return;
    set({ coursesDataset: restoreProgress(get().coursesDataset) });
    try {
      const branchId = get().activeBranchId || 'python';
      const courseId = get().selectedCourseId || 'python-1';
      const [coursesData, lessonsData] = await Promise.all([
        RoadmapService.getCoursesGraph(branchId),
        RoadmapService.getCourseLessonsGraph(courseId),
      ]);

      const storedStars = getStoredSectionStars();
      const completedLessonsSet = getStoredCompletedLessons();

      if (lessonsData && lessonsData.nodes && lessonsData.nodes.length > 0) {
        lessonsData.nodes = lessonsData.nodes.map((l) => {
          const earned = storedStars[l.id] ?? (completedLessonsSet.has(l.id) ? 3 : (l.stars ?? 0));
          return {
            ...l,
            stars: earned,
            variant: earned > 0 || l.variant === 'completed' ? ('completed' as const) : l.variant,
          };
        });
        set({ lessonsDataset: lessonsData });
      }

      if (coursesData && coursesData.nodes && coursesData.nodes.length > 0) {
        coursesData.nodes = coursesData.nodes.map((c) => {
          const cId = c.targetCourseId || c.id;
          const courseLessons = getLessonsDatasetForCourse(cId);
          const maxStars =
            COURSE_MAX_STARS_MAP[cId] ??
            (courseLessons?.nodes?.reduce((sum, l) => sum + (l.maxStars ?? 3), 0) || 30);

          const earnedStars = (courseLessons?.nodes ?? []).reduce((sum, l) => {
            const lEarned = storedStars[l.id] ?? (completedLessonsSet.has(l.id) ? 3 : (l.stars ?? 0));
            return sum + lEarned;
          }, 0);

          return {
            ...c,
            stars: Math.max(c.stars ?? 0, earnedStars),
            maxStars,
          };
        });

        const activeCourse =
          coursesData.nodes.find((n) => n.id === get().activeNodeId || n.targetCourseId === get().selectedCourseId) ||
          coursesData.nodes.find((n) => n.variant === 'active' || n.isUnlocked) ||
          coursesData.nodes[0];
        set({
          coursesDataset: coursesData,
          activeNodeId: activeCourse ? activeCourse.id : get().activeNodeId,
        });
        persistProgress(coursesData);
      }
    } catch {
      // Silencioso en caso de falla de red o modo offline
    }
  },
  completeSectionNode: (nodeId: string, stars: number) => {
    saveSectionStar(nodeId, stars);
    const dataset = get().lessonsDataset;
    const norm = (id: string) =>
      id.toLowerCase().replace(/^py-m0?/, 'les-0').replace(/boss-logic|guardi[aá]n/, 'miniboss').replace(/apex.*|boss$/, 'apex');
    const targetNorm = norm(nodeId);

    const idx = dataset.nodes.findIndex((n) => n.id === nodeId || norm(n.id) === targetNorm);
    if (idx < 0) return;

    const nodes = dataset.nodes.map((n, i) => {
      if (i === idx) {
        return { ...n, variant: 'completed' as const, stars: Math.max(n.stars ?? 0, stars), statusText: 'COMPLETADO' };
      }
      if (i === idx + 1 && !n.isUnlocked) {
        return {
          ...n,
          isUnlocked: true,
          variant: (n.variant === 'boss' ? 'boss' : 'active') as NodeVariant,
          iconType: n.iconType === 'lock' ? 'brackets' : n.iconType,
          statusText: `DISPONIBLE • +${n.xp ?? 120} XP`,
        };
      }
      return n;
    });

    const connections = dataset.connections.map((c) => {
      if (c.fromId === nodeId || norm(c.fromId) === targetNorm) {
        return { ...c, isDashed: false };
      }
      return c;
    });

    const completedCount = nodes.filter((n) => n.variant === 'completed').length;
    const progressPercent = Math.round((completedCount / Math.max(1, nodes.length)) * 100);

    const currentCourseId = get().selectedCourseId || 'python-1';
    const coursesDataset = get().coursesDataset;

    // Calcular suma total de estrellas en el curso actual
    const totalEarnedInCourse = nodes.reduce((sum, n) => sum + (n.stars ?? 0), 0);

    const updatedCourseNodes = coursesDataset.nodes.map((cn) => {
      if (cn.id === currentCourseId || cn.targetCourseId === currentCourseId) {
        return {
          ...cn,
          stars: totalEarnedInCourse,
        };
      }
      return cn;
    });

    // Si se completó el examen final (Apex o Boss), desbloquear el siguiente curso en coursesDataset
    const isApexOrFinal = idx === dataset.nodes.length - 1 || targetNorm.includes('apex') || targetNorm.includes('boss');
    let nextCourseNodes = updatedCourseNodes;
    let nextCourseConns = coursesDataset.connections;

    if (isApexOrFinal) {
      nextCourseNodes = nextCourseNodes.map((cn) => {
        if (cn.id === currentCourseId || cn.targetCourseId === currentCourseId) {
          return {
            ...cn,
            variant: 'completed' as const,
            stars: cn.maxStars ?? totalEarnedInCourse,
            statusText: 'DOMINADO • 100%',
          };
        }
        return cn;
      });

      const outgoingConns = coursesDataset.connections.filter(
        (c) => c.fromId === currentCourseId || c.fromId.includes(currentCourseId),
      );
      const targetCourseIds = new Set(outgoingConns.map((c) => c.toId));

      nextCourseNodes = nextCourseNodes.map((cn) => {
        if (targetCourseIds.has(cn.id) || (cn.targetCourseId && targetCourseIds.has(cn.targetCourseId))) {
          return {
            ...cn,
            isUnlocked: true,
            variant: (cn.variant === 'locked' ? 'active' : cn.variant) as NodeVariant,
            statusText: 'DISPONIBLE • EN PROGRESO',
          };
        }
        return cn;
      });

      nextCourseConns = coursesDataset.connections.map((c) => {
        if (c.fromId === currentCourseId || c.fromId.includes(currentCourseId)) {
          return { ...c, isDashed: false };
        }
        return c;
      });
    }

    const completedCourses = nextCourseNodes.filter((cn) => cn.variant === 'completed').length;
    const coursesPercent = Math.round((completedCourses / Math.max(1, nextCourseNodes.length)) * 100);

    const nextCoursesDataset = {
      ...coursesDataset,
      progressPercent: coursesPercent,
      nodes: nextCourseNodes,
      connections: nextCourseConns,
    };

    set({
      lessonsDataset: { ...dataset, progressPercent, nodes, connections },
      coursesDataset: nextCoursesDataset,
    });
    persistProgress(nextCoursesDataset);
  },
  setZoomLevel: (zoom) =>
    set((s) => ({
      zoomLevel: Math.max(50, Math.min(200, typeof zoom === 'function' ? zoom(s.zoomLevel) : zoom)),
    })),
  zoomIn: () => set((s) => ({ zoomLevel: Math.min(200, s.zoomLevel + 15) })),
  zoomOut: () => set((s) => ({ zoomLevel: Math.max(50, s.zoomLevel - 15) })),
  resetZoom: () => set({ zoomLevel: 100, panOffset: { x: 0, y: 0 } }),
  getCurrentDataset: () => (get().viewMode === 'courses' ? get().coursesDataset : get().lessonsDataset),
}));
