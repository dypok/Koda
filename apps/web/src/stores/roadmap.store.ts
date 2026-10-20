import { create } from 'zustand';
import { GraphViewMode, GraphDataset, NodeVariant, GraphNode, GraphConnection } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_BASIC_LESSONS_DATASET, getLessonsDatasetForCourse } from '@/models/roadmap/python-lessons-graph.mock';
import { PYTHON_COURSES_DATASET } from '@/models/roadmap/tracks/python-track.mock';
import { CareerBranchId, CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { RoadmapService, COURSE_MAX_STARS_MAP, getDynamicMaxStarsForCourse } from '@/services/roadmap/roadmap.service';
import {
  getSectionAliases,
  getStoredStarForSection,
  isSectionCompletedInSet,
  sanitizeStoredStarsCache,
} from '@/models/roadmap/section-alias.helper';

const PROGRESS_KEY = 'koda_roadmap_progress';
const SECTION_STARS_KEY = 'koda_section_stars';
const COMPLETED_LESSONS_KEY = 'koda_completed_lessons';

function getStoredSectionStars(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SECTION_STARS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const sanitized = sanitizeStoredStarsCache(parsed);
    if (raw && Object.keys(parsed).length !== Object.keys(sanitized).length) {
      window.localStorage.setItem(SECTION_STARS_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    return {};
  }
}

function saveSectionStar(sectionId: string, stars: number) {
  if (typeof window === 'undefined' || !sectionId) return;
  try {
    const map = getStoredSectionStars();
    const aliases = getSectionAliases(sectionId);
    for (const a of aliases) {
      map[a] = Math.max(map[a] ?? 0, stars);
    }
    map[sectionId] = Math.max(map[sectionId] ?? 0, stars);
    window.localStorage.setItem(SECTION_STARS_KEY, JSON.stringify(map));
  } catch {}
}

function getStoredCompletedLessons(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(COMPLETED_LESSONS_KEY);
    if (!raw) return new Set();
    const arr: string[] = JSON.parse(raw);
    const hasDaInitial = arr.some((k) => k === 'da-01' || k === 'da-m01' || k === 'da-02');
    const hasIaInitial = arr.some((k) => k === 'ia-01' || k === 'ia-m01' || k === 'ia-02');
    const hasFaInitial = arr.some((k) => k === 'fa-01' || k === 'fa-m01');
    const hasDjInitial = arr.some((k) => k === 'dj-01' || k === 'dj-m01');

    const sanitized = arr.filter((k) => {
      const lower = k.trim().toLowerCase();
      if (/^\d+$/.test(lower) || lower === 'miniboss' || lower === 'boss' || lower === 'apex' || lower === 'mb') {
        return false;
      }
      if (!hasDaInitial && (lower.includes('wrangling') || lower.startsWith('da-miniboss') || lower === 'da-mb' || lower.startsWith('da-boss') || lower === 'streamlit-dashboards')) {
        return false;
      }
      if (!hasIaInitial && (lower.includes('tool-caller') || lower.startsWith('ia-miniboss') || lower === 'ia-mb' || lower.startsWith('ia-boss') || lower.includes('agente-completo'))) {
        return false;
      }
      if (!hasFaInitial && (lower === 'fa-boss' || lower === 'fastapi-docker-deploy')) {
        return false;
      }
      if (!hasDjInitial && (lower === 'dj-boss' || lower === 'django-auth-security-deploy')) {
        return false;
      }
      return true;
    });
    if (sanitized.length !== arr.length) {
      window.localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(sanitized));
    }
    return new Set(sanitized);
  } catch {
    return new Set();
  }
}

function markCompletedLesson(lessonId: string) {
  if (typeof window === 'undefined' || !lessonId) return;
  try {
    const set = getStoredCompletedLessons();
    const aliases = getSectionAliases(lessonId);
    for (const a of aliases) {
      set.add(a);
    }
    set.add(lessonId);
    window.localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

const INITIAL_COURSES_DATASET: GraphDataset =
  CAREER_BRANCHES[0]?.dataset && CAREER_BRANCHES[0].dataset.nodes.length > 0
    ? CAREER_BRANCHES[0].dataset
    : PYTHON_COURSES_DATASET;

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

    // Purgar python-core si persistió en el almacenamiento local
    if (saved.unlockedIds?.includes('python-core') || saved.nodeStarsMap?.['python-core']) {
      const cleanedUnlockedIds = saved.unlockedIds?.filter((id) => id !== 'python-core');
      const cleanedMap = { ...(saved.nodeStarsMap || {}) };
      delete cleanedMap['python-core'];
      window.localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          ...saved,
          unlockedIds: cleanedUnlockedIds,
          nodeStarsMap: cleanedMap,
        })
      );
    }

    const unlocked = Array.isArray(saved.unlockedIds)
      ? new Set(saved.unlockedIds.filter((id) => id !== 'python-core'))
      : null;
    const nodeStarsMap = saved.nodeStarsMap || {};

    const cleanNodes = dataset.nodes.filter(
      (n) => n.id !== 'python-core' && n.targetCourseId !== 'python-core'
    );

    return {
      ...dataset,
      progressPercent: typeof saved.progressPercent === 'number' ? saved.progressPercent : dataset.progressPercent,
      nodes: cleanNodes.map((n) => {
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

const CUSTOM_LESSONS_STORAGE_KEY = 'koda_custom_module_lessons';

function getStoredCustomLessons(): Record<string, GraphDataset> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CUSTOM_LESSONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredCustomLessons(dict: Record<string, GraphDataset>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CUSTOM_LESSONS_STORAGE_KEY, JSON.stringify(dict));
  } catch {}
}

export function buildDefaultSingleLessonDataset(moduleTitle: string, initialLessonId = 'les-01'): GraphDataset {
  const node: GraphNode = {
    id: initialLessonId,
    code: '01',
    label: 'LECCION 01',
    subtitle: 'CAMPOS LISTOS PARA EDITAR',
    x: 575,
    y: 310,
    variant: 'active',
    iconType: 'code',
    stars: 0,
    maxStars: 3,
    xp: 50,
    statusText: 'DISPONIBLE • LISTA PARA EDITAR',
    isUnlocked: true,
  };

  return {
    sectorTitle: moduleTitle.toUpperCase(),
    progressPercent: 0,
    nodes: [node],
    connections: [],
  };
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
  customModuleLessonsMap: Record<string, GraphDataset>;
  customTrackDatasetsMap: Record<string, GraphDataset>;
  retreatTrigger: number;
  triggerRetreatToCourses: () => void;
  animatingConnectionId: string | null;
  unlockingNodeId: string | null;
  simulateCompleteAndUnlockNext: () => void;
  toggleNodeLock: (nodeId: string) => void;
  unlockNodeWithCinematic: (nodeId: string) => void;
  openCourseLessons: (courseId: string, bypassUnlocked?: boolean) => Promise<void>;
  returnToCourses: () => void;
  setActiveNode: (id: string | null) => void;
  setBranch: (branchId: CareerBranchId) => Promise<void> | void;
  registerTrack: (track: { slug: string; name: string; color?: string; description?: string }) => void;
  setPanOffset: (pan: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  hydrateProgress: () => Promise<void> | void;
  completeSectionNode: (nodeId: string, stars: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  getCurrentDataset: () => GraphDataset;
  insertModuleNode: (nodeData: Partial<GraphNode>, targetIndex?: number) => void;
  insertSectionNode: (nodeData: Partial<GraphNode>, targetIndex?: number) => void;
}

const CUSTOM_TRACKS_STORAGE_KEY = 'koda_custom_tracks_datasets';

function getStoredCustomTracks(): Record<string, GraphDataset> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredCustomTracks(dict: Record<string, GraphDataset>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(dict));
  } catch {}
}

export function buildDefaultTrackDataset(trackTitle: string, initialModuleSlug = 'mod-01'): GraphDataset {
  const node: GraphNode = {
    id: initialModuleSlug,
    code: '01',
    label: `${trackTitle.toUpperCase()} - MODULO 01`,
    subtitle: 'FUNDAMENTOS Y ESTRUCTURA BASE',
    x: 575,
    y: 310,
    variant: 'active',
    iconType: 'brackets',
    stars: 0,
    maxStars: 30,
    xp: 300,
    statusText: 'DISPONIBLE • LISTO PARA EDITAR',
    targetCourseId: initialModuleSlug,
    isUnlocked: true,
  };

  return {
    sectorTitle: trackTitle.toUpperCase(),
    progressPercent: 0,
    nodes: [node],
    connections: [],
  };
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
  customModuleLessonsMap: getStoredCustomLessons(),
  customTrackDatasetsMap: getStoredCustomTracks(),
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
  openCourseLessons: async (courseId, bypassUnlocked = false) => {
    const courseNode = get().coursesDataset.nodes.find((n) => n.targetCourseId === courseId || n.id === courseId);
    if (!bypassUnlocked && courseNode && !courseNode.isUnlocked) return;
    set({ viewMode: 'lessons', selectedCourseId: courseId, isLoading: true, panOffset: { x: 0, y: 0 } });

    // 1. Revisar si ya existe un dataset de lecciones registrado para este módulo
    const customMap = get().customModuleLessonsMap;
    if (customMap[courseId]) {
      const dataset = customMap[courseId];
      const activeLesson = dataset.nodes.find((n) => n.variant === 'active' || n.isUnlocked) || dataset.nodes[0];
      set({
        lessonsDataset: dataset,
        activeNodeId: activeLesson ? activeLesson.id : null,
        isLoading: false,
      });
      return;
    }

    // 2. Verificar si es un curso canónico conocido
    const canonicalCourseIds = [
      'python-1',
      'py-basic',
      'python-2',
      'py-intermediate',
      'python-3',
      'py-advanced',
      'fastapi-async',
      'py-fastapi',
      'django-enterprise',
      'py-django',
      'data-analytics',
      'py-data',
      'ai-agents',
      'py-ia',
      'python-apex',
      'py-apex',
    ];

    if (!canonicalCourseIds.includes(courseId)) {
      // Es un nuevo módulo creado por el usuario: inicializar con 1 única lección predeterminada
      const title = courseNode?.label || 'NUEVO MODULO';
      const singleLessonDataset = buildDefaultSingleLessonDataset(title);
      const nextMap = { ...customMap, [courseId]: singleLessonDataset };
      saveStoredCustomLessons(nextMap);
      set({
        customModuleLessonsMap: nextMap,
        lessonsDataset: singleLessonDataset,
        activeNodeId: singleLessonDataset.nodes[0].id,
        isLoading: false,
      });
      return;
    }

    const dataset = await RoadmapService.getCourseLessonsGraph(courseId);
    const storedStars = getStoredSectionStars();
    const completedLessonsSet = getStoredCompletedLessons();

    const enrichedNodes = dataset.nodes.map((l) => {
      const stored = getStoredStarForSection(l.id, storedStars);
      const isCompleted = isSectionCompletedInSet(l.id, completedLessonsSet);
      const earned = Math.max(l.stars ?? 0, stored > 0 ? stored : isCompleted ? 3 : 0);
      const maxStars = typeof l.maxStars === 'number' && l.maxStars > 0 ? l.maxStars : 3;

      if (earned > 0) {
        saveSectionStar(l.id, earned);
        markCompletedLesson(l.id);
      }

      return {
        ...l,
        stars: earned,
        maxStars,
        variant: earned > 0 || l.variant === 'completed' || isCompleted ? ('completed' as const) : l.variant,
        statusText: earned > 0 || l.variant === 'completed' || isCompleted ? 'COMPLETADO' : l.statusText,
      };
    });
    const enrichedDataset = { ...dataset, nodes: enrichedNodes };
    const activeLesson = enrichedNodes.find((n) => n.variant === 'active' || n.isUnlocked) || enrichedNodes[0];

    const totalEarnedInCourse = enrichedNodes.reduce((sum, n) => sum + (n.stars ?? 0), 0);
    const dynamicCourseMax = enrichedNodes.reduce((sum, n) => sum + (typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3), 0);
    const courses = get().coursesDataset;
    const updatedCoursesNodes = courses.nodes.map((cn) => {
      if (cn.id === courseId || cn.targetCourseId === courseId) {
        return {
          ...cn,
          stars: Math.max(cn.stars ?? 0, totalEarnedInCourse),
          maxStars: dynamicCourseMax || cn.maxStars,
        };
      }
      return cn;
    });

    set({
      lessonsDataset: enrichedDataset,
      coursesDataset: { ...courses, nodes: updatedCoursesNodes },
      activeNodeId: activeLesson ? activeLesson.id : null,
      isLoading: false,
    });
  },
  returnToCourses: () => {
    const courses = get().coursesDataset;
    const lessons = get().lessonsDataset;
    const currentCourseId = get().selectedCourseId;
    const totalEarnedInCourse = lessons.nodes.reduce((sum, n) => sum + (n.stars ?? 0), 0);
    const dynamicCourseMax = lessons.nodes.reduce((sum, n) => sum + (typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3), 0);

    const updatedNodes = courses.nodes.map((cn) => {
      if (cn.id === currentCourseId || cn.targetCourseId === currentCourseId) {
        return {
          ...cn,
          stars: Math.max(cn.stars ?? 0, totalEarnedInCourse),
          maxStars: dynamicCourseMax || cn.maxStars,
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
    const canonicalBranch = CAREER_BRANCHES.find((b) => b.id === branchId);

    if (!canonicalBranch) {
      // Rama personalizada del administrador
      const customTracks = get().customTrackDatasetsMap;
      let dataset: GraphDataset;
      if (customTracks[branchId]) {
        dataset = customTracks[branchId];
      } else {
        dataset = buildDefaultTrackDataset(branchId);
        const nextMap = { ...customTracks, [branchId]: dataset };
        saveStoredCustomTracks(nextMap);
        set({ customTrackDatasetsMap: nextMap });
      }

      set({
        activeBranchId: branchId,
        coursesDataset: dataset,
        viewMode: 'courses',
        panOffset: { x: 0, y: 0 },
        selectedCourseId: dataset.nodes[0]?.targetCourseId || dataset.nodes[0]?.id || '',
        activeNodeId: dataset.nodes[0]?.id || null,
        isLoading: false,
      });
      return;
    }

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
        coursesDataset: canonicalBranch.dataset,
        selectedCourseId: 'python-1',
        activeNodeId: 'python-1',
        isLoading: false,
      });
    }
  },
  registerTrack: (track) => {
    const customTracks = get().customTrackDatasetsMap;
    const existing = customTracks[track.slug];
    if (!existing) {
      const dataset = buildDefaultTrackDataset(track.name);
      const nextMap = { ...customTracks, [track.slug]: dataset };
      saveStoredCustomTracks(nextMap);
      set({
        customTrackDatasetsMap: nextMap,
        activeBranchId: track.slug,
        coursesDataset: dataset,
        viewMode: 'courses',
        selectedCourseId: dataset.nodes[0]?.targetCourseId || dataset.nodes[0]?.id || '',
        activeNodeId: dataset.nodes[0]?.id || null,
      });
    } else {
      set({
        activeBranchId: track.slug,
        coursesDataset: existing,
        viewMode: 'courses',
        selectedCourseId: existing.nodes[0]?.targetCourseId || existing.nodes[0]?.id || '',
        activeNodeId: existing.nodes[0]?.id || null,
      });
    }
  },
  setPanOffset: (pan) => set({ panOffset: pan }),
  hydrateProgress: async () => {
    if (typeof window === 'undefined') return;
    set({
      coursesDataset: restoreProgress(get().coursesDataset),
      customModuleLessonsMap: getStoredCustomLessons(),
      customTrackDatasetsMap: getStoredCustomTracks(),
    });
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
          const stored = getStoredStarForSection(l.id, storedStars);
          const isCompleted = isSectionCompletedInSet(l.id, completedLessonsSet);
          const maxStars = typeof l.maxStars === 'number' && l.maxStars > 0 ? l.maxStars : 3;
          const earned = Math.min(maxStars, Math.max(l.stars ?? 0, stored > 0 ? stored : isCompleted ? maxStars : 0));

          if (earned > 0) {
            saveSectionStar(l.id, earned);
            markCompletedLesson(l.id);
          }

          return {
            ...l,
            stars: earned,
            maxStars,
            variant: earned > 0 || l.variant === 'completed' || isCompleted ? ('completed' as const) : l.variant,
            statusText: earned > 0 || l.variant === 'completed' || isCompleted ? 'COMPLETADO' : l.statusText,
          };
        });
        set({ lessonsDataset: lessonsData });
      }

      const refreshedStars = getStoredSectionStars();
      const refreshedCompletedSet = getStoredCompletedLessons();

      if (coursesData && coursesData.nodes && coursesData.nodes.length > 0) {
        // Garantizar eliminación de cualquier nodo residual python-core
        coursesData.nodes = coursesData.nodes
          .filter((c) => c.id !== 'python-core' && c.targetCourseId !== 'python-core')
          .map((c) => {
            const cId = c.targetCourseId || c.id;
            const courseLessons = getLessonsDatasetForCourse(cId);
            const nodesToInspect = (cId === courseId && lessonsData?.nodes?.length)
              ? lessonsData.nodes
              : (courseLessons?.nodes ?? []);

            const maxStars =
              nodesToInspect.length > 0
                ? nodesToInspect.reduce((sum, l) => sum + (typeof l.maxStars === 'number' && l.maxStars > 0 ? l.maxStars : 3), 0)
                : getDynamicMaxStarsForCourse(cId);

            const earnedStars = nodesToInspect.reduce((sum, l) => {
              const stored = getStoredStarForSection(l.id, refreshedStars);
              const isComp = isSectionCompletedInSet(l.id, refreshedCompletedSet);
              const lMax = typeof l.maxStars === 'number' && l.maxStars > 0 ? l.maxStars : 3;
              const lEarned = Math.min(lMax, Math.max(l.stars ?? 0, stored > 0 ? stored : isComp ? lMax : 0));
              return sum + lEarned;
            }, 0);

            const effectiveStars = Math.max(c.stars ?? 0, earnedStars);

            return {
              ...c,
              stars: effectiveStars,
              maxStars,
              variant: effectiveStars >= maxStars || c.variant === 'completed' ? ('completed' as const) : c.variant,
              statusText: effectiveStars >= maxStars || c.variant === 'completed' ? 'DOMINADO • 100%' : c.statusText,
            };
          });

        const currentActiveId = get().activeNodeId === 'python-core' ? 'python-1' : get().activeNodeId;
        const currentSelectedCourseId = get().selectedCourseId === 'python-core' ? 'python-1' : get().selectedCourseId;

        const activeCourse =
          coursesData.nodes.find((n) => n.id === currentActiveId || n.targetCourseId === currentSelectedCourseId) ||
          coursesData.nodes.find((n) => n.variant === 'active' || n.isUnlocked) ||
          coursesData.nodes[0];
        set({
          coursesDataset: coursesData,
          selectedCourseId: currentSelectedCourseId,
          activeNodeId: activeCourse ? activeCourse.id : (currentActiveId || 'python-1'),
        });
        persistProgress(coursesData);
      }
    } catch {
      // Silencioso en caso de falla de red o modo offline
    }
  },
  completeSectionNode: (nodeId: string, stars: number) => {
    saveSectionStar(nodeId, stars);
    markCompletedLesson(nodeId);
    const dataset = get().lessonsDataset;
    const aliases = getSectionAliases(nodeId);
    const norm = (id: string) =>
      id.toLowerCase().replace(/^py-m0?/, 'les-0').replace(/boss-logic|guardi[aá]n/, 'miniboss').replace(/apex.*|boss$/, 'apex');
    const targetNorm = norm(nodeId);

    const idx = dataset.nodes.findIndex(
      (n) => n.id === nodeId || aliases.includes(n.id) || norm(n.id) === targetNorm
    );
    if (idx < 0) return;

    const nodes = dataset.nodes.map((n, i) => {
      if (i === idx) {
        return {
          ...n,
          variant: 'completed' as const,
          stars: Math.max(n.stars ?? 0, stars),
          maxStars: typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3,
          statusText: 'COMPLETADO',
        };
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
      if (c.fromId === nodeId || aliases.includes(c.fromId) || norm(c.fromId) === targetNorm) {
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
    const dynamicCourseMax = nodes.reduce((sum, n) => sum + (typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3), 0);

    const updatedCourseNodes = coursesDataset.nodes.map((cn) => {
      if (cn.id === currentCourseId || cn.targetCourseId === currentCourseId) {
        return {
          ...cn,
          stars: totalEarnedInCourse,
          maxStars: dynamicCourseMax || cn.maxStars,
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

    const nextLessonsDataset = { ...dataset, progressPercent, nodes, connections };

    // Sincronizar cache de lecciones personalizadas si aplica
    const customMap = { ...get().customModuleLessonsMap };
    if (currentCourseId && customMap[currentCourseId]) {
      customMap[currentCourseId] = nextLessonsDataset;
      saveStoredCustomLessons(customMap);
      set({ lessonsDataset: nextLessonsDataset, coursesDataset: nextCoursesDataset, customModuleLessonsMap: customMap });
    } else {
      set({ lessonsDataset: nextLessonsDataset, coursesDataset: nextCoursesDataset });
    }
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
  insertModuleNode: (nodeData, targetIndex) => {
    const ds = get().coursesDataset;
    const nodes = [...ds.nodes];
    const newId = nodeData.id || `module-${Date.now()}`;
    const targetCourseId = nodeData.targetCourseId || newId;
    const insertIdx = targetIndex !== undefined ? Math.max(0, Math.min(nodes.length, targetIndex)) : nodes.length;

    const newNode: GraphNode = {
      id: newId,
      code: String(insertIdx + 1).padStart(2, '0'),
      label: nodeData.label || 'NUEVO MODULO',
      subtitle: nodeData.subtitle || 'OBJETIVO PEDAGOGICO',
      x: 0,
      y: 310,
      variant: 'unlocked',
      iconType: 'brackets',
      stars: 0,
      maxStars: 30,
      xp: nodeData.xp || 300,
      statusText: 'DISPONIBLE • ADMIN',
      targetCourseId,
      isUnlocked: true,
      ...nodeData,
    };

    nodes.splice(insertIdx, 0, newNode);

    // Re-espaciar posiciones x armónicamente
    const startX = 120;
    const endX = Math.max(900, nodes.length * 180);
    const stepX = (endX - startX) / (Math.max(1, nodes.length - 1));
    nodes.forEach((n, idx) => {
      n.x = Math.round(startX + idx * stepX);
      n.code = String(idx + 1).padStart(2, '0');
    });

    // Reconstruir conexiones lineales secuenciales
    const connections: GraphConnection[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const n1 = nodes[i];
      const n2 = nodes[i + 1];
      const midX = Math.round((n1.x + n2.x) / 2);
      connections.push({
        id: `conn-${n1.id}-${n2.id}`,
        fromId: n1.id,
        toId: n2.id,
        color: '#38BDF8',
        path: `M ${n1.x} ${n1.y} C ${midX} ${n1.y}, ${midX} ${n2.y}, ${n2.x} ${n2.y}`,
      });
    }

    // Inicializar para este módulo un dataset con únicamente 1 lección inicial predeterminada
    const singleLessonDataset = buildDefaultSingleLessonDataset(newNode.label);
    const customMap = { ...get().customModuleLessonsMap, [targetCourseId]: singleLessonDataset };
    saveStoredCustomLessons(customMap);

    const nextDataset = { ...ds, nodes, connections };
    set({ coursesDataset: nextDataset, customModuleLessonsMap: customMap });
  },
  insertSectionNode: (nodeData, targetIndex) => {
    const ds = get().lessonsDataset;
    const nodes = [...ds.nodes];
    const newId = nodeData.id || `les-${Date.now()}`;
    const insertIdx = targetIndex !== undefined ? Math.max(0, Math.min(nodes.length, targetIndex)) : nodes.length;

    const newNode: GraphNode = {
      id: newId,
      code: String(insertIdx + 1).padStart(2, '0'),
      label: nodeData.label || 'NUEVA SECCION',
      subtitle: nodeData.subtitle || 'COMPETENCIA CLAVE',
      x: 0,
      y: 310,
      variant: 'unlocked',
      iconType: 'code',
      stars: 0,
      maxStars: 3,
      xp: nodeData.xp || 50,
      statusText: 'DISPONIBLE • ADMIN',
      isUnlocked: true,
      ...nodeData,
    };

    nodes.splice(insertIdx, 0, newNode);

    // Re-espaciar y alternar altura suavemente (230 / 390 / 310)
    const startX = 110;
    const endX = Math.max(900, nodes.length * 160);
    const stepX = (endX - startX) / (Math.max(1, nodes.length - 1));
    nodes.forEach((n, idx) => {
      n.x = Math.round(startX + idx * stepX);
      n.code = String(idx + 1).padStart(2, '0');
      if (idx === 0 || idx === nodes.length - 1) {
        n.y = 310;
      } else {
        n.y = idx % 2 === 1 ? 230 : 390;
      }
    });

    const connections: GraphConnection[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const n1 = nodes[i];
      const n2 = nodes[i + 1];
      const midX = Math.round((n1.x + n2.x) / 2);
      connections.push({
        id: `conn-${n1.id}-${n2.id}`,
        fromId: n1.id,
        toId: n2.id,
        color: '#38BDF8',
        path: `M ${n1.x} ${n1.y} C ${midX} ${n1.y}, ${midX} ${n2.y}, ${n2.x} ${n2.y}`,
      });
    }

    const nextDataset = { ...ds, nodes, connections };
    const currentCourseId = get().selectedCourseId;
    const customMap = { ...get().customModuleLessonsMap };
    if (currentCourseId) {
      customMap[currentCourseId] = nextDataset;
      saveStoredCustomLessons(customMap);
    }
    set({ lessonsDataset: nextDataset, customModuleLessonsMap: customMap });
  },
}));
