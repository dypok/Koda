import { UnauthorizedException } from '@nestjs/common';
import { ValidateUserSessionUseCase } from './validate-user-session.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { SupabaseService } from '../../../database/supabase.service';

describe('ValidateUserSessionUseCase', () => {
  let useCase: ValidateUserSessionUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockUserEntity = new UserEntity({
    id: 'user-uuid-123',
    email: 'estudiante@koda.edu',
    role: 'user',
    status: 'active',
    displayName: 'Estudiante Koda',
    avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
    avatarObjectKey: null,
    documentNumber: null,
    documentType: null,
    bio: null,
    timezone: 'America/Bogota',
    locale: 'es-CO',
    initialLanguageSlug: 'python',
    experienceLevel: 'beginner',
    learningStyle: 'hands-on',
    dailyGoalId: 'regular',
    dailyGoalMinutes: 10,
    totalXp: 150,
    currentLevel: 2,
    currentStreak: 3,
    longestStreak: 5,
    streakFreezeCount: 1,
    totalStudyTimeSeconds: 1200,
    lastStudyDate: new Date('2026-09-15T12:00:00Z'),
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-15T12:00:00Z'),
  });

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateProfile: jest.fn(),
      updateGamification: jest.fn(),
    };

    supabaseService = {
      verifyAuthToken: jest.fn(),
      getClient: jest.fn(),
      getAdminClient: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new ValidateUserSessionUseCase(userRepository, supabaseService);
  });

  it('debe lanzar UnauthorizedException si no se proporciona token', async () => {
    await expect(useCase.execute('')).rejects.toThrow(UnauthorizedException);
  });

  it('debe lanzar UnauthorizedException si Supabase no valida el token', async () => {
    supabaseService.verifyAuthToken.mockResolvedValue(null);

    await expect(useCase.execute('invalid-token')).rejects.toThrow(UnauthorizedException);
  });

  it('debe retornar la sesion si el usuario ya existe en la base de datos', async () => {
    supabaseService.verifyAuthToken.mockResolvedValue({
      id: 'user-uuid-123',
      email: 'estudiante@koda.edu',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    });

    userRepository.findById.mockResolvedValue(mockUserEntity);

    const result = await useCase.execute('Bearer valid-jwt-token');

    expect(result).toBeDefined();
    expect(result.id).toBe('user-uuid-123');
    expect(result.email).toBe('estudiante@koda.edu');
    expect(result.role).toBe('user');
    expect(result.totalXp).toBe(150);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('debe aprovisionar automaticamente el usuario si existe en Supabase pero no en PostgreSQL', async () => {
    supabaseService.verifyAuthToken.mockResolvedValue({
      id: 'new-uuid-456',
      email: 'nuevo@koda.edu',
      app_metadata: {},
      user_metadata: {
        full_name: 'Nuevo Estudiante',
        role: 'user',
        experience_level: 'intermediate',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    });

    userRepository.findById.mockResolvedValue(null);
    userRepository.create.mockImplementation(async (entity) => entity);

    const result = await useCase.execute('Bearer new-jwt-token');

    expect(result).toBeDefined();
    expect(result.id).toBe('new-uuid-456');
    expect(result.email).toBe('nuevo@koda.edu');
    expect(result.displayName).toBe('Nuevo Estudiante');
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});
