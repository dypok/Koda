import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LessonAnsweredEvent } from '../../../domain/events/lesson-answered.event';
import { SupabaseService } from '../../../database/supabase.service';

@Injectable()
export class LessonAnsweredListener {
  private readonly logger = new Logger(LessonAnsweredListener.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  @OnEvent('lesson.answered', { async: true })
  async handleLessonAnswered(event: LessonAnsweredEvent): Promise<void> {
    const { payload } = event;
    const client = this.supabaseService.getClient();

    try {
      // 1. Guardar intento en attempts
      const { data: attemptData, error: attemptError } = await client
        .from('attempts')
        .insert({
          user_id: payload.userId,
          lesson_id: payload.lessonId,
          section_id: payload.sectionSlug,
          module_id: payload.moduleSlug,
          course_id: payload.courseSlug,
          language_code: payload.languageSlug,
          status: 'completed',
          is_passed: payload.isCorrect,
          xp_earned: payload.xpEarned,
          duration_seconds: payload.timeSpentSeconds,
          mistakes_count: payload.isCorrect ? 0 : 1,
        })
        .select('id')
        .single();

      if (attemptData && !attemptError) {
        await client.from('attempt_answers').insert({
          attempt_id: attemptData.id,
          question_id: `${payload.lessonId}_q1`,
          question_type: 'SINGLE_CHOICE',
          user_response: payload.selectedOptionIds,
          is_correct: payload.isCorrect,
          time_spent_seconds: payload.timeSpentSeconds,
          xp_awarded: payload.xpEarned,
          feedback_text: payload.feedbackText,
        });
      }

      // 2. Si es incorrecta, upsert en user_mistakes_notebook
      if (!payload.isCorrect) {
        const questionId = `${payload.lessonId}_q1`;
        const { data: existingMistake } = await client
          .from('user_mistakes_notebook')
          .select('id, fail_count')
          .eq('user_id', payload.userId)
          .eq('question_id', questionId)
          .maybeSingle();

        if (existingMistake) {
          await client
            .from('user_mistakes_notebook')
            .update({
              fail_count: (existingMistake.fail_count || 1) + 1,
              is_resolved: false,
              last_failed_at: new Date().toISOString(),
            })
            .eq('id', existingMistake.id);
        } else {
          await client.from('user_mistakes_notebook').insert({
            user_id: payload.userId,
            question_id: questionId,
            lesson_id: payload.lessonId,
            section_slug: payload.sectionSlug,
            module_slug: payload.moduleSlug,
            course_slug: payload.courseSlug,
            track_slug: payload.languageSlug,
            question_type: 'SINGLE_CHOICE',
            question_prompt: payload.prompt,
            user_wrong_answer: payload.selectedOptionIds,
            correct_answer: payload.correctOptionId ? [payload.correctOptionId] : [],
            fail_count: 1,
            is_resolved: false,
            first_failed_at: new Date().toISOString(),
            last_failed_at: new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      this.logger.error(`Error procesando telemetría de lección en background: ${err?.message}`);
    }
  }
}
