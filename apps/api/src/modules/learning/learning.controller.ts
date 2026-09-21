import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { OptionalSupabaseAuthGuard } from '@common/guards/optional-supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { LearningService } from './learning.service';
import { LessonAnswerSubmissionDto } from './dto/lesson-answer-submission.dto';
import type {
  RoadmapResponse,
  LessonDetail,
  LessonAnswerFeedback,
} from '@koda/types';

@ApiExcludeController()
@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

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
  @ApiOperation({ summary: 'Evaluar respuesta de una micro-lección con feedback anti-spoilers (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Feedback evaluado y XP otorgado' })
  async evaluateAnswer(
    @Param('lessonId') lessonId: string,
    @Body() submission: LessonAnswerSubmissionDto,
  ): Promise<LessonAnswerFeedback> {
    return this.learningService.evaluateAnswer({ ...submission, lesson_id: lessonId });
  }
}
