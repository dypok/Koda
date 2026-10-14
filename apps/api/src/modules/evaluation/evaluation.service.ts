import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as crypto from 'crypto';
import {
  ICurriculumRepository,
  CURRICULUM_REPOSITORY_TOKEN,
} from '@domain/repositories/curriculum.repository';
import { SupabaseService } from '../../database/supabase.service';
import { ContentBundleService, BankQuestion } from '../../infra/content/content-bundle.service';

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly supabaseService: SupabaseService,
    private readonly contentBundleService: ContentBundleService,
  ) {}

  private sampleQuestions(questions: BankQuestion[], config: Record<string, number>): BankQuestion[] {
    const sampled: BankQuestion[] = [];
    for (const [type, count] of Object.entries(config)) {
      const pool = questions.filter((q) => q.type === type);
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      sampled.push(...shuffled.slice(0, count));
    }

    const totalRequired = Object.values(config).reduce((a, b) => a + b, 0);
    if (sampled.length < totalRequired) {
      const remaining = totalRequired - sampled.length;
      const unused = questions.filter((q) => !sampled.includes(q));
      sampled.push(...[...unused].sort(() => 0.5 - Math.random()).slice(0, remaining));
    }

    return sampled.sort(() => 0.5 - Math.random());
  }

  /**
   * Genera un intento de evaluación (Quiz o Examen) obteniendo las preguntas desde
   * ContentBundleService (en memoria, precalentado) y eliminando respuestas correctas para evitar spoilers.
   */
  async generateEvaluation(userId: string, moduleSlug: string, type: 'quiz' | 'exam') {
    const module = await this.curriculumRepository.findModuleBySlug(moduleSlug);
    if (!module) throw new NotFoundException(`Modulo ${moduleSlug} no encontrado.`);

    const course = await this.curriculumRepository.findCourseBySlug(module.courseSlug);
    const languageSlug = course?.trackSlug || 'python';

    const compositions = this.contentBundleService.getComposition(languageSlug);
    const config = type === 'quiz' ? compositions?.quiz : compositions?.exam;

    if (!config) {
      throw new BadRequestException('Configuración de evaluación no encontrada');
    }

    const bank = this.contentBundleService.getModuleBank(languageSlug, moduleSlug);
    if (!bank || bank.length === 0) {
      throw new BadRequestException('Banco de preguntas vacío para este módulo');
    }

    const selectedQuestions = this.sampleQuestions(bank, config);

    // Ocultar respuestas correctas y pistas antes de enviar al cliente
    const publicQuestions = selectedQuestions.map((q) => {
      const { correct_option_id, hint, ...rest } = q;
      return rest;
    });

    return {
      evaluation_type: type,
      module_id: moduleSlug,
      total_questions: publicQuestions.length,
      questions: publicQuestions,
    };
  }

  /**
   * Evalúa el intento de examen/quiz de forma atómica.
   * Erradica la cascada N+1 ejecutando un único 'bulk insert' en user_mistakes_notebook.
   */
  async evaluateAttempt(userId: string, targetId: string, submission: any, type: 'quiz' | 'exam') {
    const moduleSlug = targetId;
    const module = await this.curriculumRepository.findModuleBySlug(moduleSlug);
    if (!module) throw new NotFoundException('Modulo no encontrado');

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

    // 1. Guardar intento
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
      // 2. Bulk insert masivo de respuestas del intento (1 sola petición HTTP)
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

      // 3. Bulk insert masivo de fallos en el cuaderno de errores (ANTI N+1)
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

        // Inserción en bloque masiva: 1 solo round-trip a PostgREST
        await client.from('user_mistakes_notebook').insert(mistakeRecords);
      }
    }

    // Si aprobó examen, otorgar XP por RPC
    if (type === 'exam' && passed) {
      try {
        await client.rpc('fn_award_xp', { p_user_id: userId, p_xp_amount: earnedXp });
      } catch (e) {
        this.logger.warn(`RPC fn_award_xp omitido o no disponible: ${(e as Error).message}`);
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

  /**
   * Extrae el resumen del intento calificado de la base de datos (PostgreSQL),
   * inyectando las explicaciones formativas desde el ContentBundleService en memoria.
   */
  async getAttemptSummary(userId: string, attemptId: string) {
    const client = this.supabaseService.getClient();
    const { data: attempt } = await client
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', userId)
      .single();

    if (!attempt) throw new NotFoundException('Intento no encontrado');

    const { data: answers } = await client
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', attemptId);

    const bank = this.contentBundleService.getModuleBank(attempt.language_code, attempt.module_id);

    const summary = (answers || []).map((ans: any) => {
      const q = bank.find((x) => x.id === ans.question_id);
      return {
        question_id: ans.question_id,
        prompt: q?.prompt,
        user_answer: ans.user_response?.[0],
        correct_answer: q?.correct_option_id,
        is_correct: ans.is_correct,
        explanation: q?.hint,
      };
    });

    return {
      attempt_id: attempt.id,
      passed: attempt.is_passed,
      score: summary.length > 0 ? (summary.filter((s: any) => s.is_correct).length / summary.length) * 100 : 0,
      details: summary,
    };
  }
}
