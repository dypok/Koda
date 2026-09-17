import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ collection: 'tracks', timestamps: true })
export class Track {
  @Prop({ required: true, unique: true, index: true })
  slug: string; // ej. 'frontend', 'backend', 'devops', 'python'

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 'IconTerminal2' })
  icon: string;

  @Prop({ required: true, default: 'Carrera' })
  badge: string;

  @Prop({ required: true, default: '#38BDF8' })
  color: string;

  @Prop({ required: true, default: 100 })
  sort_order: number;

  @Prop({ required: true, default: true })
  is_active: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
