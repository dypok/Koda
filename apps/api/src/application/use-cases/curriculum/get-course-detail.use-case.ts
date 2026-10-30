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

    const moduleSlugs = modules.map((m) => m.slug);
    const sectionsByModule = new Map<string, SectionEntity[]>();

    if (typeof this.curriculumRepository.findSectionsByModuleSlugs === 'function') {
      const allSections = await this.curriculumRepository.findSectionsByModuleSlugs(moduleSlugs);
      for (const sec of allSections) {
        const mSlug = sec.moduleSlug;
        const list = sectionsByModule.get(mSlug) || [];
        list.push(sec);
        sectionsByModule.set(mSlug, list);
      }
    } else {
      const nested = await Promise.all(
        modules.map((m) => this.curriculumRepository.findSectionsByModule(m.slug)),
      );
      modules.forEach((mod, idx) => {
        sectionsByModule.set(mod.slug, nested[idx] || []);
      });
    }

    const modulesWithSections: ModuleWithSections[] = modules.map((mod) => ({
      module: mod,
      sections: sectionsByModule.get(mod.slug) || [],
    }));

    return {
      course,
      modules: modulesWithSections,
    };
  }
}
