import { BadRequestException } from '@nestjs/common';
import { CompleteSectionUseCase } from './complete-section.use-case';
import { IProgressRepository } from '@domain/repositories/progress.repository';
import { SectionStarsEntity } from '@domain/entities/section-stars.entity';

describe('CompleteSectionUseCase', () => {
  let useCase: CompleteSectionUseCase;
  let progressRepository: jest.Mocked<IProgressRepository>;

  beforeEach(() => {
    progressRepository = {
      findSectionStars: jest.fn(),
      findSectionStarsByUserAndModule: jest.fn(),
      findAllSectionStarsByUser: jest.fn(),
      findModuleProgress: jest.fn(),
      findAllModuleProgressByUser: jest.fn(),
      saveSectionCompletion: jest.fn(),
      unlockModule: jest.fn(),
      checkPrerequisitesMet: jest.fn(),
    };

    useCase = new CompleteSectionUseCase(progressRepository);
  });

  it('debe otorgar 3 estrellas para una precisión del 100% (perfección)', async () => {
    const entity = new SectionStarsEntity({
      userId: 'user-123',
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      starsEarned: 3,
      bestAccuracyScore: 100,
      totalAttemptsCount: 1,
    });

    progressRepository.saveSectionCompletion.mockResolvedValue({
      sectionStars: entity,
      xpAwarded: 40, // 30 base + 10 bono
      isNewlyPassed: true,
      isNewBest: true,
      userTotalXp: 140,
    });

    const result = await useCase.execute('user-123', {
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      courseId: 'course-python',
      accuracyPercentage: 100,
    });

    expect(result.starsEarnedThisAttempt).toBe(3);
    expect(result.bestStarsEarnedOverall).toBe(3);
    expect(result.isPassed).toBe(true);
    expect(result.isPerfect).toBe(true);
    expect(result.xpAwarded).toBe(40);
  });

  it('debe otorgar 2 estrellas para una precisión entre 80% y 99%', async () => {
    const entity = new SectionStarsEntity({
      userId: 'user-123',
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      starsEarned: 2,
      bestAccuracyScore: 85,
      totalAttemptsCount: 1,
    });

    progressRepository.saveSectionCompletion.mockResolvedValue({
      sectionStars: entity,
      xpAwarded: 30,
      isNewlyPassed: true,
      isNewBest: true,
      userTotalXp: 130,
    });

    const result = await useCase.execute('user-123', {
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      courseId: 'course-python',
      accuracyPercentage: 85,
    });

    expect(result.starsEarnedThisAttempt).toBe(2);
    expect(result.isPassed).toBe(true);
    expect(result.isPerfect).toBe(false);
  });

  it('debe otorgar 1 estrella para una precisión entre 70% y 79%', async () => {
    const entity = new SectionStarsEntity({
      userId: 'user-123',
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      starsEarned: 1,
      bestAccuracyScore: 75,
      totalAttemptsCount: 1,
    });

    progressRepository.saveSectionCompletion.mockResolvedValue({
      sectionStars: entity,
      xpAwarded: 30,
      isNewlyPassed: true,
      isNewBest: true,
      userTotalXp: 130,
    });

    const result = await useCase.execute('user-123', {
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      courseId: 'course-python',
      accuracyPercentage: 75,
    });

    expect(result.starsEarnedThisAttempt).toBe(1);
    expect(result.isPassed).toBe(true);
  });

  it('debe otorgar 0 estrellas y no aprobar si la precisión es menor al 70%', async () => {
    const entity = new SectionStarsEntity({
      userId: 'user-123',
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      starsEarned: 0,
      bestAccuracyScore: 60,
      totalAttemptsCount: 1,
    });

    progressRepository.saveSectionCompletion.mockResolvedValue({
      sectionStars: entity,
      xpAwarded: 0,
      isNewlyPassed: false,
      isNewBest: true,
      userTotalXp: 100,
    });

    const result = await useCase.execute('user-123', {
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      courseId: 'course-python',
      accuracyPercentage: 60,
    });

    expect(result.starsEarnedThisAttempt).toBe(0);
    expect(result.isPassed).toBe(false);
    expect(result.xpAwarded).toBe(0);
  });

  it('debe lanzar BadRequestException si el porcentaje es inválido', async () => {
    await expect(
      useCase.execute('user-123', {
        sectionId: 'sec-01',
        moduleId: 'mod-01',
        courseId: 'course-python',
        accuracyPercentage: 110,
      }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      useCase.execute('user-123', {
        sectionId: 'sec-01',
        moduleId: 'mod-01',
        courseId: 'course-python',
        accuracyPercentage: -5,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
