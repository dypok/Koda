import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationResolver } from './evaluation.resolver';
import { GenerateEvaluationUseCase } from '../../../application/use-cases/evaluation/generate-evaluation.use-case';
import { EvaluateAttemptUseCase } from '../../../application/use-cases/evaluation/evaluate-attempt.use-case';
import { GetAttemptSummaryUseCase } from '../../../application/use-cases/evaluation/get-attempt-summary.use-case';
import { SupabaseService } from '../../../database/supabase.service';

describe('EvaluationResolver (GraphQL Transport - ADR-012)', () => {
  let resolver: EvaluationResolver;

  const mockGenerateEvaluationUseCase = {
    execute: jest.fn(),
  };

  const mockEvaluateAttemptUseCase = {
    execute: jest.fn(),
  };

  const mockGetAttemptSummaryUseCase = {
    execute: jest.fn(),
  };

  const mockUser: any = { id: 'usr-graphql-1' };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationResolver,
        {
          provide: SupabaseService,
          useValue: {
            verifyAuthToken: jest.fn().mockResolvedValue(mockUser),
            getClient: jest.fn(),
            getAdminClient: jest.fn(),
          },
        },
        {
          provide: GenerateEvaluationUseCase,
          useValue: mockGenerateEvaluationUseCase,
        },
        {
          provide: EvaluateAttemptUseCase,
          useValue: mockEvaluateAttemptUseCase,
        },
        {
          provide: GetAttemptSummaryUseCase,
          useValue: mockGetAttemptSummaryUseCase,
        },
      ],
    }).compile();

    resolver = module.get<EvaluationResolver>(EvaluationResolver);
  });

  it('debe orquestar la query generateEvaluation vía caso de uso', async () => {
    mockGenerateEvaluationUseCase.execute.mockResolvedValue({
      evaluation_type: 'quiz',
      module_id: 'mod-1',
      total_questions: 1,
      questions: [
        {
          id: 'q1',
          type: 'single_choice',
          prompt: 'Pregunta GraphQL',
          options: [{ id: 'opt_a', text: 'Opción A' }],
        },
      ],
    });

    const result = await resolver.generateEvaluation('mod-1', 'quiz', mockUser);

    expect(result.module_id).toBe('mod-1');
    expect(result.questions.length).toBe(1);
    expect(mockGenerateEvaluationUseCase.execute).toHaveBeenCalledWith('usr-graphql-1', 'mod-1', 'quiz');
  });

  it('debe orquestar la mutation submitEvaluationAttempt vía caso de uso', async () => {
    mockEvaluateAttemptUseCase.execute.mockResolvedValue({
      passed: true,
      score: 100,
      correct_count: 2,
      total_questions: 2,
      xp_earned: 25,
      content_version: 'hash-version',
    });

    const input = {
      target_module_id: 'mod-1',
      evaluation_type: 'quiz',
      answers: [
        { question_id: 'q1', selected_option_id: 'opt_a' },
        { question_id: 'q2', selected_option_id: 'opt_b' },
      ],
      time_spent_seconds: 60,
    };

    const result = await resolver.submitEvaluationAttempt(input, mockUser);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(mockEvaluateAttemptUseCase.execute).toHaveBeenCalledWith(
      'usr-graphql-1',
      'mod-1',
      {
        answers: { q1: 'opt_a', q2: 'opt_b' },
        time_spent_seconds: 60,
      },
      'quiz',
    );
  });
});
