import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { DatabaseModule } from '../../database/database.module';
import { ContentBundleService } from '../../infra/content/content-bundle.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EvaluationController],
  providers: [EvaluationService, ContentBundleService],
  exports: [EvaluationService, ContentBundleService],
})
export class EvaluationModule {}
