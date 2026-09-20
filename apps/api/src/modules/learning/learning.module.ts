import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { DiagnosticController } from './diagnostic.controller';
import { GetDiagnosticQuestionsUseCase } from '@application/use-cases/diagnostic/get-diagnostic-questions.use-case';
import { EvaluateDiagnosticUseCase } from '@application/use-cases/diagnostic/evaluate-diagnostic.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { PrismaUserRepository } from '@infra/database/postgres/repositories/prisma-user.repository';
import { OptionalSupabaseAuthGuard } from '@common/guards/optional-supabase-auth.guard';
import { DatabaseModule } from '../../database/database.module';
import { ContentModule } from '../../presentation/rest/content/content.module';

@Module({
  imports: [DatabaseModule, ContentModule],
  controllers: [LearningController, DiagnosticController],
  providers: [
    LearningService,
    GetDiagnosticQuestionsUseCase,
    EvaluateDiagnosticUseCase,
    OptionalSupabaseAuthGuard,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [LearningService, GetDiagnosticQuestionsUseCase, EvaluateDiagnosticUseCase],
})
export class LearningModule {}
