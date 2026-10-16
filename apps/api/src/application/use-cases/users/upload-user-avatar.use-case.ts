import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { SupabaseService } from '../../../database/supabase.service';
import { UserProfileResponseDto } from '../../dto/users/user-profile-response.dto';

export interface UploadedAvatarFile {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export const MAX_AVATAR_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB

export const ALLOWED_AVATAR_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

@Injectable()
export class UploadUserAvatarUseCase {
  private readonly logger = new Logger(UploadUserAvatarUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(userId: string, file?: UploadedAvatarFile): Promise<UserProfileResponseDto> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Debes adjuntar un archivo de imagen válido en el campo "file".');
    }

    if (file.size > MAX_AVATAR_FILE_SIZE_BYTES) {
      throw new BadRequestException('El archivo de avatar excede el límite máximo permitido de 3 MB.');
    }

    const ext = ALLOWED_AVATAR_MIME_TYPES[file.mimetype];
    if (!ext) {
      throw new BadRequestException(
        'Formato de imagen no soportado. Formatos permitidos: JPEG, PNG, WEBP, SVG.',
      );
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado en la base de datos.`);
    }

    const fileName = `avatar-${Date.now()}.${ext}`;
    const { path, publicUrl } = await this.supabaseService.uploadAvatar(
      userId,
      fileName,
      file.buffer,
      file.mimetype,
    );

    user.updateProfile({
      avatarUrl: publicUrl,
      avatarObjectKey: path,
    });

    const updatedUser = await this.userRepository.update(user);

    try {
      await this.supabaseService.updateUserMetadata(userId, {
        avatar_url: publicUrl,
      });
      this.logger.log(`Avatar sincronizado en Supabase Auth para usuario ${userId}`);
    } catch (error: any) {
      this.logger.warn(
        `No se pudo sincronizar avatar_url en Supabase Auth: ${error?.message || error}`,
      );
    }

    return UserProfileResponseDto.fromEntity(updatedUser);
  }
}
