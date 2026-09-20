import { Controller, Post, Get, Body, Headers, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { ValidateUserSessionUseCase } from '@application/use-cases/auth/validate-user-session.use-case';
import { RegisterWithOtpUseCase, RegisterWithOtpResponse } from '@application/use-cases/auth/register-with-otp.use-case';
import { VerifyOtpUseCase, VerifyOtpResponse } from '@application/use-cases/auth/verify-otp.use-case';
import { CompleteOnboardingUseCase } from '@application/use-cases/auth/complete-onboarding.use-case';
import { ForgotPasswordUseCase, ForgotPasswordResponse } from '@application/use-cases/auth/forgot-password.use-case';
import { ResetPasswordUseCase, ResetPasswordResponse } from '@application/use-cases/auth/reset-password.use-case';
import { UserSessionResponseDto } from '@application/dto/auth/user-session-response.dto';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { RegisterOtpDto } from './dto/register-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly validateUserSessionUseCase: ValidateUserSessionUseCase,
    private readonly registerWithOtpUseCase: RegisterWithOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly completeOnboardingUseCase: CompleteOnboardingUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

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
    return this.validateUserSessionUseCase.execute(authUser.id);
  }

  @Post('register-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar usuario tradicional con validación OTP',
    description: 'Crea el usuario en Supabase Auth y despacha un código OTP de 6 dígitos a su correo electrónico.',
  })
  @ApiResponse({ status: 201, description: 'Código OTP enviado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos.' })
  @ApiResponse({ status: 409, description: 'El correo ya se encuentra registrado.' })
  async registerWithOtp(@Body() dto: RegisterOtpDto): Promise<RegisterWithOtpResponse> {
    return this.registerWithOtpUseCase.execute(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar código OTP y emitir sesión',
    description: 'Valida el código numérico de 6 dígitos con Supabase Auth, aprovisiona la cuenta en PostgreSQL y retorna la sesión con tokens.',
  })
  @ApiResponse({ status: 200, description: 'Código OTP verificado correctamente.' })
  @ApiResponse({ status: 401, description: 'Código OTP inválido o expirado.' })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<VerifyOtpResponse> {
    return this.verifyOtpUseCase.execute(dto);
  }

  @Post('onboarding')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Completar y sincronizar onboarding del estudiante',
    description: 'Guarda las preferencias educativas (tecnología, nivel, metas, estilo) en PostgreSQL y sincroniza la metadata en Supabase Auth marcando onboardingCompleted en true.',
  })
  @ApiResponse({ status: 200, description: 'Onboarding completado exitosamente.', type: UserSessionResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async completeOnboarding(
    @CurrentUser() authUser: SupabaseAuthUser,
    @Body() dto: CompleteOnboardingDto,
  ): Promise<UserSessionResponseDto> {
    return this.completeOnboardingUseCase.execute(authUser.id, dto);
  }

  @Get('onboarding-status')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consultar estado de onboarding del usuario actual',
    description: 'Verifica si el usuario autenticado ya culminó su flujo de onboarding para permitir o restringir acceso al roadmap.',
  })
  @ApiResponse({ status: 200, description: 'Estado de onboarding resuelto.' })
  async getOnboardingStatus(@CurrentUser() authUser: SupabaseAuthUser): Promise<{ onboardingCompleted: boolean }> {
    const session = await this.validateUserSessionUseCase.execute(authUser.id);
    return { onboardingCompleted: session.onboardingCompleted };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña (OWASP anti-enumeración)',
    description:
      'Envía un enlace/token temporal de recuperación de 15 minutos al correo electrónico. Siempre devuelve HTTP 200 con respuesta genérica idéntica para prevenir enumeración de cuentas de usuario. Límite: 3 peticiones por hora por IP.',
  })
  @ApiResponse({
    status: 200,
    description: 'Respuesta uniforme anti-enumeración (OWASP).',
    schema: {
      example: {
        message: 'Si el correo existe en nuestra plataforma, recibirás un enlace de recuperación con las instrucciones.',
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Límite de solicitudes de recuperación excedido (máximo 3 por hora).' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    return this.forgotPasswordUseCase.execute(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restablecer contraseña con token de recuperación de un solo uso',
    description:
      'Valida el token temporal de recuperación, exige requisitos de complejidad de contraseña (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo especial) y actualiza las credenciales en Supabase Auth, invalidando el token de inmediato.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente.',
    schema: {
      example: {
        message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.',
        success: true,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token de recuperación inválido, expirado o contraseña no cumple requisitos.' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    return this.resetPasswordUseCase.execute(dto);
  }
}