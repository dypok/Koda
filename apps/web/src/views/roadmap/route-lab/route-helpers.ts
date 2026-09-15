'use client';

import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

export const LUA_ACCENT = '#8FA8FF';

export type RouteStatus = 'done' | 'active' | 'open' | 'locked';

export function routeStatusOf(node: GraphNode): RouteStatus {
  if (node.variant === 'completed') return 'done';
  if (node.variant === 'active') return 'active';
  if (node.isUnlocked) return 'open';
  return 'locked';
}

export interface RoutePartition {
  trunkPre: GraphNode[];
  flow: GraphNode[];
  data: GraphNode[];
  trunkPost: GraphNode[];
}

/** Tronco → ramas Flujo/Datos → convergencia, en orden del dataset. */
export function partitionRoute(nodes: GraphNode[]): RoutePartition {
  const firstBranch = nodes.findIndex((n) => n.route === 'flow' || n.route === 'data');
  const split = firstBranch < 0 ? nodes.length : firstBranch;
  const trunkPre = nodes.slice(0, split).filter((n) => (n.route ?? 'trunk') === 'trunk');
  const flow = nodes.filter((n) => n.route === 'flow');
  const data = nodes.filter((n) => n.route === 'data');
  const branchIds = new Set([...flow, ...data].map((n) => n.id));
  const trunkPost = nodes.slice(split).filter((n) => !branchIds.has(n.id));
  return { trunkPre, flow, data, trunkPost };
}

export function shortHash(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h.toString(16).slice(0, 6).padStart(6, '0');
}
