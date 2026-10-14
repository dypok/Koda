import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GenerateEvaluationUseCase } from '../../../application/use-cases/evaluation/generate-evaluation.use-case';
import { EvaluateAttemptUseCase } from '../../../application/use-cases/evaluation/evaluate-attempt.use-case';
import { GetAttemptSummaryUseCase } from '../../../application/use-cases/evaluation/get-attempt-summary.use-case';
import {
  GeneratedEvaluationPayloadType,
  SubmitEvaluationAttemptInput,
  EvaluationAttemptResultPayloadType,
  AttemptSummaryPayloadType,
} from './types/evaluation.type';

@Resolver()
export class EvaluationResolver {
  constructor(
    private readonly generateEvaluationUseCase: GenerateEvaluationUseCase,
    private readonly evaluateAttemptUseCase: EvaluateAttemptUseCase,
    private readonly getAttemptSummaryUseCase: GetAttemptSummaryUseCase,
  ) {}

  @Query(() => GeneratedEvaluationPayloadType, {
    name: 'generateEvaluation',
    description: 'Genera un quiz o examen interactivo con muestreo balanceado desde MongoDB/Memory Bundle (ADR-012)',
  })
  @UseGuards(SupabaseAuthGuard)
  async generateEvaluation(
    @Args('moduleId', { type: () => String }) moduleId: string,
    @Args('type', { type: () => String }) type: 'quiz' | 'exam',
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<GeneratedEvaluationPayloadType> {
    const result = await this.generateEvaluationUseCase.execute(authUser.id, moduleId, type);
    return {
      evaluation_type: result.evaluation_type,
      module_id: result.module_id,
      total_questions: result.total_questions,
      questions: result.questions.map((q) => ({
        id: q.id,
        concept_id: q.concept_id,
        type: q.type,
        difficulty: q.difficulty,
        prompt: q.prompt,
        options: q.options?.map((o) => ({ id: o.id, text: o.text })),
        code_snippet: q.code_snippet,
      })),
    };
  }

  @Mutation(() => EvaluationAttemptResultPayloadType, {
    name: 'submitEvaluationAttempt',
    description: 'Envía y califica atómicamente un intento de Quiz o Examen en PostgreSQL sin cascada N+1 (ADR-012)',
  })
  @UseGuards(SupabaseAuthGuard)
  async submitEvaluationAttempt(
    @Args('input', { type: () => SubmitEvaluationAttemptInput }) input: SubmitEvaluationAttemptInput,
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<EvaluationAttemptResultPayloadType> {
    // Transformar array de respuestas a mapa para el caso de uso
    const answersRecord: Record<string, string> = {};
    for (const ans of input.answers) {
      answersRecord[ans.question_id] = ans.selected_option_id;
    }

    const evaluationType = input.evaluation_type === 'exam' ? 'exam' : 'quiz';

    return this.evaluateAttemptUseCase.execute(
      authUser.id,
      input.target_module_id,
      {
        answers: answersRecord,
        time_spent_seconds: input.time_spent_seconds,
      },
      evaluationType,
    );
  }

  @Query(() => AttemptSummaryPayloadType, {
    name: 'getEvaluationAttemptSummary',
    description: 'Extrae la revisión formativa de un intento calificado post-evaluación',
  })
  @UseGuards(SupabaseAuthGuard)
  async getEvaluationAttemptSummary(
    @Args('attemptId', { type: () => String }) attemptId: string,
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<AttemptSummaryPayloadType> {
    return this.getAttemptSummaryUseCase.execute(authUser.id, attemptId);
  }
}
