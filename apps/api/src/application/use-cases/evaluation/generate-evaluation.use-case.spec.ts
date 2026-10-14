import { Test, TestingModule } from '@nestjs/testing';
import { GenerateEvaluationUseCase } from './generate-evaluation.use-case';
import { CURRICULUM_REPOSITORY_TOKEN } from '@domain/repositories/curriculum.repository';
import { ContentBundleService } from '../../../infra/content/content-bundle.service';

describe('GenerateEvaluationUseCase (Hexagonal Domain)', () => {
  let useCase: GenerateEvaluationUseCase;

  const mockCurriculumRepo = {
    findModuleBySlug: jest.fn(),
    findCourseBySlug: jest.fn(),
  };

  const mockContentBundleService = {
    getComposition: jest.fn().mockReturnValue({
      quiz: { single_choice: 2 },
      exam: { single_choice: 2 },
    }),
    getModuleBank: jest.fn().mockReturnValue([
      {
        id: 'q1',
        type: 'single_choice',
        prompt: 'Pregunta 1',
        correct_option_id: 'opt_a',
        hint: 'Pista 1',
      },
      {
        id: 'q2',
        type: 'single_choice',
        prompt: 'Pregunta 2',
        correct_option_id: 'opt_b',
        hint: 'Pista 2',
      },
    ]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateEvaluationUseCase,
        {
          provide: CURRICULUM_REPOSITORY_TOKEN,
          useValue: mockCurriculumRepo,
        },
        {
          provide: ContentBundleService,
          useValue: mockContentBundleService,
        },
      ],
    }).compile();

    useCase = module.get<GenerateEvaluationUseCase>(GenerateEvaluationUseCase);
  });

  it('debe generar una evaluación despojando correct_option_id y hints', async () => {
    mockCurriculumRepo.findModuleBySlug.mockResolvedValue({
      slug: 'python-fundamentos',
      courseSlug: 'python-core',
    });
    mockCurriculumRepo.findCourseBySlug.mockResolvedValue({
      slug: 'python-core',
      trackSlug: 'python',
    });

    const result = await useCase.execute('user-1', 'python-fundamentos', 'quiz');

    expect(result.evaluation_type).toBe('quiz');
    expect(result.total_questions).toBe(2);
    expect(result.questions[0]).not.toHaveProperty('correct_option_id');
    expect(result.questions[0]).not.toHaveProperty('hint');
    expect(result.questions[0]).toHaveProperty('prompt');
  });
});
