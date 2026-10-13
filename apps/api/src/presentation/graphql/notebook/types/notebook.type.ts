import { Field, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType('MistakesNotebookItem')
export class MistakesNotebookItemType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  user_id: string;

  @Field(() => String)
  question_id: string;

  @Field(() => String, { nullable: true })
  track_slug?: string;

  @Field(() => String, { nullable: true })
  course_slug?: string;

  @Field(() => String, { nullable: true })
  module_slug?: string;

  @Field(() => String, { nullable: true })
  section_slug?: string;

  @Field(() => String)
  lesson_title: string;

  @Field(() => String)
  prompt: string;

  @Field(() => String, { nullable: true })
  code_context?: string;

  @Field(() => Int)
  error_count: number;

  @Field(() => Boolean)
  is_resolved: boolean;

  @Field(() => Int, { nullable: true })
  interval_days?: number;

  @Field(() => Float, { nullable: true })
  ease_factor?: number;

  @Field(() => Int, { nullable: true })
  repetition_count?: number;

  @Field(() => String, { nullable: true })
  next_review_at?: string;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  last_failed_at: string;
}

@ObjectType('ResolveMistakeResponse')
export class ResolveMistakeResponseType {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  xp_reward: number;
}
