import { create } from 'zustand';
import { GraphViewMode, GraphDataset } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_TRACK } from '@/models/roadmap/python-roadmap.mock';
import { PYTHON_COURSES_DATASET } from '@/models/roadmap/python-courses-graph.mock';
import { PYTHON_BASIC_LESSONS_DATASET } from '@/models/roadmap/python-lessons-graph.mock';
import { RoadmapService } from '@/services/roadmap/roadmap.service';

interface RoadmapStoreState {
  viewMode: GraphViewMode;
  selectedLanguageId: string;
  selectedCourseId: string;
  activeNodeId: string | null;
  zoomLevel: number;
  isLoading: boolean;
  coursesDataset: GraphDataset;
  lessonsDataset: GraphDataset;
  openCourseLessons: (courseId: string) => Promise<void>;
  returnToCourses: () => void;
  toggleViewMode: () => void;
  setActiveNode: (id: string | null) => void;
  setLanguage: (langId: string) => Promise<void>;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  getEarnedStars: () => number;
  getTotalStars: () => number;
  getCurrentDataset: () => GraphDataset;
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  viewMode: 'courses',
  selectedLanguageId: 'python',
  selectedCourseId: 'py-basic',
  activeNodeId: 'les-04',
  zoomLevel: 100,
  isLoading: false,
  coursesDataset: PYTHON_COURSES_DATASET,
  lessonsDataset: PYTHON_BASIC_LESSONS_DATASET,
  openCourseLessons: async (courseId) => {
    set({ viewMode: 'lessons', selectedCourseId: courseId, isLoading: true });
    const dataset = await RoadmapService.getCourseLessonsGraph(courseId);
    set({ lessonsDataset: dataset, isLoading: false });
  },
  returnToCourses: () => set({ viewMode: 'courses' }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === 'courses' ? 'lessons' : 'courses' })),
  setActiveNode: (id) => set({ activeNodeId: id }),
  setLanguage: async (langId) => {
    set({ selectedLanguageId: langId, isLoading: true });
    const dataset = await RoadmapService.getCoursesGraph(langId);
    set({ coursesDataset: dataset, isLoading: false });
  },
  zoomIn: () => set((s) => ({ zoomLevel: Math.min(140, s.zoomLevel + 10) })),
  zoomOut: () => set((s) => ({ zoomLevel: Math.max(70, s.zoomLevel - 10) })),
  resetZoom: () => set({ zoomLevel: 100 }),
  getEarnedStars: () => PYTHON_TRACK.mainCourses.reduce((acc, c) => acc + c.earnedStars, 0),
  getTotalStars: () => PYTHON_TRACK.mainCourses.reduce((acc, c) => acc + c.totalStars, 0),
  getCurrentDataset: () => (get().viewMode === 'courses' ? get().coursesDataset : get().lessonsDataset),
}));
