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
    const record = await this.prisma.userSectionStars.findUnique({
      where: {
        userId_sectionId: {
          userId,
          sectionId,
        },
      },
    });

    return record ? ProgressMapper.sectionStarsToDomain(record) : null;
  }

  async findSectionStarsByUserAndModule(userId: string, moduleId: string): Promise<SectionStarsEntity[]> {
    const records = await this.prisma.userSectionStars.findMany({
      where: {
        userId,
        moduleId,
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
    const { userId, sectionId, moduleId, courseId, accuracyPercentage } = params;

    return this.prisma.$transaction(async (tx) => {
      // 1. Obtener o inicializar entidad de estrellas de sección
      const existingRecord = await tx.userSectionStars.findUnique({
        where: {
          userId_sectionId: { userId, sectionId },
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
      const attemptResult = sectionStars.recordAttempt(accuracyPercentage);

      // 3. Persistir user_section_stars
      const savedStarsRecord = await tx.userSectionStars.upsert({
        where: {
          userId_sectionId: { userId, sectionId },
        },
        create: {
          userId,
          sectionId,
          moduleId,
          starsEarned: sectionStars.starsEarned,
          bestAccuracyScore: new Prisma.Decimal(sectionStars.bestAccuracyScore),
          totalAttemptsCount: sectionStars.totalAttemptsCount,
          completedAt: sectionStars.completedAt,
        },
        update: {
          starsEarned: sectionStars.starsEarned,
          bestAccuracyScore: new Prisma.Decimal(sectionStars.bestAccuracyScore),
          totalAttemptsCount: sectionStars.totalAttemptsCount,
          completedAt: sectionStars.completedAt,
          updatedAt: new Date(),
        },
      });

      // 4. Actualizar XP acumulado del usuario atómicamente si ganó XP
      let updatedUserTotalXp = 0;
      if (attemptResult.xpAwarded > 0) {
        const user = await tx.user.update({
          where: { id: userId },
          data: {
            totalXp: { increment: attemptResult.xpAwarded },
          },
          select: { totalXp: true },
        });
        updatedUserTotalXp = user.totalXp;
      } else {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { totalXp: true },
        });
        updatedUserTotalXp = user?.totalXp ?? 0;
      }

      // 5. Actualizar progreso del módulo
      const moduleStars = await tx.userSectionStars.findMany({
        where: { userId, moduleId },
      });

      const totalEarnedStars = moduleStars.reduce((sum, s) => sum + s.starsEarned, 0);
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
        userTotalXp: updatedUserTotalXp,
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
        sectionId: { in: prerequisiteSectionIds },
        starsEarned: { gte: 1 }, // Aprobado con al menos 1 estrella
      },
      select: { sectionId: true },
    });

    const passedIds = new Set(records.map((r) => r.sectionId));
    return prerequisiteSectionIds.every((id) => passedIds.has(id));
  }
}
