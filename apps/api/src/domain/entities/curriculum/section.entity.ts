export interface SectionProps {
  slug: string;
  moduleSlug: string;
  title: string;
  position: number;
  totalLessons: number;
  xpReward: number;
  isActive: boolean;
}

export class SectionEntity {
  readonly slug: string;
  readonly moduleSlug: string;
  readonly title: string;
  readonly position: number;
  readonly totalLessons: number;
  readonly xpReward: number;
  readonly isActive: boolean;

  constructor(props: SectionProps) {
    this.slug = props.slug;
    this.moduleSlug = props.moduleSlug;
    this.title = props.title;
    this.position = props.position;
    this.totalLessons = props.totalLessons;
    this.xpReward = props.xpReward;
    this.isActive = props.isActive;
  }
}
