import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LearningService } from './learning.service';
import { CURRICULUM_REPOSITORY_TOKEN } from '../../domain/repositories/curriculum.repository';
import { PROGRESS_REPOSITORY_TOKEN } from '../../domain/repositories/progress.repository';
import { SectionStarsEntity } from '../../domain/entities/section-stars.entity';
import { ModuleProgressEntity } from '../../domain/entities/module-progress.entity';

describe('LearningService (Hybrid Progress Fusion)', () => {
  let service: LearningService;

  const mockCurriculumRepo = {
    findTrackBySlug: jest.fn(),
    findModulesByCourse: jest.fn(),
    findSectionsByModule: jest.fn(),
    findLessonBySlug: jest.fn(),
  };

  const mockProgressRepo = {
    findAllSectionStarsByUser: jest.fn(),
    findAllModuleProgressByUser: jest.fn(),
    findSectionStars: jest.fn(),
    findModuleProgress: jest.fn(),
    saveSectionCompletion: jest.fn(),
    unlockModule: jest.fn(),
    checkPrerequisitesMet: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningService,
        {
          provide: CURRICULUM_REPOSITORY_TOKEN,
          useValue: mockCurriculumRepo,
        },
        {
          provide: PROGRESS_REPOSITORY_TOKEN,
          useValue: mockProgressRepo,
        },
      ],
    }).compile();

    service = module.get<LearningService>(LearningService);
  });

  describe('getRoadmap', () => {
    const mockTrack = {
      slug: 'python',
      name: 'Python 3.12',
      description: 'Fundamentos',
      color: '#38BDF8',
    };

    const mockModules = [
      {
        slug: 'python-m1',
        title: 'Módulo 1: Sintaxis y Variables',
        objective: 'Aprender lo básico',
        position: 1,
        totalSections: 2,
      },
      {
        slug: 'python-m2',
        title: 'Módulo 2: Estructuras de Control',
        objective: 'Condicionales y bucles',
        position: 2,
        totalSections: 2,
      },
    ];

    const mockM1Sections = [
      { slug: 'python-s01', title: 'Variables', position: 1, totalLessons: 3 },
      { slug: 'python-s02', title: 'Tipos de Datos', position: 2, totalLessons: 3 },
    ];

    const mockM2Sections = [
      { slug: 'python-s03', title: 'If / Else', position: 1, totalLessons: 3 },
      { slug: 'python-s04', title: 'Bucles For', position: 2, totalLessons: 3 },
    ];

    beforeEach(() => {
      mockCurriculumRepo.findTrackBySlug.mockResolvedValue(mockTrack);
      mockCurriculumRepo.findModulesByCourse.mockResolvedValue(mockModules);
      mockCurriculumRepo.findSectionsByModule.mockImplementation((modSlug: string) => {
        if (modSlug === 'python-m1') return Promise.resolve(mockM1Sections);
        if (modSlug === 'python-m2') return Promise.resolve(mockM2Sections);
        return Promise.resolve([]);
      });
    });

    it('debe retornar roadmap base para usuario anónimo sin consultar PostgreSQL', async () => {
      const result = await service.getRoadmap('python');

      expect(mockCurriculumRepo.findModulesByCourse).toHaveBeenCalledWith('python-core');
      expect(mockProgressRepo.findAllSectionStarsByUser).not.toHaveBeenCalled();
      expect(mockProgressRepo.findAllModuleProgressByUser).not.toHaveBeenCalled();

      expect(result.overall_progress_percentage).toBe(0);
      expect(result.total_stars_earned).toBe(0);
      expect(result.max_possible_stars).toBe(12); // 4 sections * 3

      // Módulo 1 desbloqueado por defecto, Módulo 2 bloqueado
      expect(result.modules[0].is_unlocked).toBe(true);
      expect(result.modules[0].sections[0].is_unlocked).toBe(true);
      expect(result.modules[0].sections[1].is_unlocked).toBe(false);
      expect(result.modules[1].is_unlocked).toBe(false);
      expect(result.modules[1].sections[0].is_unlocked).toBe(false);
    });

    it('debe fusionar progreso de Supabase Postgres cuando se provee userId', async () => {
      const userId = 'usr-123';

      const userStars = [
        new SectionStarsEntity({
          id: 'star-1',
          userId,
          sectionId: 'python-s01',
          moduleId: 'python-m1',
          starsEarned: 3,
          bestAccuracyScore: 100,
          totalAttemptsCount: 1,
          completedAt: new Date(),
        }),
        new SectionStarsEntity({
          id: 'star-2',
          userId,
          sectionId: 'python-s02',
          moduleId: 'python-m1',
          starsEarned: 2,
          bestAccuracyScore: 85,
          totalAttemptsCount: 2,
          completedAt: new Date(),
        }),
      ];

      const userModules = [
        new ModuleProgressEntity({
          id: 'mod-prog-1',
          userId,
          moduleId: 'python-m1',
          courseId: 'python-core',
          status: 'completed',
          unlockedByDiagnostic: false,
        }),
      ];

      mockProgressRepo.findAllSectionStarsByUser.mockResolvedValue(userStars);
      mockProgressRepo.findAllModuleProgressByUser.mockResolvedValue(userModules);

      const result = await service.getRoadmap('python', userId);

      expect(mockProgressRepo.findAllSectionStarsByUser).toHaveBeenCalledWith(userId);
      expect(mockProgressRepo.findAllModuleProgressByUser).toHaveBeenCalledWith(userId);

      // Total de estrellas acumuladas = 3 + 2 = 5
      expect(result.total_stars_earned).toBe(5);

      // Progreso global: 2 completadas de 4 = 50%
      expect(result.overall_progress_percentage).toBe(50);

      // Módulo 1 completado con 100% de maestría
      expect(result.modules[0].is_completed).toBe(true);
      expect(result.modules[0].mastery_percentage).toBe(100);
      expect(result.modules[0].sections[0].stars_earned).toBe(3);
      expect(result.modules[0].sections[1].stars_earned).toBe(2);

      // Módulo 2 desbloqueado automáticamente porque el Módulo 1 está completado
      expect(result.modules[1].is_unlocked).toBe(true);
      // Primera sección del Módulo 2 desbloqueada
      expect(result.modules[1].sections[0].is_unlocked).toBe(true);
      // Segunda sección del Módulo 2 aún bloqueada porque la primera de M2 no se ha aprobado
      expect(result.modules[1].sections[1].is_unlocked).toBe(false);

      // El current_module_id debe apuntar a python-m2 (el primero desbloqueado pero no terminado)
      expect(result.current_module_id).toBe('python-m2');
    });

    it('debe lanzar NotFoundException si no existen módulos en MongoDB', async () => {
      mockCurriculumRepo.findModulesByCourse.mockResolvedValue([]);

      await expect(service.getRoadmap('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('evaluateAnswer', () => {
    const mockLesson = {
      slug: 'lesson-01',
      xpReward: 50,
      item2Quiz: {
        prompt: '¿Cuál es la palabra clave para definir funciones?',
        options: [
          { id: 'opt-1', text: 'def', isCorrect: true, feedback: '¡Correcto!' },
          { id: 'opt-2', text: 'function', isCorrect: false, feedback: 'Incorrecto, function es en JS.' },
        ],
      },
      item3Prediction: {
        hint: 'Usa def nombre_funcion():',
      },
    };

    it('debe otorgar feedback positivo y XP cuando la respuesta es correcta', async () => {
      mockCurriculumRepo.findLessonBySlug.mockResolvedValue(mockLesson);

      const feedback = await service.evaluateAnswer({
        lesson_id: 'lesson-01',
        question_id: 'q1',
        selected_option_ids: ['opt-1'],
      });

      expect(feedback.is_correct).toBe(true);
      expect(feedback.xp_earned).toBe(50);
      expect(feedback.feedback_message).toBe('¡Correcto!');
      expect(feedback.added_to_review_queue).toBe(false);
    });

    it('debe indicar error y agregar al notebook de errores cuando es incorrecta', async () => {
      mockCurriculumRepo.findLessonBySlug.mockResolvedValue(mockLesson);

      const feedback = await service.evaluateAnswer({
        lesson_id: 'lesson-01',
        question_id: 'q1',
        selected_option_ids: ['opt-2'],
      });

      expect(feedback.is_correct).toBe(false);
      expect(feedback.xp_earned).toBe(0);
      expect(feedback.feedback_message).toContain('Incorrecto');
      expect(feedback.added_to_review_queue).toBe(true);
    });
  });
});
