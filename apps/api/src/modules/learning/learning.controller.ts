import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { OptionalSupabaseAuthGuard } from '@common/guards/optional-supabase-auth.guard';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { LearningService } from './learning.service';
import { LessonAnswerSubmissionDto } from './dto/lesson-answer-submission.dto';
import { CompleteSectionUseCase } from '@application/use-cases/learning/complete-section.use-case';
import { I_CODE_RUNNER, ICodeRunner, ExecuteCodeRequest } from '@application/services/code-runner/code-runner.interface';
import type {
  RoadmapResponse,
  LessonDetail,
  LessonAnswerFeedback,
} from '@koda/types';

@ApiExcludeController()
@Controller('learning')
export class LearningController {
  constructor(
    private readonly learningService: LearningService,
    private readonly completeSectionUseCase: CompleteSectionUseCase,
    @Inject(I_CODE_RUNNER) private readonly codeRunner: ICodeRunner,
  ) {}

  @Get('roadmap/:languageSlug')
  @UseGuards(OptionalSupabaseAuthGuard)
  @ApiOperation({ summary: 'Obtener el árbol de roadmap con candados y estrellas (MongoDB + Postgres)' })
  @ApiResponse({ status: 200, description: 'Roadmap del lenguaje' })
  async getRoadmap(
    @Param('languageSlug') languageSlug: string,
    @CurrentUser() authUser?: SupabaseAuthUser,
  ): Promise<RoadmapResponse> {
    return this.learningService.getRoadmap(languageSlug, authUser?.id);
  }


  @Get('lessons/:lessonId')
  @ApiOperation({ summary: 'Obtener detalle de una micro-lección y su ejercicio (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Detalle de lección' })
  async getLesson(@Param('lessonId') lessonId: string): Promise<LessonDetail> {
    return this.learningService.getLesson(lessonId);
  }

  @Post('lessons/:lessonId/answer')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Evaluar respuesta de una micro-lección con feedback anti-spoilers (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Feedback evaluado y XP otorgado' })
  async evaluateAnswer(
    @Param('lessonId') lessonId: string,
    @Body() submission: LessonAnswerSubmissionDto,
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<LessonAnswerFeedback> {
    return this.learningService.evaluateAnswer(authUser.id, { ...submission, lesson_id: lessonId });
  }

  @Post('sections/:id/complete')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Registrar completitud de sección con XP y telemetría (Postgres)' })
  @ApiResponse({ status: 200, description: 'Resultado de completitud' })
  async completeSection(
    @Param('id') sectionId: string,
    @Body() body: any,
    @CurrentUser() authUser: SupabaseAuthUser,
  ) {
    return this.completeSectionUseCase.execute(authUser.id, {
      sectionId: sectionId,
      moduleId: body.moduleId,
      courseId: body.courseId,
      accuracyPercentage: body.accuracyPercentage,
    });
  }

  @Post('sandbox/execute')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Ejecutar código en el Sandbox de forma segura (Fallback)' })
  @ApiResponse({ status: 200, description: 'Resultado de la ejecución del código' })
  async executeCode(@Body() request: ExecuteCodeRequest) {
    return this.codeRunner.execute(request);
  }
}
