import { Injectable, Inject, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { SupabaseService } from '../../../database/supabase.service';
import { VerifyOtpDto } from '../../../presentation/rest/auth/dto/verify-otp.dto';
import { UserSessionResponseDto } from '../../dto/auth/user-session-response.dto';

export interface VerifyOtpResponse {
  session: UserSessionResponseDto;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class VerifyOtpUseCase {
  private readonly logger = new Logger(VerifyOtpUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(dto: VerifyOtpDto): Promise<VerifyOtpResponse> {
    try {
      const data = await this.supabaseService.verifyOtp(dto.email, dto.token, dto.type || 'signup');

      if (!data || !data.user || !data.session) {
        throw new UnauthorizedException('Código OTP inválido o expirado.');
      }

      const authUser = data.user;
      let user = await this.userRepository.findById(authUser.id);

      if (!user) {
        const meta = authUser.user_metadata || {};
        const newUser = new UserEntity({
          id: authUser.id,
          email: authUser.email || dto.email,
          role: (meta.role as any) || 'user',
          status: 'active',
          displayName: meta.full_name || meta.display_name || dto.email.split('@')[0] || 'Estudiante Koda',
          avatarUrl: meta.avatar_url || '/brand/koda-mascot-cartoon-2d.svg',
          avatarObjectKey: null,
          documentNumber: null,
          documentType: null,
          bio: null,
          timezone: meta.timezone || 'America/Bogota',
          locale: meta.locale || 'es-CO',
          onboardingCompleted: false,
          initialLanguageSlug: meta.initial_language_slug || 'python',
          experienceLevel: meta.experience_level || 'beginner',
          learningStyle: meta.learning_style || 'hands-on',
          dailyGoalId: meta.daily_goal_id || 'regular',
          dailyGoalMinutes: Number(meta.daily_goal_minutes) || 10,
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

        user = await this.userRepository.create(newUser);
        this.logger.log(`Usuario aprovisionado vía verificación OTP ID: ${authUser.id}`);
      }

      return {
        session: UserSessionResponseDto.fromEntity(user),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error(`Fallo en verificación OTP: ${error.message}`);
      throw new BadRequestException(error.message || 'Código OTP inválido o expirado.');
    }
  }
}
