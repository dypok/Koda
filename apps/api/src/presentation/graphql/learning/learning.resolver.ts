import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { OptionalSupabaseAuthGuard } from '@common/guards/optional-supabase-auth.guard';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { LearningService } from '../../../modules/learning/learning.service';
import { CompleteSectionUseCase } from '@application/use-cases/learning/complete-section.use-case';
import {
  LearningRoadmapType,
  LessonAnswerFeedbackType,
  LessonAnswerInput,
  CompleteSectionInput,
  SectionCompletionType,
} from './types/learning.type';

@Resolver()
export class LearningResolver {
  constructor(
    private readonly learningService: LearningService,
    private readonly completeSectionUseCase: CompleteSectionUseCase,
  ) {}

  @Query(() => LearningRoadmapType, {
    name: 'learningRoadmap',
    description: 'Obtener el árbol de roadmap con candados y estrellas de un lenguaje (MongoDB + PostgreSQL)',
  })
  @UseGuards(OptionalSupabaseAuthGuard)
  async getLearningRoadmap(
    @Args('languageSlug', { type: () => String }) languageSlug: string,
    @CurrentUser() authUser?: SupabaseAuthUser,
  ): Promise<LearningRoadmapType> {
    const res = await this.learningService.getRoadmap(languageSlug, authUser?.id);
    return {
      overall_progress_percentage: res.overall_progress_percentage,
      total_stars_earned: res.total_stars_earned,
      max_possible_stars: res.max_possible_stars,
      current_module_id: res.current_module_id,
      modules: res.modules.map((m) => ({
        id: m.id,
        code: m.code,
        title: m.title,
        description: m.description,
        order_index: m.order_index,
        total_sections: m.total_sections,
        is_unlocked: m.is_unlocked,
        is_completed: m.is_completed,
        mastery_percentage: m.mastery_percentage,
        sections: m.sections.map((s) => ({
          id: s.id,
          code: s.code,
          title: s.title,
          order_index: s.order_index,
          total_lessons: s.total_lessons,
          is_unlocked: s.is_unlocked,
          is_completed: s.is_completed,
          stars_earned: s.stars_earned,
          max_stars_earned: s.max_stars_earned,
        })),
      })),
    };
  }

  @Mutation(() => LessonAnswerFeedbackType, {
    name: 'evaluateLessonAnswer',
    description: 'Evaluar respuesta de una micro-lección con feedback anti-spoilers (MongoDB)',
  })
  @UseGuards(SupabaseAuthGuard)
  async evaluateLessonAnswer(
    @Args('input', { type: () => LessonAnswerInput }) input: LessonAnswerInput,
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<LessonAnswerFeedbackType> {
    return this.learningService.evaluateAnswer(authUser.id, input);
  }

  @Mutation(() => SectionCompletionType, {
    name: 'completeSection',
    description: 'Registrar la completitud de una sección con asignación de estrellas (1-3⭐), XP no-regresiva y telemetría en PostgreSQL',
  })
  @UseGuards(SupabaseAuthGuard)
  async completeSection(
    @Args('input', { type: () => CompleteSectionInput }) input: CompleteSectionInput,
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<SectionCompletionType> {
    return this.completeSectionUseCase.execute(authUser.id, input);
  }
}

