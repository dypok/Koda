import { create } from 'zustand';

export type BackgroundPreset =
  | 'cosmic-stars'
  | 'fireflies'
  | 'embers'
  | 'dust'
  | 'matrix-rain'
  | 'kepler-orbit';

export type StarDensity = 'low' | 'medium' | 'high';
export type AccentTheme = 'amber' | 'cyan' | 'violet' | 'emerald';
export type CoursesDisplayMode = 'fusion' | 'canvas' | 'pin-rail';

export interface AppearanceSettings {
  backgroundPreset: BackgroundPreset;
  starDensity: StarDensity;
  accentTheme: AccentTheme;
  interactiveCursor: boolean;
  coursesDisplayMode: CoursesDisplayMode;
}

interface AppearanceState extends AppearanceSettings {
  hasHydrated: boolean;
  setAppearance: (settings: Partial<AppearanceSettings>) => void;
  setBackgroundPreset: (preset: BackgroundPreset) => void;
  setStarDensity: (density: StarDensity) => void;
  setAccentTheme: (theme: AccentTheme) => void;
  setInteractiveCursor: (interactive: boolean) => void;
  setCoursesDisplayMode: (mode: CoursesDisplayMode) => void;
  resetAppearance: () => void;
  initAppearance: () => void;
}

const STORAGE_KEY = 'koda_appearance_settings';

const DEFAULT_SETTINGS: AppearanceSettings = {
  backgroundPreset: 'cosmic-stars',
  starDensity: 'medium',
  accentTheme: 'amber',
  interactiveCursor: true,
  coursesDisplayMode: 'fusion',
};

export const useAppearanceStore = create<AppearanceState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hasHydrated: false,

  initAppearance: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          backgroundPreset: parsed.backgroundPreset ?? DEFAULT_SETTINGS.backgroundPreset,
          starDensity: parsed.starDensity ?? DEFAULT_SETTINGS.starDensity,
          accentTheme: parsed.accentTheme ?? DEFAULT_SETTINGS.accentTheme,
          interactiveCursor: parsed.interactiveCursor ?? DEFAULT_SETTINGS.interactiveCursor,
          coursesDisplayMode: parsed.coursesDisplayMode ?? DEFAULT_SETTINGS.coursesDisplayMode,
          hasHydrated: true,
        });
        return;
      }
    } catch {
      // Ignorar error de parsing
    }
    set({ hasHydrated: true });
  },

  setAppearance: (settings: Partial<AppearanceSettings>) => {
    set((state) => {
      const updated = {
        backgroundPreset: settings.backgroundPreset ?? state.backgroundPreset,
        starDensity: settings.starDensity ?? state.starDensity,
        accentTheme: settings.accentTheme ?? state.accentTheme,
        interactiveCursor: settings.interactiveCursor ?? state.interactiveCursor,
        coursesDisplayMode: settings.coursesDisplayMode ?? state.coursesDisplayMode,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  },

  setBackgroundPreset: (preset: BackgroundPreset) => {
    get().setAppearance({ backgroundPreset: preset });
  },

  setStarDensity: (density: StarDensity) => {
    get().setAppearance({ starDensity: density });
  },

  setAccentTheme: (theme: AccentTheme) => {
    get().setAppearance({ accentTheme: theme });
  },

  setInteractiveCursor: (interactive: boolean) => {
    get().setAppearance({ interactiveCursor: interactive });
  },

  setCoursesDisplayMode: (mode: CoursesDisplayMode) => {
    get().setAppearance({ coursesDisplayMode: mode });
  },

  resetAppearance: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
    set({ ...DEFAULT_SETTINGS });
  },
}));
