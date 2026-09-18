import { UnauthorizedException } from '@nestjs/common';
import { VerifyOtpUseCase } from './verify-otp.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { SupabaseService } from '../../../database/supabase.service';
import { VerifyOtpDto } from '../../../presentation/rest/auth/dto/verify-otp.dto';

describe('VerifyOtpUseCase', () => {
  let useCase: VerifyOtpUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockUser = new UserEntity({
    id: 'user-uuid-123',
    email: 'test@koda.academy',
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
      verifyOtp: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new VerifyOtpUseCase(userRepository, supabaseService);
  });

  const dto: VerifyOtpDto = {
    email: 'test@koda.academy',
    token: '123456',
    type: 'signup',
  };

  it('debe validar OTP y devolver la sesión con tokens para usuario existente', async () => {
    supabaseService.verifyOtp.mockResolvedValue({
      user: {
        id: 'user-uuid-123',
        email: 'test@koda.academy',
        user_metadata: {},
      } as any,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      } as any,
    });

    userRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.accessToken).toBe('mock-access-token');
    expect(result.session.id).toBe('user-uuid-123');
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('debe aprovisionar el usuario si no existía en la base de datos', async () => {
    supabaseService.verifyOtp.mockResolvedValue({
      user: {
        id: 'new-uuid-456',
        email: 'test@koda.academy',
        user_metadata: { full_name: 'Estudiante Nuevo' },
      } as any,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      } as any,
    });

    userRepository.findById.mockResolvedValue(null);
    userRepository.create.mockImplementation(async (entity) => entity);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.session.id).toBe('new-uuid-456');
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar UnauthorizedException si Supabase no retorna usuario o sesión', async () => {
    supabaseService.verifyOtp.mockResolvedValue({
      user: null as any,
      session: null as any,
    });

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
  });
});
