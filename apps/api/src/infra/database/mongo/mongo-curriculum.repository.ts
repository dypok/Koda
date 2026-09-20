import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import {
  TrackEntity,
  CourseEntity,
  ModuleEntity,
  SectionEntity,
  LessonEntity,
  VisualEffectEntity,
} from '../../../domain/entities/curriculum';
import {
  Track,
  TrackDocument,
  Course,
  CourseDocument,
  Module as CourseModule,
  ModuleDocument,
  Section,
  SectionDocument,
  Lesson,
  LessonDocument,
  VisualEffect,
  VisualEffectDocument,
} from '../../../database/schemas';

@Injectable()
export class MongoCurriculumRepository implements ICurriculumRepository {
  constructor(
    @InjectModel(Track.name)
    private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @InjectModel(CourseModule.name)
    private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel(Section.name)
    private readonly sectionModel: Model<SectionDocument>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(VisualEffect.name)
    private readonly visualEffectModel: Model<VisualEffectDocument>,
  ) {}

  private mapTrack(doc: any): TrackEntity {
    return new TrackEntity({
      slug: doc.slug,
      name: doc.name,
      description: doc.description,
      icon: doc.icon,
      badge: doc.badge,
      color: doc.color,
      sortOrder: doc.sort_order,
      isActive: doc.is_active,
    });
  }

  private mapCourse(doc: any): CourseEntity {
    return new CourseEntity({
      slug: doc.slug,
      trackSlug: doc.track_slug,
      name: doc.name,
      description: doc.description,
      color: doc.color,
      icon: doc.icon,
      topology: {
        tier: doc.topology?.tier ?? 0,
        lane: doc.topology?.lane ?? 0,
      },
      prerequisites: doc.prerequisites ?? [],
      edges: (doc.edges ?? []).map((e: any) => ({
        targetCourseSlug: e.target_course_slug,
        connectionType: e.connection_type,
        visualEffectCode: e.visual_effect_code,
        edgeColor: e.edge_color,
      })),
      isActive: doc.is_active,
    });
  }

  private mapModule(doc: any): ModuleEntity {
    return new ModuleEntity({
      slug: doc.slug,
      courseSlug: doc.course_slug,
      title: doc.title,
      objective: doc.objective,
      position: doc.position,
      totalSections: doc.total_sections,
      minStarsPercentage: doc.min_stars_percentage,
      isActive: doc.is_active,
    });
  }

  private mapSection(doc: any): SectionEntity {
    return new SectionEntity({
      slug: doc.slug,
      moduleSlug: doc.module_slug,
      title: doc.title,
      position: doc.position,
      totalLessons: doc.total_lessons,
      xpReward: doc.xp_reward,
      isActive: doc.is_active,
    });
  }

  private mapLesson(doc: any): LessonEntity {
    return new LessonEntity({
      slug: doc.slug,
      sectionSlug: doc.section_slug,
      title: doc.title,
      position: doc.position,
      theory: {
        step1: doc.theory?.step1 ?? '',
        step2: doc.theory?.step2 ?? '',
        step3: doc.theory?.step3 ?? '',
        codeSnippet: doc.theory?.code_snippet,
      },
      item1Console: {
        prompt: doc.item_1_console?.prompt ?? '',
        initialCode: doc.item_1_console?.initial_code ?? '',
        solutionCode: doc.item_1_console?.solution_code ?? '',
        testCases: (doc.item_1_console?.test_cases ?? []).map((tc: any) => ({
          input: tc.input,
          expectedOutput: tc.expected_output,
          description: tc.description,
        })),
      },
      item2Quiz: {
        prompt: doc.item_2_quiz?.prompt ?? '',
        options: (doc.item_2_quiz?.options ?? []).map((opt: any) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.is_correct,
          feedback: opt.feedback,
        })),
      },
      item3Prediction: {
        prompt: doc.item_3_prediction?.prompt ?? '',
        codeSnippet: doc.item_3_prediction?.code_snippet ?? '',
        targetType: doc.item_3_prediction?.target_type ?? 'predict_output',
        expectedAnswer: doc.item_3_prediction?.expected_answer ?? '',
        hint: doc.item_3_prediction?.hint ?? '',
      },
      xpReward: doc.xp_reward ?? 15,
      isActive: doc.is_active ?? true,
    });
  }

  private mapVisualEffect(doc: any): VisualEffectEntity {
    return new VisualEffectEntity({
      code: doc.code,
      name: doc.name,
      description: doc.description,
      preset: doc.preset,
      animationSpeed: doc.animation_speed,
      particleDensity: doc.particle_density,
      glowIntensity: doc.glow_intensity,
      defaultColor: doc.default_color,
      dashStyle: doc.dash_style,
      isGpuAccelerated: doc.is_gpu_accelerated,
    });
  }

  async findTracks(): Promise<TrackEntity[]> {
    const docs = await this.trackModel.find({ is_active: true }).sort({ sort_order: 1 }).lean();
    return docs.map((d) => this.mapTrack(d));
  }

  async findTrackBySlug(slug: string): Promise<TrackEntity | null> {
    const doc = await this.trackModel.findOne({ slug, is_active: true }).lean();
    return doc ? this.mapTrack(doc) : null;
  }

  async findCoursesByTrack(trackSlug: string): Promise<CourseEntity[]> {
    const docs = await this.courseModel
      .find({ track_slug: trackSlug, is_active: true })
      .sort({ 'topology.tier': 1, 'topology.lane': 1 })
      .lean();
    return docs.map((d) => this.mapCourse(d));
  }

  async findCourseBySlug(slug: string): Promise<CourseEntity | null> {
    const doc = await this.courseModel.findOne({ slug, is_active: true }).lean();
    return doc ? this.mapCourse(doc) : null;
  }

  async findAllCourses(): Promise<CourseEntity[]> {
    const docs = await this.courseModel
      .find({ is_active: true })
      .sort({ 'topology.tier': 1, 'topology.lane': 1 })
      .lean();
    return docs.map((d) => this.mapCourse(d));
  }

  async findModulesByCourse(courseSlug: string): Promise<ModuleEntity[]> {
    const docs = await this.moduleModel
      .find({ course_slug: courseSlug, is_active: true })
      .sort({ position: 1 })
      .lean();
    return docs.map((d) => this.mapModule(d));
  }

  async findModuleBySlug(slug: string): Promise<ModuleEntity | null> {
    const doc = await this.moduleModel.findOne({ slug, is_active: true }).lean();
    return doc ? this.mapModule(doc) : null;
  }

  async findSectionsByModule(moduleSlug: string): Promise<SectionEntity[]> {
    const docs = await this.sectionModel
      .find({ module_slug: moduleSlug, is_active: true })
      .sort({ position: 1 })
      .lean();
    return docs.map((d) => this.mapSection(d));
  }

  async findSectionBySlug(slug: string): Promise<SectionEntity | null> {
    const doc = await this.sectionModel.findOne({ slug, is_active: true }).lean();
    return doc ? this.mapSection(doc) : null;
  }

  async findLessonsBySection(sectionSlug: string): Promise<LessonEntity[]> {
    const docs = await this.lessonModel
      .find({ section_slug: sectionSlug, is_active: true })
      .sort({ position: 1 })
      .lean();
    return docs.map((d) => this.mapLesson(d));
  }

  async findLessonBySlug(slug: string): Promise<LessonEntity | null> {
    const doc = await this.lessonModel.findOne({ slug, is_active: true }).lean();
    return doc ? this.mapLesson(doc) : null;
  }

  async findVisualEffects(): Promise<VisualEffectEntity[]> {
    const docs = await this.visualEffectModel.find().lean();
    return docs.map((d) => this.mapVisualEffect(d));
  }

  async findVisualEffectByCode(code: string): Promise<VisualEffectEntity | null> {
    const doc = await this.visualEffectModel.findOne({ code }).lean();
    return doc ? this.mapVisualEffect(doc) : null;
  }
}
