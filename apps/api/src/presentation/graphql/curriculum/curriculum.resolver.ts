import { Resolver, Query, Args } from '@nestjs/graphql';
import {
  GetTracksUseCase,
  GetTrackCoursesUseCase,
  GetCourseDetailUseCase,
  GetLessonDetailUseCase,
  GetVisualEffectsUseCase,
} from '../../../application/use-cases/curriculum';
import { TrackType } from './types/track.type';
import { TrackCoursesType, CourseDetailType } from './types/course.type';
import { LessonType } from './types/lesson.type';
import { VisualEffectType } from './types/visual-effect.type';

@Resolver()
export class CurriculumResolver {
  constructor(
    private readonly getTracksUseCase: GetTracksUseCase,
    private readonly getTrackCoursesUseCase: GetTrackCoursesUseCase,
    private readonly getCourseDetailUseCase: GetCourseDetailUseCase,
    private readonly getLessonDetailUseCase: GetLessonDetailUseCase,
    private readonly getVisualEffectsUseCase: GetVisualEffectsUseCase,
  ) {}

  @Query(() => [TrackType], {
    name: 'tracks',
    description: 'Catálogo de pistas profesionales de carrera (MongoDB)',
  })
  async getTracks(): Promise<TrackType[]> {
    return this.getTracksUseCase.execute();
  }

  @Query(() => TrackCoursesType, {
    name: 'track',
    description: 'Obtener cursos en grafo DAG de una pista profesional (MongoDB)',
  })
  async getTrackBySlug(@Args('slug', { type: () => String }) slug: string): Promise<TrackCoursesType> {
    return this.getTrackCoursesUseCase.execute(slug);
  }

  @Query(() => CourseDetailType, {
    name: 'course',
    description: 'Obtener detalle de un curso con sus módulos y secciones (MongoDB)',
  })
  async getCourseBySlug(@Args('slug', { type: () => String }) slug: string): Promise<CourseDetailType> {
    return this.getCourseDetailUseCase.execute(slug);
  }

  @Query(() => LessonType, {
    name: 'lesson',
    description: 'Obtener micro-lección atómica con la Tríada Evaluativa (MongoDB)',
  })
  async getLessonBySlug(@Args('slug', { type: () => String }) slug: string): Promise<LessonType> {
    return this.getLessonDetailUseCase.execute(slug);
  }

  @Query(() => [VisualEffectType], {
    name: 'visualEffects',
    description: 'Catálogo de presets de aristas aceleradas por GPU (MongoDB)',
  })
  async getVisualEffects(): Promise<VisualEffectType[]> {
    return this.getVisualEffectsUseCase.execute();
  }
}
