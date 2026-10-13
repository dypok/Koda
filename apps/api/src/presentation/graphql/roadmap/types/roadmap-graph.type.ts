import { Field, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType('GraphNode')
export class GraphNodeType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  label: string;

  @Field(() => String, { nullable: true })
  subtitle?: string;

  @Field(() => Float)
  x: number;

  @Field(() => Float)
  y: number;

  @Field(() => String)
  variant: string;

  @Field(() => String)
  iconType: string;

  @Field(() => Int, { nullable: true })
  stars?: number;

  @Field(() => Int, { nullable: true })
  maxStars?: number;

  @Field(() => Int, { nullable: true })
  xp?: number;

  @Field(() => String, { nullable: true })
  statusText?: string;

  @Field(() => String, { nullable: true })
  targetCourseId?: string;

  @Field(() => Boolean)
  isUnlocked: boolean;
}

@ObjectType('GraphConnection')
export class GraphConnectionType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fromId: string;

  @Field(() => String)
  toId: string;

  @Field(() => String)
  color: string;

  @Field(() => String)
  path: string;

  @Field(() => Boolean, { nullable: true })
  isDashed?: boolean;
}

@ObjectType('GraphDataset')
export class GraphDatasetType {
  @Field(() => String)
  sectorTitle: string;

  @Field(() => Float)
  progressPercent: number;

  @Field(() => [GraphNodeType])
  nodes: GraphNodeType[];

  @Field(() => [GraphConnectionType])
  connections: GraphConnectionType[];
}
