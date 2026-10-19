import { Module } from '@nestjs/common';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';
import { ContentModule } from '../../presentation/rest/content/content.module';
import { OptionalSupabaseAuthGuard } from '../../common/guards/optional-supabase-auth.guard';

@Module({
  imports: [ContentModule],
  controllers: [RoadmapController],
  providers: [RoadmapService, OptionalSupabaseAuthGuard],
  exports: [RoadmapService],
})
export class RoadmapModule {}
