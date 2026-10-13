import { Module } from '@nestjs/common';
import { RoadmapResolver } from './roadmap.resolver';
import { RoadmapModule } from '../../../modules/roadmap/roadmap.module';

@Module({
  imports: [RoadmapModule],
  providers: [RoadmapResolver],
  exports: [RoadmapResolver],
})
export class RoadmapGraphQLModule {}
