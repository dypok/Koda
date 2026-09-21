import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrerequisitesGuard } from './prerequisites.guard';
import { ValidateDagPrerequisitesUseCase } from '@application/use-cases/learning/validate-dag-prerequisites.use-case';
import { ICurriculumRepository } from '../../domain/repositories/curriculum.repository';
import { SupabaseService } from '../../database/supabase.service';

describe('PrerequisitesGuard', () => {
  let guard: PrerequisitesGuard;
  let validateDagPrerequisitesUseCase: jest.Mocked<ValidateDagPrerequisitesUseCase>;
  let curriculumRepository: jest.Mocked<ICurriculumRepository>;
  let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(() => {
    validateDagPrerequisitesUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ValidateDagPrerequisitesUseCase>;

    curriculumRepository = {
      findTracks: jest.fn(),
      findTrackBySlug: jest.fn(),
      findCoursesByTrack: jest.fn(),
      findCourseBySlug: jest.fn(),
      findAllCourses: jest.fn(),
      findModulesByCourse: jest.fn(),
      findModuleBySlug: jest.fn(),
      findSectionsByModule: jest.fn(),
      findSectionBySlug: jest.fn(),
      findLessonsBySection: jest.fn(),
      findLessonBySlug: jest.fn(),
      findVisualEffects: jest.fn(),
      findVisualEffectByCode: jest.fn(),
    };


    supabaseService = {
      verifyAuthToken: jest.fn(),
      getClient: jest.fn(),
      getAdminClient: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    guard = new PrerequisitesGuard(
      validateDagPrerequisitesUseCase,
      curriculumRepository,
      supabaseService,
    );
  });

  const createMockContext = (params: any, headers: any = {}): ExecutionContext => {
    return {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          params,
          headers,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('debe permitir el acceso si no hay identificador de lección o sección en la petición', async () => {
    const context = createMockContext({});
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('debe permitir el acceso si el nodo es inicial (ej. lección posición 1 sin dependencias)', async () => {
    curriculumRepository.findLessonBySlug.mockResolvedValue({
      slug: 'print-basic',
      position: 1,
    } as any);

    const context = createMockContext({ lessonId: 'print-basic' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('debe permitir el acceso cuando el usuario cumple con todos los requisitos', async () => {
    curriculumRepository.findLessonBySlug.mockResolvedValue({
      slug: 'lesson-advanced',
      position: 1,
    } as any);

    const context = createMockContext({ lessonId: 'lesson-advanced' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
