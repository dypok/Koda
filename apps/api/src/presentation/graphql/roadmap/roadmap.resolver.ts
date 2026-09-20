import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoadmapService } from '../../../modules/roadmap/roadmap.service';
import { GraphDatasetType } from './types/roadmap-graph.type';
import { SeedRoadmapInput } from './types/seed-roadmap.input';

@Resolver()
export class RoadmapResolver {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Query(() => GraphDatasetType, {
    name: 'roadmapCoursesGraph',
    description: 'Obtener el grafo interactivo DAG de cursos de un lenguaje',
  })
  async getCoursesGraph(@Args('lang', { type: () => String }) lang: string): Promise<GraphDatasetType> {
    return this.roadmapService.getCoursesGraph(lang);
  }

  @Query(() => GraphDatasetType, {
    name: 'roadmapLessonsGraph',
    description: 'Obtener el grafo interactivo DAG de lecciones de un curso',
  })
  async getLessonsGraph(@Args('courseId', { type: () => String }) courseId: string): Promise<GraphDatasetType> {
    return this.roadmapService.getLessonsGraph(courseId);
  }

  @Mutation(() => Boolean, {
    name: 'seedRoadmapDataset',
    description: 'Sembrar (upsert) un dataset de grafo diseñado en el frontend/admin',
  })
  async seedRoadmapDataset(@Args('input', { type: () => SeedRoadmapInput }) input: SeedRoadmapInput): Promise<boolean> {
    const courseId =
      input.courseId ??
      input.coursesDataset.nodes.find((n) => n.isUnlocked)?.targetCourseId ??
      input.coursesDataset.nodes[0]?.targetCourseId ??
      input.language;

    await this.roadmapService.seedDataset(
      input.language,
      courseId,
      input.coursesDataset as any,
      input.lessonsDataset as any,
    );
    return true;
  }
}
