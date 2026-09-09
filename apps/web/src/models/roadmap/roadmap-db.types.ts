import { NodeVariant } from './roadmap-graph.types';

export interface DbCourseEntity {
  id: string;
  language_id: string;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'framework';
  description: string;
  sort_order: number;
  total_stars: number;
  xp_reward: number;
  prerequisite_course_id?: string | null;
  graph_x: number;
  graph_y: number;
  icon_type: string;
  is_published: boolean;
}

export interface DbLessonEntity {
  id: string;
  course_id: string;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  order_index: number;
  duration_minutes: number;
  xp_reward: number;
  max_stars: number;
  variant: NodeVariant;
  graph_x: number;
  graph_y: number;
  icon_type: string;
  badge?: string | null;
  prerequisite_lesson_id?: string | null;
  is_published: boolean;
}

export interface DbGraphEdgeEntity {
  id: string;
  scope_type: 'courses' | 'lessons';
  scope_id: string;
  from_node_id: string;
  to_node_id: string;
  color: string;
  path_d: string;
  is_dashed: boolean;
}
