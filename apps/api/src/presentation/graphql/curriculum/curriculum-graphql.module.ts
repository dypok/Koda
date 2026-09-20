import { Module } from '@nestjs/common';
import { CurriculumResolver } from './curriculum.resolver';
import { ContentModule } from '../../rest/content/content.module';

@Module({
  imports: [ContentModule],
  providers: [CurriculumResolver],
  exports: [CurriculumResolver],
})
export class CurriculumGraphQLModule {}
