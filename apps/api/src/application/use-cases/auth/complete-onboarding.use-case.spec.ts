import { NotFoundException } from '@nestjs/common';
import { CompleteOnboardingUseCase } from './complete-onboarding.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { SupabaseService } from '../../../database/supabase.service';
import { CompleteOnboardingDto } from '../../../presentation/rest/auth/dto/complete-onboarding.dto';

describe('CompleteOnboardingUseCase', () => {
  let useCase: CompleteOnboardingUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockUser = new UserEntity({
    id: 'user-uuid-123',
    email: 'test@koda.academy',
    role: 'user',
    status: 'active',
    displayName: 'Estudiante Inicial',
    avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
    avatarObjectKey: null,
    documentNumber: null,
    documentType: null,
    bio: null,
    timezone: 'America/Bogota',
    locale: 'es-CO',
    onboardingCompleted: false,
    initialLanguageSlug: 'python',
    experienceLevel: 'beginner',
    learningStyle: 'hands-on',
    dailyGoalId: 'regular',
    dailyGoalMinutes: 10,
    totalXp: 0,
    currentLevel: 1,
    currentStreak: 0,
    longestStreak: 0,
    streakFreezeCount: 1,
    totalStudyTimeSeconds: 0,
    lastStudyDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new CompleteOnboardingUseCase(userRepository, supabaseService);
  });

  const dto: CompleteOnboardingDto = {
    initialLanguageSlug: 'javascript',
    experienceLevel: 'intermediate',
    learningStyle: 'projects',
    dailyGoalId: 'focused',
    dailyGoalMinutes: 15,
    displayName: 'Daniel Echeverría',
  };

  it('debe actualizar las preferencias, marcar onboardingCompleted en true y sincronizar Supabase', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.update.mockImplementation(async (entity) => entity);
    supabaseService.updateUserMetadata.mockResolvedValue({} as any);

    const result = await useCase.execute('user-uuid-123', dto);

    expect(result).toBeDefined();
    expect(result.onboardingCompleted).toBe(true);
    expect(result.initialLanguageSlug).toBe('javascript');
    expect(result.experienceLevel).toBe('intermediate');
    expect(result.displayName).toBe('Daniel Echeverría');
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(supabaseService.updateUserMetadata).toHaveBeenCalledWith('user-uuid-123', expect.objectContaining({
      onboarding_completed: true,
      initial_language_slug: 'javascript',
    }));
  });

  it('debe lanzar NotFoundException si el usuario no existe', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-user', dto)).rejects.toThrow(NotFoundException);
  });
});
