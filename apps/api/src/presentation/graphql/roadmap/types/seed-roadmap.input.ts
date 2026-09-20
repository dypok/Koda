import { Field, InputType, Float, Int } from '@nestjs/graphql';

@InputType('GraphNodeInput')
export class GraphNodeInput {
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

@InputType('GraphConnectionInput')
export class GraphConnectionInput {
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

@InputType('GraphDatasetInput')
export class GraphDatasetInput {
  @Field(() => String)
  sectorTitle: string;

  @Field(() => Float)
  progressPercent: number;

  @Field(() => [GraphNodeInput])
  nodes: GraphNodeInput[];

  @Field(() => [GraphConnectionInput])
  connections: GraphConnectionInput[];
}

@InputType('SeedRoadmapInput')
export class SeedRoadmapInput {
  @Field(() => String)
  language: string;

  @Field(() => String, { nullable: true })
  courseId?: string;

  @Field(() => GraphDatasetInput)
  coursesDataset: GraphDatasetInput;

  @Field(() => GraphDatasetInput)
  lessonsDataset: GraphDatasetInput;
}
