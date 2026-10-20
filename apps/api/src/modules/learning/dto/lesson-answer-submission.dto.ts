import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { LessonAnswerSubmission } from '@koda/types';

export class LessonAnswerSubmissionDto implements LessonAnswerSubmission {
  @ApiProperty({ description: 'ID de la micro-lección', example: 'py_01' })
  @IsString()
  @IsOptional()
  lesson_id: string;

  @ApiProperty({ description: 'ID de la pregunta respondida', example: 'q_001' })
  @IsString()
  question_id: string;

  @ApiProperty({
    description: 'IDs de las opciones seleccionadas',
    example: ['opt_1'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  selected_option_ids: string[];

  @ApiPropertyOptional({ description: 'Texto libre ingresado por el usuario', example: 'Koda' })
  @IsOptional()
  @IsString()
  input_text?: string;

  @ApiPropertyOptional({
    description: 'Ordenamiento de bloques en ejercicios tipo Parson',
    example: ['b1', 'b2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ordered_block_ids?: string[];

  @ApiPropertyOptional({
    description: 'XP dinámico obtenido para la lección específica',
    example: 40,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  xp_earned?: number;
}
