import { EvaluateDiagnosticUseCase } from './evaluate-diagnostic.use-case';
import {
  PYTHON_DIAGNOSTIC_QUESTIONS,
  DiagnosticAnswerInput,
} from '@domain/entities/diagnostic.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { PrismaService } from '@infra/database/postgres/prisma.service';

describe('EvaluateDiagnosticUseCase', () => {
  let useCase: EvaluateDiagnosticUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let prisma: jest.Mocked<PrismaService>;

  // Helper para generar respuestas correctas para preguntas específicas
  const makeAnswers = (correctQuestionIds: string[]): DiagnosticAnswerInput[] => {
    return PYTHON_DIAGNOSTIC_QUESTIONS.map((q) => {
      const isCorrect = correctQuestionIds.includes(q.id);
      return {
        questionId: q.id,
        selectedOptionId: isCorrect ? q.correctOptionId : 'wrong-option-id',
      };
    });
  };

  const b1QuestionIds = PYTHON_DIAGNOSTIC_QUESTIONS.filter((q) => q.blockId === 'B1').map(
    (q) => q.id,
  );
  const b2QuestionIds = PYTHON_DIAGNOSTIC_QUESTIONS.filter((q) => q.blockId === 'B2').map(
    (q) => q.id,
  );

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateProfile: jest.fn(),
      updateGamification: jest.fn(),
    };

    prisma = {} as unknown as jest.Mocked<PrismaService>;

    useCase = new EvaluateDiagnosticUseCase(userRepository, prisma);
  });

  describe('DoD: 4 Casos del Algoritmo de Clamping y Determinación de Módulo de Inicio', () => {
    it('Caso 1 (Principiante): Usuario beginner con respuestas deficientes o sin experiencia se ubica en M01', async () => {
      // 0 aciertos
      const answers = makeAnswers([]);

      const result = await useCase.execute({
        declaredLevel: 'beginner',
        answers,
      });

      expect(result.recommendedModuleCode).toBe('M01');
      expect(result.recommendedModuleOrder).toBe(1);
      expect(result.recommendedModuleTitle).toBe('Fundamentos de Python');
      expect(result.overallScore).toBe(0);
      expect(result.passedBlock1).toBe(false);
      expect(result.passedBlock2).toBe(false);
      expect(result.unlockedModules).toEqual([]);
      expect(result.clamped).toBe(false);
    });

    it('Caso 2 (Intermedio Bloque 1 aprobado): >= 80% en B1 y < 80% en B2 desbloquea y ubica en M04', async () => {
      // 5 de 6 en B1 (83.33%) y 1 de 6 en B2 (16.67%)
      const answers = makeAnswers([...b1QuestionIds.slice(0, 5), b2QuestionIds[0]]);

      const result = await useCase.execute({
        declaredLevel: 'medium',
        answers,
      });

      expect(result.passedBlock1).toBe(true);
      expect(result.passedBlock2).toBe(false);
      expect(result.recommendedModuleCode).toBe('M04');
      expect(result.recommendedModuleOrder).toBe(4);
      expect(result.recommendedModuleTitle).toBe('Condicionales y Decisiones');
      expect(result.unlockedModules).toEqual(['M01', 'M02', 'M03']);
      expect(result.clamped).toBe(false);
      expect(result.justification).toContain('Módulo 4: Condicionales y Decisiones');
    });

    it('Caso 3 (Intermedio con acierto total - Clamping): 100% en B1 y B2 pero nivel medium restringe a M06', async () => {
      // 100% en B1 y B2 (todas correctas)
      const answers = makeAnswers([...b1QuestionIds, ...b2QuestionIds]);

      const result = await useCase.execute({
        declaredLevel: 'medium',
        answers,
      });

      // B1 y B2 aprobados al 100%
      expect(result.passedBlock1).toBe(true);
      expect(result.passedBlock2).toBe(true);
      expect(result.overallScore).toBe(100);

      // El candidato natural sería M07, pero el clamping de 'medium' tiene tope superior en M06
      expect(result.clamped).toBe(true);
      expect(result.recommendedModuleCode).toBe('M06');
      expect(result.recommendedModuleOrder).toBe(6);
      expect(result.recommendedModuleTitle).toBe('Funciones y Modularidad');
      expect(result.unlockedModules).toEqual(['M01', 'M02', 'M03', 'M04', 'M05']);
      expect(result.justification).toContain('nivel autodeclarado (medium)');
    });

    it('Caso 4 (Semi-Pro / Profesional): >= 80% en B1 y B2 desbloquea M07 sin contención de clamping', async () => {
      // 100% en B1 y B2 con nivel autodeclarado semi_professional
      const answers = makeAnswers([...b1QuestionIds, ...b2QuestionIds]);

      const result = await useCase.execute({
        declaredLevel: 'semi_professional',
        answers,
      });

      expect(result.passedBlock1).toBe(true);
      expect(result.passedBlock2).toBe(true);
      expect(result.overallScore).toBe(100);
      expect(result.clamped).toBe(false);
      expect(result.recommendedModuleCode).toBe('M07');
      expect(result.recommendedModuleOrder).toBe(7);
      expect(result.recommendedModuleTitle).toBe('Colecciones y Estructuras de Datos');
      expect(result.unlockedModules).toEqual(['M01', 'M02', 'M03', 'M04', 'M05', 'M06']);
      expect(result.justification).toContain('Módulo 7: Colecciones y Estructuras de Datos');
    });
  });

  describe('Flujos de Omisión y Autodeclaración', () => {
    it('debe asignar directamente Módulo 01 si el usuario declara Principiante y omite el test', async () => {
      const result = await useCase.execute({
        declaredLevel: 'beginner',
        answers: [],
      });

      expect(result.recommendedModuleCode).toBe('M01');
      expect(result.recommendedModuleOrder).toBe(1);
      expect(result.overallScore).toBe(0);
      expect(result.unlockedModules).toEqual([]);
      expect(result.justification).toContain('comienza directamente desde el Módulo 01');
    });

    it('debe actualizar el perfil del usuario si se proporciona userId en la ejecución', async () => {
      const mockUser = {
        id: 'user-uuid-999',
        updateProfile: jest.fn(),
      };
      userRepository.findById.mockResolvedValue(mockUser as any);
      userRepository.update.mockResolvedValue(mockUser as any);

      const answers = makeAnswers(b1QuestionIds);

      const result = await useCase.execute(
        {
          declaredLevel: 'intermediate',
          answers,
        },
        'user-uuid-999',
      );

      expect(result).toBeDefined();
      expect(userRepository.findById).toHaveBeenCalledWith('user-uuid-999');
      expect(mockUser.updateProfile).toHaveBeenCalledWith({ experienceLevel: 'semi_professional' });
      expect(userRepository.update).toHaveBeenCalledWith(mockUser);
    });
  });
});
