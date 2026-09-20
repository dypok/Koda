import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { CourseEntity, TrackEntity } from '../../../domain/entities/curriculum';

export interface TrackWithCourses {
  track: TrackEntity;
  courses: CourseEntity[];
}

@Injectable()
export class GetTrackCoursesUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  async execute(trackSlug: string): Promise<TrackWithCourses> {
    const track = await this.curriculumRepository.findTrackBySlug(trackSlug);
    if (!track) {
      throw new NotFoundException(`La pista profesional '${trackSlug}' no fue encontrada.`);
    }

    const courses = await this.curriculumRepository.findCoursesByTrack(trackSlug);
    return { track, courses };
  }
}
