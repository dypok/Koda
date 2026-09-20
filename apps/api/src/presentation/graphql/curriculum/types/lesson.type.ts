import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType('LessonTheory')
export class LessonTheoryType {
  @Field(() => String)
  step1: string;

  @Field(() => String)
  step2: string;

  @Field(() => String)
  step3: string;

  @Field(() => String, { nullable: true })
  codeSnippet?: string;
}

@ObjectType('TestCase')
export class TestCaseType {
  @Field(() => String)
  input: string;

  @Field(() => String)
  expectedOutput: string;

  @Field(() => String)
  description: string;
}

@ObjectType('ConsoleChallenge')
export class ConsoleChallengeType {
  @Field(() => String)
  prompt: string;

  @Field(() => String)
  initialCode: string;

  @Field(() => String)
  solutionCode: string;

  @Field(() => [TestCaseType])
  testCases: TestCaseType[];
}

@ObjectType('QuizOption')
export class QuizOptionType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => Boolean)
  isCorrect: boolean;

  @Field(() => String)
  feedback: string;
}

@ObjectType('SingleChoiceChallenge')
export class SingleChoiceChallengeType {
  @Field(() => String)
  prompt: string;

  @Field(() => [QuizOptionType])
  options: QuizOptionType[];
}

@ObjectType('PredictionChallenge')
export class PredictionChallengeType {
  @Field(() => String)
  prompt: string;

  @Field(() => String)
  codeSnippet: string;

  @Field(() => String)
  targetType: string;

  @Field(() => String)
  expectedAnswer: string;

  @Field(() => String)
  hint: string;
}

@ObjectType('Lesson')
export class LessonType {
  @Field(() => String)
  slug: string;

  @Field(() => String)
  sectionSlug: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  position: number;

  @Field(() => LessonTheoryType)
  theory: LessonTheoryType;

  @Field(() => ConsoleChallengeType)
  item1Console: ConsoleChallengeType;

  @Field(() => SingleChoiceChallengeType)
  item2Quiz: SingleChoiceChallengeType;

  @Field(() => PredictionChallengeType)
  item3Prediction: PredictionChallengeType;

  @Field(() => Int)
  xpReward: number;

  @Field(() => Boolean)
  isActive: boolean;
}
