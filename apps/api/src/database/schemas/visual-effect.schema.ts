import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisualEffectDocument = VisualEffect & Document;

export type VisualEffectPreset =
  | 'laser_flow'
  | 'energy_beam'
  | 'pulse_glow'
  | 'radar_sweep'
  | 'dotted_line';

@Schema({ collection: 'visual_effects', timestamps: true })
export class VisualEffect {
  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['laser_flow', 'energy_beam', 'pulse_glow', 'radar_sweep', 'dotted_line'],
    default: 'laser_flow',
  })
  preset: VisualEffectPreset;

  @Prop({ required: true, default: 1.0 })
  animation_speed: number;

  @Prop({ required: true, default: 1.0 })
  particle_density: number;

  @Prop({ required: true, default: 0.8 })
  glow_intensity: number;

  @Prop({ required: true, default: '#38BDF8' })
  default_color: string;

  @Prop({ default: 'solid', enum: ['solid', 'dashed', 'dotted'] })
  dash_style: string;

  @Prop({ required: true, default: true })
  is_gpu_accelerated: boolean;
}

export const VisualEffectSchema = SchemaFactory.createForClass(VisualEffect);
