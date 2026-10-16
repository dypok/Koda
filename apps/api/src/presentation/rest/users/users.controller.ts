import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetUserProfileUseCase } from '@application/use-cases/users/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/use-cases/users/update-user-profile.use-case';
import {
  UploadUserAvatarUseCase,
  UploadedAvatarFile,
  MAX_AVATAR_FILE_SIZE_BYTES,
} from '@application/use-cases/users/upload-user-avatar.use-case';
import { UserProfileResponseDto } from '@application/dto/users/user-profile-response.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly uploadUserAvatarUseCase: UploadUserAvatarUseCase,
  ) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Retorna el perfil de usuario consolidado: datos personales, avatar de Koda, documento de identidad enmascarado para certificados (CC ***678), preferencias pedagógicas y métricas de gamificación.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil de usuario obtenido con éxito.',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token de acceso no proporcionado o inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no registrado en la base de datos de Koda.' })
  async getProfile(@CurrentUser() authUser: SupabaseAuthUser): Promise<UserProfileResponseDto> {
    return this.getUserProfileUseCase.execute(authUser.id);
  }

  @Patch('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil y preferencias del usuario autenticado',
    description:
      'Permite modificar datos del perfil (nombre a mostrar, avatar oficial, biografía, metas diarias de estudio y número de documento legal) manteniendo el enmascaramiento en la respuesta y sincronizando metadatos de sesión.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil actualizado exitosamente.',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cuerpo de la petición con datos o formato inválido.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token de acceso no proporcionado o inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado en el sistema.' })
  async updateProfile(
    @CurrentUser() authUser: SupabaseAuthUser,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    return this.updateUserProfileUseCase.execute(authUser.id, dto);
  }

  @Post('me/avatar')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_AVATAR_FILE_SIZE_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Subir avatar personalizado del usuario autenticado',
    description:
      'Recibe una imagen en formato multipart/form-data (JPEG, PNG, WEBP, SVG; máx. 3 MB), la almacena en el bucket avatars de Supabase Storage, actualiza el perfil en PostgreSQL y sincroniza los metadatos de sesión.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Avatar subido y perfil actualizado exitosamente.',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Archivo ausente, formato no permitido o excede los 3 MB.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token de acceso no proporcionado o inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado en el sistema.' })
  async uploadAvatar(
    @CurrentUser() authUser: SupabaseAuthUser,
    @UploadedFile() file: UploadedAvatarFile,
  ): Promise<UserProfileResponseDto> {
    return this.uploadUserAvatarUseCase.execute(authUser.id, file);
  }
}
