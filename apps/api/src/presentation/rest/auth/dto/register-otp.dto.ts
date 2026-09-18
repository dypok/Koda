import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsInt, Min, Max } from 'class-validator';

export class RegisterOtpDto {
  @ApiProperty({
    description: 'Nombre completo o apodo visible del estudiante',
    example: 'Daniel Echeverría',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  fullName: string;

  @ApiProperty({
    description: 'Correo electrónico válido',
    example: 'estudiante@koda.academy',
  })
  @IsEmail({}, { message: 'El formato de correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiProperty({
    description: 'Contraseña segura (mínimo 8 caracteres)',
    example: 'KodaPass#2026',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiPropertyOptional({
    description: 'Slug del lenguaje seleccionado en el onboarding previo',
    example: 'python',
    default: 'python',
  })
  @IsString()
  @IsOptional()
  initialLanguageSlug?: string;

  @ApiPropertyOptional({
    description: 'Nivel autodeclarado de experiencia',
    example: 'beginner',
    default: 'beginner',
  })
  @IsString()
  @IsOptional()
  experienceLevel?: string;

  @ApiPropertyOptional({
    description: 'Estilo de aprendizaje preferido',
    example: 'hands-on',
    default: 'hands-on',
  })
  @IsString()
  @IsOptional()
  learningStyle?: string;

  @ApiPropertyOptional({
    description: 'Identificador de la meta diaria de estudio',
    example: 'regular',
    default: 'regular',
  })
  @IsString()
  @IsOptional()
  dailyGoalId?: string;

  @ApiPropertyOptional({
    description: 'Minutos diarios comprometidos',
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(5)
  @Max(60)
  @IsOptional()
  dailyGoalMinutes?: number;
}
