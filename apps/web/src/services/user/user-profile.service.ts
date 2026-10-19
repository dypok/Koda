import { AuthService } from '@/services/auth/auth.service';

export interface UserProfileResponse {
  id: string;
  email: string;
  role: string;
  status: string;
  displayName: string;
  avatarUrl?: string | null;
  avatarObjectKey?: string | null;
  documentType?: 'CC' | 'TI' | 'CE' | 'PASSPORT' | null;
  documentNumberMasked?: string | null;
  formattedMaskedDocument?: string | null;
  bio?: string | null;
  timezone: string;
  locale: string;
  onboardingCompleted: boolean;
  initialLanguageSlug: string;
  experienceLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  learningStyle: 'hands-on' | 'guided' | 'projects' | 'gamified';
  dailyGoalId: 'casual' | 'regular' | 'focused' | 'intense';
  dailyGoalMinutes: number;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezeCount: number;
  totalStudyTimeSeconds: number;
  lastStudyDate?: string | null;
  isActiveToday?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  displayName?: string;
  avatarUrl?: string;
  avatarObjectKey?: string;
  documentType?: 'CC' | 'TI' | 'CE' | 'PASSPORT';
  documentNumber?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
  dailyGoalId?: 'casual' | 'regular' | 'focused' | 'intense';
  dailyGoalMinutes?: number;
  initialLanguageSlug?: string;
  experienceLevel?: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  learningStyle?: 'hands-on' | 'guided' | 'projects' | 'gamified';
}

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

export class UserProfileService {
  /**
   * Obtiene el perfil completo y consolidado del usuario autenticado con métricas en tiempo real.
   */
  public static async getProfile(token?: string): Promise<UserProfileResponse> {
    const activeToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null);
    if (!activeToken) {
      throw new Error('No hay sesión activa para consultar el perfil.');
    }

    try {
      const res = await fetchWithFallback('/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        throw new Error(msg || `Error al consultar el perfil (${res.status})`);
      }

      return data as UserProfileResponse;
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error('No se pudo conectar con el servidor de Koda. Verifica que la API esté activa.');
      }
      throw err;
    }
  }

  /**
   * Actualiza parcialmente datos de perfil, preferencias pedagógicas o avatar del usuario.
   */
  public static async updateProfile(
    payload: UpdateUserProfilePayload,
    token?: string
  ): Promise<UserProfileResponse> {
    const activeToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null);
    if (!activeToken) {
      throw new Error('No hay sesión activa para actualizar el perfil.');
    }

    try {
      const res = await fetchWithFallback('/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        throw new Error(msg || `Error al actualizar el perfil (${res.status})`);
      }

      return data as UserProfileResponse;
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error('No se pudo conectar con el servidor de Koda. Verifica que la API esté activa.');
      }
      throw err;
    }
  }
}
