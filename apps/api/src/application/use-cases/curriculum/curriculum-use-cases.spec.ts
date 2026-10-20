import { NotFoundException } from '@nestjs/common';
import {
  GetTracksUseCase,
  GetTrackCoursesUseCase,
  GetCourseDetailUseCase,
  GetLessonDetailUseCase,
  GetVisualEffectsUseCase,
  GetRoadmapGraphUseCase,
} from './index';
import { ICurriculumRepository } from '../../../domain/repositories/curriculum.repository';
import {
  TrackEntity,
  CourseEntity,
  ModuleEntity,
  SectionEntity,
  LessonEntity,
  VisualEffectEntity,
} from '../../../domain/entities/curriculum';

describe('Curriculum Use Cases (MongoDB)', () => {
  let mockRepo: jest.Mocked<ICurriculumRepository>;

  const mockTrack = new TrackEntity({
    slug: 'python',
    name: 'Pista Python',
    description: 'Aprende Python',
    icon: 'IconBrandPython',
    badge: 'Fundacional',
    color: '#38BDF8',
    sortOrder: 1,
    isActive: true,
  });

  const mockCourse = new CourseEntity({
    slug: 'python-1',
    trackSlug: 'python',
    name: 'Fundamentos de Python',
    description: 'Sintaxis básica',
    color: '#38BDF8',
    icon: 'IconBrandPython',
    topology: { tier: 0, lane: 0 },
    prerequisites: [],
    edges: [
      {
        targetCourseSlug: 'fastapi-async',
        connectionType: 'unlocks',
        visualEffectCode: 'laser_flow_fast',
        edgeColor: '#38BDF8',
      },
    ],
    isActive: true,
  });

  const mockModule = new ModuleEntity({
    slug: 'fundamentos-de-python',
    courseSlug: 'python-1',
    title: 'Módulo 1',
    objective: 'Aprender print',
    position: 1,
    totalSections: 8,
    minStarsPercentage: 80,
    isActive: true,
  });

  const mockSection = new SectionEntity({
    slug: 'py-m01-s01',
    moduleSlug: 'fundamentos-de-python',
    title: 'Sección 1',
    position: 1,
    totalLessons: 4,
    xpReward: 50,
    isActive: true,
  });

  const mockLesson = new LessonEntity({
    slug: 'py-m01-s01-l01',
    sectionSlug: 'py-m01-s01',
    title: 'Bienvenido',
    position: 1,
    theory: {
      step1: 'Teoría 1',
      step2: 'Teoría 2',
      step3: 'Teoría 3',
      codeSnippet: 'print(1)',
    },
    item1Console: {
      prompt: 'Imprime 1',
      initialCode: '# code',
      solutionCode: 'print(1)',
      testCases: [{ input: '', expectedOutput: '1', description: 'test' }],
    },
    item2Quiz: {
      prompt: '¿Qué hace print?',
      options: [
        { id: 'a', text: 'Imprime', isCorrect: true, feedback: 'Correcto' },
        { id: 'b', text: 'Nada', isCorrect: false, feedback: 'Error' },
        { id: 'c', text: 'Suma', isCorrect: false, feedback: 'Error' },
        { id: 'd', text: 'Resta', isCorrect: false, feedback: 'Error' },
      ],
    },
    item3Prediction: {
      prompt: 'Predice salida',
      codeSnippet: 'print(2)',
      targetType: 'predict_output',
      expectedAnswer: '2',
      hint: 'Muestra 2',
    },
    xpReward: 15,
    isActive: true,
  });

  const mockVisualEffect = new VisualEffectEntity({
    code: 'laser_flow_fast',
    name: 'Flujo Láser',
    description: 'Efecto láser',
    preset: 'laser_flow',
    animationSpeed: 2.0,
    particleDensity: 1.0,
    glowIntensity: 1.0,
    defaultColor: '#38BDF8',
    dashStyle: 'solid',
    isGpuAccelerated: true,
  });

  beforeEach(() => {
    mockRepo = {
      findTracks: jest.fn().mockResolvedValue([mockTrack]),
      findTrackBySlug: jest.fn().mockImplementation(async (slug) => (slug === 'python' ? mockTrack : null)),
      findCoursesByTrack: jest.fn().mockResolvedValue([mockCourse]),
      findCourseBySlug: jest.fn().mockImplementation(async (slug) => (slug === 'python-1' ? mockCourse : null)),
      findAllCourses: jest.fn().mockResolvedValue([mockCourse]),
      findModulesByCourse: jest.fn().mockResolvedValue([mockModule]),
      findModuleBySlug: jest.fn().mockImplementation(async (slug) => (slug === 'fundamentos-de-python' ? mockModule : null)),
      findSectionsByModule: jest.fn().mockResolvedValue([mockSection]),
      findSectionBySlug: jest.fn().mockImplementation(async (slug) => (slug === 'py-m01-s01' ? mockSection : null)),
      findLessonsBySection: jest.fn().mockResolvedValue([mockLesson]),
      findLessonBySlug: jest.fn().mockImplementation(async (slug) => (slug === 'py-m01-s01-l01' ? mockLesson : null)),
      findVisualEffects: jest.fn().mockResolvedValue([mockVisualEffect]),
      findVisualEffectByCode: jest.fn().mockResolvedValue(mockVisualEffect),
    };
  });

  it('GetTracksUseCase retorna lista de tracks', async () => {
    const useCase = new GetTracksUseCase(mockRepo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('python');
  });

  it('GetTrackCoursesUseCase retorna track con cursos', async () => {
    const useCase = new GetTrackCoursesUseCase(mockRepo);
    const result = await useCase.execute('python');
    expect(result.track.slug).toBe('python');
    expect(result.courses).toHaveLength(1);
  });

  it('GetTrackCoursesUseCase arroja NotFoundException si track no existe', async () => {
    const useCase = new GetTrackCoursesUseCase(mockRepo);
    await expect(useCase.execute('inexistente')).rejects.toThrow(NotFoundException);
  });

  it('GetCourseDetailUseCase retorna curso con módulos y secciones', async () => {
    const useCase = new GetCourseDetailUseCase(mockRepo);
    const result = await useCase.execute('python-1');
    expect(result.course.slug).toBe('python-1');
    expect(result.modules).toHaveLength(1);
    expect(result.modules[0].sections).toHaveLength(1);
  });

  it('GetCourseDetailUseCase arroja NotFoundException si curso no existe', async () => {
    const useCase = new GetCourseDetailUseCase(mockRepo);
    await expect(useCase.execute('curso-fantasma')).rejects.toThrow(NotFoundException);
  });

  it('GetLessonDetailUseCase retorna micro-lección con Tríada Evaluativa', async () => {
    const useCase = new GetLessonDetailUseCase(mockRepo);
    const result = await useCase.execute('py-m01-s01-l01');
    expect(result.slug).toBe('py-m01-s01-l01');
    expect(result.item1Console.solutionCode).toBe('print(1)');
    expect(result.item2Quiz.options).toHaveLength(4);
  });

  it('GetLessonDetailUseCase arroja NotFoundException si lección no existe', async () => {
    const useCase = new GetLessonDetailUseCase(mockRepo);
    await expect(useCase.execute('leccion-inexistente')).rejects.toThrow(NotFoundException);
  });

  it('GetVisualEffectsUseCase retorna presets visuales', async () => {
    const useCase = new GetVisualEffectsUseCase(mockRepo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('laser_flow_fast');
  });

  it('GetRoadmapGraphUseCase genera GraphDataset para cursos y lecciones', async () => {
    const useCase = new GetRoadmapGraphUseCase(mockRepo);
    const coursesGraph = await useCase.getCoursesGraph('python');
    expect(coursesGraph.nodes).toHaveLength(1);
    expect(coursesGraph.nodes[0].isUnlocked).toBe(true);

    const lessonsGraph = await useCase.getLessonsGraph('python-1');
    expect(lessonsGraph.nodes).toHaveLength(8);
    expect(lessonsGraph.nodes[0].id).toBe('py-m01');
  });
});
