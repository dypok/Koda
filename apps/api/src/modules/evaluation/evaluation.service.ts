import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GenerateEvaluationUseCase } from '../../application/use-cases/evaluation/generate-evaluation.use-case';
import { EvaluateAttemptUseCase } from '../../application/use-cases/evaluation/evaluate-attempt.use-case';
import { GetAttemptSummaryUseCase } from '../../application/use-cases/evaluation/get-attempt-summary.use-case';

/**
 * Fachada delegada para compatibilidad retroactiva.
 * Todas las operaciones delegan en los casos de uso puros para evitar 'code drift'.
 */
@Injectable()
export class EvaluationService {
  constructor(
    private readonly generateEvaluationUseCase: GenerateEvaluationUseCase,
    private readonly evaluateAttemptUseCase: EvaluateAttemptUseCase,
    private readonly getAttemptSummaryUseCase: GetAttemptSummaryUseCase,
  ) {}

  async generateEvaluation(userId: string, moduleSlug: string, type: 'quiz' | 'exam') {
    return this.generateEvaluationUseCase.execute(userId, moduleSlug, type);
  }

  async evaluateAttempt(userId: string, targetId: string, submission: any, type: 'quiz' | 'exam') {
    return this.evaluateAttemptUseCase.execute(userId, targetId, submission, type);
  }

  async getAttemptSummary(userId: string, attemptId: string) {
    return this.getAttemptSummaryUseCase.execute(userId, attemptId);
  }
}
