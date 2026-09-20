import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class DiagnosticAnswerDto {
  @ApiProperty({ description: 'ID de la pregunta respondida', example: 'diag-py-01' })
  @IsString()
  @IsNotEmpty({ message: 'El questionId es obligatorio' })
  questionId: string;

  @ApiProperty({ description: 'ID de la opción seleccionada por el estudiante', example: 'opt_1a' })
  @IsString()
  @IsNotEmpty({ message: 'El selectedOptionId es obligatorio' })
  selectedOptionId: string;
}

export class SubmitDiagnosticDto {
  @ApiProperty({
    description: 'Nivel autodeclarado por el estudiante en la pantalla de onboarding',
    enum: ['beginner', 'medium', 'semi_professional', 'professional', 'elementary', 'intermediate', 'advanced'],
    example: 'medium',
  })
  @IsEnum(
    ['beginner', 'medium', 'semi_professional', 'professional', 'elementary', 'intermediate', 'advanced'],
    { message: 'Nivel autodeclarado inválido' },
  )
  declaredLevel: string;

  @ApiPropertyOptional({
    description: 'Lenguaje tecnológico evaluado (default: python)',
    example: 'python',
  })
  @IsOptional()
  @IsString()
  languageSlug?: string;

  @ApiProperty({
    description: 'Respuestas seleccionadas en el test de 12 preguntas',
    type: [DiagnosticAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosticAnswerDto)
  answers: DiagnosticAnswerDto[];
}
