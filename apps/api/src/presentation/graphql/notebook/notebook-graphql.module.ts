import { Module } from '@nestjs/common';
import { NotebookResolver } from './notebook.resolver';
import { NotebookModule } from '../../../modules/notebook/notebook.module';

@Module({
  imports: [NotebookModule],
  providers: [NotebookResolver],
  exports: [NotebookResolver],
})
export class NotebookGraphQLModule {}
