import { ValidateDagPrerequisitesUseCase } from './validate-dag-prerequisites.use-case';
import { IProgressRepository } from '@domain/repositories/progress.repository';
import { SectionStarsEntity } from '@domain/entities/section-stars.entity';

describe('ValidateDagPrerequisitesUseCase', () => {
  let useCase: ValidateDagPrerequisitesUseCase;
  let progressRepository: jest.Mocked<IProgressRepository>;

  beforeEach(() => {
    progressRepository = {
      findSectionStars: jest.fn(),
      findSectionStarsByUserAndModule: jest.fn(),
      findAllSectionStarsByUser: jest.fn(),
      findModuleProgress: jest.fn(),
      findAllModuleProgressByUser: jest.fn(),
      saveSectionCompletion: jest.fn(),
      unlockModule: jest.fn(),
      checkPrerequisitesMet: jest.fn(),
    };

    useCase = new ValidateDagPrerequisitesUseCase(progressRepository);
  });

  describe('Detección de Ciclos en Grafos DAG (Kahn Algorithm)', () => {
    it('debe validar que un grafo acíclico lineal es válido (sin ciclos)', () => {
      const nodes = ['node-1', 'node-2', 'node-3', 'node-4'];
      const edges = [
        { from: 'node-1', to: 'node-2' },
        { from: 'node-2', to: 'node-3' },
        { from: 'node-3', to: 'node-4' },
      ];

      expect(ValidateDagPrerequisitesUseCase.isGraphAcyclic(nodes, edges)).toBe(true);
    });

    it('debe validar un grafo en diamante con bifurcaciones concurrentes', () => {
      const nodes = ['root', 'branch-a', 'branch-b', 'merge'];
      const edges = [
        { from: 'root', to: 'branch-a' },
        { from: 'root', to: 'branch-b' },
        { from: 'branch-a', to: 'merge' },
        { from: 'branch-b', to: 'merge' },
      ];

      expect(ValidateDagPrerequisitesUseCase.isGraphAcyclic(nodes, edges)).toBe(true);
    });

    it('debe rechazar y detectar un ciclo cerrado (A -> B -> C -> A)', () => {
      const nodes = ['A', 'B', 'C'];
      const edges = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }, // Ciclo
      ];

      expect(ValidateDagPrerequisitesUseCase.isGraphAcyclic(nodes, edges)).toBe(false);
    });
  });

  describe('Evaluación de Prerrequisitos de Usuario en PostgreSQL', () => {
    it('debe desbloquear el nodo raíz cuando no tiene prerrequisitos', async () => {
      const result = await useCase.execute({
        userId: 'user-uuid',
        targetNodeId: 'node-root',
        prerequisiteNodeIds: [],
      });

      expect(result.isUnlocked).toBe(true);
      expect(result.missingPrerequisites).toHaveLength(0);
    });

    it('debe desbloquear el nodo cuando todos los prerrequisitos están aprobados con >= 1 estrella', async () => {
      progressRepository.findSectionStarsByUserAndModule.mockResolvedValue([]);
      progressRepository.findAllSectionStarsByUser.mockResolvedValue([
        new SectionStarsEntity({ userId: 'user-uuid', sectionId: 'req-1', moduleId: 'mod-1', starsEarned: 2 }),
        new SectionStarsEntity({ userId: 'user-uuid', sectionId: 'req-2', moduleId: 'mod-1', starsEarned: 3 }),
      ]);

      const result = await useCase.execute({
        userId: 'user-uuid',
        targetNodeId: 'target-node',
        prerequisiteNodeIds: ['req-1', 'req-2'],
      });

      expect(result.isUnlocked).toBe(true);
      expect(result.satisfiedPrerequisites).toEqual(['req-1', 'req-2']);
      expect(result.missingPrerequisites).toHaveLength(0);
    });

    it('debe bloquear el nodo cuando al menos un prerrequisito tiene 0 estrellas o falta', async () => {
      progressRepository.findSectionStarsByUserAndModule.mockResolvedValue([]);
      progressRepository.findAllSectionStarsByUser.mockResolvedValue([
        new SectionStarsEntity({ userId: 'user-uuid', sectionId: 'req-1', moduleId: 'mod-1', starsEarned: 2 }),
        new SectionStarsEntity({ userId: 'user-uuid', sectionId: 'req-2', moduleId: 'mod-1', starsEarned: 0 }), // 0 estrellas
      ]);

      const result = await useCase.execute({
        userId: 'user-uuid',
        targetNodeId: 'target-node',
        prerequisiteNodeIds: ['req-1', 'req-2', 'req-3'],
      });

      expect(result.isUnlocked).toBe(false);
      expect(result.satisfiedPrerequisites).toEqual(['req-1']);
      expect(result.missingPrerequisites).toEqual(['req-2', 'req-3']);
    });
  });
});
