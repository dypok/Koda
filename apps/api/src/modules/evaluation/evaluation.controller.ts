import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GenerateEvaluationUseCase } from '../../application/use-cases/evaluation/generate-evaluation.use-case';
import { EvaluateAttemptUseCase } from '../../application/use-cases/evaluation/evaluate-attempt.use-case';
import { GetAttemptSummaryUseCase } from '../../application/use-cases/evaluation/get-attempt-summary.use-case';

@ApiTags('Evaluations')
@Controller('learning')
export class EvaluationController {
  constructor(
    private readonly generateEvaluationUseCase: GenerateEvaluationUseCase,
    private readonly evaluateAttemptUseCase: EvaluateAttemptUseCase,
    private readonly getAttemptSummaryUseCase: GetAttemptSummaryUseCase,
  ) {}

  @Get('modules/:id/quiz')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Generar intento de Quiz de Módulo' })
  @ApiResponse({ status: 200, description: 'Quiz generado con 10 preguntas' })
  async generateQuiz(
    @Param('id') moduleId: string,
    @CurrentUser() authUser: SupabaseAuthUser,
  ) {
    return this.generateEvaluationUseCase.execute(authUser.id, moduleId, 'quiz');
  }

  @Post('quiz/:id/attempt')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Evaluar intento de Quiz' })
  @ApiResponse({ status: 200, description: 'Resultado de la evaluación' })
  async submitQuizAttempt(
    @Param('id') quizId: string,
    @Body() submission: any,
    @CurrentUser() authUser: SupabaseAuthUser,
  ) {
    return this.evaluateAttemptUseCase.execute(authUser.id, quizId, submission, 'quiz');
  }

  @Get('modules/:id/exam')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Generar intento de Examen de Módulo' })
  @ApiResponse({ status: 200, description: 'Examen generado con 20 preguntas' })
  async generateExam(
    @Param('id') moduleId: string,
    @CurrentUser() authUser: SupabaseAuthUser,
  ) {
    return this.generateEvaluationUseCase.execute(authUser.id, moduleId, 'exam');
  }

  @Post('exam/:id/attempt')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Evaluar intento de Examen' })
  @ApiResponse({ status: 200, description: 'Resultado de la evaluación' })
  async submitExamAttempt(
    @Param('id') examId: string,
    @Body() submission: any,
    @CurrentUser() authUser: SupabaseAuthUser,
  ) {
    return this.evaluateAttemptUseCase.execute(authUser.id, examId, submission, 'exam');
  }

  @Get('attempts/:attemptId/summary')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Revisión detallada de respuestas post-evaluación' })
  @ApiResponse({ status: 200, description: 'Resumen con feedback' })
  async getAttemptSummary(
    @Param('attemptId') attemptId: string,
    @CurrentUser() authUser: SupabaseAuthUser,
  ) {
    return this.getAttemptSummaryUseCase.execute(authUser.id, attemptId);
  }
}
