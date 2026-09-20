export interface CourseTopology {
  tier: number;
  lane: number;
}

export interface CourseEdge {
  targetCourseSlug: string;
  connectionType: 'requires' | 'unlocks' | 'recommended';
  visualEffectCode: string;
  edgeColor: string;
}

export interface CourseProps {
  slug: string;
  trackSlug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  topology: CourseTopology;
  prerequisites: string[];
  edges: CourseEdge[];
  isActive: boolean;
}

export class CourseEntity {
  readonly slug: string;
  readonly trackSlug: string;
  readonly name: string;
  readonly description: string;
  readonly color: string;
  readonly icon: string;
  readonly topology: CourseTopology;
  readonly prerequisites: string[];
  readonly edges: CourseEdge[];
  readonly isActive: boolean;

  constructor(props: CourseProps) {
    this.slug = props.slug;
    this.trackSlug = props.trackSlug;
    this.name = props.name;
    this.description = props.description;
    this.color = props.color;
    this.icon = props.icon;
    this.topology = props.topology;
    this.prerequisites = props.prerequisites;
    this.edges = props.edges;
    this.isActive = props.isActive;
  }
}
