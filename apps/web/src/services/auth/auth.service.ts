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

export class AuthService {
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
