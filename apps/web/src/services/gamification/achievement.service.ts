import { AuthService } from '@/services/auth/auth.service';
import type { UserAchievementsResponse } from '@koda/types';

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const DIRECT_BASE_URL = RAW_BASE_URL.replace(/\/$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/$/, '')
  : `${RAW_BASE_URL.replace(/\/$/, '')}/api/v1`;

async function fetchWithFallback(path: string, options: RequestInit = {}): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const directUrl = `${DIRECT_BASE_URL}${cleanPath}`;
  const proxyUrl = `/api/v1${cleanPath}`;

  // 1. En navegador, intentar primero la ruta relativa mediante el proxy de Next.js
  if (typeof window !== 'undefined') {
    try {
      const res = await AuthService.authFetch(proxyUrl, options);
      if (res.status !== 404) {
        return res;
      }
    } catch {
      // Si el proxy falla, intentar directo al backend
    }
  }

  // 2. Fetch directo al backend
  return AuthService.authFetch(directUrl, options);
}

export class AchievementService {
  /**
   * Obtiene la lista completa de logros y medallas del usuario autenticado.
   */
  public static async getAchievements(token?: string): Promise<UserAchievementsResponse> {
    const activeToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null);
    if (!activeToken) {
      return {
        achievements: [],
        newly_unlocked: [],
        stats: { total: 0, unlocked_count: 0, total_xp_earned: 0 },
      };
    }

    try {
      const res = await fetchWithFallback('/users/me/achievements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        return {
          achievements: [],
          newly_unlocked: [],
          stats: { total: 0, unlocked_count: 0, total_xp_earned: 0 },
        };
      }

      const data: UserAchievementsResponse = await res.json();
      return data;
    } catch (err: any) {
      console.warn('Error consultando catálogo de logros:', err?.message);
      return {
        achievements: [],
        newly_unlocked: [],
        stats: { total: 0, unlocked_count: 0, total_xp_earned: 0 },
      };
    }
  }

  /**
   * Fuerza la evaluación y conciliación de logros contra el progreso en la DB.
   */
  public static async checkAchievements(token?: string): Promise<UserAchievementsResponse> {
    const activeToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null);
    if (!activeToken) {
      throw new Error('No hay sesión activa para evaluar logros.');
    }

    const res = await fetchWithFallback('/users/me/achievements/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeToken}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Error al evaluar logros.');
    }

    return data as UserAchievementsResponse;
  }
}
