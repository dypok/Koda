import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LearningService } from '../../../modules/learning/learning.service';
import {
  LearningRoadmapType,
  LessonAnswerFeedbackType,
  LessonAnswerInput,
} from './types/learning.type';

@Resolver()
export class LearningResolver {
  constructor(private readonly learningService: LearningService) {}

  @Query(() => LearningRoadmapType, {
    name: 'learningRoadmap',
    description: 'Obtener el árbol de roadmap con candados y estrellas de un lenguaje (MongoDB)',
  })
  async getLearningRoadmap(
    @Args('languageSlug', { type: () => String }) languageSlug: string,
  ): Promise<LearningRoadmapType> {
    const res = await this.learningService.getRoadmap(languageSlug);
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
  async evaluateLessonAnswer(
    @Args('input', { type: () => LessonAnswerInput }) input: LessonAnswerInput,
  ): Promise<LessonAnswerFeedbackType> {
    return this.learningService.evaluateAnswer(input);
  }
}
