import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { CourseEntity } from '../../../domain/entities/curriculum';
import {
  GraphConnection,
  GraphDataset,
  GraphNode,
  GraphNodeIconType,
} from '../../../modules/roadmap/roadmap-graph.types';

@Injectable()
export class GetRoadmapGraphUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  private mapIconType(icon: string): GraphNodeIconType {
    const map: Record<string, GraphNodeIconType> = {
      IconBrandPython: 'brackets',
      IconDeviceDesktop: 'atom',
      IconServer: 'server',
      IconCloudComputing: 'database',
      terminal: 'brackets',
    };
    return map[icon] ?? 'brackets';
  }

  private generateSvgPath(fromX: number, fromY: number, toX: number, toY: number): string {
    const startX = fromX + 40;
    const startY = fromY + 40;
    const endX = toX + 40;
    const endY = toY + 40;
    const dx = Math.abs(endX - startX) * 0.5;
    return `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
  }

  async getCoursesGraph(trackOrLangSlug: string): Promise<GraphDataset> {
    const slug = trackOrLangSlug.toLowerCase();
    const track = await this.curriculumRepository.findTrackBySlug(slug);

    // Si no encuentra el track por slug directo, busca el track por defecto (python)
    const activeTrackSlug = track ? track.slug : 'python';
    const allCourses = await this.curriculumRepository.findAllCourses();

    if (allCourses.length === 0) {
      throw new NotFoundException(`No hay cursos registrados en MongoDB para '${trackOrLangSlug}'.`);
    }

    // Coordenadas calculadas según topología DAG
    const nodes: GraphNode[] = allCourses.map((c: CourseEntity) => {
      const isTrunk = c.topology.tier === 0;
      const x = c.topology.tier * 230 + 140;
      const y = c.topology.lane * 140 + 290;

      return {
        id: c.slug,
        code: c.slug.toUpperCase().slice(0, 4),
        label: c.name,
        subtitle: c.description,
        x,
        y,
        variant: isTrunk ? 'active' : 'locked',
        iconType: this.mapIconType(c.icon),
        stars: isTrunk ? 3 : 0,
        maxStars: 3,
        xp: 150,
        targetCourseId: c.slug,
        isUnlocked: isTrunk,
        statusText: isTrunk ? 'ACTIVO' : 'BLOQUEADO',
      };
    });

    const nodeCoords = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => nodeCoords.set(n.id, { x: n.x, y: n.y }));

    const connections: GraphConnection[] = [];
    allCourses.forEach((c) => {
      const fromCoord = nodeCoords.get(c.slug);
      if (!fromCoord) return;

      c.edges.forEach((edge, idx) => {
        const toCoord = nodeCoords.get(edge.targetCourseSlug);
        if (!toCoord) return;

        connections.push({
          id: `edge-${c.slug}-${edge.targetCourseSlug}-${idx}`,
          fromId: c.slug,
          toId: edge.targetCourseSlug,
          color: edge.edgeColor || '#38BDF8',
          path: this.generateSvgPath(fromCoord.x, fromCoord.y, toCoord.x, toCoord.y),
          isDashed: edge.connectionType === 'recommended',
        });
      });
    });

    return {
      sectorTitle: `SECTOR: ${activeTrackSlug.toUpperCase()} ROADMAP (DAG)`,
      progressPercent: 20,
      nodes,
      connections,
    };
  }

  async getLessonsGraph(courseSlug: string): Promise<GraphDataset> {
    // Normalizar si viene con prefijos antiguos
    let normalizedSlug = courseSlug;
    if (courseSlug === 'py-basic' || courseSlug === 'python-basico') {
      normalizedSlug = 'python-core';
    }

    const course = await this.curriculumRepository.findCourseBySlug(normalizedSlug);
    const resolvedSlug = course ? course.slug : 'python-core';

    const modules = await this.curriculumRepository.findModulesByCourse(resolvedSlug);
    const targetModuleSlug = modules[0]?.slug ?? 'fundamentos-de-python';

    const sections = await this.curriculumRepository.findSectionsByModule(targetModuleSlug);
    const targetSectionSlug = sections[0]?.slug ?? 'py-m01-s01';

    const lessons = await this.curriculumRepository.findLessonsBySection(targetSectionSlug);

    const nodes: GraphNode[] = lessons.map((les, index) => {
      const isFirst = index === 0;
      const x = index * 140 + 130;
      const y = index % 2 === 0 ? 340 : 240;

      return {
        id: les.slug,
        code: `L0${les.position}`,
        label: les.title,
        subtitle: les.theory.step1.slice(0, 40) + '...',
        x,
        y,
        variant: isFirst ? 'active' : 'locked',
        iconType: 'brackets',
        stars: isFirst ? 3 : 0,
        maxStars: 3,
        xp: les.xpReward,
        isUnlocked: isFirst,
        statusText: isFirst ? 'ACTIVA' : 'SELLADA',
      };
    });

    const connections: GraphConnection[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];
      connections.push({
        id: `les-edge-${from.id}-${to.id}`,
        fromId: from.id,
        toId: to.id,
        color: '#38BDF8',
        path: this.generateSvgPath(from.x, from.y, to.x, to.y),
        isDashed: false,
      });
    }

    return {
      sectorTitle: `LECCIONES: ${(course?.name ?? resolvedSlug).toUpperCase()}`,
      progressPercent: 15,
      nodes,
      connections,
    };
  }
}
