import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import type { GraphNodeVariant } from '../roadmap-graph.types';

const NODE_VARIANTS: GraphNodeVariant[] = ['completed', 'active', 'unlocked', 'locked', 'boss', 'bonus', 'branch'];

export class GraphNodeDto {
  @IsString() id: string;
  @IsString() code: string;
  @IsString() label: string;
  @IsOptional() @IsString() subtitle?: string;
  @IsNumber() x: number;
  @IsNumber() y: number;
  @IsIn(NODE_VARIANTS) variant: GraphNodeVariant;
  @IsString() iconType: string;
  @IsOptional() @IsNumber() stars?: number;
  @IsOptional() @IsNumber() maxStars?: number;
  @IsOptional() @IsNumber() xp?: number;
  @IsOptional() @IsString() statusText?: string;
  @IsOptional() @IsString() targetCourseId?: string;
  @IsBoolean() isUnlocked: boolean;
}

export class GraphConnectionDto {
  @IsString() id: string;
  @IsString() fromId: string;
  @IsString() toId: string;
  @IsString() color: string;
  @IsString() path: string;
  @IsOptional() @IsBoolean() isDashed?: boolean;
}

export class GraphDatasetDto {
  @IsString() sectorTitle: string;
  @IsNumber() progressPercent: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GraphNodeDto)
  nodes: GraphNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GraphConnectionDto)
  connections: GraphConnectionDto[];
}

export class SeedRoadmapDto {
  @IsString() language: string;

  /** Curso al que pertenece lessonsDataset. Si se omite, se infiere del primer nodo desbloqueado de coursesDataset. */
  @IsOptional() @IsString() courseId?: string;

  @ValidateNested()
  @Type(() => GraphDatasetDto)
  coursesDataset: GraphDatasetDto;

  @ValidateNested()
  @Type(() => GraphDatasetDto)
  lessonsDataset: GraphDatasetDto;
}
