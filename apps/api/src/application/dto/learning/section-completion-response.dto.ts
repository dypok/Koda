import { SectionStarsEntity } from '@domain/entities/section-stars.entity';

export class SectionCompletionResponseDto {
  sectionId!: string;
  moduleId!: string;
  starsEarnedThisAttempt!: number;
  bestStarsEarnedOverall!: number;
  bestAccuracyScore!: number;
  totalAttemptsCount!: number;
  isPassed!: boolean;
  isPerfect!: boolean;
  isNewlyPassed!: boolean;
  isNewBest!: boolean;
  xpAwarded!: number;
  userTotalXp!: number;
  completedAt!: string | null;

  static fromResult(params: {
    entity: SectionStarsEntity;
    attemptStars: number;
    isNewlyPassed: boolean;
    isNewBest: boolean;
    xpAwarded: number;
    userTotalXp: number;
  }): SectionCompletionResponseDto {
    const { entity, attemptStars, isNewlyPassed, isNewBest, xpAwarded, userTotalXp } = params;

    const dto = new SectionCompletionResponseDto();
    dto.sectionId = entity.sectionId;
    dto.moduleId = entity.moduleId;
    dto.starsEarnedThisAttempt = attemptStars;
    dto.bestStarsEarnedOverall = entity.starsEarned;
    dto.bestAccuracyScore = entity.bestAccuracyScore;
    dto.totalAttemptsCount = entity.totalAttemptsCount;
    dto.isPassed = entity.isPassed;
    dto.isPerfect = entity.isPerfect;
    dto.isNewlyPassed = isNewlyPassed;
    dto.isNewBest = isNewBest;
    dto.xpAwarded = xpAwarded;
    dto.userTotalXp = userTotalXp;
    dto.completedAt = entity.completedAt ? entity.completedAt.toISOString() : null;

    return dto;
  }
}
