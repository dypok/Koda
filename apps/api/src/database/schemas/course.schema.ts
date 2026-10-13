import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ _id: false })
export class CourseTopology {
  @Prop({ required: true, default: 0 })
  tier: number; // Profundidad vertical (0, 1, 2, ...)

  @Prop({ required: true, default: 0 })
  lane: number; // Desplazamiento horizontal (-2, -1, 0, 1, 2)
}

@Schema({ _id: false })
export class CourseEdge {
  @Prop({ required: true })
  target_course_slug: string;

  @Prop({ required: true, enum: ['requires', 'unlocks', 'recommended'], default: 'requires' })
  connection_type: string;

  @Prop({ required: true, default: 'laser_flow_fast' })
  visual_effect_code: string;

  @Prop({ default: '#38BDF8' })
  edge_color: string;
}

@Schema({ collection: 'courses', timestamps: true })
export class Course {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, index: true })
  track_slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: '#38BDF8' })
  color: string;

  @Prop({ required: true, default: 'IconBookOpen' })
  icon: string;

  @Prop({ type: CourseTopology, required: true, default: () => ({ tier: 0, lane: 0 }) })
  topology: CourseTopology;

  @Prop({ type: [String], default: [] })
  prerequisites: string[];

  @Prop({ type: [CourseEdge], default: [] })
  edges: CourseEdge[];

  @Prop({ required: true, default: true })
  is_active: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
