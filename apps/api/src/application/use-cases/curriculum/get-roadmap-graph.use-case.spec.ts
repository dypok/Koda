import { GetRoadmapGraphUseCase } from './get-roadmap-graph.use-case';
import { ICurriculumRepository } from '../../../domain/repositories/curriculum.repository';
import { IProgressRepository } from '../../../domain/repositories/progress.repository';
import { SectionStarsEntity } from '../../../domain/entities/section-stars.entity';
import { CourseEntity } from '../../../domain/entities/curriculum';

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

  it('debe marcar python-1 completado y desbloquear python-2 cuando el usuario aprueba el examen apex py-apex-1', async () => {
    const mockStars = [
      new SectionStarsEntity({ userId: 'user-apex', sectionId: 'py-apex-1', moduleId: 'funciones-fundamentales', starsEarned: 3 }),
    ];
    progressRepository.findAllSectionStarsByUser.mockResolvedValue(mockStars);

    const dataset = await useCase.getCoursesGraph('python', 'user-apex');

    const py1 = dataset.nodes.find((n) => n.id === 'python-1');
    expect(py1?.variant).toBe('completed');
    expect(py1?.isUnlocked).toBe(true);

    const py2 = dataset.nodes.find((n) => n.id === 'python-2');
    expect(py2?.variant).toBe('active');
    expect(py2?.isUnlocked).toBe(true);

    const py3 = dataset.nodes.find((n) => n.id === 'python-3');
    expect(py3?.variant).toBe('locked');
    expect(py3?.isUnlocked).toBe(false);

    // La conexión de python-1 hacia python-2 debe ser sólida (isDashed: false)
    const edge = dataset.connections.find((c) => c.fromId === 'python-1' && c.toId === 'python-2');
    expect(edge?.isDashed).toBe(false);
  });

  it('debe retornar la estructura completa de 12 nodos para python-2 en lugar del fallback quemado', async () => {
    const dataset = await useCase.getLessonsGraph('python-2');

    expect(dataset.nodes.length).toBe(12);
    expect(dataset.nodes[0].id).toBe('py2-m01');
    expect(dataset.nodes[0].label).toBe('COMPRENSIONES');
    expect(dataset.nodes[11].id).toBe('py2-boss');
    expect(dataset.nodes[11].variant).toBe('boss');
    expect(dataset.sectorTitle).toContain('PYTHON 2');
  });

  it('debe retornar las fases de certificacion para python-apex sin usar fallback falso', async () => {
    const dataset = await useCase.getLessonsGraph('python-apex');

    expect(dataset.nodes.length).toBe(3);
    expect(dataset.nodes[0].id).toBe('apex-01');
    expect(dataset.nodes[2].id).toBe('apex-03');
    expect(dataset.sectorTitle).toContain('APEX MASTER GATE');
  });

  it('debe lanzar NotFoundException si se consulta un curso inexistente', async () => {
    await expect(useCase.getLessonsGraph('curso-inexistente-123')).rejects.toThrow(
      'Curso \'curso-inexistente-123\' no encontrado',
    );
  });

  it('debe filtrar y purgar python-core o cursos obsoletos con nombre Python 3.12 en getCoursesGraph', async () => {
    const mockCourses = [
      new CourseEntity({
        slug: 'python-core',
        trackSlug: 'python',
        name: 'Fundamentos de Programación con Python 3.12',
        description: 'Legacy course',
        color: '#38BDF8',
        icon: 'IconBrandPython',
        topology: { tier: 0, lane: 0 },
        prerequisites: [],
        edges: [],
        isActive: true,
      }),
      new CourseEntity({
        slug: 'python-1',
        trackSlug: 'python',
        name: 'Python 1: Fundamentos',
        description: 'Canonical course',
        color: '#38BDF8',
        icon: 'IconBrandPython',
        topology: { tier: 0, lane: 0 },
        prerequisites: [],
        edges: [],
        isActive: true,
      }),
    ];
    curriculumRepository.findAllCourses.mockResolvedValue(mockCourses);

    const dataset = await useCase.getCoursesGraph('python');

    expect(dataset.nodes.some((n) => n.id === 'python-core')).toBe(false);
    expect(dataset.nodes.some((n) => n.label.includes('Python 3.12'))).toBe(false);
    expect(dataset.nodes.find((n) => n.id === 'python-1')).toBeDefined();
  });
});
