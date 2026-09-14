import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema({ collection: 'sections', timestamps: true })
export class Section {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, index: true })
  module_slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 1 })
  position: number;

  @Prop({ required: true, default: 10 })
  total_lessons: number;

  @Prop({ required: true, default: 50 })
  xp_reward: number;

  @Prop({ required: true, default: true })
  is_active: boolean;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
