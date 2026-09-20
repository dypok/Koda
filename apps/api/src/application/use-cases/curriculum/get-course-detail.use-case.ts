import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { CourseEntity, ModuleEntity, SectionEntity } from '../../../domain/entities/curriculum';

export interface ModuleWithSections {
  module: ModuleEntity;
  sections: SectionEntity[];
}

export interface CourseDetailResult {
  course: CourseEntity;
  modules: ModuleWithSections[];
}

@Injectable()
export class GetCourseDetailUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  async execute(courseSlug: string): Promise<CourseDetailResult> {
    const course = await this.curriculumRepository.findCourseBySlug(courseSlug);
    if (!course) {
      throw new NotFoundException(`El curso '${courseSlug}' no fue encontrado.`);
    }

    const modules = await this.curriculumRepository.findModulesByCourse(courseSlug);

    const modulesWithSections: ModuleWithSections[] = await Promise.all(
      modules.map(async (mod) => {
        const sections = await this.curriculumRepository.findSectionsByModule(mod.slug);
        return { module: mod, sections };
      }),
    );

    return {
      course,
      modules: modulesWithSections,
    };
  }
}
