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
export interface AppearanceSettings {
  backgroundPreset: BackgroundPreset;
  starDensity: StarDensity;
  accentTheme: AccentTheme;
  interactiveCursor: boolean;
}

interface AppearanceState extends AppearanceSettings {
  hasHydrated: boolean;
  setAppearance: (settings: Partial<AppearanceSettings>) => void;
  setBackgroundPreset: (preset: BackgroundPreset) => void;
  setStarDensity: (density: StarDensity) => void;
  setAccentTheme: (theme: AccentTheme) => void;
  setInteractiveCursor: (interactive: boolean) => void;
  resetAppearance: () => void;
  initAppearance: () => void;
}

const STORAGE_KEY = 'koda_appearance_settings';

const DEFAULT_SETTINGS: AppearanceSettings = {
  backgroundPreset: 'cosmic-stars',
  starDensity: 'medium',
  accentTheme: 'amber',
  interactiveCursor: true,
};

export const ACCENT_PALETTES: Record<
  AccentTheme,
  {
    name: string;
    primary: string;
    light: string;
    dark: string;
    rgb: string;
    glow: string;
    pixiHex: number;
    gradient: string;
  }
> = {
  amber: {
    name: 'Ámbar Koda',
    primary: '#f59e0b',
    light: '#fbbf24',
    dark: '#b45309',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.35)',
    pixiHex: 0xf59e0b,
    gradient: 'from-amber-500 to-orange-500',
  },
  cyan: {
    name: 'Cian Neón',
    primary: '#06b6d4',
    light: '#22d3ee',
    dark: '#0e7490',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.35)',
    pixiHex: 0x06b6d4,
    gradient: 'from-cyan-500 to-blue-500',
  },
  violet: {
    name: 'Púrpura Cuántico',
    primary: '#8b5cf6',
    light: '#a78bfa',
    dark: '#6d28d9',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.35)',
    pixiHex: 0x8b5cf6,
    gradient: 'from-violet-500 to-purple-500',
  },
  emerald: {
    name: 'Esmeralda Hacker',
    primary: '#10b981',
    light: '#34d399',
    dark: '#047857',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.35)',
    pixiHex: 0x10b981,
    gradient: 'from-emerald-500 to-teal-500',
  },
};

export function applyAccentToDom(theme: AccentTheme) {
  if (typeof document === 'undefined') return;
  const palette = ACCENT_PALETTES[theme] || ACCENT_PALETTES.amber;
  const root = document.documentElement;
  root.setAttribute('data-accent-theme', theme);
  root.style.setProperty('--koda-accent', palette.primary);
  root.style.setProperty('--koda-accent-light', palette.light);
  root.style.setProperty('--koda-accent-dark', palette.dark);
  root.style.setProperty('--koda-accent-rgb', palette.rgb);
  root.style.setProperty('--koda-accent-glow', palette.glow);
}

export const useAppearanceStore = create<AppearanceState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hasHydrated: false,

  initAppearance: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const resolvedTheme = parsed.accentTheme ?? DEFAULT_SETTINGS.accentTheme;
        applyAccentToDom(resolvedTheme);
        set({
          backgroundPreset: parsed.backgroundPreset ?? DEFAULT_SETTINGS.backgroundPreset,
          starDensity: parsed.starDensity ?? DEFAULT_SETTINGS.starDensity,
          accentTheme: resolvedTheme,
          interactiveCursor: parsed.interactiveCursor ?? DEFAULT_SETTINGS.interactiveCursor,
          hasHydrated: true,
        });
        return;
      }
    } catch {
      // Ignorar error de parsing
    }
    applyAccentToDom(DEFAULT_SETTINGS.accentTheme);
    set({ hasHydrated: true });
  },

  setAppearance: (settings: Partial<AppearanceSettings>) => {
    set((state) => {
      const updated = {
        backgroundPreset: settings.backgroundPreset ?? state.backgroundPreset,
        starDensity: settings.starDensity ?? state.starDensity,
        accentTheme: settings.accentTheme ?? state.accentTheme,
        interactiveCursor: settings.interactiveCursor ?? state.interactiveCursor,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        applyAccentToDom(updated.accentTheme);
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

  resetAppearance: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      applyAccentToDom(DEFAULT_SETTINGS.accentTheme);
    }
    set({ ...DEFAULT_SETTINGS });
  },
}));
