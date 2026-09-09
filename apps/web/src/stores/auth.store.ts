import { create } from 'zustand';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  totalXp: number;
  level: number;
  streak: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasEverLoggedIn: boolean;
  hasHydrated: boolean;
  initAuth: () => void;
  login: (email: string, fullName?: string) => void;
  loginSocial: (provider: 'google' | 'github') => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  USER: 'koda_auth_user',
  HAS_LOGGED: 'koda_has_ever_logged_in',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasEverLoggedIn: false,
  hasHydrated: false,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const hasEver = localStorage.getItem(STORAGE_KEYS.HAS_LOGGED) === 'true';
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true, hasEverLoggedIn: true, hasHydrated: true });
        return;
      }
      set({ hasEverLoggedIn: hasEver, hasHydrated: true });
    } catch {
      set({ hasHydrated: true });
    }
  },

  login: (email: string, fullName?: string) => {
    const cleanName = fullName?.trim() || email.split('@')[0] || 'Estudiante';
    const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const mockUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      email, fullName: capitalized,
      avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
      totalXp: 150, level: 2, streak: 3,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }
    set({ user: mockUser, isAuthenticated: true, hasEverLoggedIn: true });
  },

  loginSocial: (provider: 'google' | 'github') => {
    const name = provider === 'google' ? 'Dev Google' : 'Octocat Dev';
    const mockUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      email: `${provider}_user@koda.academy`,
      fullName: name, avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
      totalXp: 100, level: 1, streak: 1,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }
    set({ user: mockUser, isAuthenticated: true, hasEverLoggedIn: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }
    set({ user: null, isAuthenticated: false, hasEverLoggedIn: true });
  },
}));
