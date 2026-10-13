import { ConfigService } from '@nestjs/config';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { UserEntity } from '@domain/entities/user.entity';

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let supabaseService: jest.Mocked<SupabaseService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateProfile: jest.fn(),
      updateGamification: jest.fn(),
    };

    supabaseService = {
      resetPasswordForEmail: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'FRONTEND_URL') return 'http://localhost:3000';
        return null;
      }),
    } as unknown as jest.Mocked<ConfigService>;

    useCase = new ForgotPasswordUseCase(userRepository, supabaseService, configService);
  });

  const dto = { email: 'estudiante@koda.academy' };

  it('debe enviar correo de recuperación y retornar mensaje genérico si el usuario existe', async () => {
    const mockUser = new UserEntity({
      id: 'user-123',
      email: 'estudiante@koda.academy',
      role: 'user',
      status: 'active',
      displayName: 'Estudiante Koda',
      avatarUrl: null,
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

    userRepository.findByEmail.mockResolvedValue(mockUser);
    supabaseService.resetPasswordForEmail.mockResolvedValue({} as any);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.message).toContain('Si el correo existe en nuestra plataforma, recibirás un enlace de recuperación');
    expect(userRepository.findByEmail).toHaveBeenCalledWith('estudiante@koda.academy');
    expect(supabaseService.resetPasswordForEmail).toHaveBeenCalledWith(
      'estudiante@koda.academy',
      'http://localhost:3000/nueva-clave',
    );
  });

  it('debe devolver respuesta genérica idéntica si el correo no existe en el sistema (OWASP)', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({ email: 'inexistente@koda.academy' });

    expect(result).toBeDefined();
    expect(result.message).toContain('Si el correo existe en nuestra plataforma, recibirás un enlace de recuperación');
    expect(supabaseService.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('debe retornar mensaje genérico y mitigar fugas si Supabase falla internamente', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 'user-123', email: 'estudiante@koda.academy' } as any);
    supabaseService.resetPasswordForEmail.mockRejectedValue(new Error('Supabase SMTP service unavailable'));

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.message).toContain('Si el correo existe en nuestra plataforma, recibirás un enlace de recuperación');
  });
});
