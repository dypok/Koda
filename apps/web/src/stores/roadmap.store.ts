import { create } from 'zustand';
import { GraphViewMode, GraphDataset, NodeVariant, GraphNode, GraphConnection } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_BASIC_LESSONS_DATASET } from '@/models/roadmap/python-lessons-graph.mock';
import { CareerBranchId, CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { PYTHON_COURSES_DATASET } from '@/models/roadmap/tracks/python-track.mock';
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
  setBranch: (branchId: CareerBranchId) => void;
  registerTrack: (track: { slug: string; name: string; color?: string; description?: string }) => void;
  setPanOffset: (pan: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  hydrateProgress: () => void;
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
  activeNodeId: 'py-level-1',
  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  isLoading: false,
  coursesDataset: PYTHON_COURSES_DATASET,
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
    const activeLesson = dataset.nodes.find((n) => n.variant === 'active' || n.isUnlocked) || dataset.nodes[0];
    set({
      lessonsDataset: dataset,
      activeNodeId: activeLesson ? activeLesson.id : null,
      isLoading: false,
    });
  },
  returnToCourses: () => {
    const courses = get().coursesDataset;
    const currentCourseId = get().selectedCourseId;
    const matchingCourse = courses.nodes.find((n) => n.targetCourseId === currentCourseId || n.id === currentCourseId);
    const activeCourse = matchingCourse || courses.nodes.find((n) => n.variant === 'active' || n.isUnlocked) || courses.nodes[0];
    set({
      viewMode: 'courses',
      panOffset: { x: 0, y: 0 },
      activeNodeId: activeCourse ? activeCourse.id : null,
    });
  },
  setActiveNode: (id) => set({ activeNodeId: id }),
  setBranch: (branchId) => {
    const canonicalBranch = CAREER_BRANCHES.find((b) => b.id === branchId);
    let dataset = canonicalBranch?.dataset;

    if (!dataset) {
      const customTracks = get().customTrackDatasetsMap;
      if (customTracks[branchId]) {
        dataset = customTracks[branchId];
      } else {
        dataset = buildDefaultTrackDataset(branchId);
        const nextMap = { ...customTracks, [branchId]: dataset };
        saveStoredCustomTracks(nextMap);
        set({ customTrackDatasetsMap: nextMap });
      }
    }

    set({
      activeBranchId: branchId,
      coursesDataset: dataset,
      viewMode: 'courses',
      panOffset: { x: 0, y: 0 },
      selectedCourseId: dataset.nodes[0]?.targetCourseId || dataset.nodes[0]?.id || '',
      activeNodeId: dataset.nodes[0]?.id || null,
    });
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
  hydrateProgress: () => {
    if (typeof window === 'undefined') return;
    set({
      coursesDataset: restoreProgress(get().coursesDataset),
      customModuleLessonsMap: getStoredCustomLessons(),
      customTrackDatasetsMap: getStoredCustomTracks(),
    });
  },
  completeSectionNode: (nodeId: string, stars: number) => {
    const dataset = get().lessonsDataset;
    const norm = (id: string) =>
      id.toLowerCase().replace(/^py-m0?/, 'les-0').replace(/boss-logic|guardi[aá]n/, 'miniboss').replace(/apex.*|boss$/, 'apex');
    const targetNorm = norm(nodeId);

    const idx = dataset.nodes.findIndex((n) => n.id === nodeId || norm(n.id) === targetNorm);
    if (idx < 0) return;

    const nodes = dataset.nodes.map((n, i) => {
      if (i === idx) {
        return { ...n, variant: 'completed' as const, stars: Math.max(n.stars ?? 0, stars), statusText: 'COMPLETADA' };
      }
      if (i === idx + 1 && !n.isUnlocked) {
        return {
          ...n,
          isUnlocked: true,
          variant: (n.variant === 'boss' ? 'boss' : 'unlocked') as NodeVariant,
          iconType: n.iconType === 'lock' ? 'code' : n.iconType,
          statusText: 'DISPONIBLE',
        };
      }
      return n;
    });

    const nextLessonsDataset = { ...dataset, nodes };
    const currentCourseId = get().selectedCourseId;
    const customMap = { ...get().customModuleLessonsMap };
    if (currentCourseId && customMap[currentCourseId]) {
      customMap[currentCourseId] = nextLessonsDataset;
      saveStoredCustomLessons(customMap);
      set({ lessonsDataset: nextLessonsDataset, customModuleLessonsMap: customMap });
    } else {
      set({ lessonsDataset: nextLessonsDataset });
    }
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
