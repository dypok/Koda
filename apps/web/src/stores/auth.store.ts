import { create } from 'zustand';
import type { BackendUserSession } from '@/services/auth/auth.service';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  totalXp: number;
  level: number;
  streak: number;
  initialLanguageSlug?: string;
  experienceLevel?: string;
  learningStyle?: string;
  dailyGoalMinutes?: number;
  onboardingCompleted?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasEverLoggedIn: boolean;
  hasHydrated: boolean;
  initAuth: () => void;
  setUserSession: (session: BackendUserSession, accessToken: string, refreshToken?: string) => void;
  updateUserProfile: (partial: Partial<AuthUser>) => void;
  login: (email: string, fullName?: string) => void;
  loginSocial: (provider: 'google' | 'github') => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  USER: 'koda_auth_user',
  TOKEN: 'koda_auth_token',
  REFRESH_TOKEN: 'koda_auth_refresh_token',
  HAS_LOGGED: 'koda_has_ever_logged_in',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  hasEverLoggedIn: false,
  hasHydrated: false,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const hasEver = localStorage.getItem(STORAGE_KEYS.HAS_LOGGED) === 'true';

      // Requerir estrictamente que exista un token JWT real de Supabase/NestJS y descartar mocks
      const isMockUser = storedUser?.includes('"usr_') || !storedToken;

      if (storedUser && storedToken && !isMockUser) {
        try {
          const user = JSON.parse(storedUser);
          set({
            user,
            token: storedToken,
            refreshToken: storedRefreshToken || null,
            isAuthenticated: true,
            hasEverLoggedIn: true,
            hasHydrated: true,
          });
          return;
        } catch {
          // JSON corrupto, limpiar
        }
      }

      // Si había residuos de mocks sin token real, purgarlos de inmediato
      if (storedUser && isMockUser) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        hasEverLoggedIn: hasEver,
        hasHydrated: true,
      });
    } catch {
      set({ hasHydrated: true });
    }
  },

  setUserSession: (session: BackendUserSession, accessToken: string, refreshToken?: string) => {
    const user: AuthUser = {
      id: session.id,
      email: session.email,
      fullName: session.displayName || session.email.split('@')[0] || 'Estudiante Koda',
      avatarUrl: session.avatarUrl || '/brand/koda-mascot-cartoon-2d.svg',
      totalXp: session.totalXp ?? 0,
      level: session.currentLevel ?? 1,
      streak: session.currentStreak ?? 0,
      initialLanguageSlug: session.initialLanguageSlug,
      experienceLevel: session.experienceLevel,
      learningStyle: session.learningStyle,
      dailyGoalMinutes: session.dailyGoalMinutes,
      onboardingCompleted: session.onboardingCompleted,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }

    set({
      user,
      token: accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      hasEverLoggedIn: true,
    });
  },

  updateUserProfile: (partial: Partial<AuthUser>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...partial };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  login: () => {
    // Deprecated: No se permiten logins simulados sin autenticación real de Supabase
    // eslint-disable-next-line no-console
    console.warn('[auth] login() simulado deshabilitado. Autentica con AuthService.loginWithPassword()');
  },

  loginSocial: () => {
    // Deprecated: Redirige a través de AuthService.getOAuthRedirectUrl()
    // eslint-disable-next-line no-console
    console.warn('[auth] loginSocial() simulado deshabilitado. Usa AuthService.getOAuthRedirectUrl()');
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, hasEverLoggedIn: true });
  },
}));

