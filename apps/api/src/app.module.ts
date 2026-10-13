import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { LanguagesModule } from './modules/languages/languages.module';
import { LearningModule } from './modules/learning/learning.module';
import { CertificationModule } from './modules/certification/certification.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { NotebookModule } from './modules/notebook/notebook.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from '@infra/database/postgres/prisma.module';
import { AuthModule } from './presentation/rest/auth/auth.module';
import { UsersModule } from './presentation/rest/users/users.module';
import { ContentModule } from './presentation/rest/content/content.module';
import { AppThrottlerGuard } from './common/guards/app-throttler.guard';

// Adaptadores de entrada GraphQL
import { CurriculumGraphQLModule } from './presentation/graphql/curriculum/curriculum-graphql.module';
import { RoadmapGraphQLModule } from './presentation/graphql/roadmap/roadmap-graphql.module';
import { LearningGraphQLModule } from './presentation/graphql/learning/learning-graphql.module';
import { NotebookGraphQLModule } from './presentation/graphql/notebook/notebook-graphql.module';
import { LanguagesGraphQLModule } from './presentation/graphql/languages/languages-graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Ventana de 1 minuto
        limit: 100, // Máximo 100 peticiones por IP por minuto
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      path: '/graphql',
    }),
    PrismaModule,
    DatabaseModule,
    // Adaptadores primarios REST (/api/v1)
    AuthModule,
    UsersModule,
    ContentModule,
    LanguagesModule,
    LearningModule,
    CertificationModule,
    NotebookModule,
    RoadmapModule,
    // Adaptadores primarios GraphQL (/graphql)
    CurriculumGraphQLModule,
    RoadmapGraphQLModule,
    LearningGraphQLModule,
    NotebookGraphQLModule,
    LanguagesGraphQLModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
