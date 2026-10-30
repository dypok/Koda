import { Controller, Get, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AchievementsService } from './achievements.service';
import type { UserAchievementsResponse } from '@koda/types';

@ApiTags('Achievements')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth()
@Controller(['users/me/achievements', 'achievements'])
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener catálogo de logros y medallas del usuario autenticado',
    description:
      'Retorna la lista de todos los logros activos con su estado (bloqueado/desbloqueado), métricas de progreso porcentual y evalúa dinámicamente si califica para nuevos logros acreditando XP correspondiente.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Catálogo de logros del usuario obtenido exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de acceso no proporcionado o inválido.',
  })
  async getAchievements(
    @CurrentUser() user: SupabaseAuthUser,
  ): Promise<UserAchievementsResponse> {
    return this.achievementsService.getAchievementsForUser(user.id);
  }

  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Forzar evaluación y conciliación de logros del usuario',
    description:
      'Compara las métricas pedagógicas y de gamificación del usuario contra las reglas del catálogo y retorna la lista actualizada junto con cualquier logro recién desbloqueado.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Evaluación de logros realizada con éxito.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de acceso no proporcionado o inválido.',
  })
  async checkAchievements(
    @CurrentUser() user: SupabaseAuthUser,
  ): Promise<UserAchievementsResponse> {
    return this.achievementsService.getAchievementsForUser(user.id);
  }
}
