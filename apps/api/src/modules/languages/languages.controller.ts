import { Controller, Get, Param } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import type { ProgrammingLanguage } from '@koda/types';

@ApiExcludeController()
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de lenguajes disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de lenguajes activos' })
  findAll(): Promise<ProgrammingLanguage[]> {
    return this.languagesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener detalle de un lenguaje por su slug' })
  @ApiResponse({ status: 200, description: 'Detalle del lenguaje' })
  @ApiResponse({ status: 404, description: 'Lenguaje no encontrado' })
  findBySlug(@Param('slug') slug: string): Promise<ProgrammingLanguage> {
    return this.languagesService.findBySlug(slug);
  }
}
