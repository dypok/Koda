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
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/$/, '')
  : `${RAW_BASE_URL.replace(/\/$/, '')}/api/v1`;

export class UserProfileService {
  /**
   * Obtiene el perfil completo y consolidado del usuario autenticado con métricas en tiempo real.
   */
  public static async getProfile(token: string): Promise<UserProfileResponse> {
    if (!token) {
      throw new Error('No hay sesión activa para consultar el perfil.');
    }

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new Error(msg || `Error al consultar el perfil (${res.status})`);
    }

    return data as UserProfileResponse;
  }

  /**
   * Actualiza parcialmente datos de perfil, preferencias pedagógicas o avatar del usuario.
   */
  public static async updateProfile(
    payload: UpdateUserProfilePayload,
    token: string
  ): Promise<UserProfileResponse> {
    if (!token) {
      throw new Error('No hay sesión activa para actualizar el perfil.');
    }

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new Error(msg || `Error al actualizar el perfil (${res.status})`);
    }

    return data as UserProfileResponse;
  }
}
