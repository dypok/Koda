/**
 * Espejo exacto (camelCase) de apps/web/src/models/roadmap/roadmap-graph.types.ts.
 * Este es el contrato de cable real que consume RoadmapService en el frontend —
 * deliberadamente distinto de los tipos de grafo en @koda/types (ADR-007/011),
 * que aún no está conectado a esta vista.
 */

export type GraphNodeVariant = 'completed' | 'active' | 'unlocked' | 'locked' | 'boss' | 'bonus' | 'branch';

export type GraphNodeIconType =
  | 'code'
  | 'brackets'
  | 'matrix'
  | 'flow'
  | 'atom'
  | 'lock'
  | 'skull'
  | 'chest'
  | 'server'
  | 'database';

export interface GraphNode {
  id: string;
  code: string;
  label: string;
  subtitle?: string;
  x: number;
  y: number;
  variant: GraphNodeVariant;
  iconType: GraphNodeIconType;
  stars?: number;
  maxStars?: number;
  xp?: number;
  statusText?: string;
  targetCourseId?: string;
  isUnlocked: boolean;
}

export interface GraphConnection {
  id: string;
  fromId: string;
  toId: string;
  color: string;
  path: string;
  isDashed?: boolean;
}

export interface GraphDataset {
  sectorTitle: string;
  progressPercent: number;
  nodes: GraphNode[];
  connections: GraphConnection[];
}
