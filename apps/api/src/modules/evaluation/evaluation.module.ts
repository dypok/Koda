import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { DatabaseModule } from '../../database/database.module';
import { ContentBundleService } from '../../infra/content/content-bundle.service';
import { GenerateEvaluationUseCase } from '../../application/use-cases/evaluation/generate-evaluation.use-case';
import { EvaluateAttemptUseCase } from '../../application/use-cases/evaluation/evaluate-attempt.use-case';
import { GetAttemptSummaryUseCase } from '../../application/use-cases/evaluation/get-attempt-summary.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [EvaluationController],
  providers: [
    ContentBundleService,
    GenerateEvaluationUseCase,
    EvaluateAttemptUseCase,
    GetAttemptSummaryUseCase,
    EvaluationService,
  ],
  exports: [
    ContentBundleService,
    GenerateEvaluationUseCase,
    EvaluateAttemptUseCase,
    GetAttemptSummaryUseCase,
    EvaluationService,
  ],
})
export class EvaluationModule {}
