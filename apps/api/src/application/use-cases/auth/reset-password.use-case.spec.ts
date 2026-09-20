import { BadRequestException } from '@nestjs/common';
import { ResetPasswordUseCase } from './reset-password.use-case';
import { SupabaseService } from '../../../database/supabase.service';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(() => {
    supabaseService = {
      verifyRecoveryOtp: jest.fn(),
      updateUserPassword: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new ResetPasswordUseCase(supabaseService);
  });

  const dto = {
    token: 'valid-recovery-token-123',
    email: 'estudiante@koda.academy',
    newPassword: 'NewPassword#2026',
  };

  it('debe validar token y actualizar la contraseña correctamente', async () => {
    supabaseService.verifyRecoveryOtp.mockResolvedValue({
      user: { id: 'user-uuid-123', email: 'estudiante@koda.academy' } as any,
      session: { access_token: 'temp-session' } as any,
    });
    supabaseService.updateUserPassword.mockResolvedValue({} as any);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain('Tu contraseña ha sido actualizada exitosamente');
    expect(supabaseService.verifyRecoveryOtp).toHaveBeenCalledWith('valid-recovery-token-123', 'estudiante@koda.academy');
    expect(supabaseService.updateUserPassword).toHaveBeenCalledWith('user-uuid-123', 'NewPassword#2026');
  });

  it('debe rechazar con BadRequestException si el token es inválido o ha expirado', async () => {
    supabaseService.verifyRecoveryOtp.mockRejectedValue(new Error('Token has expired or is invalid'));

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    expect(supabaseService.updateUserPassword).not.toHaveBeenCalled();
  });

  it('debe rechazar con BadRequestException si verifyRecoveryOtp no retorna usuario', async () => {
    supabaseService.verifyRecoveryOtp.mockResolvedValue(null as any);

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    expect(supabaseService.updateUserPassword).not.toHaveBeenCalled();
  });

  it('debe rechazar si falla la actualización de contraseña en Supabase Auth', async () => {
    supabaseService.verifyRecoveryOtp.mockResolvedValue({
      user: { id: 'user-uuid-123' } as any,
    });
    supabaseService.updateUserPassword.mockRejectedValue(new Error('Password rejected by provider'));

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });
});
