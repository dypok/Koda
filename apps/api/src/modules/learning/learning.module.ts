import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { DiagnosticController } from './diagnostic.controller';
import { GetDiagnosticQuestionsUseCase } from '@application/use-cases/diagnostic/get-diagnostic-questions.use-case';
import { EvaluateDiagnosticUseCase } from '@application/use-cases/diagnostic/evaluate-diagnostic.use-case';
import { CompleteSectionUseCase } from '@application/use-cases/learning/complete-section.use-case';
import { ValidateDagPrerequisitesUseCase } from '@application/use-cases/learning/validate-dag-prerequisites.use-case';
import { PrerequisitesGuard } from '@common/guards/prerequisites.guard';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { PROGRESS_REPOSITORY_TOKEN } from '@domain/repositories/progress.repository';
import { PrismaUserRepository } from '@infra/database/postgres/repositories/prisma-user.repository';
import { PrismaProgressRepository } from '@infra/database/postgres/repositories/prisma-progress.repository';
import { OptionalSupabaseAuthGuard } from '@common/guards/optional-supabase-auth.guard';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { DatabaseModule } from '../../database/database.module';
import { ContentModule } from '../../presentation/rest/content/content.module';

import { ContentLoaderService } from './content-loader.service';

@Module({
  imports: [DatabaseModule, ContentModule],
  controllers: [LearningController, DiagnosticController],
  providers: [
    LearningService,
    ContentLoaderService,
    GetDiagnosticQuestionsUseCase,
    EvaluateDiagnosticUseCase,
    CompleteSectionUseCase,
    ValidateDagPrerequisitesUseCase,
    PrerequisitesGuard,
    OptionalSupabaseAuthGuard,
    SupabaseAuthGuard,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    {
      provide: PROGRESS_REPOSITORY_TOKEN,
      useClass: PrismaProgressRepository,
    },
  ],
  exports: [
    LearningService,
    ContentLoaderService,
    GetDiagnosticQuestionsUseCase,
    EvaluateDiagnosticUseCase,
    CompleteSectionUseCase,
    ValidateDagPrerequisitesUseCase,
    PrerequisitesGuard,
    PROGRESS_REPOSITORY_TOKEN,
  ],
})
export class LearningModule {}

