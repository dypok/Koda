import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType('VisualEffect')
export class VisualEffectType {
  @Field(() => String)
  code: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  preset: string;

  @Field(() => Float)
  animationSpeed: number;

  @Field(() => Float)
  particleDensity: number;

  @Field(() => Float)
  glowIntensity: number;

  @Field(() => String)
  defaultColor: string;

  @Field(() => String)
  dashStyle: string;

  @Field(() => Boolean)
  isGpuAccelerated: boolean;
}
