import { UserEntity, ExperienceLevel, LearningStyle, DailyGoalId, DocumentType } from '../entities/user.entity';

export interface UpdateUserProfileDto {
  displayName?: string;
  avatarUrl?: string | null;
  avatarObjectKey?: string | null;
  documentNumber?: string | null;
  documentType?: DocumentType | null;
  bio?: string | null;
  timezone?: string;
  locale?: string;
  initialLanguageSlug?: string;
  experienceLevel?: ExperienceLevel;
  learningStyle?: LearningStyle;
  dailyGoalId?: DailyGoalId;
  dailyGoalMinutes?: number;
}

export interface UpdateUserGamificationDto {
  totalXp?: number;
  currentLevel?: number;
  currentStreak?: number;
  longestStreak?: number;
  streakFreezeCount?: number;
  totalStudyTimeSeconds?: number;
  lastStudyDate?: Date | null;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  updateProfile(id: string, data: UpdateUserProfileDto): Promise<UserEntity>;
  updateGamification(id: string, data: UpdateUserGamificationDto): Promise<UserEntity>;
}

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');
