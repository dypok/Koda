import { AuthService } from '@/services/auth/auth.service';
import type { MistakesNotebookItem } from '@koda/types';

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

export class NotebookService {
  /**
   * Obtiene la lista de errores persistentes pendientes del usuario autenticado (SM-2).
   */
  public static async getMistakes(token?: string): Promise<MistakesNotebookItem[]> {
    const activeToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null);
    if (!activeToken) {
      return [];
    }

    try {
      const res = await fetchWithFallback('/notebook/mistakes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json().catch(() => []);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.warn('Error consultando cuaderno de errores:', err?.message);
      return [];
    }
  }

  /**
   * Marca un error como remediado, actualiza métricas SM-2 y acredita +5 XP.
   */
  public static async resolveMistake(
    questionId: string,
    token?: string
  ): Promise<{ success: boolean; xp_reward: number }> {
    const activeToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null);
    if (!activeToken) {
      throw new Error('No hay sesión activa para remediar el error.');
    }

    const res = await fetchWithFallback(`/notebook/mistakes/${encodeURIComponent(questionId)}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeToken}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Error al remediar el ejercicio en el cuaderno.');
    }

    return {
      success: Boolean(data?.success),
      xp_reward: Number(data?.xp_reward || 5),
    };
  }
}
