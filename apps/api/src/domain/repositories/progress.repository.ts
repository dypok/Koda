import { SectionStarsEntity } from '../entities/section-stars.entity';
import { ModuleProgressEntity } from '../entities/module-progress.entity';

export interface SaveSectionCompletionParams {
  userId: string;
  sectionId: string;
  moduleId: string;
  courseId: string;
  accuracyPercentage: number;
}

export interface SaveSectionCompletionResult {
  sectionStars: SectionStarsEntity;
  xpAwarded: number;
  isNewlyPassed: boolean;
  isNewBest: boolean;
  userTotalXp: number;
  currentStreak?: number;
  longestStreak?: number;
  streakFreezeCount?: number;
  isActiveToday?: boolean;
}

export interface IProgressRepository {
  findSectionStars(userId: string, sectionId: string): Promise<SectionStarsEntity | null>;
  findSectionStarsByUserAndModule(userId: string, moduleId: string): Promise<SectionStarsEntity[]>;
  findAllSectionStarsByUser(userId: string): Promise<SectionStarsEntity[]>;
  findModuleProgress(userId: string, moduleId: string): Promise<ModuleProgressEntity | null>;
  findAllModuleProgressByUser(userId: string, courseId?: string): Promise<ModuleProgressEntity[]>;
  saveSectionCompletion(params: SaveSectionCompletionParams): Promise<SaveSectionCompletionResult>;
  unlockModule(userId: string, moduleId: string, courseId: string, byDiagnostic?: boolean): Promise<ModuleProgressEntity>;
  checkPrerequisitesMet(userId: string, prerequisiteSectionIds: string[]): Promise<boolean>;
}

export const PROGRESS_REPOSITORY_TOKEN = Symbol('IProgressRepository');
