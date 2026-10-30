import { Module, Global, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Track, TrackSchema,
  Course, CourseSchema,
  Module as CourseModule, ModuleSchema,
  Section, SectionSchema,
  Lesson, LessonSchema,
  VisualEffect, VisualEffectSchema,
  QuestionBank, QuestionBankSchema,
} from './schemas';

import { SupabaseService } from './supabase.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/koda';
        return {
          uri,
          serverSelectionTimeoutMS: 2000,
          maxPoolSize: 50,
          minPoolSize: 5,
          socketTimeoutMS: 30000,
          connectTimeoutMS: 5000,
          lazyConnection: true,
          retryAttempts: 2,
          connectionFactory: (connection) => {
            connection.on('connected', () => logger.log(`MongoDB conectado (${uri})`));
            connection.on('error', (err: Error) =>
              logger.error(
                `No se pudo conectar a MongoDB en ${uri}. ¿Está corriendo? ` +
                  `Ejecuta "docker compose up -d mongo" o define MONGODB_URI en tu .env. Detalle: ${err.message}`,
              ),
            );
            return connection;
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Course.name, schema: CourseSchema },
      { name: CourseModule.name, schema: ModuleSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: VisualEffect.name, schema: VisualEffectSchema },
      { name: QuestionBank.name, schema: QuestionBankSchema },
    ]),
  ],
  providers: [SupabaseService],
  exports: [MongooseModule, SupabaseService],
})
export class DatabaseModule {}
