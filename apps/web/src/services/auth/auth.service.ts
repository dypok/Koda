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
   * Inicia sesión con correo y contraseña contra Supabase Auth y sincroniza la sesión con el backend.
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
      const desc = data?.error_description || data?.msg || data?.message || '';
      if (desc.includes('Invalid login credentials')) {
        throw new Error('Correo electrónico o contraseña incorrectos.');
      }
      if (desc.includes('Email not confirmed')) {
        throw new Error('Debes confirmar tu correo electrónico con el código OTP antes de ingresar.');
      }
      throw new Error(desc || `Error al iniciar sesión (${res.status})`);
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
   * Obtiene la URL de redirección para autenticación OAuth (Google / GitHub) en Supabase Auth.
   */
  public static getOAuthRedirectUrl(provider: 'google' | 'github'): string {
    const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(
      `${redirectOrigin}/login`
    )}`;
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
   * Registra al estudiante en el backend con envío de código OTP vía correo (Supabase Auth).
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
   * Verifica el código numérico OTP de 6 dígitos emitido por Supabase Auth.
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
}
