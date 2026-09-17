import { Injectable, Inject, UnauthorizedException, Logger } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { UserSessionResponseDto } from '../../dto/auth/user-session-response.dto';
import { SupabaseService } from '../../../database/supabase.service';

@Injectable()
export class ValidateUserSessionUseCase {
  private readonly logger = new Logger(ValidateUserSessionUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(token: string): Promise<UserSessionResponseDto> {
    if (!token) {
      throw new UnauthorizedException('Token de autenticación no proporcionado.');
    }

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const authUser = await this.supabaseService.verifyAuthToken(cleanToken);

    if (!authUser || !authUser.id) {
      throw new UnauthorizedException('Token de sesión inválido o expirado en Supabase Auth.');
    }

    let user = await this.userRepository.findById(authUser.id);

    // Si el usuario acaba de crearse y el trigger aún no se ejecutó, aprovisionar de forma segura
    if (!user) {
      const meta = authUser.user_metadata || {};
      const newUser = new UserEntity({
        id: authUser.id,
        email: authUser.email || '',
        role: (meta.role as any) || 'user',
        status: 'active',
        displayName: meta.full_name || meta.display_name || authUser.email?.split('@')[0] || 'Estudiante Koda',
        avatarUrl: meta.avatar_url || '/brand/koda-mascot-cartoon-2d.svg',
        avatarObjectKey: null,
        documentNumber: null,
        documentType: null,
        bio: null,
        timezone: meta.timezone || 'America/Bogota',
        locale: meta.locale || 'es-CO',
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
      this.logger.log(`Usuario aprovisionado exitosamente para ID: ${authUser.id}`);
    }

    return UserSessionResponseDto.fromEntity(user);
  }
}