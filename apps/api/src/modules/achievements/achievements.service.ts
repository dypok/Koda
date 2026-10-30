import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infra/database/postgres/prisma.service';
import type {
  AchievementCategory,
  AchievementItem,
  UserAchievementsResponse,
} from '@koda/types';

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene la lista completa de logros para el usuario autenticado,
   * evaluando dinámicamente si califica para nuevos logros no reclamados,
   * otorgándolos con idempotencia y acreditando XP correspondiente.
   */
  async getAchievementsForUser(userId: string): Promise<UserAchievementsResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        totalXp: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    let currentUserXp = user.totalXp ?? 0;

    // 1. Obtener catálogo completo de logros activos
    const allAchievements = await this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { xpReward: 'asc' }],
    });

    // 2. Obtener logros ya desbloqueados por el usuario
    const userUnlocked = await this.prisma.userAchievement.findMany({
      where: { userId },
    });
    const unlockedMap = new Map(userUnlocked.map((ua) => [ua.achievementId, ua]));

    // 3. Obtener métricas de progreso del usuario en paralelo
    const [sectionStars, moduleProgress, resolvedMistakesCount, attempts] =
      await Promise.all([
        this.prisma.userSectionStars.findMany({
          where: { userId },
          select: { maxStarsEarned: true, sectionSlug: true },
        }),
        this.prisma.userModuleProgress.findMany({
          where: { userId },
          select: { starsPercentage: true, masteredAt: true },
        }),
        this.prisma.userMistakesNotebook.count({
          where: { userId, isResolved: true },
        }),
        this.prisma.attempt.findMany({
          where: { userId },
          select: {
            mode: true,
            isPassed: true,
            score: true,
            starsAwarded: true,
            timeSpentSeconds: true,
            sectionSlug: true,
          },
        }),
      ]);

    // Métricas calculadas
    const lessonsCompletedCount = sectionStars.length;
    const streakDays = Math.max(user.currentStreak || 0, user.longestStreak || 0);
    const isProfileCustomized =
      (user.displayName && user.displayName !== 'Estudiante Koda') ||
      (user.avatarUrl && !user.avatarUrl.includes('koda-mascot-cartoon-2d.svg')) ||
      Boolean(user.bio?.trim())
        ? 1
        : 0;
    const stars3Count = sectionStars.filter((s) => s.maxStarsEarned >= 3).length;
    const totalStars = sectionStars.reduce((sum, s) => sum + (s.maxStarsEarned || 0), 0);
    const modulesMastered = moduleProgress.filter(
      (m) => Number(m.starsPercentage) >= 80 || m.masteredAt !== null,
    ).length;
    const flawlessQuizzes = attempts.filter(
      (a) => a.mode === 'quiz' && (Number(a.score) >= 100 || a.starsAwarded >= 3),
    ).length;
    const examsPassed = attempts.filter(
      (a) => (a.mode === 'exam' || a.mode === 'certification') && a.isPassed,
    ).length;
    const apexCleared = attempts.filter(
      (a) => a.sectionSlug?.includes('apex') && a.isPassed,
    ).length;
    const speedDemonCount = attempts.filter(
      (a) =>
        a.timeSpentSeconds > 0 &&
        a.timeSpentSeconds <= 60 &&
        a.isPassed &&
        Number(a.score) >= 100,
    ).length;

    const newlyUnlocked: AchievementItem[] = [];
    const items: AchievementItem[] = [];

    // 4. Evaluar cada logro
    for (const ach of allAchievements) {
      const targetValue = ach.conditionValue ?? 1;
      let currentValue = 0;

      switch (ach.conditionType) {
        case 'lessons_completed':
          currentValue = lessonsCompletedCount;
          break;
        case 'streak_days':
          currentValue = streakDays;
          break;
        case 'total_xp':
          currentValue = currentUserXp;
          break;
        case 'profile_customized':
          currentValue = isProfileCustomized;
          break;
        case 'stars_3_count':
          currentValue = stars3Count;
          break;
        case 'total_stars':
          currentValue = totalStars;
          break;
        case 'modules_mastered':
          currentValue = modulesMastered;
          break;
        case 'mistakes_resolved':
          currentValue = resolvedMistakesCount;
          break;
        case 'quiz_flawless':
          currentValue = flawlessQuizzes;
          break;
        case 'exams_passed':
          currentValue = examsPassed;
          break;
        case 'apex_cleared':
          currentValue = apexCleared;
          break;
        case 'speed_demon':
          currentValue = speedDemonCount;
          break;
        default:
          currentValue = 0;
      }

      const existingRecord = unlockedMap.get(ach.id);
      let isUnlocked = Boolean(existingRecord);
      let unlockedAt = existingRecord?.unlockedAt?.toISOString();

      // Desbloquear si cumple la condición y aún no estaba desbloqueado
      if (!isUnlocked && currentValue >= targetValue) {
        try {
          const now = new Date();
          const xpReward = ach.xpReward ?? 0;
          const nextXp = currentUserXp + xpReward;

          await this.prisma.$transaction(async (tx) => {
            await tx.userAchievement.create({
              data: {
                userId,
                achievementId: ach.id,
                unlockedAt: now,
                metadata: {
                  code: ach.code,
                  conditionType: ach.conditionType,
                  conditionValue: targetValue,
                  metricValue: currentValue,
                  awardedAt: now.toISOString(),
                },
              },
            });

            if (xpReward > 0) {
              await tx.user.update({
                where: { id: userId },
                data: { totalXp: { increment: xpReward } },
              });

              await tx.xpTransaction.create({
                data: {
                  userId,
                  amount: xpReward,
                  balanceAfter: nextXp,
                  reason: 'achievement_unlocked',
                  referenceId: ach.code,
                  referenceType: 'achievement',
                  idempotencyKey: `achievement:${userId}:${ach.code}`,
                },
              });
            }
          });

          currentUserXp = nextXp;
          isUnlocked = true;
          unlockedAt = now.toISOString();

          const unlockedItem: AchievementItem = {
            id: ach.id,
            code: ach.code,
            title: ach.title,
            description: ach.description,
            icon_name: ach.iconName || 'Trophy',
            category: ach.category as AchievementCategory,
            xp_reward: ach.xpReward,
            condition_type: ach.conditionType ?? undefined,
            condition_value: targetValue,
            is_unlocked: true,
            unlocked_at: unlockedAt,
            progress_percentage: 100,
            current_value: Math.max(currentValue, targetValue),
            target_value: targetValue,
          };

          newlyUnlocked.push(unlockedItem);
        } catch (err: any) {
          this.logger.warn(
            `Error al otorgar logro ${ach.code} a usuario ${userId}: ${err?.message}`,
          );
        }
      }

      const progressPercentage = isUnlocked
        ? 100
        : Math.min(99, Math.round((currentValue / Math.max(1, targetValue)) * 100));

      items.push({
        id: ach.id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        icon_name: ach.iconName || 'Trophy',
        category: ach.category as AchievementCategory,
        xp_reward: ach.xpReward,
        condition_type: ach.conditionType ?? undefined,
        condition_value: targetValue,
        is_unlocked: isUnlocked,
        unlocked_at: unlockedAt,
        progress_percentage: progressPercentage,
        current_value: isUnlocked ? Math.max(currentValue, targetValue) : currentValue,
        target_value: targetValue,
      });
    }

    const unlockedCount = items.filter((i) => i.is_unlocked).length;
    const totalXpEarned = items
      .filter((i) => i.is_unlocked)
      .reduce((sum, i) => sum + i.xp_reward, 0);

    return {
      achievements: items,
      newly_unlocked: newlyUnlocked,
      stats: {
        total: items.length,
        unlocked_count: unlockedCount,
        total_xp_earned: totalXpEarned,
      },
    };
  }
}
