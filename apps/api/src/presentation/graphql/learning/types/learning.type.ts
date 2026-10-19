import { Field, ObjectType, Float, Int, InputType } from '@nestjs/graphql';

@ObjectType('LearningRoadmapSection')
export class LearningRoadmapSectionType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  order_index: number;

  @Field(() => Int)
  total_lessons: number;

  @Field(() => Boolean)
  is_unlocked: boolean;

  @Field(() => Boolean)
  is_completed: boolean;

  @Field(() => Int)
  stars_earned: number;

  @Field(() => Int)
  max_stars_earned: number;
}

@ObjectType('LearningRoadmapModule')
export class LearningRoadmapModuleType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  order_index: number;

  @Field(() => Int)
  total_sections: number;

  @Field(() => Boolean)
  is_unlocked: boolean;

  @Field(() => Boolean)
  is_completed: boolean;

  @Field(() => Float)
  mastery_percentage: number;

  @Field(() => [LearningRoadmapSectionType])
  sections: LearningRoadmapSectionType[];
}

@ObjectType('LearningRoadmap')
export class LearningRoadmapType {
  @Field(() => Float)
  overall_progress_percentage: number;

  @Field(() => Int)
  total_stars_earned: number;

  @Field(() => Int)
  max_possible_stars: number;

  @Field(() => String)
  current_module_id: string;

  @Field(() => [LearningRoadmapModuleType])
  modules: LearningRoadmapModuleType[];
}

@ObjectType('LessonAnswerFeedback')
export class LessonAnswerFeedbackType {
  @Field(() => Boolean)
  is_correct: boolean;

  @Field(() => Int)
  xp_earned: number;

  @Field(() => String)
  feedback_message: string;

  @Field(() => String, { nullable: true })
  hint?: string;

  @Field(() => String, { nullable: true })
  explanation?: string;

  @Field(() => [String], { nullable: true })
  correct_option_ids?: string[];

  @Field(() => Boolean)
  added_to_review_queue: boolean;
}

@InputType('LessonAnswerInput')
export class LessonAnswerInput {
  @Field(() => String)
  lesson_id: string;

  @Field(() => String)
  question_id: string;

  @Field(() => [String])
  selected_option_ids: string[];

  @Field(() => String, { nullable: true })
  input_text?: string;

  @Field(() => [String], { nullable: true })
  ordered_block_ids?: string[];
}

@InputType('CompleteSectionInput')
export class CompleteSectionInput {
  @Field(() => String)
  sectionId!: string;

  @Field(() => String)
  moduleId!: string;

  @Field(() => String)
  courseId!: string;

  @Field(() => Float)
  accuracyPercentage!: number;
}

@ObjectType('SectionCompletion')
export class SectionCompletionType {
  @Field(() => String)
  sectionId!: string;

  @Field(() => String)
  moduleId!: string;

  @Field(() => Int)
  starsEarnedThisAttempt!: number;

  @Field(() => Int)
  bestStarsEarnedOverall!: number;

  @Field(() => Float)
  bestAccuracyScore!: number;

  @Field(() => Int)
  totalAttemptsCount!: number;

  @Field(() => Boolean)
  isPassed!: boolean;

  @Field(() => Boolean)
  isPerfect!: boolean;

  @Field(() => Boolean)
  isNewlyPassed!: boolean;

  @Field(() => Boolean)
  isNewBest!: boolean;

  @Field(() => Int)
  xpAwarded!: number;

  @Field(() => Int)
  userTotalXp!: number;

  @Field(() => Int, { nullable: true })
  currentStreak?: number;

  @Field(() => Int, { nullable: true })
  longestStreak?: number;

  @Field(() => Int, { nullable: true })
  streakFreezeCount?: number;

  @Field(() => Boolean, { nullable: true })
  isActiveToday?: boolean;

  @Field(() => String, { nullable: true })
  completedAt!: string | null;
}

