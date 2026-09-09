import { GraphDataset } from './roadmap-graph.types';
import { DbCourseEntity, DbLessonEntity, DbGraphEdgeEntity } from './roadmap-db.types';

export function datasetToDbCourseRows(dataset: GraphDataset, languageId: string): DbCourseEntity[] {
  return dataset.nodes.map((node, idx) => ({
    id: node.targetCourseId || node.id,
    language_id: languageId,
    code: node.code,
    slug: node.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: node.label,
    subtitle: node.subtitle || '',
    level: node.variant === 'branch' ? 'framework' : node.code === '01' ? 'basic' : node.code === '02' ? 'intermediate' : 'advanced',
    description: node.statusText || '',
    sort_order: idx + 1,
    total_stars: node.maxStars || 0,
    xp_reward: node.xp || 0,
    graph_x: node.x,
    graph_y: node.y,
    icon_type: node.iconType,
    is_published: true,
  }));
}

export function datasetToDbLessonRows(dataset: GraphDataset, courseId: string): DbLessonEntity[] {
  return dataset.nodes.map((node, idx) => ({
    id: node.id,
    course_id: courseId,
    code: node.code,
    slug: node.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: node.label,
    subtitle: node.subtitle || '',
    order_index: idx + 1,
    duration_minutes: 10,
    xp_reward: node.xp || 0,
    max_stars: node.maxStars || 3,
    variant: node.variant,
    graph_x: node.x,
    graph_y: node.y,
    icon_type: node.iconType,
    badge: node.badge || null,
    is_published: true,
  }));
}

export function datasetToDbEdgeRows(dataset: GraphDataset, scopeType: 'courses' | 'lessons', scopeId: string): DbGraphEdgeEntity[] {
  return dataset.connections.map((c) => ({
    id: c.id,
    scope_type: scopeType,
    scope_id: scopeId,
    from_node_id: c.fromId,
    to_node_id: c.toId,
    color: c.color,
    path_d: c.path,
    is_dashed: Boolean(c.isDashed),
  }));
}
