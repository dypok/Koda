import { User as PrismaUser } from '@prisma/client';
import {
  UserEntity,
  UserRole,
  UserStatus,
  ExperienceLevel,
  LearningStyle,
  DailyGoalId,
  DocumentType,
} from '@domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity({
      id: raw.id,
      email: raw.email,
      role: (raw.role as UserRole) || 'user',
      status: (raw.status as UserStatus) || 'active',
      displayName: raw.displayName,
      avatarUrl: raw.avatarUrl,
      avatarObjectKey: raw.avatarObjectKey,
      documentNumber: raw.documentNumber,
      documentType: raw.documentType ? (raw.documentType as DocumentType) : null,
      bio: raw.bio,
      timezone: raw.timezone,
      locale: raw.locale,
      onboardingCompleted: (raw as any).onboardingCompleted ?? false,
      initialLanguageSlug: raw.initialLanguageSlug,
      experienceLevel: (raw.experienceLevel as ExperienceLevel) || 'beginner',
      learningStyle: (raw.learningStyle as LearningStyle) || 'hands-on',
      dailyGoalId: (raw.dailyGoalId as DailyGoalId) || 'regular',
      dailyGoalMinutes: raw.dailyGoalMinutes,
      totalXp: raw.totalXp,
      currentLevel: raw.currentLevel,
      currentStreak: raw.currentStreak,
      longestStreak: raw.longestStreak,
      streakFreezeCount: raw.streakFreezeCount,
      totalStudyTimeSeconds: raw.totalStudyTimeSeconds,
      lastStudyDate: raw.lastStudyDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: UserEntity): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    const p = entity.toPrimitives();
    return {
      id: p.id,
      email: p.email,
      role: p.role,
      status: p.status,
      displayName: p.displayName,
      avatarUrl: p.avatarUrl ?? null,
      avatarObjectKey: p.avatarObjectKey ?? null,
      documentNumber: p.documentNumber ?? null,
      documentType: p.documentType ?? null,
      bio: p.bio ?? null,
      timezone: p.timezone,
      locale: p.locale,
      onboardingCompleted: p.onboardingCompleted ?? false,
      initialLanguageSlug: p.initialLanguageSlug,
      experienceLevel: p.experienceLevel,
      learningStyle: p.learningStyle,
      dailyGoalId: p.dailyGoalId,
      dailyGoalMinutes: p.dailyGoalMinutes,
      totalXp: p.totalXp,
      currentLevel: p.currentLevel,
      currentStreak: p.currentStreak,
      longestStreak: p.longestStreak,
      streakFreezeCount: p.streakFreezeCount,
      totalStudyTimeSeconds: p.totalStudyTimeSeconds,
      lastStudyDate: p.lastStudyDate ?? null,
    } as any;
  }
}