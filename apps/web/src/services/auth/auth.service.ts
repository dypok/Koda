export interface RegisterOtpPayload {
  fullName: string;
  email: string;
  password: string;
  initialLanguageSlug?: string;
  experienceLevel?: string;
  learningStyle?: string;
  dailyGoalId?: string;
  dailyGoalMinutes?: number;
}

export interface RegisterOtpResult {
  message: string;
  email: string;
  requiresOtp: boolean;
  userId?: string;
}

export interface VerifyOtpPayload {
  email: string;
  token: string;
  type?: 'signup' | 'email';
}

export interface BackendUserSession {
  id: string;
  email: string;
  role: string;
  status: string;
  displayName: string;
  avatarUrl?: string | null;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezeCount: number;
  totalStudyTimeSeconds: number;
  onboardingCompleted: boolean;
  initialLanguageSlug: string;
  experienceLevel: string;
  learningStyle: string;
  dailyGoalId: string;
  dailyGoalMinutes: number;
  lastStudyDate?: string | null;
  createdAt?: string;
}

export interface VerifyOtpResult {
  session: BackendUserSession;
  accessToken: string;
  refreshToken?: string;
}

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/$/, '')
  : `${RAW_BASE_URL.replace(/\/$/, '')}/api/v1`;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sertfbduqivvjrmeblvh.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnRmYmR1cWl2dmpybWVibHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNDY3MjcsImV4cCI6MjEwNDkyMjcyN30.jC5gwZVgxqsA_VFbS6OAHOFKsmVdcpNhuH175KZ3Q3E';

export class AuthService {
  /**
   * Inicia sesión con correo y contraseña contra el servicio de autenticación y sincroniza la sesión con el backend.
   */
  public static async loginWithPassword(email: string, password: string): Promise<VerifyOtpResult> {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const desc = (data?.error_description || data?.msg || data?.message || '').toLowerCase();
      if (desc.includes('invalid login credentials') || desc.includes('invalid credentials')) {
        throw new Error('Correo electrónico o contraseña incorrectos.');
      }
      if (desc.includes('email not confirmed')) {
        throw new Error('Debes confirmar tu correo electrónico con el código OTP antes de ingresar.');
      }
      const raw = data?.error_description || data?.msg || data?.message || '';
      const sanitized = raw.replace(/supabase/gi, '').replace(/gotrue/gi, '').trim();
      throw new Error(sanitized || 'Error al iniciar sesión. Por favor, verifica tus datos.');
    }

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    // Sincronizar y aprovisionar perfil en el backend NestJS
    const session = await this.verifySession(accessToken);

    return {
      session,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Renueva el token de acceso JWT utilizando el refresh_token para evitar que la sesión venza.
   */
  public static async refreshSession(refreshToken: string): Promise<VerifyOtpResult> {
    if (!refreshToken) {
      throw new Error('No se encontró token de renovación.');
    }

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const raw = data?.error_description || data?.msg || data?.message || '';
      const sanitized = raw.replace(/supabase/gi, '').replace(/gotrue/gi, '').trim();
      throw new Error(sanitized || 'Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    const accessToken = data.access_token;
    const newRefreshToken = data.refresh_token || refreshToken;

    const session = await this.verifySession(accessToken);

    // Actualizar inmediatamente en almacenamiento local si estamos en navegador
    if (typeof window !== 'undefined') {
      localStorage.setItem('koda_auth_token', accessToken);
      localStorage.setItem('koda_auth_refresh_token', newRefreshToken);
    }

    return {
      session,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Obtiene la URL de redirección para autenticación OAuth (Google / GitHub).
   */
  public static getOAuthRedirectUrl(provider: 'google' | 'github', redirectTo?: string): string {
    const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const target = redirectTo || `${redirectOrigin}/login`;
    return `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(target)}`;
  }

  /**
   * Guarda y sincroniza las preferencias educativas del estudiante en PostgreSQL.
   */
  public static async completeOnboarding(
    payload: {
      initialLanguageSlug: string;
      experienceLevel: string;
      learningStyle: string;
      dailyGoalId: string;
      dailyGoalMinutes: number;
      displayName?: string;
    },
    token: string
  ): Promise<BackendUserSession> {
    const res = await fetch(`${API_BASE_URL}/auth/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new Error(msg || 'No fue posible completar el onboarding.');
    }

    return data as BackendUserSession;
  }

  /**
   * Solicita el restablecimiento de contraseña llamando a NestJS (POST /api/v1/auth/forgot-password).
   */
  public static async requestPasswordReset(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new Error(msg || 'No fue posible procesar la solicitud.');
    }

    return data;
  }

  /**
   * Restablece la contraseña utilizando el token temporal recibido por correo (POST /api/v1/auth/reset-password).
   */
  public static async resetPassword(payload: {
    token: string;
    newPassword: string;
    email?: string;
  }): Promise<{ message: string; success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new Error(msg || 'No fue posible restablecer la contraseña. Verifica que el token sea válido.');
    }

    return data;
  }
  /**
   * Registra al estudiante en el backend con envío de código OTP vía correo.
   */
  public static async registerWithOtp(payload: RegisterOtpPayload): Promise<RegisterOtpResult> {
    const res = await fetch(`${API_BASE_URL}/auth/register-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = Array.isArray(data?.message)
        ? data.message[0]
        : data?.message || `Error al registrar estudiante (${res.status})`;
      throw new Error(errorMessage);
    }

    return data as RegisterOtpResult;
  }

  /**
   * Verifica el código numérico OTP de 6 dígitos.
   * Retorna la sesión provisionada del usuario y el JWT Bearer token.
   */
  public static async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResult> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        token: payload.token.trim(),
        type: payload.type || 'signup',
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = Array.isArray(data?.message)
        ? data.message[0]
        : data?.message || `Código de verificación incorrecto o expirado (${res.status})`;
      throw new Error(errorMessage);
    }

    return data as VerifyOtpResult;
  }

  /**
   * Valida la autenticidad de un token JWT existente en el backend.
   */
  public static async verifySession(token: string): Promise<BackendUserSession> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data?.message || 'Sesión no válida o expirada';
      throw new Error(errorMessage);
    }

    return data as BackendUserSession;
  }

  /**
   * Realiza una petición HTTP autenticada. Si el token está vencido (401),
   * renueva la sesión automáticamente con el refresh_token y reintenta la petición.
   */
  public static async authFetch(url: string, init: RequestInit = {}): Promise<Response> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('koda_auth_token') : null;
    const headers = new Headers(init.headers || {});
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let res = await fetch(url, { ...init, headers });

    // Si responde 401 y tenemos refresh_token, renovar en caliente y reintentar
    if (res.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('koda_auth_refresh_token');
      if (refreshToken) {
        try {
          const renewed = await this.refreshSession(refreshToken);
          headers.set('Authorization', `Bearer ${renewed.accessToken}`);
          res = await fetch(url, { ...init, headers });
        } catch {
          // Si el refresh falla, devolver la respuesta original 401
        }
      }
    }

    return res;
  }
}
