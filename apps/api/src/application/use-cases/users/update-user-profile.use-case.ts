import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { UpdateUserProfileDto } from '../../../presentation/rest/users/dto/update-user-profile.dto';
import { UserProfileResponseDto } from '../../dto/users/user-profile-response.dto';

@Injectable()
export class UpdateUserProfileUseCase {
  private readonly logger = new Logger(UpdateUserProfileUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(userId: string, dto: UpdateUserProfileDto): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado en la base de datos.`);
    }

    user.updateProfile(dto);

    const updatedUser = await this.userRepository.update(user);

    // Sincronización de metadatos en Supabase Auth si se actualizan campos visuales/públicos
    if (dto.displayName || dto.avatarUrl) {
      try {
        const metadataToSync: Record<string, any> = {};
        if (dto.displayName) {
          metadataToSync.display_name = dto.displayName;
          metadataToSync.full_name = dto.displayName;
        }
        if (dto.avatarUrl) {
          metadataToSync.avatar_url = dto.avatarUrl;
        }
        await this.supabaseService.updateUserMetadata(userId, metadataToSync);
        this.logger.log(`Metadatos de Supabase Auth sincronizados para usuario ${userId}`);
      } catch (error: any) {
        this.logger.warn(`No se pudo sincronizar metadata en Supabase Auth: ${error?.message || error}`);
      }
    }

    return UserProfileResponseDto.fromEntity(updatedUser);
  }
}
