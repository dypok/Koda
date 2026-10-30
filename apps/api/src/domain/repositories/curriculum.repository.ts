import {
  TrackEntity,
  CourseEntity,
  ModuleEntity,
  SectionEntity,
  LessonEntity,
  VisualEffectEntity,
} from '../entities/curriculum';

export const CURRICULUM_REPOSITORY_TOKEN = 'ICurriculumRepository';

export interface ICurriculumRepository {
  findTracks(): Promise<TrackEntity[]>;
  findTrackBySlug(slug: string): Promise<TrackEntity | null>;
  findCoursesByTrack(trackSlug: string): Promise<CourseEntity[]>;
  findCourseBySlug(slug: string): Promise<CourseEntity | null>;
  findAllCourses(): Promise<CourseEntity[]>;
  findModulesByCourse(courseSlug: string): Promise<ModuleEntity[]>;
  findModuleBySlug(slug: string): Promise<ModuleEntity | null>;
  findSectionsByModule(moduleSlug: string): Promise<SectionEntity[]>;
  findSectionsByModuleSlugs?(moduleSlugs: string[]): Promise<SectionEntity[]>;
  findSectionBySlug(slug: string): Promise<SectionEntity | null>;
  findLessonsBySection(sectionSlug: string): Promise<LessonEntity[]>;
  findLessonBySlug(slug: string): Promise<LessonEntity | null>;
  findVisualEffects(): Promise<VisualEffectEntity[]>;
  findVisualEffectByCode(code: string): Promise<VisualEffectEntity | null>;
}
