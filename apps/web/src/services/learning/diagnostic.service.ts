/**
 * Servicio de Evaluación Diagnóstica Inicial (AUTH-02)
 * Conecta con NestJS:
 * - GET /api/v1/learning/diagnostic/questions
 * - POST /api/v1/learning/diagnostic/submit
 */

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const DIRECT_BASE_URL = RAW_BASE_URL.replace(/\/$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/$/, '')
  : `${RAW_BASE_URL.replace(/\/$/, '')}/api/v1`;

async function fetchWithFallback(path: string, options: RequestInit = {}): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const directUrl = `${DIRECT_BASE_URL}${cleanPath}`;
  const proxyUrl = `/api/v1${cleanPath}`;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(proxyUrl, options);
      if (res.status !== 404) {
        return res;
      }
    } catch {
      // Fallback a conexión directa
    }
  }

  return fetch(directUrl, options);
}

export interface DiagnosticOption {
  id: string;
  text: string;
}

export interface DiagnosticQuestionItem {
  id: string;
  order: number;
  blockId: string;
  blockName: string;
  moduleCode: string;
  moduleTitle: string;
  prompt: string;
  codeSnippet?: string;
  options: DiagnosticOption[];
}

export interface DiagnosticQuestionsResponse {
  languageSlug: string;
  totalQuestions: number;
  suggestedDurationMinutes: number;
  questions: DiagnosticQuestionItem[];
}

export interface DiagnosticAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface BlockScore {
  blockId: string;
  name: string;
  modulesCovered: string[];
  correctAnswers: number;
  totalQuestions: number;
  scorePercentage: number;
  isPassed?: boolean;
  passed?: boolean;
}

export interface DiagnosticResultResponse {
  recommendedModuleId: string;
  recommendedModuleCode: string;
  recommendedModuleTitle: string;
  recommendedModuleOrder: number;
  overallScore: number;
  totalQuestions: number;
  totalCorrect: number;
  passedBlock1: boolean;
  passedBlock2: boolean;
  blockScores: BlockScore[];
  clamped: boolean;
  justification: string;
  unlockedModules: string[];
  declaredLevel: string;
}

export class DiagnosticService {
  /**
   * Obtiene las 12 preguntas calibradas sin respuestas correctas del backend.
   */
  public static async getQuestions(
    languageSlug = 'python'
  ): Promise<DiagnosticQuestionsResponse> {
    try {
      const res = await fetchWithFallback(
        `/learning/diagnostic/questions?languageSlug=${encodeURIComponent(
          languageSlug
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error al cargar preguntas diagnósticas (${res.status})`);
      }

      return res.json();
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error('No se pudo conectar con el servidor de Koda. Verifica que la API esté activa.');
      }
      throw err;
    }
  }

  /**
   * Envía las respuestas del estudiante para evaluar el punto de entrada pedagógico.
   * Soporta envío autenticado con token Bearer o no autenticado durante el registro.
   */
  public static async submitDiagnostic(
    payload: {
      declaredLevel: string;
      languageSlug?: string;
      answers: DiagnosticAnswer[];
    },
    token?: string
  ): Promise<DiagnosticResultResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetchWithFallback('/learning/diagnostic/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = Array.isArray(data?.message)
          ? data.message[0]
          : data?.message || 'Error al procesar la evaluación diagnóstica.';
        throw new Error(msg);
      }

      return data as DiagnosticResultResponse;
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error('No se pudo conectar con el servidor de Koda. Verifica que la API esté activa.');
      }
      throw err;
    }
  }
}
