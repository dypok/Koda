import { create } from 'zustand';
import { LanguageTrack, RoadmapLesson } from '@/models/roadmap/roadmap.types';
import { PYTHON_TRACK } from '@/models/roadmap/python-roadmap.mock';

interface RoadmapState {
  selectedLanguageId: string;
  currentTrack: LanguageTrack;
  selectedLesson: RoadmapLesson | null;
  setLanguage: (langId: string) => void;
  selectLesson: (lesson: RoadmapLesson | null) => void;
  getTotalEarnedStars: () => number;
  getTotalPossibleStars: () => number;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  selectedLanguageId: 'python',
  currentTrack: PYTHON_TRACK,
  selectedLesson: null,

  setLanguage: (langId: string) => {
    set({ selectedLanguageId: langId, selectedLesson: null });
  },

  selectLesson: (lesson: RoadmapLesson | null) => {
    set({ selectedLesson: lesson });
  },

  getTotalEarnedStars: () => {
    const { currentTrack } = get();
    const main = currentTrack.mainCourses.reduce((acc, c) => acc + c.earnedStars, 0);
    const fw = currentTrack.frameworkBranches.reduce(
      (acc, b) => acc + b.courses.reduce((cAcc, c) => cAcc + c.earnedStars, 0),
      0
    );
    return main + fw;
  },

  getTotalPossibleStars: () => {
    const { currentTrack } = get();
    const main = currentTrack.mainCourses.reduce((acc, c) => acc + c.totalStars, 0);
    const fw = currentTrack.frameworkBranches.reduce(
      (acc, b) => acc + b.courses.reduce((cAcc, c) => cAcc + c.totalStars, 0),
      0
    );
    return main + fw;
  },
}));
