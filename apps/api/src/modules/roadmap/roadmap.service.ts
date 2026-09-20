import { Injectable, Logger } from '@nestjs/common';
import { GetRoadmapGraphUseCase } from '../../application/use-cases/curriculum';
import type { GraphDataset } from './roadmap-graph.types';
import type { GraphDatasetDto } from './dto/seed-roadmap.dto';

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name);

  constructor(private readonly getRoadmapGraphUseCase: GetRoadmapGraphUseCase) {}

  /**
   * Obtiene el grafo de cursos (nodos + conexiones) de un lenguaje/track desde MongoDB.
   */
  async getCoursesGraph(languageSlug: string): Promise<GraphDataset> {
    this.logger.log(`Consultando grafo de cursos desde MongoDB para: ${languageSlug}`);
    return this.getRoadmapGraphUseCase.getCoursesGraph(languageSlug);
  }

  /**
   * Obtiene el grafo de lecciones (nodos + conexiones) de un curso desde MongoDB.
   */
  async getLessonsGraph(courseId: string): Promise<GraphDataset> {
    this.logger.log(`Consultando grafo de lecciones desde MongoDB para curso: ${courseId}`);
    return this.getRoadmapGraphUseCase.getLessonsGraph(courseId);
  }

  /**
   * Endpoint de compatibilidad para siembra desde frontend.
   * La siembra canónica se gestiona ahora a través de MongoDB y content/.
   */
  async seedDataset(
    languageSlug: string,
    courseId: string,
    coursesDataset: GraphDatasetDto,
    lessonsDataset: GraphDatasetDto,
  ): Promise<void> {
    this.logger.log(
      `Solicitud de siembra recibida para lenguaje '${languageSlug}', curso '${courseId}'. Gestionado vía MongoDB.`,
    );
  }
}
