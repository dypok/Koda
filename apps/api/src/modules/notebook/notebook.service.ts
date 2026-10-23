import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { MistakesNotebookItem } from '@koda/types';
import { PrismaService } from '@infra/database/postgres/prisma.service';
import { Lesson, LessonDocument } from '../../database/schemas';

const XP_RECOVERY_REWARD = 5;
const MIN_EASE_FACTOR = 1.3;

@Injectable()
export class NotebookService {
  private readonly logger = new Logger(NotebookService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async getMistakes(userId: string): Promise<MistakesNotebookItem[]> {
    try {
      const rows = await this.prisma.userMistakesNotebook.findMany({
        where: {
          userId,
          isResolved: false,
        },
        orderBy: {
          lastFailedAt: 'desc',
        },
      });

      const lessonSlugs = [...new Set(rows.map((r) => r.lessonId).filter((v): v is string => !!v))];
      const lessons = lessonSlugs.length
        ? await this.lessonModel.find({ slug: { $in: lessonSlugs } }).lean()
        : [];
      const lessonBySlug = new Map(lessons.map((l) => [l.slug, l]));

      return rows.map((row) => {
        const lesson = row.lessonId ? lessonBySlug.get(row.lessonId) : undefined;
        return {
          id: row.id,
          user_id: row.userId,
          question_id: row.questionId,
          track_slug: row.trackSlug,
          course_slug: row.courseSlug,
          module_slug: row.moduleSlug,
          section_slug: row.sectionSlug ?? undefined,
          lesson_title: lesson?.title ?? row.lessonId ?? 'Lección',
          prompt: lesson?.item_2_quiz?.prompt ?? '',
          code_context: lesson?.item_1_console?.initial_code,
          error_count: row.failCount,
          is_resolved: row.isResolved,
          interval_days: row.intervalDays,
          ease_factor: Number(row.easeFactor),
          repetition_count: row.repetitionCount,
          next_review_at: row.nextReviewAt.toISOString(),
          created_at: row.firstFailedAt.toISOString(),
          last_failed_at: row.lastFailedAt.toISOString(),
        };
      });
    } catch (error: any) {
      this.logger.error(`Error consultando user_mistakes_notebook: ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener el cuaderno de errores.');
    }
  }

  /**
   * Marca un ejercicio como remediado, avanza el algoritmo SuperMemo SM-2 para
   * programar el siguiente repaso y otorga +5 XP de recuperación de forma
   * atómica e idempotente vía transacción Prisma en Postgres.
   */
  async resolveMistake(userId: string, questionId: string): Promise<{ success: boolean; xp_reward: number }> {
    try {
      const mistake = await this.prisma.userMistakesNotebook.findFirst({
        where: {
          userId,
          questionId,
        },
      });

      if (!mistake) {
        throw new NotFoundException(`Error con question_id '${questionId}' no encontrado en el cuaderno.`);
      }

      if (mistake.isResolved) {
        return { success: true, xp_reward: 0 };
      }

      // SM-2: 1er repaso correcto -> 1 día; 2do -> 6 días; siguientes -> intervalo previo * ease factor.
      const previousInterval = mistake.intervalDays;
      const previousRepetitions = mistake.repetitionCount;
      const newEaseFactor = Math.max(MIN_EASE_FACTOR, Number(mistake.easeFactor) + 0.1);
      const newRepetitionCount = previousRepetitions + 1;
      const newIntervalDays =
        previousRepetitions === 0 ? 1 : previousRepetitions === 1 ? 6 : Math.round(previousInterval * newEaseFactor);
      const nextReviewAt = new Date(Date.now() + newIntervalDays * 24 * 60 * 60 * 1000);

      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { totalXp: true },
      });
      const balanceAfter = (currentUser?.totalXp ?? 0) + XP_RECOVERY_REWARD;

      await this.prisma.$transaction([
        this.prisma.userMistakesNotebook.update({
          where: { id: mistake.id },
          data: {
            isResolved: true,
            resolvedAt: new Date(),
            xpRecovered: XP_RECOVERY_REWARD,
            easeFactor: newEaseFactor,
            repetitionCount: newRepetitionCount,
            intervalDays: newIntervalDays,
            nextReviewAt,
          },
        }),
        this.prisma.user.update({
          where: { id: userId },
          data: {
            totalXp: { increment: XP_RECOVERY_REWARD },
          },
        }),
        this.prisma.xpTransaction.create({
          data: {
            user: { connect: { id: userId } },
            amount: XP_RECOVERY_REWARD,
            balanceAfter,
            reason: 'mistake_remediated',
            referenceId: mistake.id,
            referenceType: 'mistake',
            idempotencyKey: `mistake_remediated:${mistake.id}`,
          },
        }),
      ]);

      return { success: true, xp_reward: XP_RECOVERY_REWARD };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error actualizando cuaderno de errores: ${error.message}`);
      throw new InternalServerErrorException('No se pudo remediar el error.');
    }
  }
}
