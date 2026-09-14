import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ collection: 'modules', timestamps: true })
export class Module {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, index: true })
  course_slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  objective: string;

  @Prop({ required: true, default: 1 })
  position: number;

  @Prop({ required: true, default: 10 })
  total_sections: number;

  @Prop({ required: true, default: 80 })
  min_stars_percentage: number;

  @Prop({ required: true, default: true })
  is_active: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
