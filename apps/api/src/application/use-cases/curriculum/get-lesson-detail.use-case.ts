import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { LessonEntity } from '../../../domain/entities/curriculum';

@Injectable()
export class GetLessonDetailUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  async execute(lessonSlug: string): Promise<LessonEntity> {
    const lesson = await this.curriculumRepository.findLessonBySlug(lessonSlug);
    if (!lesson) {
      throw new NotFoundException(`La lección '${lessonSlug}' no fue encontrada.`);
    }

    return lesson;
  }
}
