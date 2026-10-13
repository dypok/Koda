import { Injectable, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../../database/supabase.service';
import { RegisterOtpDto } from '../../../presentation/rest/auth/dto/register-otp.dto';

export interface RegisterWithOtpResponse {
  message: string;
  email: string;
  requiresOtp: boolean;
  userId?: string;
}

@Injectable()
export class RegisterWithOtpUseCase {
  private readonly logger = new Logger(RegisterWithOtpUseCase.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async execute(dto: RegisterOtpDto): Promise<RegisterWithOtpResponse> {
    const metadata = {
      full_name: dto.fullName,
      display_name: dto.fullName,
      initial_language_slug: dto.initialLanguageSlug || 'python',
      experience_level: dto.experienceLevel || 'beginner',
      learning_style: dto.learningStyle || 'hands-on',
      daily_goal_id: dto.dailyGoalId || 'regular',
      daily_goal_minutes: dto.dailyGoalMinutes || 10,
    };

    try {
      const data = await this.supabaseService.signUpWithEmail(dto.email, dto.password, metadata);

      // Si Supabase devuelve identidades vacías o ya confirmadas, el usuario ya existe
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new ConflictException('Ya existe una cuenta registrada con este correo electrónico.');
      }

      this.logger.log(`Registro con OTP iniciado exitosamente para: ${dto.email}`);

      return {
        message: 'Código de verificación OTP enviado exitosamente a tu correo.',
        email: dto.email,
        requiresOtp: true,
        userId: data.user?.id,
      };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error en registro con OTP: ${error.message}`);
      const rawMessage = error.message || '';
      const cleanMessage =
        rawMessage.toLowerCase().includes('supabase') ||
        rawMessage.toLowerCase().includes('database') ||
        rawMessage.toLowerCase().includes('duplicate key')
          ? 'No fue posible completar el registro. Inténtalo de nuevo más tarde.'
          : rawMessage || 'No fue posible completar el registro.';
      throw new BadRequestException(cleanMessage);
    }
  }
}
