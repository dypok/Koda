/**
 * Servicio de Evaluación Diagnóstica Inicial (AUTH-02)
 * Conecta con NestJS:
 * - GET /api/v1/learning/diagnostic/questions
 * - POST /api/v1/learning/diagnostic/submit
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

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
  isPassed: boolean;
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
    const res = await fetch(
      `${API_BASE_URL}/learning/diagnostic/questions?languageSlug=${encodeURIComponent(
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

    const res = await fetch(`${API_BASE_URL}/learning/diagnostic/submit`, {
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
  }
}
