import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { CompleteOnboardingDto } from '../../../presentation/rest/auth/dto/complete-onboarding.dto';
import { UserSessionResponseDto } from '../../dto/auth/user-session-response.dto';

@Injectable()
export class CompleteOnboardingUseCase {
  private readonly logger = new Logger(CompleteOnboardingUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(userId: string, dto: CompleteOnboardingDto): Promise<UserSessionResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado en la base de datos.`);
    }

    user.completeOnboarding({
      initialLanguageSlug: dto.initialLanguageSlug,
      experienceLevel: dto.experienceLevel,
      learningStyle: dto.learningStyle,
      dailyGoalId: dto.dailyGoalId,
      dailyGoalMinutes: dto.dailyGoalMinutes,
      displayName: dto.displayName,
    });

    const updatedUser = await this.userRepository.update(user);

    // Sincronización transparente con Supabase Auth metadata
    try {
      await this.supabaseService.updateUserMetadata(userId, {
        onboarding_completed: true,
        initial_language_slug: dto.initialLanguageSlug,
        experience_level: dto.experienceLevel,
        learning_style: dto.learningStyle,
        daily_goal_id: dto.dailyGoalId,
        daily_goal_minutes: dto.dailyGoalMinutes,
        ...(dto.displayName ? { display_name: dto.displayName, full_name: dto.displayName } : {}),
      });
      this.logger.log(`Metadata de Supabase Auth sincronizada exitosamente para usuario: ${userId}`);
    } catch (err: any) {
      this.logger.warn(`No se pudo sincronizar metadata en Supabase Auth: ${err.message}`);
    }

    return UserSessionResponseDto.fromEntity(updatedUser);
  }
}
