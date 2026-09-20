import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType('ProgrammingLanguage')
export class ProgrammingLanguageType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  icon_url: string;

  @Field(() => String)
  color: string;

  @Field(() => Int)
  total_modules: number;

  @Field(() => Boolean)
  is_active: boolean;
}
