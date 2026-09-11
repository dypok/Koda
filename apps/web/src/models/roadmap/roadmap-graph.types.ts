export type NodeVariant =
  | 'completed'
  | 'active'
  | 'unlocked'
  | 'locked'
  | 'boss'
  | 'bonus'
  | 'branch';

export interface GraphNode {
  id: string;
  code: string;
  label: string;
  subtitle?: string;
  x: number;
  y: number;
  variant: NodeVariant;
  iconType: 'code' | 'brackets' | 'matrix' | 'flow' | 'atom' | 'lock' | 'skull' | 'chest' | 'server' | 'database';
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

export type GraphViewMode = 'courses' | 'lessons';
