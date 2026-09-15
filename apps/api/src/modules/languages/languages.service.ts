import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { ProgrammingLanguage } from '@koda/types';
import { SupabaseService } from '../../database/supabase.service';

interface ProgrammingLanguageRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  color: string;
  total_modules: number;
  is_active: boolean;
}

function toProgrammingLanguage(row: ProgrammingLanguageRow): ProgrammingLanguage {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    icon_url: row.icon_url ?? '',
    color: row.color,
    total_modules: row.total_modules,
    is_active: row.is_active,
  };
}

@Injectable()
export class LanguagesService {
  private readonly logger = new Logger(LanguagesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<ProgrammingLanguage[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('programming_languages')
      .select('id, slug, name, description, icon_url, color, total_modules, is_active')
      .eq('is_active', true)
      .eq('status', 'available')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (error) {
      this.logger.error(`Error consultando programming_languages: ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener el catálogo de lenguajes.');
    }

    return (data as ProgrammingLanguageRow[]).map(toProgrammingLanguage);
  }

  async findBySlug(slug: string): Promise<ProgrammingLanguage> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('programming_languages')
      .select('id, slug, name, description, icon_url, color, total_modules, is_active')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      this.logger.error(`Error consultando programming_languages por slug '${slug}': ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener el lenguaje solicitado.');
    }

    if (!data) {
      throw new NotFoundException(`Lenguaje '${slug}' no encontrado.`);
    }

    return toProgrammingLanguage(data as ProgrammingLanguageRow);
  }
}
