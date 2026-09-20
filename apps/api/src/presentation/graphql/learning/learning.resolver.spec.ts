import { Test, TestingModule } from '@nestjs/testing';
import { LearningResolver } from './learning.resolver';
import { LearningService } from '../../../modules/learning/learning.service';

describe('LearningResolver', () => {
  let resolver: LearningResolver;
  let learningService: jest.Mocked<LearningService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningResolver,
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
      ],
    }).compile();

    resolver = module.get<LearningResolver>(LearningResolver);
    learningService = module.get(LearningService);
  });

  it('should query learning roadmap', async () => {
    const res = await resolver.getLearningRoadmap('python');
    expect(res.overall_progress_percentage).toBe(25);
    expect(learningService.getRoadmap).toHaveBeenCalledWith('python');
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
});
