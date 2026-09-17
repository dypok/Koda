import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { MistakesNotebookItem } from '@koda/types';
import { SupabaseService } from '../../database/supabase.service';
import { Lesson, LessonDocument } from '../../database/schemas';

interface MistakeRow {
  id: string;
  user_id: string;
  track_slug: string;
  course_slug: string;
  module_slug: string;
  section_slug: string | null;
  lesson_id: string | null;
  question_id: string;
  fail_count: number;
  is_resolved: boolean;
  interval_days: number;
  ease_factor: number;
  repetition_count: number;
  next_review_at: string;
  first_failed_at: string;
  last_failed_at: string;
}

const XP_RECOVERY_REWARD = 5;
const MIN_EASE_FACTOR = 1.3;

@Injectable()
export class NotebookService {
  private readonly logger = new Logger(NotebookService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async getMistakes(userId: string): Promise<MistakesNotebookItem[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_mistakes_notebook')
      .select(
        'id, user_id, track_slug, course_slug, module_slug, section_slug, lesson_id, question_id, fail_count, is_resolved, interval_days, ease_factor, repetition_count, next_review_at, first_failed_at, last_failed_at',
      )
      .eq('user_id', userId)
      .eq('is_resolved', false)
      .order('last_failed_at', { ascending: false });

    if (error) {
      this.logger.error(`Error consultando user_mistakes_notebook: ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener el cuaderno de errores.');
    }

    const rows = (data ?? []) as MistakeRow[];
    const lessonSlugs = [...new Set(rows.map((r) => r.lesson_id).filter((v): v is string => !!v))];
    const lessons = lessonSlugs.length
      ? await this.lessonModel.find({ slug: { $in: lessonSlugs } }).lean()
      : [];
    const lessonBySlug = new Map(lessons.map((l) => [l.slug, l]));

    return rows.map((row) => {
      const lesson = row.lesson_id ? lessonBySlug.get(row.lesson_id) : undefined;
      return {
        id: row.id,
        user_id: row.user_id,
        question_id: row.question_id,
        track_slug: row.track_slug,
        course_slug: row.course_slug,
        module_slug: row.module_slug,
        section_slug: row.section_slug ?? undefined,
        lesson_title: lesson?.title ?? row.lesson_id ?? 'Lección',
        prompt: lesson?.item_2_quiz?.prompt ?? '',
        code_context: lesson?.item_1_console?.initial_code,
        error_count: row.fail_count,
        is_resolved: row.is_resolved,
        interval_days: row.interval_days,
        ease_factor: Number(row.ease_factor),
        repetition_count: row.repetition_count,
        next_review_at: row.next_review_at,
        created_at: row.first_failed_at,
        last_failed_at: row.last_failed_at,
      };
    });
  }

  /**
   * Marca un ejercicio como remediado, avanza el algoritmo SuperMemo SM-2 para
   * programar el siguiente repaso y otorga +5 XP de recuperación de forma
   * atómica e idempotente vía la función fn_award_xp de Postgres.
   */
  async resolveMistake(userId: string, questionId: string): Promise<{ success: boolean; xp_reward: number }> {
    const client = this.supabaseService.getClient();

    const { data: mistake, error: fetchError } = await client
      .from('user_mistakes_notebook')
      .select('id, ease_factor, repetition_count, interval_days, is_resolved')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .maybeSingle();

    if (fetchError) {
      this.logger.error(`Error buscando error a remediar: ${fetchError.message}`);
      throw new InternalServerErrorException('No se pudo remediar el error.');
    }

    if (!mistake) {
      throw new NotFoundException(`Error con question_id '${questionId}' no encontrado en el cuaderno.`);
    }

    if (mistake.is_resolved) {
      return { success: true, xp_reward: 0 };
    }

    // SM-2: 1er repaso correcto -> 1 día; 2do -> 6 días; siguientes -> intervalo previo * ease factor.
    const previousInterval = mistake.interval_days;
    const previousRepetitions = mistake.repetition_count;
    const newEaseFactor = Math.max(MIN_EASE_FACTOR, Number(mistake.ease_factor) + 0.1);
    const newRepetitionCount = previousRepetitions + 1;
    const newIntervalDays =
      previousRepetitions === 0 ? 1 : previousRepetitions === 1 ? 6 : Math.round(previousInterval * newEaseFactor);
    const nextReviewAt = new Date(Date.now() + newIntervalDays * 24 * 60 * 60 * 1000).toISOString();

    const { error: updateError } = await client
      .from('user_mistakes_notebook')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        xp_recovered: XP_RECOVERY_REWARD,
        ease_factor: newEaseFactor,
        repetition_count: newRepetitionCount,
        interval_days: newIntervalDays,
        next_review_at: nextReviewAt,
      })
      .eq('id', mistake.id);

    if (updateError) {
      this.logger.error(`Error actualizando cuaderno de errores: ${updateError.message}`);
      throw new InternalServerErrorException('No se pudo remediar el error.');
    }

    const { error: xpError } = await client.rpc('fn_award_xp', {
      p_user_id: userId,
      p_amount: XP_RECOVERY_REWARD,
      p_reason: 'mistake_remediated',
      p_reference_id: mistake.id,
      p_reference_type: 'mistake',
      p_idempotency_key: `mistake_remediated:${mistake.id}`,
    });

    if (xpError) {
      this.logger.error(`Error otorgando XP de remediación: ${xpError.message}`);
      throw new InternalServerErrorException('El error se remedió pero no se pudo otorgar el XP de recuperación.');
    }

    return { success: true, xp_reward: XP_RECOVERY_REWARD };
  }
}
