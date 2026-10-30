import { useAuthStore } from '@/stores/auth.store';
import type { CertificateVerificationResponse } from '@koda/types';

export interface LessonAnswerFeedback {
  is_correct: boolean;
  xp_earned: number;
  feedback_message: string;
  hint?: string;
  explanation?: string;
  correct_option_ids?: string[];
  added_to_review_queue: boolean;
}

export interface SectionCompletionResult {
  sectionId?: string;
  attemptStars?: number;
  starsEarned?: number;
  isNewlyPassed?: boolean;
  isNewBest?: boolean;
  xpAwarded?: number;
  userTotalXp?: number;
  currentStreak?: number;
  longestStreak?: number;
  streakFreezeCount?: number;
  isActiveToday?: boolean;
}

export interface EvaluationQuestion {
  id: string;
  prompt: string;
  type?: string;
  code_snippet?: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

export interface EvaluationResponse {
  id?: string;
  moduleId?: string;
  module_id?: string;
  type?: 'quiz' | 'exam';
  evaluation_type?: 'quiz' | 'exam';
  total_questions?: number;
  questions: EvaluationQuestion[];
}

export interface AttemptSubmissionResult {
  attemptId?: string;
  attempt_id?: string;
  score: number;
  passed: boolean;
  correctAnswersCount?: number;
  correct_count?: number;
  totalQuestions?: number;
  total_questions?: number;
  xpEarned?: number;
  xp_earned?: number;
  certificateCode?: string;
}

export interface AttemptDetailItem {
  question_id: string;
  prompt: string;
  user_answer?: string;
  user_response?: string[];
  correct_answer?: string | string[];
  is_correct: boolean;
  explanation?: string;
  feedback_text?: string;
}

export interface AttemptSummaryResponse {
  attemptId?: string;
  attempt_id?: string;
  passed: boolean;
  score: number;
  xpEarned?: number;
  xp_earned?: number;
  attemptType?: 'quiz' | 'exam' | 'lesson';
  details: AttemptDetailItem[];
}

export interface IssueCertificateResponse {
  code: string;
  verificationCode: string;
  storageUrl?: string;
  storage_url?: string;
  [key: string]: any;
}

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const DIRECT_BASE_URL = RAW_BASE_URL.replace(/\/$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/$/, '')
  : `${RAW_BASE_URL.replace(/\/$/, '')}/api/v1`;

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return useAuthStore.getState().token || localStorage.getItem('koda_auth_token');
}

async function requestWithAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const directUrl = `${DIRECT_BASE_URL}${cleanPath}`;
  const proxyUrl = `/api/v1${cleanPath}`;

  const timeoutSignal = options.signal || (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(8000) : undefined);
  const fetchOptions: RequestInit = {
    ...options,
    signal: timeoutSignal,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  // 1. Probar ruta relativa con proxy
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(proxyUrl, fetchOptions);
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      // Continuar al fallback directo
    }
  }

  // 2. Conexión directa al backend
  const res = await fetch(directUrl, fetchOptions);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error en API (${res.status}): ${errorText}`);
  }

  return (await res.json()) as T;
}

export class EvaluationService {
  /**
   * Obtiene o genera las preguntas del quiz para un módulo.
   */
  public static async getModuleQuiz(moduleId: string): Promise<EvaluationResponse> {
    return requestWithAuth<EvaluationResponse>(`/learning/modules/${moduleId}/quiz`);
  }

  /**
   * Envía las respuestas seleccionadas para calificar el quiz.
   */
  public static async submitQuizAttempt(
    moduleIdOrQuizId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number = 120,
  ): Promise<AttemptSubmissionResult> {
    return requestWithAuth<AttemptSubmissionResult>(`/learning/quiz/${moduleIdOrQuizId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers, time_spent_seconds: timeSpentSeconds }),
    });
  }

  /**
   * Obtiene o genera las preguntas del examen final para un módulo.
   */
  public static async getModuleExam(moduleId: string): Promise<EvaluationResponse> {
    return requestWithAuth<EvaluationResponse>(`/learning/modules/${moduleId}/exam`);
  }

  /**
   * Envía las respuestas seleccionadas para calificar el examen final.
   */
  public static async submitExamAttempt(
    moduleIdOrExamId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number = 1800,
  ): Promise<AttemptSubmissionResult> {
    return requestWithAuth<AttemptSubmissionResult>(`/learning/exam/${moduleIdOrExamId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers, time_spent_seconds: timeSpentSeconds }),
    });
  }

  /**
   * Obtiene el desglose detallado de un intento realizado.
   */
  public static async getAttemptSummary(attemptId: string): Promise<AttemptSummaryResponse> {
    return requestWithAuth<AttemptSummaryResponse>(`/learning/attempts/${attemptId}/summary`);
  }

  /**
   * Emite el certificado oficial si el examen fue aprobado.
   */
  public static async issueCertificate(languageSlug: string): Promise<IssueCertificateResponse> {
    const res = await requestWithAuth<any>('/certificates/issue', {
      method: 'POST',
      body: JSON.stringify({ languageSlug }),
    });
    const code = res.code || res.verificationCode || '';
    return {
      ...res,
      code,
      verificationCode: res.verificationCode || code,
      storageUrl: res.storageUrl || res.storage_url,
    };
  }

  /**
   * Verifica públicamente la autenticidad de un certificado Koda por su código.
   */
  public static async verifyCertificate(code: string): Promise<CertificateVerificationResponse> {
    const cleanPath = `/certificates/verify/${code}`;
    const directUrl = `${DIRECT_BASE_URL}${cleanPath}`;
    const proxyUrl = `/api/v1${cleanPath}`;

    // 1. Probar ruta relativa con proxy
    if (typeof window !== 'undefined') {
      try {
        const signal = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(8000) : undefined;
      const res = await fetch(proxyUrl, { signal });
        if (res.ok) {
          return (await res.json()) as CertificateVerificationResponse;
        }
      } catch {}
    }

    // 2. Conexión directa
    const signal = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(8000) : undefined;
    const res = await fetch(directUrl, { signal });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error (${res.status}): ${errorText}`);
    }
    return (await res.json()) as CertificateVerificationResponse;
  }

  /**
   * Evalúa la respuesta de una micro-lección en el backend.
   */
  public static async evaluateLessonAnswer(
    lessonId: string,
    submission: {
      selected_option_ids: string[];
      execution_code?: string;
      prediction_answer?: string;
      xp_earned?: number;
    },
  ): Promise<LessonAnswerFeedback> {
    return requestWithAuth<LessonAnswerFeedback>(`/learning/lessons/${lessonId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ ...submission, lesson_id: lessonId }),
    });
  }

  /**
   * Registra la finalizacion de una seccion en PostgreSQL otorgando estrellas y XP.
   */
  public static async completeSection(
    sectionId: string,
    data: {
      moduleId: string;
      courseId: string;
      accuracyPercentage: number;
      targetXp?: number;
    },
  ): Promise<SectionCompletionResult> {
    return requestWithAuth<SectionCompletionResult>(`/learning/sections/${sectionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
