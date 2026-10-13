import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '@domain/entities/user.entity';

export class UserProfileResponseDto {
  @ApiProperty({ description: 'Identificador único UUID del usuario', example: 'd3b07384-d113-4603-a125-f852e93b4a28' })
  id: string;

  @ApiProperty({ description: 'Correo electrónico institucional o personal', example: 'estudiante@koda.academy' })
  email: string;

  @ApiProperty({ description: 'Rol del usuario en la plataforma', example: 'user' })
  role: string;

  @ApiProperty({ description: 'Estado actual de la cuenta', example: 'active' })
  status: string;

  @ApiProperty({ description: 'Nombre completo o nombre a mostrar públicamente', example: 'Dylan Gamero' })
  displayName: string;

  @ApiPropertyOptional({ description: 'URL del avatar oficial de Koda o imagen de perfil', example: '/brand/koda-mascot-cartoon-2d.svg' })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ description: 'Key del objeto de avatar en almacenamiento S3 / Supabase Storage', example: null })
  avatarObjectKey?: string | null;

  @ApiPropertyOptional({ description: 'Tipo de documento de identidad para certificaciones (CC, TI, CE, PASSPORT)', example: 'CC' })
  documentType?: string | null;

  @ApiPropertyOptional({ description: 'Número de identificación legal enmascarado para seguridad PII', example: '***4567' })
  documentNumberMasked?: string | null;

  @ApiPropertyOptional({ description: 'Documento legal formateado con tipo y máscara', example: 'CC ***4567' })
  formattedMaskedDocument?: string | null;

  @ApiPropertyOptional({ description: 'Biografía corta del estudiante', example: 'Aprendiendo Python 3.12 y algoritmos en Koda 🦊' })
  bio?: string | null;

  @ApiProperty({ description: 'Zona horaria configurada', example: 'America/Bogota' })
  timezone: string;

  @ApiProperty({ description: 'Locale de idioma y región', example: 'es-CO' })
  locale: string;

  // Onboarding
  @ApiProperty({ description: 'Indica si el usuario completó el proceso inicial de inducción', example: true })
  onboardingCompleted: boolean;

  @ApiProperty({ description: 'Lenguaje tecnológico inicial seleccionado', example: 'python' })
  initialLanguageSlug: string;

  @ApiProperty({ description: 'Nivel autodeclarado de experiencia', example: 'beginner' })
  experienceLevel: string;

  @ApiProperty({ description: 'Estilo de aprendizaje preferido', example: 'hands-on' })
  learningStyle: string;

  @ApiProperty({ description: 'Identificador de la meta diaria de estudio', example: 'regular' })
  dailyGoalId: string;

  @ApiProperty({ description: 'Minutos diarios comprometidos de estudio', example: 10 })
  dailyGoalMinutes: number;

  // Métricas de Gamificación O(1)
  @ApiProperty({ description: 'Puntos de experiencia totales acumulados', example: 250 })
  totalXp: number;

  @ApiProperty({ description: 'Nivel pedagógico actual', example: 2 })
  currentLevel: number;

  @ApiProperty({ description: 'Racha actual de días consecutivos', example: 3 })
  currentStreak: number;

  @ApiProperty({ description: 'Racha máxima histórica conseguida', example: 7 })
  longestStreak: number;

  @ApiProperty({ description: 'Protectores de racha disponibles', example: 1 })
  streakFreezeCount: number;

  @ApiProperty({ description: 'Tiempo total invertido de estudio en segundos', example: 3600 })
  totalStudyTimeSeconds: number;

  @ApiPropertyOptional({ description: 'Fecha del último día de estudio activo (ISO-8601)', example: '2026-09-19T23:00:00.000Z' })
  lastStudyDate?: string | null;

  @ApiProperty({ description: 'Fecha de creación de la cuenta (ISO-8601)', example: '2026-09-15T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Fecha de última actualización del perfil (ISO-8601)', example: '2026-09-20T00:00:00.000Z' })
  updatedAt: string;

  static fromEntity(user: UserEntity): UserProfileResponseDto {
    const dto = new UserProfileResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.status = user.status;
    dto.displayName = user.displayName;
    dto.avatarUrl = user.avatarUrl ?? null;
    dto.avatarObjectKey = user.avatarObjectKey ?? null;
    dto.documentType = user.documentType ?? null;
    dto.documentNumberMasked = user.maskedDocumentNumber;
    dto.formattedMaskedDocument = user.formattedMaskedDocument;
    dto.bio = user.bio ?? null;
    dto.timezone = user.timezone;
    dto.locale = user.locale;
    dto.onboardingCompleted = user.onboardingCompleted;
    dto.initialLanguageSlug = user.initialLanguageSlug;
    dto.experienceLevel = user.experienceLevel;
    dto.learningStyle = user.learningStyle;
    dto.dailyGoalId = user.dailyGoalId;
    dto.dailyGoalMinutes = user.dailyGoalMinutes;
    dto.totalXp = user.totalXp;
    dto.currentLevel = user.currentLevel;
    dto.currentStreak = user.currentStreak;
    dto.longestStreak = user.longestStreak;
    dto.streakFreezeCount = user.streakFreezeCount;
    dto.totalStudyTimeSeconds = user.totalStudyTimeSeconds;
    dto.lastStudyDate = user.lastStudyDate ? user.lastStudyDate.toISOString() : null;
    dto.createdAt = user.createdAt.toISOString();
    dto.updatedAt = user.updatedAt.toISOString();
    return dto;
  }
}
