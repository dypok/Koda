export interface TrackProps {
  slug: string;
  name: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export class TrackEntity {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly badge: string;
  readonly color: string;
  readonly sortOrder: number;
  readonly isActive: boolean;

  constructor(props: TrackProps) {
    this.slug = props.slug;
    this.name = props.name;
    this.description = props.description;
    this.icon = props.icon;
    this.badge = props.badge;
    this.color = props.color;
    this.sortOrder = props.sortOrder;
    this.isActive = props.isActive;
  }
}
