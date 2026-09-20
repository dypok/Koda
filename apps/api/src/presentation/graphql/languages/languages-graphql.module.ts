import { Module } from '@nestjs/common';
import { LanguagesResolver } from './languages.resolver';
import { LanguagesModule } from '../../../modules/languages/languages.module';

@Module({
  imports: [LanguagesModule],
  providers: [LanguagesResolver],
  exports: [LanguagesResolver],
})
export class LanguagesGraphQLModule {}
