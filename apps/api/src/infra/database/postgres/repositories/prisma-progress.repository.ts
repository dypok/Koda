import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IProgressRepository,
  SaveSectionCompletionParams,
  SaveSectionCompletionResult,
} from '@domain/repositories/progress.repository';
import { SectionStarsEntity } from '@domain/entities/section-stars.entity';
import { ModuleProgressEntity } from '@domain/entities/module-progress.entity';
import { ProgressMapper } from '../mappers/progress.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaProgressRepository implements IProgressRepository {
  private readonly logger = new Logger(PrismaProgressRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findSectionStars(userId: string, sectionId: string): Promise<SectionStarsEntity | null> {
    const record = await this.prisma.userSectionStars.findFirst({
      where: {
        userId,
        sectionSlug: sectionId,
      },
    });

    return record ? ProgressMapper.sectionStarsToDomain(record) : null;
  }

  async findSectionStarsByUserAndModule(userId: string, moduleId: string): Promise<SectionStarsEntity[]> {
    const records = await this.prisma.userSectionStars.findMany({
      where: {
        userId,
        moduleSlug: moduleId,
      },
    });

    return records.map((r) => ProgressMapper.sectionStarsToDomain(r));
  }

  async findAllSectionStarsByUser(userId: string): Promise<SectionStarsEntity[]> {
    const records = await this.prisma.userSectionStars.findMany({
      where: { userId },
    });

    return records.map((r) => ProgressMapper.sectionStarsToDomain(r));
  }

  async findModuleProgress(userId: string, moduleId: string): Promise<ModuleProgressEntity | null> {
    const record = await this.prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
    });

    return record ? ProgressMapper.moduleProgressToDomain(record) : null;
  }

  async findAllModuleProgressByUser(userId: string, courseId?: string): Promise<ModuleProgressEntity[]> {
    const records = await this.prisma.userModuleProgress.findMany({
      where: {
        userId,
        ...(courseId ? { courseId } : {}),
      },
      orderBy: { moduleId: 'asc' },
    });

    return records.map((r) => ProgressMapper.moduleProgressToDomain(r));
  }

  async saveSectionCompletion(params: SaveSectionCompletionParams): Promise<SaveSectionCompletionResult> {
    const { userId, sectionId, moduleId, courseId, accuracyPercentage, targetXp } = params;

    return this.prisma.$transaction(async (tx) => {
      // 1. Obtener o inicializar entidad de estrellas de sección
      const existingRecord = await tx.userSectionStars.findUnique({
        where: {
          userId_courseSlug_moduleSlug_sectionSlug: {
            userId,
            courseSlug: courseId,
            moduleSlug: moduleId,
            sectionSlug: sectionId,
          },
        },
      });

      const sectionStars = existingRecord
        ? ProgressMapper.sectionStarsToDomain(existingRecord)
        : new SectionStarsEntity({
            userId,
            sectionId,
            moduleId,
          });

      // 2. Registrar intento con el algoritmo de estrellas y blindaje histórico
      const attemptResult = sectionStars.recordAttempt(accuracyPercentage, targetXp);

      // 3. Persistir user_section_stars
      const savedStarsRecord = await tx.userSectionStars.upsert({
        where: {
          userId_courseSlug_moduleSlug_sectionSlug: {
            userId,
            courseSlug: courseId,
            moduleSlug: moduleId,
            sectionSlug: sectionId,
          },
        },
        create: {
          userId,
          courseSlug: courseId,
          moduleSlug: moduleId,
          sectionSlug: sectionId,
          maxStarsEarned: Math.max(1, sectionStars.starsEarned),
          attemptsCount: Math.max(1, sectionStars.totalAttemptsCount),
          firstEarnedAt: sectionStars.completedAt || new Date(),
          lastEarnedAt: new Date(),
        },
        update: {
          maxStarsEarned: Math.max(1, sectionStars.starsEarned),
          attemptsCount: Math.max(1, sectionStars.totalAttemptsCount),
          lastEarnedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // 4. Obtener usuario para actualizar XP acumulado y ciclo de racha diario (GAMI-02)
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          totalXp: true,
          currentStreak: true,
          longestStreak: true,
          streakFreezeCount: true,
          lastStudyDate: true,
          timezone: true,
        },
      });

      const userTimezone = existingUser?.timezone || 'America/Bogota';
      const now = new Date();

      const formatCalDate = (d: Date | null | undefined, tz: string): string | null => {
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

      const todayStr = formatCalDate(now, userTimezone);
      const lastStudyStr = formatCalDate(existingUser?.lastStudyDate, userTimezone);

      let currentStreak = existingUser?.currentStreak ?? 0;
      let longestStreak = existingUser?.longestStreak ?? 0;
      let streakFreezeCount = existingUser?.streakFreezeCount ?? 1;
      let streakFreezeUsedAt: Date | null = null;

      if (!lastStudyStr) {
        // Primera lección completada en la plataforma
        currentStreak = 1;
        longestStreak = Math.max(1, longestStreak);
      } else if (lastStudyStr === todayStr) {
        // Ya estudió hoy, la racha activa se preserva sin doble conteo
        if (currentStreak === 0) currentStreak = 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        const dToday = new Date(todayStr + 'T00:00:00Z');
        const dLast = new Date(lastStudyStr + 'T00:00:00Z');
        const diffDays = Math.round((dToday.getTime() - dLast.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Día consecutivo exitoso
          currentStreak += 1;
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
          // Otorgar 1 protector de racha cada 7 días continuos (máximo 2)
          if (currentStreak % 7 === 0 && streakFreezeCount < 2) {
            streakFreezeCount += 1;
          }
        } else if (diffDays === 2 && streakFreezeCount > 0) {
          // Salvado por protector de racha (Streak Freeze)
          streakFreezeCount -= 1;
          streakFreezeUsedAt = now;
          currentStreak += 1;
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
        } else {
          // Racha reiniciada
          currentStreak = 1;
        }
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalXp: attemptResult.xpAwarded > 0 ? { increment: attemptResult.xpAwarded } : undefined,
          currentStreak,
          longestStreak,
          streakFreezeCount,
          lastStudyDate: now,
        },
        select: {
          totalXp: true,
          currentStreak: true,
          longestStreak: true,
          streakFreezeCount: true,
          lastStudyDate: true,
        },
      });

      // Sincronizar tabla relacional streaks si existe
      try {
        await tx.streak.upsert({
          where: { userId },
          create: {
            userId,
            currentStreak,
            longestStreak,
            streakFreezeCount,
            streakFreezeUsedAt,
            lastActivityDate: now,
            isActiveToday: true,
          },
          update: {
            currentStreak,
            longestStreak,
            streakFreezeCount,
            streakFreezeUsedAt: streakFreezeUsedAt ?? undefined,
            lastActivityDate: now,
            isActiveToday: true,
            updatedAt: now,
          },
        });
      } catch {
        // Silencioso si la tabla streaks no está poblada para este usuario
      }

      // 5. Actualizar progreso del módulo
      const moduleStars = await tx.userSectionStars.findMany({
        where: { userId, moduleSlug: moduleId },
      });

      const totalEarnedStars = moduleStars.reduce((sum, s) => sum + s.maxStarsEarned, 0);
      // Asumiendo hasta 8 secciones canónicas (24 estrellas posibles por módulo)
      const maxPossibleModuleStars = 24;
      const starsPercentage = Math.min(100, Math.round((totalEarnedStars / maxPossibleModuleStars) * 100));

      await tx.userModuleProgress.upsert({
        where: {
          userId_moduleId: { userId, moduleId },
        },
        create: {
          userId,
          moduleId,
          courseId,
          languageCode: 'python',
          status: 'in_progress',
          isUnlocked: true,
          score: new Prisma.Decimal(starsPercentage),
        },
        update: {
          score: new Prisma.Decimal(starsPercentage),
          status: starsPercentage >= 70 ? 'completed' : 'in_progress',
          completedAt: starsPercentage >= 70 ? new Date() : undefined,
          updatedAt: new Date(),
        },
      });

      return {
        sectionStars: ProgressMapper.sectionStarsToDomain(savedStarsRecord),
        xpAwarded: attemptResult.xpAwarded,
        isNewlyPassed: attemptResult.isNewlyPassed,
        isNewBest: attemptResult.isNewBest,
        userTotalXp: updatedUser.totalXp,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak,
        streakFreezeCount: updatedUser.streakFreezeCount,
        isActiveToday: true,
      };
    });
  }

  async unlockModule(userId: string, moduleId: string, courseId: string, byDiagnostic = false): Promise<ModuleProgressEntity> {
    const record = await this.prisma.userModuleProgress.upsert({
      where: {
        userId_moduleId: { userId, moduleId },
      },
      create: {
        userId,
        moduleId,
        courseId,
        languageCode: 'python',
        status: byDiagnostic ? 'completed' : 'in_progress',
        isUnlocked: true,
        unlockedByDiagnostic: byDiagnostic,
        score: byDiagnostic ? new Prisma.Decimal(100) : new Prisma.Decimal(0),
        completedAt: byDiagnostic ? new Date() : null,
      },
      update: {
        isUnlocked: true,
        status: byDiagnostic ? 'completed' : 'in_progress',
        unlockedByDiagnostic: byDiagnostic ? true : undefined,
        score: byDiagnostic ? new Prisma.Decimal(100) : undefined,
        completedAt: byDiagnostic ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });


    return ProgressMapper.moduleProgressToDomain(record);
  }

  async checkPrerequisitesMet(userId: string, prerequisiteSectionIds: string[]): Promise<boolean> {
    if (!prerequisiteSectionIds || prerequisiteSectionIds.length === 0) {
      return true;
    }

    const records = await this.prisma.userSectionStars.findMany({
      where: {
        userId,
        sectionSlug: { in: prerequisiteSectionIds },
        maxStarsEarned: { gte: 1 }, // Aprobado con al menos 1 estrella
      },
      select: { sectionSlug: true },
    });

    const passedIds = new Set(records.map((r) => r.sectionSlug));
    return prerequisiteSectionIds.every((id) => passedIds.has(id));
  }
}
