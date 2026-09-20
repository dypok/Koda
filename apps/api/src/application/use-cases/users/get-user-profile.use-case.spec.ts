import { NotFoundException } from '@nestjs/common';
import { GetUserProfileUseCase } from './get-user-profile.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const mockUserEntity = new UserEntity({
    id: 'user-uuid-123',
    email: 'estudiante@koda.academy',
    role: 'user',
    status: 'active',
    displayName: 'Dylan Gamero',
    avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
    avatarObjectKey: null,
    documentNumber: '1047456789',
    documentType: 'CC',
    bio: 'Estudiante enfocado en Python',
    timezone: 'America/Bogota',
    locale: 'es-CO',
    onboardingCompleted: true,
    initialLanguageSlug: 'python',
    experienceLevel: 'intermediate',
    learningStyle: 'hands-on',
    dailyGoalId: 'regular',
    dailyGoalMinutes: 15,
    totalXp: 350,
    currentLevel: 3,
    currentStreak: 5,
    longestStreak: 10,
    streakFreezeCount: 2,
    totalStudyTimeSeconds: 4500,
    lastStudyDate: new Date('2026-09-19T20:00:00Z'),
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-19T20:00:00Z'),
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

    useCase = new GetUserProfileUseCase(userRepository);
  });

  it('debe retornar el perfil del usuario con documento enmascarado y métricas', async () => {
    userRepository.findById.mockResolvedValue(mockUserEntity);

    const result = await useCase.execute('user-uuid-123');

    expect(result).toBeDefined();
    expect(result.id).toBe('user-uuid-123');
    expect(result.displayName).toBe('Dylan Gamero');
    expect(result.documentType).toBe('CC');
    expect(result.documentNumberMasked).toBe('***6789');
    expect(result.formattedMaskedDocument).toBe('CC ***6789');
    expect(result.totalXp).toBe(350);
    expect(result.currentStreak).toBe(5);
    expect(result.onboardingCompleted).toBe(true);
    expect(userRepository.findById).toHaveBeenCalledWith('user-uuid-123');
  });

  it('debe lanzar NotFoundException si el usuario no existe en la base de datos', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('inexistent-uuid')).rejects.toThrow(NotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith('inexistent-uuid');
  });
});
