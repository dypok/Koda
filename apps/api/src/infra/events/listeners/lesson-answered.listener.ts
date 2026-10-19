import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LessonAnsweredEvent } from '../../../domain/events/lesson-answered.event';
import { PrismaService } from '../../database/postgres/prisma.service';

@Injectable()
export class LessonAnsweredListener {
  private readonly logger = new Logger(LessonAnsweredListener.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('lesson.answered', { async: true })
  async handleLessonAnswered(event: LessonAnsweredEvent): Promise<void> {
    const { payload } = event;
    const now = new Date();

    try {
      // 1. Guardar intento en attempts
      await this.prisma.attempt.create({
        data: {
          userId: payload.userId,
          sectionSlug: payload.sectionSlug,
          lessonId: payload.lessonId,
          mode: 'standard',
          isPassed: payload.isCorrect,
          score: payload.isCorrect ? 100 : 0,
          starsAwarded: 0,
          xpAwarded: payload.xpEarned || 0,
          timeSpentSeconds: payload.timeSpentSeconds || 0,
          answersPayload: payload.selectedOptionIds || [],
          startedAt: now,
          completedAt: now,
          attemptAnswers: {
            create: {
              questionId: `${payload.lessonId}_q1`,
              questionVersion: 1,
              givenAnswer: payload.selectedOptionIds || [],
              isCorrect: payload.isCorrect,
              executionTimeMs: (payload.timeSpentSeconds || 0) * 1000,
            },
          },
        },
      });

      // 2. Si la respuesta fue correcta: actualizar racha, totalXp y lastStudyDate en users y streaks
      if (payload.isCorrect) {
        const user = await this.prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            totalXp: true,
            currentStreak: true,
            longestStreak: true,
            streakFreezeCount: true,
            lastStudyDate: true,
            timezone: true,
          },
        });

        if (user) {
          const userTz = user.timezone || 'America/Bogota';
          const formatCalDate = (d: Date | null | undefined, tz: string) => {
            if (!d) return null;
            try {
              return new Intl.DateTimeFormat('en-CA', {
                timeZone: tz,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).format(d);
            } catch {
              return d.toISOString().slice(0, 10);
            }
          };

          const todayStr = formatCalDate(now, userTz);
          const lastStudyStr = formatCalDate(user.lastStudyDate, userTz);

          let currentStreak = user.currentStreak ?? 0;
          let longestStreak = user.longestStreak ?? 0;
          let streakFreezeCount = user.streakFreezeCount ?? 1;
          let streakFreezeUsedAt: Date | null = null;

          if (!lastStudyStr) {
            currentStreak = 1;
            longestStreak = Math.max(1, longestStreak);
          } else if (lastStudyStr === todayStr) {
            if (currentStreak === 0) currentStreak = 1;
            longestStreak = Math.max(longestStreak, currentStreak);
          } else {
            const dToday = new Date(`${todayStr}T00:00:00Z`);
            const dLast = new Date(`${lastStudyStr}T00:00:00Z`);
            const diffDays = Math.round((dToday.getTime() - dLast.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              currentStreak += 1;
              if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
              }
              if (currentStreak % 7 === 0 && streakFreezeCount < 2) {
                streakFreezeCount += 1;
              }
            } else if (diffDays === 2 && streakFreezeCount > 0) {
              streakFreezeCount -= 1;
              streakFreezeUsedAt = now;
              currentStreak += 1;
              if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
              }
            } else {
              currentStreak = 1;
            }
          }

          await this.prisma.user.update({
            where: { id: payload.userId },
            data: {
              totalXp: (payload.xpEarned && payload.xpEarned > 0) ? { increment: payload.xpEarned } : undefined,
              currentStreak,
              longestStreak,
              streakFreezeCount,
              lastStudyDate: now,
            },
          });

          // Registrar en tabla streaks
          const todayDateOnly = new Date(now.toISOString().slice(0, 10));
          try {
            await this.prisma.streak.upsert({
              where: {
                userId_activityDate: {
                  userId: payload.userId,
                  activityDate: todayDateOnly,
                },
              },
              create: {
                userId: payload.userId,
                activityDate: todayDateOnly,
                timezone: userTz,
                activityCount: 1,
                lessonsCompletedCount: 1,
                xpEarnedToday: payload.xpEarned || 0,
                dailyGoalMet: true,
                freezeUsed: streakFreezeUsedAt !== null,
                firstActivityAt: now,
                lastActivityAt: now,
              },
              update: {
                activityCount: { increment: 1 },
                lessonsCompletedCount: { increment: 1 },
                xpEarnedToday: { increment: payload.xpEarned || 0 },
                dailyGoalMet: true,
                freezeUsed: streakFreezeUsedAt !== null ? true : undefined,
                lastActivityAt: now,
              },
            });
          } catch (streakErr) {
            this.logger.warn(`Error al upsert en streaks para user ${payload.userId}: ${streakErr}`);
          }
        }
      }

      // 3. Si es incorrecta, upsert en user_mistakes_notebook
      if (!payload.isCorrect) {
        const questionId = `${payload.lessonId}_q1`;
        try {
          await this.prisma.userMistakesNotebook.upsert({
            where: {
              userId_questionId: {
                userId: payload.userId,
                questionId,
              },
            },
            create: {
              userId: payload.userId,
              trackSlug: payload.languageSlug || 'python',
              courseSlug: payload.courseSlug || 'python-intermedio',
              moduleSlug: payload.moduleSlug || 'variables',
              sectionSlug: payload.sectionSlug,
              lessonId: payload.lessonId,
              questionId,
              questionVersion: 1,
              failCount: 1,
              isResolved: false,
              firstFailedAt: now,
              lastFailedAt: now,
            },
            update: {
              failCount: { increment: 1 },
              isResolved: false,
              lastFailedAt: now,
            },
          });
        } catch (mistakeErr) {
          this.logger.warn(`Error al registrar mistake en notebook: ${mistakeErr}`);
        }
      }
    } catch (err: any) {
      this.logger.error(`Error procesando telemetría de lección en background: ${err?.message}`);
    }
  }
}

