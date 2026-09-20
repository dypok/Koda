import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre a mostrar públicamente en la plataforma y diplomas',
    example: 'Dylan Gamero',
  })
  @IsOptional()
  @IsString()
  @Length(2, 80, { message: 'El nombre debe tener entre 2 y 80 caracteres' })
  displayName?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar oficial seleccionado o imagen pública',
    example: '/brand/koda-mascot-cartoon-2d.svg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Clave del avatar almacenado en almacenamiento de objetos (S3 o Supabase Storage)',
    example: 'avatars/d3b07384/koda-astronaut.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  avatarObjectKey?: string;

  @ApiPropertyOptional({
    description: 'Tipo de documento legal para expedición de certificaciones (CC, TI, CE, PASSPORT)',
    enum: ['CC', 'TI', 'CE', 'PASSPORT'],
    example: 'CC',
  })
  @IsOptional()
  @IsEnum(['CC', 'TI', 'CE', 'PASSPORT'], {
    message: 'El tipo de documento debe ser CC, TI, CE o PASSPORT',
  })
  documentType?: 'CC' | 'TI' | 'CE' | 'PASSPORT';

  @ApiPropertyOptional({
    description: 'Número de documento de identificación legal oficial',
    example: '1047456789',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50, { message: 'El documento debe contener entre 3 y 50 caracteres' })
  documentNumber?: string;

  @ApiPropertyOptional({
    description: 'Biografía corta del estudiante',
    example: 'Ingeniero de Software apasionado por Python y Machine Learning',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La biografía no puede superar los 500 caracteres' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Zona horaria preferida (IANA timezone)',
    example: 'America/Bogota',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Código de idioma y región',
    example: 'es-CO',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;

  @ApiPropertyOptional({
    description: 'Meta de ritmo de estudio diario',
    enum: ['casual', 'regular', 'focused', 'intense'],
    example: 'regular',
  })
  @IsOptional()
  @IsEnum(['casual', 'regular', 'focused', 'intense'], {
    message: 'La meta de estudio debe ser casual, regular, focused o intense',
  })
  dailyGoalId?: 'casual' | 'regular' | 'focused' | 'intense';

  @ApiPropertyOptional({
    description: 'Minutos diarios de estudio objetivo',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @Min(5, { message: 'El tiempo mínimo diario es de 5 minutos' })
  @Max(120, { message: 'El tiempo máximo diario es de 120 minutos' })
  dailyGoalMinutes?: number;

  @ApiPropertyOptional({
    description: 'Lenguaje tecnológico inicial seleccionado',
    example: 'python',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  initialLanguageSlug?: string;

  @ApiPropertyOptional({
    description: 'Nivel pedagógico de experiencia',
    enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
    example: 'beginner',
  })
  @IsOptional()
  @IsEnum(['beginner', 'elementary', 'intermediate', 'advanced'], {
    message: 'Nivel de experiencia inválido',
  })
  experienceLevel?: 'beginner' | 'elementary' | 'intermediate' | 'advanced';

  @ApiPropertyOptional({
    description: 'Estilo de aprendizaje predilecto',
    enum: ['hands-on', 'guided', 'projects', 'gamified'],
    example: 'hands-on',
  })
  @IsOptional()
  @IsEnum(['hands-on', 'guided', 'projects', 'gamified'], {
    message: 'Estilo de aprendizaje inválido',
  })
  learningStyle?: 'hands-on' | 'guided' | 'projects' | 'gamified';
}
