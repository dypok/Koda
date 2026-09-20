import { Resolver, Query, Args } from '@nestjs/graphql';
import { LanguagesService } from '../../../modules/languages/languages.service';
import { ProgrammingLanguageType } from './types/language.type';

@Resolver()
export class LanguagesResolver {
  constructor(private readonly languagesService: LanguagesService) {}

  @Query(() => [ProgrammingLanguageType], {
    name: 'languages',
    description: 'Obtener catálogo de lenguajes disponibles',
  })
  async getLanguages(): Promise<ProgrammingLanguageType[]> {
    return this.languagesService.findAll();
  }

  @Query(() => ProgrammingLanguageType, {
    name: 'language',
    description: 'Obtener detalle de un lenguaje por su slug',
  })
  async getLanguageBySlug(
    @Args('slug', { type: () => String }) slug: string,
  ): Promise<ProgrammingLanguageType> {
    return this.languagesService.findBySlug(slug);
  }
}
