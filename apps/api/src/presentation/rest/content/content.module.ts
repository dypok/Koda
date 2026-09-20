import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { CURRICULUM_REPOSITORY_TOKEN } from '../../../domain/repositories/curriculum.repository';
import { MongoCurriculumRepository } from '../../../infra/database/mongo/mongo-curriculum.repository';
import {
  GetTracksUseCase,
  GetTrackCoursesUseCase,
  GetCourseDetailUseCase,
  GetLessonDetailUseCase,
  GetVisualEffectsUseCase,
  GetRoadmapGraphUseCase,
} from '../../../application/use-cases/curriculum';

@Module({
  controllers: [ContentController],
  providers: [
    {
      provide: CURRICULUM_REPOSITORY_TOKEN,
      useClass: MongoCurriculumRepository,
    },
    GetTracksUseCase,
    GetTrackCoursesUseCase,
    GetCourseDetailUseCase,
    GetLessonDetailUseCase,
    GetVisualEffectsUseCase,
    GetRoadmapGraphUseCase,
  ],
  exports: [
    CURRICULUM_REPOSITORY_TOKEN,
    GetTracksUseCase,
    GetTrackCoursesUseCase,
    GetCourseDetailUseCase,
    GetLessonDetailUseCase,
    GetVisualEffectsUseCase,
    GetRoadmapGraphUseCase,
  ],
})
export class ContentModule {}
