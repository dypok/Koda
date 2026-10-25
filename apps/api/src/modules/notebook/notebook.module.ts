import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotebookController } from './notebook.controller';
import { NotebookService } from './notebook.service';
import { Lesson, LessonSchema } from '../../database/schemas';
import { PrismaModule } from '@infra/database/postgres/prisma.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    PrismaModule,
  ],
  controllers: [NotebookController],
  providers: [NotebookService],
  exports: [NotebookService],
})
export class NotebookModule {}
