import { Controller, Post, Get, Body, Headers, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { ValidateUserSessionUseCase } from '@application/use-cases/auth/validate-user-session.use-case';
import { UserSessionResponseDto } from '@application/dto/auth/user-session-response.dto';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { VerifyTokenDto } from './dto/verify-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly validateUserSessionUseCase: ValidateUserSessionUseCase) {}

  @Post('verify-session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar y sincronizar sesión de Supabase Auth',
    description: 'Valida la autenticidad del token JWT de Supabase, aprovisiona la cuenta en public.users si es necesario y entrega el perfil completo con métricas de estudio.',
  })
  @ApiResponse({ status: 200, description: 'Sesión válida y perfil resuelto.', type: UserSessionResponseDto })
  @ApiResponse({ status: 401, description: 'Token de sesión inválido o expirado.' })
  async verifySession(
    @Body() dto: VerifyTokenDto,
    @Headers('authorization') authHeader?: string,
  ): Promise<UserSessionResponseDto> {
    const token = dto.token || authHeader || '';
    return this.validateUserSessionUseCase.execute(token);
  }

  @Get('session')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener sesión del usuario autenticado',
    description: 'Consulta los datos del usuario actual a partir del token Bearer validado por SupabaseAuthGuard.',
  })
  @ApiResponse({ status: 200, description: 'Sesión activa del usuario.', type: UserSessionResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  async getSession(@CurrentUser() authUser: SupabaseAuthUser): Promise<UserSessionResponseDto> {
    // Si ya pasó el guard, usamos el token de la petición o el ID directo
    return this.validateUserSessionUseCase.execute(authUser.id);
  }
}