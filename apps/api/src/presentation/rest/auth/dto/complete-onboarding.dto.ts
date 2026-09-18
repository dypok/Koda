import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CompleteOnboardingDto {
  @ApiProperty({
    description: 'Lenguaje tecnológico inicial seleccionado',
    example: 'python',
  })
  @IsString()
  @IsNotEmpty({ message: 'El lenguaje inicial es obligatorio' })
  initialLanguageSlug: string;

  @ApiProperty({
    description: 'Nivel autodeclarado de experiencia en programación',
    enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
    example: 'beginner',
  })
  @IsEnum(['beginner', 'elementary', 'intermediate', 'advanced'], {
    message: 'Nivel de experiencia inválido',
  })
  experienceLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';

  @ApiProperty({
    description: 'Estilo de aprendizaje preferido en Koda',
    enum: ['hands-on', 'guided', 'projects', 'gamified'],
    example: 'hands-on',
  })
  @IsEnum(['hands-on', 'guided', 'projects', 'gamified'], {
    message: 'Estilo de aprendizaje inválido',
  })
  learningStyle: 'hands-on' | 'guided' | 'projects' | 'gamified';

  @ApiProperty({
    description: 'Identificador de la meta diaria de estudio',
    enum: ['casual', 'regular', 'focused', 'intense'],
    example: 'regular',
  })
  @IsEnum(['casual', 'regular', 'focused', 'intense'], {
    message: 'Meta diaria inválida',
  })
  dailyGoalId: 'casual' | 'regular' | 'focused' | 'intense';

  @ApiProperty({
    description: 'Minutos diarios comprometidos de estudio',
    example: 10,
  })
  @IsInt()
  @Min(5, { message: 'El tiempo mínimo diario es de 5 minutos' })
  @Max(60, { message: 'El tiempo máximo diario es de 60 minutos' })
  dailyGoalMinutes: number;

  @ApiPropertyOptional({
    description: 'Nombre público a mostrar si se desea actualizar desde el onboarding',
    example: 'Daniel Echeverría',
  })
  @IsString()
  @IsOptional()
  displayName?: string;
}
