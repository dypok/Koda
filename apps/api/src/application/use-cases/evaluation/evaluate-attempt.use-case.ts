import {
  Injectable,
  Logger,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import * as crypto from 'crypto';
import {
  ICurriculumRepository,
  CURRICULUM_REPOSITORY_TOKEN,
} from '@domain/repositories/curriculum.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { ContentBundleService } from '../../../infra/content/content-bundle.service';

export interface EvaluationSubmissionInput {
  answers: Record<string, string>;
  time_spent_seconds?: number;
}

export interface EvaluationResultPayload {
  passed: boolean;
  score: number;
  correct_count: number;
  total_questions: number;
  xp_earned: number;
  attempt_id?: string;
  content_version: string;
}

@Injectable()
export class EvaluateAttemptUseCase {
  private readonly logger = new Logger(EvaluateAttemptUseCase.name);

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly supabaseService: SupabaseService,
    private readonly contentBundleService: ContentBundleService,
  ) {}

  async execute(
    userId: string,
    targetId: string,
    submission: EvaluationSubmissionInput,
    type: 'quiz' | 'exam',
  ): Promise<EvaluationResultPayload> {
    const moduleSlug = targetId;
    const module = await this.curriculumRepository.findModuleBySlug(moduleSlug);
    if (!module) throw new NotFoundException(`Modulo '${moduleSlug}' no encontrado`);

    const course = await this.curriculumRepository.findCourseBySlug(module.courseSlug);
    const languageSlug = course?.trackSlug || 'python';

    const bank = this.contentBundleService.getModuleBank(languageSlug, moduleSlug);

    let correctCount = 0;
    const answersObj = submission.answers || {};
    const totalQuestions = Object.keys(answersObj).length;

    const attemptDetails: Array<{
      question_id: string;
      user_answer: string;
      is_correct: boolean;
      correct_answer?: string;
      hint?: string;
    }> = [];

    // Calcular puntaje
    for (const [qId, ans] of Object.entries(answersObj)) {
      const question = bank.find((q) => q.id === qId);
      if (!question) continue;

      const isCorrect = question.correct_option_id === ans;
      if (isCorrect) correctCount++;

      attemptDetails.push({
        question_id: qId,
        user_answer: String(ans),
        is_correct: isCorrect,
        correct_answer: question.correct_option_id,
        hint: question.hint,
      });
    }

    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const threshold = type === 'exam' ? 80 : 70;
    const passed = scorePercentage >= threshold;
    const xpReward = type === 'exam' ? 100 : 25;
    const earnedXp = passed ? xpReward : 0;

    const contentVersionHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(bank))
      .digest('hex');

    const client = this.supabaseService.getClient();

    // 1. Persistir intento de evaluación
    const { data: attemptData, error: attemptError } = await client
      .from('attempts')
      .insert({
        user_id: userId,
        module_id: moduleSlug,
        course_id: course?.slug,
        language_code: languageSlug,
        status: 'completed',
        is_passed: passed,
        xp_earned: earnedXp,
        duration_seconds: submission.time_spent_seconds || 0,
        mistakes_count: totalQuestions - correctCount,
        content_version: contentVersionHash,
        attempt_type: type,
      })
      .select('id')
      .single();

    if (attemptData && !attemptError) {
      // 2. Inserción masiva en lote de attempt_answers (1 sola llamada a PostgREST)
      const answersToInsert = attemptDetails.map((d) => ({
        attempt_id: attemptData.id,
        question_id: d.question_id,
        user_response: [d.user_answer],
        is_correct: d.is_correct,
        feedback_text: d.is_correct ? 'Correcto' : d.hint,
      }));

      if (answersToInsert.length > 0) {
        await client.from('attempt_answers').insert(answersToInsert);
      }

      // 3. Inserción masiva en lote de errores en user_mistakes_notebook (ANTI N+1)
      const wrongAnswers = attemptDetails.filter((d) => !d.is_correct);
      if (wrongAnswers.length > 0) {
        const mistakeRecords = wrongAnswers.map((detail) => ({
          user_id: userId,
          question_id: detail.question_id,
          module_slug: moduleSlug,
          track_slug: languageSlug,
          question_type: 'single_choice',
          user_wrong_answer: [detail.user_answer],
          correct_answer: [detail.correct_answer],
          fail_count: 1,
          is_resolved: false,
          first_failed_at: new Date().toISOString(),
          last_failed_at: new Date().toISOString(),
        }));

        await client.from('user_mistakes_notebook').insert(mistakeRecords);
      }
    }

    // 4. Si aprobó el examen, invocar RPC para otorgar XP
    if (type === 'exam' && passed) {
      try {
        await client.rpc('fn_award_xp', { p_user_id: userId, p_xp_amount: earnedXp });
      } catch (e) {
        this.logger.warn(`RPC fn_award_xp no disponible: ${(e as Error).message}`);
      }
    }

    return {
      passed,
      score: scorePercentage,
      correct_count: correctCount,
      total_questions: totalQuestions,
      xp_earned: earnedXp,
      attempt_id: attemptData?.id,
      content_version: contentVersionHash,
    };
  }
}
