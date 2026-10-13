import { Module } from '@nestjs/common';
import { LearningResolver } from './learning.resolver';
import { LearningModule } from '../../../modules/learning/learning.module';

@Module({
  imports: [LearningModule],
  providers: [LearningResolver],
  exports: [LearningResolver],
})
export class LearningGraphQLModule {}
