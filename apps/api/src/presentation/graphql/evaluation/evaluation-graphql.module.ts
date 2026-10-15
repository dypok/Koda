import { Module } from '@nestjs/common';
import { EvaluationResolver } from './evaluation.resolver';
import { EvaluationModule } from '../../../modules/evaluation/evaluation.module';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [EvaluationModule, DatabaseModule],
  providers: [EvaluationResolver],
})
export class EvaluationGraphQLModule {}
