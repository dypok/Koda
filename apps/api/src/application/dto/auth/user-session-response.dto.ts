import { UserEntity } from '@domain/entities/user.entity';

export class UserSessionResponseDto {
  id: string;
  email: string;
  role: string;
  status: string;
  displayName: string;
  avatarUrl?: string | null;
  avatarObjectKey?: string | null;
  documentNumberMasked?: string | null;
  documentType?: string | null;
  bio?: string | null;
  timezone: string;
  locale: string;

  // Onboarding
  initialLanguageSlug: string;
  experienceLevel: string;
  learningStyle: string;
  dailyGoalId: string;
  dailyGoalMinutes: number;

  // Gamification O(1)
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezeCount: number;
  totalStudyTimeSeconds: number;
  lastStudyDate?: string | null;
  createdAt: string;

  static fromEntity(user: UserEntity): UserSessionResponseDto {
    const dto = new UserSessionResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.status = user.status;
    dto.displayName = user.displayName;
    dto.avatarUrl = user.avatarUrl;
    dto.avatarObjectKey = user.avatarObjectKey;
    dto.documentNumberMasked = user.maskedDocumentNumber;
    dto.documentType = user.documentType;
    dto.bio = user.bio;
    dto.timezone = user.timezone;
    dto.locale = user.locale;
    dto.initialLanguageSlug = user.initialLanguageSlug;
    dto.experienceLevel = user.experienceLevel;
    dto.learningStyle = user.learningStyle;
    dto.dailyGoalId = user.dailyGoalId;
    dto.dailyGoalMinutes = user.dailyGoalMinutes;
    dto.totalXp = user.totalXp;
    dto.currentLevel = user.currentLevel;
    dto.currentStreak = user.currentStreak;
    dto.longestStreak = user.longestStreak;
    dto.streakFreezeCount = user.streakFreezeCount;
    dto.totalStudyTimeSeconds = user.totalStudyTimeSeconds;
    dto.lastStudyDate = user.lastStudyDate ? user.lastStudyDate.toISOString() : null;
    dto.createdAt = user.createdAt.toISOString();
    return dto;
  }
}