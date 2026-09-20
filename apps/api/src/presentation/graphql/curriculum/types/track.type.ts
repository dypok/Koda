import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType('Track')
export class TrackType {
  @Field(() => String)
  slug: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  icon: string;

  @Field(() => String)
  badge: string;

  @Field(() => String)
  color: string;

  @Field(() => Int)
  sortOrder: number;

  @Field(() => Boolean)
  isActive: boolean;
}
