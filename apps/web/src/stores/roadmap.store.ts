import { create } from 'zustand';
import { GraphViewMode, GraphDataset } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_BASIC_LESSONS_DATASET } from '@/models/roadmap/python-lessons-graph.mock';
import { CareerBranchId, CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { FRONTEND_COURSES_DATASET } from '@/models/roadmap/tracks/frontend-track.mock';
import { RoadmapService } from '@/services/roadmap/roadmap.service';

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
  openCourseLessons: (courseId: string) => Promise<void>;
  returnToCourses: () => void;
  setActiveNode: (id: string | null) => void;
  setBranch: (branchId: CareerBranchId) => void;
  setPanOffset: (pan: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number) => void;
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
  coursesDataset: FRONTEND_COURSES_DATASET,
  lessonsDataset: PYTHON_BASIC_LESSONS_DATASET,
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
  setZoomLevel: (zoom) => set({ zoomLevel: Math.max(50, Math.min(200, zoom)) }),
  zoomIn: () => set((s) => ({ zoomLevel: Math.min(200, s.zoomLevel + 15) })),
  zoomOut: () => set((s) => ({ zoomLevel: Math.max(50, s.zoomLevel - 15) })),
  resetZoom: () => set({ zoomLevel: 100, panOffset: { x: 0, y: 0 } }),
  getCurrentDataset: () => (get().viewMode === 'courses' ? get().coursesDataset : get().lessonsDataset),
}));
