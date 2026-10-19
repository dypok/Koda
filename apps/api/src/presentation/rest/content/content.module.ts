import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { CURRICULUM_REPOSITORY_TOKEN } from '../../../domain/repositories/curriculum.repository';
import { MongoCurriculumRepository } from '../../../infra/database/mongo/mongo-curriculum.repository';
import { PROGRESS_REPOSITORY_TOKEN } from '../../../domain/repositories/progress.repository';
import { PrismaProgressRepository } from '../../../infra/database/postgres/repositories/prisma-progress.repository';
import { PrismaModule } from '../../../infra/database/postgres/prisma.module';
import {
  GetTracksUseCase,
  GetTrackCoursesUseCase,
  GetCourseDetailUseCase,
  GetLessonDetailUseCase,
  GetVisualEffectsUseCase,
  GetRoadmapGraphUseCase,
} from '../../../application/use-cases/curriculum';

@Module({
  imports: [PrismaModule],
  controllers: [ContentController],
  providers: [
    {
      provide: CURRICULUM_REPOSITORY_TOKEN,
      useClass: MongoCurriculumRepository,
    },
    {
      provide: PROGRESS_REPOSITORY_TOKEN,
      useClass: PrismaProgressRepository,
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
    PROGRESS_REPOSITORY_TOKEN,
    GetTracksUseCase,
    GetTrackCoursesUseCase,
    GetCourseDetailUseCase,
    GetLessonDetailUseCase,
    GetVisualEffectsUseCase,
    GetRoadmapGraphUseCase,
  ],
})
export class ContentModule {}
