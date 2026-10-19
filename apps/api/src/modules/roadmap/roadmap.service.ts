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
  async getCoursesGraph(languageSlug: string, userId?: string): Promise<GraphDataset> {
    this.logger.log(`Consultando grafo de cursos para ${languageSlug} (Usuario: ${userId ?? 'anónimo'})`);
    return this.getRoadmapGraphUseCase.getCoursesGraph(languageSlug, userId);
  }

  /**
   * Obtiene el grafo de lecciones (nodos + conexiones) de un curso con progreso real fusionado.
   */
  async getLessonsGraph(courseId: string, userId?: string): Promise<GraphDataset> {
    this.logger.log(`Consultando grafo de lecciones para curso ${courseId} (Usuario: ${userId ?? 'anónimo'})`);
    return this.getRoadmapGraphUseCase.getLessonsGraph(courseId, userId);
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
