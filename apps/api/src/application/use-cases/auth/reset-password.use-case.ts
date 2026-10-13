import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../../database/supabase.service';
import { ResetPasswordDto } from '../../../presentation/rest/auth/dto/reset-password.dto';

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

@Injectable()
export class ResetPasswordUseCase {
  private readonly logger = new Logger(ResetPasswordUseCase.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async execute(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    try {
      const normalizedEmail = dto.email ? dto.email.trim().toLowerCase() : undefined;
      const verifyData = await this.supabaseService.verifyRecoveryOtp(dto.token, normalizedEmail);

      if (!verifyData || !verifyData.user) {
        throw new BadRequestException('El token de recuperación es inválido o ha expirado.');
      }

      const userId = verifyData.user.id;
      await this.supabaseService.updateUserPassword(userId, dto.newPassword);

      this.logger.log(`Contraseña restablecida exitosamente para el usuario ID: ${userId}`);

      return {
        message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.',
        success: true,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al restablecer contraseña: ${error.message}`);
      throw new BadRequestException('No fue posible restablecer la contraseña. Verifica que el token sea válido y no haya expirado.');
    }
  }
}
