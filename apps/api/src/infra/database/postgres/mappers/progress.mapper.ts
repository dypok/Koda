import { UserSectionStars as PrismaUserSectionStars, UserModuleProgress as PrismaUserModuleProgress } from '@prisma/client';
import { SectionStarsEntity } from '@domain/entities/section-stars.entity';
import { ModuleProgressEntity, ModuleProgressStatus } from '@domain/entities/module-progress.entity';

export class ProgressMapper {
  public static sectionStarsToDomain(raw: PrismaUserSectionStars): SectionStarsEntity {
    return new SectionStarsEntity({
      id: raw.id,
      userId: raw.userId,
      sectionId: raw.sectionSlug,
      moduleId: raw.moduleSlug,
      starsEarned: raw.maxStarsEarned,
      totalAttemptsCount: raw.attemptsCount,
      completedAt: raw.firstEarnedAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static moduleProgressToDomain(raw: PrismaUserModuleProgress): ModuleProgressEntity {
    return new ModuleProgressEntity({
      id: raw.id,
      userId: raw.userId,
      moduleId: raw.moduleSlug,
      courseId: raw.courseSlug,
      languageCode: raw.trackSlug,
      status: raw.status as ModuleProgressStatus,
      starsEarnedPercentage: raw.starsPercentage ? Number(raw.starsPercentage) : 0,
      isUnlocked: raw.isUnlocked,
      unlockedByDiagnostic: false,
      completedAt: raw.completedAt,
      updatedAt: raw.updatedAt,
    });
  }
}

