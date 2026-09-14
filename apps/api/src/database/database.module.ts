import { Module, Global } from '@nestjs/common';
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
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/koda',
      }),
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
