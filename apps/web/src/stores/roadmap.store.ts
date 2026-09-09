import { create } from 'zustand';
import { GraphViewMode } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_TRACK } from '@/models/roadmap/python-roadmap.mock';

interface RoadmapStoreState {
  viewMode: GraphViewMode;
  selectedLanguageId: string;
  selectedCourseId: string;
  activeNodeId: string | null;
  zoomLevel: number;
  openCourseLessons: (courseId: string) => void;
  returnToCourses: () => void;
  toggleViewMode: () => void;
  setActiveNode: (id: string | null) => void;
  setLanguage: (langId: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  getEarnedStars: () => number;
  getTotalStars: () => number;
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  viewMode: 'courses',
  selectedLanguageId: 'python',
  selectedCourseId: 'py-basic',
  activeNodeId: 'les-04',
  zoomLevel: 100,
  openCourseLessons: (courseId) => set({ viewMode: 'lessons', selectedCourseId: courseId }),
  returnToCourses: () => set({ viewMode: 'courses' }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === 'courses' ? 'lessons' : 'courses' })),
  setActiveNode: (id) => set({ activeNodeId: id }),
  setLanguage: (langId) => set({ selectedLanguageId: langId }),
  zoomIn: () => set((s) => ({ zoomLevel: Math.min(140, s.zoomLevel + 10) })),
  zoomOut: () => set((s) => ({ zoomLevel: Math.max(70, s.zoomLevel - 10) })),
  resetZoom: () => set({ zoomLevel: 100 }),
  getEarnedStars: () => PYTHON_TRACK.mainCourses.reduce((acc, c) => acc + c.earnedStars, 0),
  getTotalStars: () => PYTHON_TRACK.mainCourses.reduce((acc, c) => acc + c.totalStars, 0),
}));
