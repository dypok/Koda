import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuizOption } from './lesson.schema';

export type QuestionBankDocument = QuestionBank & Document;

@Schema({ _id: false })
export class QuestionItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  prompt: string;

  @Prop()
  code_snippet?: string;

  @Prop({ type: [QuizOption], required: true })
  options: QuizOption[];

  @Prop({ required: true, default: 'Concepto clave' })
  explanation: string;
}

@Schema({ collection: 'question_banks', timestamps: true })
export class QuestionBank {
  @Prop({ required: true, index: true })
  module_slug: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'], default: 'medium' })
  difficulty: 'easy' | 'medium' | 'hard';

  @Prop({ type: [QuestionItem], required: true })
  questions: QuestionItem[];
}

export const QuestionBankSchema = SchemaFactory.createForClass(QuestionBank);
