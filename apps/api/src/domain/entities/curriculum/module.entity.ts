export interface ModuleProps {
  slug: string;
  courseSlug: string;
  title: string;
  objective: string;
  position: number;
  totalSections: number;
  minStarsPercentage: number;
  isActive: boolean;
}

export class ModuleEntity {
  readonly slug: string;
  readonly courseSlug: string;
  readonly title: string;
  readonly objective: string;
  readonly position: number;
  readonly totalSections: number;
  readonly minStarsPercentage: number;
  readonly isActive: boolean;

  constructor(props: ModuleProps) {
    this.slug = props.slug;
    this.courseSlug = props.courseSlug;
    this.title = props.title;
    this.objective = props.objective;
    this.position = props.position;
    this.totalSections = props.totalSections;
    this.minStarsPercentage = props.minStarsPercentage;
    this.isActive = props.isActive;
  }
}
