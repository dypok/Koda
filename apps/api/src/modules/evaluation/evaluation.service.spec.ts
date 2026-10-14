import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { GenerateEvaluationUseCase } from '../../application/use-cases/evaluation/generate-evaluation.use-case';
import { EvaluateAttemptUseCase } from '../../application/use-cases/evaluation/evaluate-attempt.use-case';
import { GetAttemptSummaryUseCase } from '../../application/use-cases/evaluation/get-attempt-summary.use-case';

describe('EvaluationService (Facade to Use Cases)', () => {
  let service: EvaluationService;

  const mockGenerateEvaluationUseCase = {
    execute: jest.fn(),
  };

  const mockEvaluateAttemptUseCase = {
    execute: jest.fn(),
  };

  const mockGetAttemptSummaryUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
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

    service = module.get<EvaluationService>(EvaluationService);
  });

  it('debe delegar generateEvaluation en GenerateEvaluationUseCase', async () => {
    mockGenerateEvaluationUseCase.execute.mockResolvedValue({
      evaluation_type: 'quiz',
      total_questions: 10,
    });

    const res = await service.generateEvaluation('usr-1', 'mod-1', 'quiz');
    expect(res.total_questions).toBe(10);
    expect(mockGenerateEvaluationUseCase.execute).toHaveBeenCalledWith('usr-1', 'mod-1', 'quiz');
  });

  it('debe delegar evaluateAttempt en EvaluateAttemptUseCase', async () => {
    mockEvaluateAttemptUseCase.execute.mockResolvedValue({
      passed: true,
      score: 100,
    });

    const res = await service.evaluateAttempt('usr-1', 'mod-1', { answers: {} }, 'quiz');
    expect(res.passed).toBe(true);
    expect(mockEvaluateAttemptUseCase.execute).toHaveBeenCalledWith('usr-1', 'mod-1', { answers: {} }, 'quiz');
  });

  it('debe delegar getAttemptSummary en GetAttemptSummaryUseCase', async () => {
    mockGetAttemptSummaryUseCase.execute.mockResolvedValue({
      attempt_id: 'att-1',
      score: 100,
    });

    const res = await service.getAttemptSummary('usr-1', 'att-1');
    expect(res.attempt_id).toBe('att-1');
    expect(mockGetAttemptSummaryUseCase.execute).toHaveBeenCalledWith('usr-1', 'att-1');
  });
});
