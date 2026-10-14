import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { CURRICULUM_REPOSITORY_TOKEN } from '@domain/repositories/curriculum.repository';
import { SupabaseService } from '../../database/supabase.service';
import { ContentBundleService } from '../../infra/content/content-bundle.service';

describe('EvaluationService (Anti-N+1 & Memory Bundle)', () => {
  let service: EvaluationService;

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
        EvaluationService,
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

    service = module.get<EvaluationService>(EvaluationService);
  });

  describe('generateEvaluation', () => {
    it('debe generar una evaluación omitiendo correct_option_id y hints por seguridad', async () => {
      mockCurriculumRepo.findModuleBySlug.mockResolvedValue({
        slug: 'python-fundamentos',
        courseSlug: 'python-core',
      });
      mockCurriculumRepo.findCourseBySlug.mockResolvedValue({
        slug: 'python-core',
        trackSlug: 'python',
      });

      const result = await service.generateEvaluation('user-1', 'python-fundamentos', 'quiz');

      expect(result.evaluation_type).toBe('quiz');
      expect(result.total_questions).toBe(2);
      expect(result.questions[0]).not.toHaveProperty('correct_option_id');
      expect(result.questions[0]).not.toHaveProperty('hint');
      expect(result.questions[0]).toHaveProperty('prompt');
    });
  });

  describe('evaluateAttempt', () => {
    it('debe evaluar respuestas e insertar errores en un único lote sin cascada N+1', async () => {
      mockCurriculumRepo.findModuleBySlug.mockResolvedValue({
        slug: 'python-fundamentos',
        courseSlug: 'python-core',
      });
      mockCurriculumRepo.findCourseBySlug.mockResolvedValue({
        slug: 'python-core',
        trackSlug: 'python',
      });

      // 1 acierto (q1: opt_a) y 1 fallo (q2: opt_wrong)
      const submission = {
        answers: {
          q1: 'opt_a',
          q2: 'opt_wrong',
        },
        time_spent_seconds: 45,
      };

      const result = await service.evaluateAttempt('user-1', 'python-fundamentos', submission, 'quiz');

      expect(result.passed).toBe(false); // 50% < 70% threshold
      expect(result.score).toBe(50);
      expect(result.correct_count).toBe(1);

      // Verificar que Supabase fue invocado para user_mistakes_notebook con un ARRAY (Bulk Insert)
      const mistakeCalls = mockSupabaseClient.from.mock.calls.filter(
        (c: string[]) => c[0] === 'user_mistakes_notebook',
      );
      expect(mistakeCalls.length).toBe(1); // Exactamente 1 llamada, cero cascada N+1
    });
  });
});
