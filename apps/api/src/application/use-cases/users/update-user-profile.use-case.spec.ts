import { NotFoundException } from '@nestjs/common';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { SupabaseService } from '../../../database/supabase.service';
import { UpdateUserProfileDto } from '../../../presentation/rest/users/dto/update-user-profile.dto';

describe('UpdateUserProfileUseCase', () => {
  let useCase: UpdateUserProfileUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let supabaseService: jest.Mocked<SupabaseService>;

  const createMockUserEntity = () =>
    new UserEntity({
      id: 'user-uuid-123',
      email: 'estudiante@koda.academy',
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
      onboardingCompleted: true,
      initialLanguageSlug: 'python',
      experienceLevel: 'beginner',
      learningStyle: 'hands-on',
      dailyGoalId: 'regular',
      dailyGoalMinutes: 10,
      totalXp: 100,
      currentLevel: 1,
      currentStreak: 1,
      longestStreak: 1,
      streakFreezeCount: 1,
      totalStudyTimeSeconds: 600,
      lastStudyDate: null,
      createdAt: new Date('2026-09-01T00:00:00Z'),
      updatedAt: new Date('2026-09-01T00:00:00Z'),
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
      updateUserMetadata: jest.fn(),
      verifyAuthToken: jest.fn(),
      getClient: jest.fn(),
      getAdminClient: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new UpdateUserProfileUseCase(userRepository, supabaseService);
  });

  it('debe actualizar campos del perfil, guardar en base de datos y sincronizar metadatos', async () => {
    const user = createMockUserEntity();
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (entity) => entity);
    supabaseService.updateUserMetadata.mockResolvedValue({} as any);

    const dto: UpdateUserProfileDto = {
      displayName: 'Dylan Gamero Actualizado',
      avatarUrl: '/avatars/koda-hacker.svg',
      bio: 'Programador fullstack y estudiante de Python',
      documentType: 'CC',
      documentNumber: '1047123456',
      dailyGoalId: 'focused',
      dailyGoalMinutes: 25,
    };

    const result = await useCase.execute('user-uuid-123', dto);

    expect(result).toBeDefined();
    expect(result.displayName).toBe('Dylan Gamero Actualizado');
    expect(result.avatarUrl).toBe('/avatars/koda-hacker.svg');
    expect(result.bio).toBe('Programador fullstack y estudiante de Python');
    expect(result.documentType).toBe('CC');
    expect(result.documentNumberMasked).toBe('***3456');
    expect(result.formattedMaskedDocument).toBe('CC ***3456');
    expect(result.dailyGoalId).toBe('focused');
    expect(result.dailyGoalMinutes).toBe(25);

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(supabaseService.updateUserMetadata).toHaveBeenCalledWith('user-uuid-123', {
      display_name: 'Dylan Gamero Actualizado',
      full_name: 'Dylan Gamero Actualizado',
      avatar_url: '/avatars/koda-hacker.svg',
    });
  });

  it('no debe llamar a updateUserMetadata si no se modifica displayName ni avatarUrl', async () => {
    const user = createMockUserEntity();
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (entity) => entity);

    const dto: UpdateUserProfileDto = {
      bio: 'Nueva biografía solamente',
      dailyGoalMinutes: 30,
    };

    const result = await useCase.execute('user-uuid-123', dto);

    expect(result.bio).toBe('Nueva biografía solamente');
    expect(result.dailyGoalMinutes).toBe(30);
    expect(supabaseService.updateUserMetadata).not.toHaveBeenCalled();
  });

  it('debe tolerar fallos en la sincronización con Supabase Auth sin arrojar error fatal', async () => {
    const user = createMockUserEntity();
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (entity) => entity);
    supabaseService.updateUserMetadata.mockRejectedValue(new Error('Supabase unreachable'));

    const dto: UpdateUserProfileDto = {
      displayName: 'Nuevo Nombre',
    };

    const result = await useCase.execute('user-uuid-123', dto);

    expect(result).toBeDefined();
    expect(result.displayName).toBe('Nuevo Nombre');
    expect(userRepository.update).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar NotFoundException si el usuario no existe', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent', { displayName: 'Test' })).rejects.toThrow(NotFoundException);
  });
});
