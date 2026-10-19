import { GetRoadmapGraphUseCase } from './get-roadmap-graph.use-case';
import { ICurriculumRepository } from '../../../domain/repositories/curriculum.repository';
import { IProgressRepository } from '../../../domain/repositories/progress.repository';
import { SectionStarsEntity } from '../../../domain/entities/section-stars.entity';

describe('GetRoadmapGraphUseCase', () => {
  let useCase: GetRoadmapGraphUseCase;
  let curriculumRepository: jest.Mocked<ICurriculumRepository>;
  let progressRepository: jest.Mocked<IProgressRepository>;

  beforeEach(() => {
    curriculumRepository = {
      findTracks: jest.fn(),
      findTrackBySlug: jest.fn(),
      findAllCourses: jest.fn().mockResolvedValue([]),
      findCoursesByTrack: jest.fn(),
      findCourseBySlug: jest.fn(),
      findModulesByCourse: jest.fn(),
      findModuleBySlug: jest.fn(),
      findSectionsByModule: jest.fn(),
      findSectionBySlug: jest.fn(),
      findLessonsBySection: jest.fn(),
      findLessonBySlug: jest.fn(),
      findVisualEffects: jest.fn(),
      findVisualEffectByCode: jest.fn(),
    };

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

    useCase = new GetRoadmapGraphUseCase(curriculumRepository, progressRepository);
  });

  it('debe retornar el grafo base con solo el primer nodo activo si el usuario no tiene avance', async () => {
    progressRepository.findAllSectionStarsByUser.mockResolvedValue([]);

    const dataset = await useCase.getLessonsGraph('python-1', 'user-new');

    expect(dataset.nodes[0].variant).toBe('active');
    expect(dataset.nodes[0].isUnlocked).toBe(true);
    expect(dataset.nodes[1].variant).toBe('locked');
    expect(dataset.nodes[1].isUnlocked).toBe(false);
    expect(dataset.progressPercent).toBe(0);
  });

  it('debe marcar nodos completados y desbloquear el siguiente nodo activo cuando el usuario tiene progreso en DB', async () => {
    const mockStars = [
      new SectionStarsEntity({ userId: 'user-001', sectionId: 'py-m01', moduleId: 'fundamentos', starsEarned: 3 }),
      new SectionStarsEntity({ userId: 'user-001', sectionId: 'py-m02', moduleId: 'fundamentos', starsEarned: 3 }),
    ];
    progressRepository.findAllSectionStarsByUser.mockResolvedValue(mockStars);

    const dataset = await useCase.getLessonsGraph('python-1', 'user-001');

    // Nodos 01 y 02 deben estar completados
    expect(dataset.nodes[0].id).toBe('py-m01');
    expect(dataset.nodes[0].variant).toBe('completed');
    expect(dataset.nodes[0].stars).toBe(3);

    expect(dataset.nodes[1].id).toBe('py-m02');
    expect(dataset.nodes[1].variant).toBe('completed');
    expect(dataset.nodes[1].stars).toBe(3);

    // Nodo 03 debe ser el nodo activo desbloqueado
    expect(dataset.nodes[2].id).toBe('py-m03');
    expect(dataset.nodes[2].variant).toBe('active');
    expect(dataset.nodes[2].isUnlocked).toBe(true);

    // Nodo 04 debe permanecer bloqueado
    expect(dataset.nodes[3].id).toBe('py-m04');
    expect(dataset.nodes[3].variant).toBe('locked');
    expect(dataset.nodes[3].isUnlocked).toBe(false);

    // Conexiones: c-01-02 y c-02-03 deben estar iluminadas (isDashed: false)
    const conn1 = dataset.connections.find((c) => c.fromId === 'py-m01');
    expect(conn1?.isDashed).toBe(false);
    const conn2 = dataset.connections.find((c) => c.fromId === 'py-m02');
    expect(conn2?.isDashed).toBe(false);
  });
});
