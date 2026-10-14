import { Field, ObjectType, Int, Float, InputType } from '@nestjs/graphql';

@ObjectType('QuestionOptionPayload')
export class QuestionOptionPayloadType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;
}

@ObjectType('GeneratedQuestionPayload')
export class GeneratedQuestionPayloadType {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  concept_id?: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  difficulty?: string;

  @Field(() => String)
  prompt: string;

  @Field(() => [QuestionOptionPayloadType], { nullable: true })
  options?: QuestionOptionPayloadType[];

  @Field(() => String, { nullable: true })
  code_snippet?: string;
}

@ObjectType('GeneratedEvaluationPayload')
export class GeneratedEvaluationPayloadType {
  @Field(() => String)
  evaluation_type: string;

  @Field(() => String)
  module_id: string;

  @Field(() => Int)
  total_questions: number;

  @Field(() => [GeneratedQuestionPayloadType])
  questions: GeneratedQuestionPayloadType[];
}

@InputType('EvaluationAnswerItemInput')
export class EvaluationAnswerItemInput {
  @Field(() => String)
  question_id: string;

  @Field(() => String)
  selected_option_id: string;
}

@InputType('SubmitEvaluationAttemptInput')
export class SubmitEvaluationAttemptInput {
  @Field(() => String)
  target_module_id: string;

  @Field(() => String)
  evaluation_type: string; // 'quiz' | 'exam'

  @Field(() => [EvaluationAnswerItemInput])
  answers: EvaluationAnswerItemInput[];

  @Field(() => Int, { nullable: true })
  time_spent_seconds?: number;
}

@ObjectType('EvaluationAttemptResultPayload')
export class EvaluationAttemptResultPayloadType {
  @Field(() => Boolean)
  passed: boolean;

  @Field(() => Float)
  score: number;

  @Field(() => Int)
  correct_count: number;

  @Field(() => Int)
  total_questions: number;

  @Field(() => Int)
  xp_earned: number;

  @Field(() => String, { nullable: true })
  attempt_id?: string;

  @Field(() => String)
  content_version: string;
}

@ObjectType('AttemptSummaryDetailPayload')
export class AttemptSummaryDetailPayloadType {
  @Field(() => String)
  question_id: string;

  @Field(() => String, { nullable: true })
  prompt?: string;

  @Field(() => String, { nullable: true })
  user_answer?: string;

  @Field(() => String, { nullable: true })
  correct_answer?: string;

  @Field(() => Boolean)
  is_correct: boolean;

  @Field(() => String, { nullable: true })
  explanation?: string;
}

@ObjectType('AttemptSummaryPayload')
export class AttemptSummaryPayloadType {
  @Field(() => String)
  attempt_id: string;

  @Field(() => Boolean)
  passed: boolean;

  @Field(() => Float)
  score: number;

  @Field(() => [AttemptSummaryDetailPayloadType])
  details: AttemptSummaryDetailPayloadType[];
}
