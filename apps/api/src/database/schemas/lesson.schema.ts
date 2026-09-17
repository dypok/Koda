import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema({ _id: false })
export class LessonTheory {
  @Prop({ required: true })
  step1: string;

  @Prop({ required: true })
  step2: string;

  @Prop({ required: true })
  step3: string;

  @Prop()
  code_snippet?: string;
}

@Schema({ _id: false })
export class TestCase {
  @Prop({ required: true })
  input: string;

  @Prop({ required: true })
  expected_output: string;

  @Prop({ required: true })
  description: string;
}

@Schema({ _id: false })
export class ConsoleChallenge {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  initial_code: string;

  @Prop({ required: true })
  solution_code: string;

  @Prop({ type: [TestCase], default: [] })
  test_cases: TestCase[];
}

@Schema({ _id: false })
export class QuizOption {
  @Prop({ required: true, enum: ['a', 'b', 'c', 'd'] })
  id: 'a' | 'b' | 'c' | 'd';

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  is_correct: boolean;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class SingleChoiceChallenge {
  @Prop({ required: true })
  prompt: string;

  @Prop({ type: [QuizOption], required: true, validate: [(val: QuizOption[]) => val.length === 4, 'Deben ser exactamente 4 opciones (A, B, C, D)'] })
  options: QuizOption[];
}

@Schema({ _id: false })
export class PredictionChallenge {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  code_snippet: string;

  @Prop({ required: true, enum: ['predict_output', 'bug_hunt'], default: 'predict_output' })
  target_type: 'predict_output' | 'bug_hunt';

  @Prop({ required: true })
  expected_answer: string;

  @Prop({ required: true })
  hint: string;
}

@Schema({ collection: 'lessons', timestamps: true })
export class Lesson {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, index: true })
  section_slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 1, max: 10 })
  position: number;

  @Prop({ type: LessonTheory, required: true })
  theory: LessonTheory;

  // ÍTEM 1 DE LA TRÍADA: Consola interactiva con pruebas automáticas
  @Prop({ type: ConsoleChallenge, required: true })
  item_1_console: ConsoleChallenge;

  // ÍTEM 2 DE LA TRÍADA: Quiz conceptual de 4 opciones A/B/C/D
  @Prop({ type: SingleChoiceChallenge, required: true })
  item_2_quiz: SingleChoiceChallenge;

  // ÍTEM 3 DE LA TRÍADA: Predicción de terminal o detección de bug
  @Prop({ type: PredictionChallenge, required: true })
  item_3_prediction: PredictionChallenge;

  @Prop({ required: true, default: 15 })
  xp_reward: number;

  @Prop({ required: true, default: true })
  is_active: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
