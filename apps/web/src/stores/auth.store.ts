import { create } from 'zustand';
import type { BackendUserSession } from '@/services/auth/auth.service';

import { AuthService } from '@/services/auth/auth.service';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  totalXp: number;
  level: number;
  streak: number;
  longestStreak?: number;
  streakFreezeCount?: number;
  lastStudyDate?: string | null;
  isActiveToday?: boolean;
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
  loginAsGuest: () => void;
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

/** Token centinela para la sesión de invitado (modo demo, sin backend). */
const GUEST_TOKEN = 'koda-guest-session';

function parseJwtExp(token: string): number | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleBackgroundRefresh(token: string | null, refreshToken: string | null, onRefresh: (token: string, refresh: string) => void) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  if (!token || !refreshToken || typeof window === 'undefined') return;

  const exp = parseJwtExp(token);
  const now = Math.floor(Date.now() / 1000);
  // Refrescar 5 minutos (300s) antes del vencimiento, o cada 30 minutos (1800s)
  const secondsUntilRefresh = exp ? Math.max(30, exp - now - 300) : 1800;
  const ms = secondsUntilRefresh * 1000;

  refreshTimer = setTimeout(async () => {
    try {
      const renewed = await AuthService.refreshSession(refreshToken);
      onRefresh(renewed.accessToken, renewed.refreshToken || refreshToken);
    } catch {
      // Reintentar en 60 segundos si hubo fallo de red
      scheduleBackgroundRefresh(token, refreshToken, onRefresh);
    }
  }, ms);
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

      const isMockUser = storedUser?.includes('"usr_') || !storedToken;

      if (storedUser && storedToken && !isMockUser) {
        try {
          const user = JSON.parse(storedUser);
          if (!user.avatarUrl || user.avatarUrl.includes('koda-mascot-cartoon-2d')) {
            user.avatarUrl = '/avatars/koda-classic.svg';
          }
          set({
            user,
            token: storedToken,
            refreshToken: storedRefreshToken || null,
            isAuthenticated: true,
            hasEverLoggedIn: true,
            hasHydrated: true,
          });

          // Verificar si el token ya expiró o vencerá en menos de 5 minutos
          const exp = parseJwtExp(storedToken);
          const now = Math.floor(Date.now() / 1000);
          if (storedRefreshToken && (!exp || exp - now < 300)) {
            // Renovación inmediata en frío
            AuthService.refreshSession(storedRefreshToken)
              .then((result) => {
                get().setUserSession(result.session, result.accessToken, result.refreshToken);
              })
              .catch(() => {
                // Silencioso; se reintentará en segundo plano
              });
          }

          scheduleBackgroundRefresh(storedToken, storedRefreshToken, (newToken, newRefresh) => {
            set({ token: newToken, refreshToken: newRefresh });
            scheduleBackgroundRefresh(newToken, newRefresh, (t, r) => {
              set({ token: t, refreshToken: r });
            });
          });

          return;
        } catch {
          // JSON corrupto, limpiar
        }
      }

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
      avatarUrl: (session.avatarUrl && !session.avatarUrl.includes('koda-mascot-cartoon-2d'))
        ? session.avatarUrl
        : '/avatars/koda-classic.svg',
      totalXp: session.totalXp ?? 0,
      level: session.currentLevel ?? 1,
      streak: session.currentStreak ?? 0,
      longestStreak: session.longestStreak ?? session.currentStreak ?? 0,
      streakFreezeCount: session.streakFreezeCount ?? 1,
      lastStudyDate: session.lastStudyDate ?? null,
      isActiveToday: session.isActiveToday,
      initialLanguageSlug: session.initialLanguageSlug,
      experienceLevel: session.experienceLevel,
      learningStyle: session.learningStyle,
      dailyGoalMinutes: session.dailyGoalMinutes,
      onboardingCompleted: session.onboardingCompleted,
    };

    const finalRefresh = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      if (finalRefresh) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, finalRefresh);
      }
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }

    set({
      user,
      token: accessToken,
      refreshToken: finalRefresh || null,
      isAuthenticated: true,
      hasEverLoggedIn: true,
    });

    scheduleBackgroundRefresh(accessToken, finalRefresh, (newToken, newRefresh) => {
      set({ token: newToken, refreshToken: newRefresh });
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

  /**
   * Inicia una sesión de invitado (modo demo) sin backend ni Supabase Auth.
   * Permite recorrer la app (roadmap y lecciones) con datos locales.
   */
  loginAsGuest: () => {
    const guestUser: AuthUser = {
      id: 'koda-guest',
      email: 'invitado@koda.academy',
      fullName: 'Invitado',
      avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
      totalXp: 0,
      level: 1,
      streak: 0,
      initialLanguageSlug: 'python',
      experienceLevel: 'beginner',
      learningStyle: 'hands-on',
      dailyGoalMinutes: 10,
      onboardingCompleted: true,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(guestUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, GUEST_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }

    set({
      user: guestUser,
      token: GUEST_TOKEN,
      refreshToken: null,
      isAuthenticated: true,
      hasEverLoggedIn: true,
    });
  },

  login: () => {
    // Deprecated
  },

  loginSocial: () => {
    // Deprecated
  },

  logout: () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED, 'true');
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, hasEverLoggedIn: true });
  },
}));

