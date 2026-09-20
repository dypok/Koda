import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { LanguagesModule } from './modules/languages/languages.module';
import { LearningModule } from './modules/learning/learning.module';
import { CertificationModule } from './modules/certification/certification.module';
import { NotebookModule } from './modules/notebook/notebook.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from '@infra/database/postgres/prisma.module';
import { AuthModule } from './presentation/rest/auth/auth.module';
import { UsersModule } from './presentation/rest/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Ventana de 1 minuto
        limit: 100,  // Máximo 100 peticiones por IP por minuto
      },
    ]),
    PrismaModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    LanguagesModule,
    LearningModule,
    CertificationModule,
    NotebookModule,
    RoadmapModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
