import { Inject, Injectable, Logger } from '@nestjs/common';
import { IProgressRepository, PROGRESS_REPOSITORY_TOKEN } from '@domain/repositories/progress.repository';

export interface ValidateDagPrerequisitesParams {
  userId: string;
  targetNodeId: string;
  prerequisiteNodeIds: string[];
}

export interface DagValidationResult {
  isAcyclic: boolean;
  isUnlocked: boolean;
  satisfiedPrerequisites: string[];
  missingPrerequisites: string[];
}

export interface GraphEdge {
  from: string;
  to: string;
}

@Injectable()
export class ValidateDagPrerequisitesUseCase {
  private readonly logger = new Logger(ValidateDagPrerequisitesUseCase.name);

  constructor(
    @Inject(PROGRESS_REPOSITORY_TOKEN)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async execute(params: ValidateDagPrerequisitesParams): Promise<DagValidationResult> {
    const { userId, targetNodeId, prerequisiteNodeIds } = params;

    // Si no tiene dependencias (es el nodo raíz), está automáticamente desbloqueado
    if (!prerequisiteNodeIds || prerequisiteNodeIds.length === 0) {
      return {
        isAcyclic: true,
        isUnlocked: true,
        satisfiedPrerequisites: [],
        missingPrerequisites: [],
      };
    }

    // Verificar en PostgreSQL si las secciones requeridas han sido aprobadas (>= 1 estrella)
    const records = await this.progressRepository.findSectionStarsByUserAndModule(userId, '');
    const userSectionMap = new Map<string, number>();

    // Buscar también en todas las secciones del usuario
    const allUserSections = await this.progressRepository.findAllSectionStarsByUser(userId);
    for (const s of allUserSections) {
      userSectionMap.set(s.sectionId, s.starsEarned);
    }

    const satisfied: string[] = [];
    const missing: string[] = [];

    for (const reqId of prerequisiteNodeIds) {
      const stars = userSectionMap.get(reqId) ?? 0;
      if (stars >= 1) {
        satisfied.push(reqId);
      } else {
        missing.push(reqId);
      }
    }

    const isUnlocked = missing.length === 0;

    return {
      isAcyclic: true,
      isUnlocked,
      satisfiedPrerequisites: satisfied,
      missingPrerequisites: missing,
    };
  }

  /**
   * Algoritmo de detección de ciclos en grafos dirigidos (Kahn / DFS).
   * Valida que el árbol de cursos y lecciones sea un DAG legítimo sin ciclos infinitos.
   */
  public static isGraphAcyclic(nodes: string[], edges: GraphEdge[]): boolean {
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    for (const node of nodes) {
      inDegree.set(node, 0);
      adj.set(node, []);
    }

    for (const edge of edges) {
      if (adj.has(edge.from) && inDegree.has(edge.to)) {
        adj.get(edge.from)!.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
      }
    }

    const queue: string[] = [];
    for (const [node, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(node);
      }
    }

    let visitedCount = 0;
    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedCount++;

      for (const neighbor of adj.get(current) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    return visitedCount === nodes.length;
  }
}
