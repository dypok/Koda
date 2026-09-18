import { ConflictException } from '@nestjs/common';
import { RegisterWithOtpUseCase } from './register-with-otp.use-case';
import { SupabaseService } from '../../../database/supabase.service';
import { RegisterOtpDto } from '../../../presentation/rest/auth/dto/register-otp.dto';

describe('RegisterWithOtpUseCase', () => {
  let useCase: RegisterWithOtpUseCase;
  let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(() => {
    supabaseService = {
      signUpWithEmail: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new RegisterWithOtpUseCase(supabaseService);
  });

  const dto: RegisterOtpDto = {
    fullName: 'Estudiante Prueba',
    email: 'test@koda.academy',
    password: 'Password#2026',
    initialLanguageSlug: 'python',
    experienceLevel: 'beginner',
    learningStyle: 'hands-on',
    dailyGoalId: 'regular',
    dailyGoalMinutes: 10,
  };

  it('debe iniciar el registro y retornar requiresOtp: true si el usuario es nuevo', async () => {
    supabaseService.signUpWithEmail.mockResolvedValue({
      user: {
        id: 'new-user-123',
        email: 'test@koda.academy',
        identities: [{ id: 'identity-1' }] as any,
      } as any,
      session: null,
    });

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.email).toBe('test@koda.academy');
    expect(result.requiresOtp).toBe(true);
    expect(supabaseService.signUpWithEmail).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar ConflictException si el correo ya esta registrado en Supabase', async () => {
    supabaseService.signUpWithEmail.mockResolvedValue({
      user: {
        id: 'existing-user-123',
        email: 'test@koda.academy',
        identities: [] as any, // identidades vacías indica duplicado
      } as any,
      session: null,
    });

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
  });
});
