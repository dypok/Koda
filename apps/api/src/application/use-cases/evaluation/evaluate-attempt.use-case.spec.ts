import { Test, TestingModule } from '@nestjs/testing';
import { EvaluateAttemptUseCase } from './evaluate-attempt.use-case';
import { CURRICULUM_REPOSITORY_TOKEN } from '@domain/repositories/curriculum.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { ContentBundleService } from '../../../infra/content/content-bundle.service';

describe('EvaluateAttemptUseCase (Hexagonal Domain & Anti-N+1)', () => {
  let useCase: EvaluateAttemptUseCase;

  const mockCurriculumRepo = {
    findModuleBySlug: jest.fn(),
    findCourseBySlug: jest.fn(),
  };

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: 'attempt-uuid-1' }, error: null }),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  };

  const mockSupabaseService = {
    getClient: jest.fn().mockReturnValue(mockSupabaseClient),
  };

  const mockContentBundleService = {
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
        EvaluateAttemptUseCase,
        {
          provide: CURRICULUM_REPOSITORY_TOKEN,
          useValue: mockCurriculumRepo,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: ContentBundleService,
          useValue: mockContentBundleService,
        },
      ],
    }).compile();

    useCase = module.get<EvaluateAttemptUseCase>(EvaluateAttemptUseCase);
  });

  it('debe calificar respuestas y persistir errores en un lote masivo', async () => {
    mockCurriculumRepo.findModuleBySlug.mockResolvedValue({
      slug: 'python-fundamentos',
      courseSlug: 'python-core',
    });
    mockCurriculumRepo.findCourseBySlug.mockResolvedValue({
      slug: 'python-core',
      trackSlug: 'python',
    });

    const submission = {
      answers: {
        q1: 'opt_a',
        q2: 'opt_wrong',
      },
      time_spent_seconds: 30,
    };

    const result = await useCase.execute('user-1', 'python-fundamentos', submission, 'quiz');

    expect(result.passed).toBe(false);
    expect(result.score).toBe(50);
    expect(result.correct_count).toBe(1);

    const mistakeCalls = mockSupabaseClient.from.mock.calls.filter(
      (c: string[]) => c[0] === 'user_mistakes_notebook',
    );
    expect(mistakeCalls.length).toBe(1);
  });
});
