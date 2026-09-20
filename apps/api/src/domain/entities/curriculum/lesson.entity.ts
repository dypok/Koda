export interface LessonTheory {
  step1: string;
  step2: string;
  step3: string;
  codeSnippet?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface ConsoleChallenge {
  prompt: string;
  initialCode: string;
  solutionCode: string;
  testCases: TestCase[];
}

export interface QuizOption {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface SingleChoiceChallenge {
  prompt: string;
  options: QuizOption[];
}

export interface PredictionChallenge {
  prompt: string;
  codeSnippet: string;
  targetType: 'predict_output' | 'bug_hunt';
  expectedAnswer: string;
  hint: string;
}

export interface LessonProps {
  slug: string;
  sectionSlug: string;
  title: string;
  position: number;
  theory: LessonTheory;
  item1Console: ConsoleChallenge;
  item2Quiz: SingleChoiceChallenge;
  item3Prediction: PredictionChallenge;
  xpReward: number;
  isActive: boolean;
}

export class LessonEntity {
  readonly slug: string;
  readonly sectionSlug: string;
  readonly title: string;
  readonly position: number;
  readonly theory: LessonTheory;
  readonly item1Console: ConsoleChallenge;
  readonly item2Quiz: SingleChoiceChallenge;
  readonly item3Prediction: PredictionChallenge;
  readonly xpReward: number;
  readonly isActive: boolean;

  constructor(props: LessonProps) {
    this.slug = props.slug;
    this.sectionSlug = props.sectionSlug;
    this.title = props.title;
    this.position = props.position;
    this.theory = props.theory;
    this.item1Console = props.item1Console;
    this.item2Quiz = props.item2Quiz;
    this.item3Prediction = props.item3Prediction;
    this.xpReward = props.xpReward;
    this.isActive = props.isActive;
  }
}
