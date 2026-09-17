import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import type { GraphConnection, GraphDataset, GraphNode } from './roadmap-graph.types';
import type { GraphDatasetDto } from './dto/seed-roadmap.dto';

interface CourseRow {
  id: string;
  code: string;
  label: string;
  subtitle: string | null;
  status_text: string | null;
  x: number;
  y: number;
  variant: GraphNode['variant'];
  icon_type: string;
  stars: number | null;
  max_stars: number | null;
  xp_reward: number | null;
  target_course_id: string | null;
  is_unlocked: boolean;
}

interface LessonRow {
  id: string;
  code: string;
  label: string;
  subtitle: string | null;
  status_text: string | null;
  x: number;
  y: number;
  variant: GraphNode['variant'];
  icon_type: string;
  stars: number | null;
  max_stars: number | null;
  xp_reward: number | null;
  is_unlocked: boolean;
}

interface EdgeRow {
  id: string;
  from_node_id: string;
  to_node_id: string;
  color: string;
  path_d: string;
  is_dashed: boolean;
}

function courseRowToNode(row: CourseRow): GraphNode {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    subtitle: row.subtitle ?? undefined,
    x: Number(row.x),
    y: Number(row.y),
    variant: row.variant,
    iconType: row.icon_type as GraphNode['iconType'],
    stars: row.stars ?? undefined,
    maxStars: row.max_stars ?? undefined,
    xp: row.xp_reward ?? undefined,
    statusText: row.status_text ?? undefined,
    targetCourseId: row.target_course_id ?? undefined,
    isUnlocked: row.is_unlocked,
  };
}

function lessonRowToNode(row: LessonRow): GraphNode {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    subtitle: row.subtitle ?? undefined,
    x: Number(row.x),
    y: Number(row.y),
    variant: row.variant,
    iconType: row.icon_type as GraphNode['iconType'],
    stars: row.stars ?? undefined,
    maxStars: row.max_stars ?? undefined,
    xp: row.xp_reward ?? undefined,
    statusText: row.status_text ?? undefined,
    isUnlocked: row.is_unlocked,
  };
}

function edgeRowToConnection(row: EdgeRow): GraphConnection {
  return {
    id: row.id,
    fromId: row.from_node_id,
    toId: row.to_node_id,
    color: row.color,
    path: row.path_d,
    isDashed: row.is_dashed ?? undefined,
  };
}

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getCoursesGraph(languageSlug: string): Promise<GraphDataset> {
    const client = this.supabaseService.getClient();

    const [sectorResult, coursesResult, edgesResult] = await Promise.all([
      client
        .from('roadmap_sectors')
        .select('sector_title, progress_percent')
        .eq('scope_type', 'courses')
        .eq('scope_id', languageSlug)
        .maybeSingle(),
      client
        .from('roadmap_courses')
        .select('id, code, label, subtitle, status_text, x, y, variant, icon_type, stars, max_stars, xp_reward, target_course_id, is_unlocked')
        .eq('language_slug', languageSlug)
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      client.from('roadmap_graph_edges').select('id, from_node_id, to_node_id, color, path_d, is_dashed').eq('scope_type', 'courses').eq('scope_id', languageSlug),
    ]);

    if (coursesResult.error) {
      this.logger.error(`Error consultando roadmap_courses: ${coursesResult.error.message}`);
      throw new InternalServerErrorException('No se pudo obtener el roadmap de cursos.');
    }

    const courseRows = (coursesResult.data ?? []) as CourseRow[];
    if (courseRows.length === 0) {
      throw new NotFoundException(`No hay roadmap de cursos publicado para el lenguaje '${languageSlug}'.`);
    }

    return {
      sectorTitle: sectorResult.data?.sector_title ?? '',
      progressPercent: sectorResult.data?.progress_percent ?? 0,
      nodes: courseRows.map(courseRowToNode),
      connections: ((edgesResult.data ?? []) as EdgeRow[]).map(edgeRowToConnection),
    };
  }

  async getLessonsGraph(courseId: string): Promise<GraphDataset> {
    const client = this.supabaseService.getClient();

    const [sectorResult, lessonsResult, edgesResult] = await Promise.all([
      client
        .from('roadmap_sectors')
        .select('sector_title, progress_percent')
        .eq('scope_type', 'lessons')
        .eq('scope_id', courseId)
        .maybeSingle(),
      client
        .from('roadmap_lessons')
        .select('id, code, label, subtitle, status_text, x, y, variant, icon_type, stars, max_stars, xp_reward, is_unlocked')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      client.from('roadmap_graph_edges').select('id, from_node_id, to_node_id, color, path_d, is_dashed').eq('scope_type', 'lessons').eq('scope_id', courseId),
    ]);

    if (lessonsResult.error) {
      this.logger.error(`Error consultando roadmap_lessons: ${lessonsResult.error.message}`);
      throw new InternalServerErrorException('No se pudo obtener el roadmap de lecciones.');
    }

    const lessonRows = (lessonsResult.data ?? []) as LessonRow[];
    if (lessonRows.length === 0) {
      throw new NotFoundException(`No hay roadmap de lecciones publicado para el curso '${courseId}'.`);
    }

    return {
      sectorTitle: sectorResult.data?.sector_title ?? '',
      progressPercent: sectorResult.data?.progress_percent ?? 0,
      nodes: lessonRows.map(lessonRowToNode),
      connections: ((edgesResult.data ?? []) as EdgeRow[]).map(edgeRowToConnection),
    };
  }

  /**
   * Persiste un GraphDataset autor-generado (frontend) como filas reales.
   * Usado por RoadmapService.autoSeedDatabase() en apps/web para poblar la
   * base de datos con el contenido diseñado localmente.
   */
  async seedDataset(language: string, courseId: string, coursesDataset: GraphDatasetDto, lessonsDataset: GraphDatasetDto): Promise<void> {
    const client = this.supabaseService.getClient();

    const sectorRows = [
      { scope_type: 'courses', scope_id: language, sector_title: coursesDataset.sectorTitle, progress_percent: coursesDataset.progressPercent },
      { scope_type: 'lessons', scope_id: courseId, sector_title: lessonsDataset.sectorTitle, progress_percent: lessonsDataset.progressPercent },
    ];
    const { error: sectorError } = await client.from('roadmap_sectors').upsert(sectorRows, { onConflict: 'scope_type,scope_id' });
    if (sectorError) throw this.wrapWriteError('sectores', sectorError.message);

    const courseRows = coursesDataset.nodes.map((node, idx) => ({
      id: node.id,
      language_slug: language,
      code: node.code,
      label: node.label,
      subtitle: node.subtitle ?? null,
      status_text: node.statusText ?? null,
      x: node.x,
      y: node.y,
      variant: node.variant,
      icon_type: node.iconType,
      stars: node.stars ?? null,
      max_stars: node.maxStars ?? null,
      xp_reward: node.xp ?? 0,
      target_course_id: node.targetCourseId ?? null,
      is_unlocked: node.isUnlocked,
      sort_order: idx + 1,
    }));
    const { error: coursesError } = await client.from('roadmap_courses').upsert(courseRows, { onConflict: 'id' });
    if (coursesError) throw this.wrapWriteError('cursos', coursesError.message);

    const lessonRows = lessonsDataset.nodes.map((node, idx) => ({
      id: node.id,
      course_id: courseId,
      code: node.code,
      label: node.label,
      subtitle: node.subtitle ?? null,
      status_text: node.statusText ?? null,
      x: node.x,
      y: node.y,
      variant: node.variant,
      icon_type: node.iconType,
      stars: node.stars ?? null,
      max_stars: node.maxStars ?? null,
      xp_reward: node.xp ?? 0,
      is_unlocked: node.isUnlocked,
      sort_order: idx + 1,
    }));
    const { error: lessonsError } = await client.from('roadmap_lessons').upsert(lessonRows, { onConflict: 'id' });
    if (lessonsError) throw this.wrapWriteError('lecciones', lessonsError.message);

    const edgeRows = [
      ...coursesDataset.connections.map((c) => ({
        id: c.id,
        scope_type: 'courses',
        scope_id: language,
        from_node_id: c.fromId,
        to_node_id: c.toId,
        color: c.color,
        path_d: c.path,
        is_dashed: c.isDashed ?? false,
      })),
      ...lessonsDataset.connections.map((c) => ({
        id: c.id,
        scope_type: 'lessons',
        scope_id: courseId,
        from_node_id: c.fromId,
        to_node_id: c.toId,
        color: c.color,
        path_d: c.path,
        is_dashed: c.isDashed ?? false,
      })),
    ];
    const { error: edgesError } = await client.from('roadmap_graph_edges').upsert(edgeRows, { onConflict: 'id' });
    if (edgesError) throw this.wrapWriteError('conexiones', edgesError.message);
  }

  private wrapWriteError(what: string, message: string): InternalServerErrorException {
    this.logger.error(`Error sembrando ${what} del roadmap: ${message}`);
    return new InternalServerErrorException(`No se pudo sembrar ${what} del roadmap.`);
  }
}
