import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { OptionalSupabaseAuthGuard } from '@common/guards/optional-supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetDiagnosticQuestionsUseCase } from '@application/use-cases/diagnostic/get-diagnostic-questions.use-case';
import { EvaluateDiagnosticUseCase } from '@application/use-cases/diagnostic/evaluate-diagnostic.use-case';
import { DiagnosticQuestionsResponseDto } from '@application/dto/diagnostic/diagnostic-questions-response.dto';
import { SubmitDiagnosticDto } from '@application/dto/diagnostic/submit-diagnostic.dto';
import { DiagnosticResultResponseDto } from '@application/dto/diagnostic/diagnostic-result-response.dto';

@ApiTags('Diagnostic')
@Controller('learning/diagnostic')
export class DiagnosticController {
  constructor(
    private readonly getDiagnosticQuestionsUseCase: GetDiagnosticQuestionsUseCase,
    private readonly evaluateDiagnosticUseCase: EvaluateDiagnosticUseCase,
  ) {}

  @Get('questions')
  @ApiOperation({
    summary: 'Obtener preguntas del test diagnóstico inicial',
    description:
      'Entrega 12 preguntas calibradas y estratificadas (6 de Bloque B1 y 6 de Bloque B2) sin revelar las respuestas correctas para evitar fraudes.',
  })
  @ApiQuery({
    name: 'languageSlug',
    required: false,
    example: 'python',
    description: 'Slug del lenguaje a evaluar (por defecto: python)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Banco de preguntas del test diagnóstico obtenido exitosamente.',
    type: DiagnosticQuestionsResponseDto,
  })
  getQuestions(@Query('languageSlug') languageSlug?: string): DiagnosticQuestionsResponseDto {
    return this.getDiagnosticQuestionsUseCase.execute(languageSlug || 'python');
  }

  @Post('submit')
  @UseGuards(OptionalSupabaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Evaluar respuestas del test diagnóstico y calcular punto de entrada',
    description:
      'Evalúa las respuestas según el algoritmo pedagógico (14 §5.4), aplica el clamping estricto por nivel autodeclarado para evitar saltos accidentales, y si el usuario está autenticado, persiste los módulos exonerados con 3 estrellas simbólicas.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Evaluación pedagógica calculada con módulo de inicio recomendado y desglose por bloques.',
    type: DiagnosticResultResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de respuestas o formato inválido.' })
  async submitDiagnostic(
    @Body() dto: SubmitDiagnosticDto,
    @CurrentUser() authUser?: SupabaseAuthUser,
  ): Promise<DiagnosticResultResponseDto> {
    return this.evaluateDiagnosticUseCase.execute(dto, authUser?.id);
  }
}
