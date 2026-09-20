import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { ForgotPasswordDto } from '../../../presentation/rest/auth/dto/forgot-password.dto';

export interface ForgotPasswordResponse {
  message: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const genericResponse: ForgotPasswordResponse = {
      message: 'Si el correo existe en nuestra plataforma, recibirás un enlace de recuperación con las instrucciones.',
    };

    try {
      const user = await this.userRepository.findByEmail(normalizedEmail);

      if (!user) {
        this.logger.warn(`Solicitud de recuperación para correo inexistente: ${normalizedEmail}`);
        // Retardo simulado para prevenir timing attacks y enumeración de usuarios (OWASP)
        await new Promise((resolve) => setTimeout(resolve, 100));
        return genericResponse;
      }

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      const redirectTo = `${frontendUrl}/nueva-clave`;

      await this.supabaseService.resetPasswordForEmail(normalizedEmail, redirectTo);
      this.logger.log(`Enlace de restablecimiento de contraseña despachado para: ${normalizedEmail}`);

      return genericResponse;
    } catch (error: any) {
      this.logger.error(`Error al procesar recuperación de contraseña para ${normalizedEmail}: ${error.message}`);
      // Principio OWASP: Nunca revelar excepciones internas que delaten existencia de cuentas
      return genericResponse;
    }
  }
}
