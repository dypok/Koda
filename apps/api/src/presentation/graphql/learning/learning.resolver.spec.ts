import { Test, TestingModule } from '@nestjs/testing';
import { LearningResolver } from './learning.resolver';
import { LearningService } from '../../../modules/learning/learning.service';
import { CompleteSectionUseCase } from '@application/use-cases/learning/complete-section.use-case';
import { SupabaseService } from '../../../database/supabase.service';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

describe('LearningResolver', () => {
  let resolver: LearningResolver;
  let learningService: jest.Mocked<LearningService>;
  let completeSectionUseCase: jest.Mocked<CompleteSectionUseCase>;

  const mockUser: SupabaseAuthUser = {
    id: 'usr-456',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningResolver,
        {
          provide: SupabaseService,
          useValue: {
            verifyAuthToken: jest.fn().mockResolvedValue(mockUser),
            getClient: jest.fn(),
            getAdminClient: jest.fn(),
          },
        },
        {
          provide: LearningService,
          useValue: {
            getRoadmap: jest.fn().mockResolvedValue({
              overall_progress_percentage: 25,
              total_stars_earned: 3,
              max_possible_stars: 12,
              current_module_id: 'm01',
              modules: [],
            }),
            evaluateAnswer: jest.fn().mockResolvedValue({
              is_correct: true,
              xp_earned: 15,
              feedback_message: '¡Excelente!',
              added_to_review_queue: false,
            }),
          },
        },
        {
          provide: CompleteSectionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              sectionId: 'sec-01',
              moduleId: 'mod-01',
              starsEarnedThisAttempt: 3,
              bestStarsEarnedOverall: 3,
              bestAccuracyScore: 100,
              totalAttemptsCount: 1,
              isPassed: true,
              isPerfect: true,
              isNewlyPassed: true,
              isNewBest: true,
              xpAwarded: 50,
              userTotalXp: 150,
              completedAt: new Date().toISOString(),
            }),
          },
        },
      ],
    }).compile();


    resolver = module.get<LearningResolver>(LearningResolver);
    learningService = module.get(LearningService);
    completeSectionUseCase = module.get(CompleteSectionUseCase);
  });

  it('should query learning roadmap without user', async () => {
    const res = await resolver.getLearningRoadmap('python');
    expect(res.overall_progress_percentage).toBe(25);
    expect(learningService.getRoadmap).toHaveBeenCalledWith('python', undefined);
  });

  it('should query learning roadmap with authenticated user', async () => {
    const res = await resolver.getLearningRoadmap('python', mockUser);
    expect(res.overall_progress_percentage).toBe(25);
    expect(learningService.getRoadmap).toHaveBeenCalledWith('python', 'usr-456');
  });

  it('should evaluate answer mutation', async () => {
    const res = await resolver.evaluateLessonAnswer({
      lesson_id: 'py-01',
      question_id: 'q-01',
      selected_option_ids: ['a'],
    });
    expect(res.is_correct).toBe(true);
    expect(learningService.evaluateAnswer).toHaveBeenCalledWith({
      lesson_id: 'py-01',
      question_id: 'q-01',
      selected_option_ids: ['a'],
    });
  });

  it('should complete section mutation and award stars/xp', async () => {
    const input = {
      sectionId: 'sec-01',
      moduleId: 'mod-01',
      courseId: 'python-core',
      accuracyPercentage: 100,
    };

    const res = await resolver.completeSection(input, mockUser);

    expect(res.sectionId).toBe('sec-01');
    expect(res.starsEarnedThisAttempt).toBe(3);
    expect(res.xpAwarded).toBe(50);
    expect(completeSectionUseCase.execute).toHaveBeenCalledWith('usr-456', input);
  });
});

