import { ApiProperty } from '@nestjs/swagger';

export class BlockScoreDto {
  @ApiProperty({ description: 'Identificador del bloque (B1 o B2)', example: 'B1' })
  blockId: string;

  @ApiProperty({ description: 'Nombre descriptivo del bloque pedagógico', example: 'Fundamentos y Sintaxis' })
  name: string;

  @ApiProperty({ description: 'Módulos que abarca el bloque', example: ['M01', 'M02', 'M03'] })
  modulesCovered: string[];

  @ApiProperty({ description: 'Preguntas correctas en el bloque', example: 5 })
  correctAnswers: number;

  @ApiProperty({ description: 'Total de preguntas del bloque', example: 6 })
  totalQuestions: number;

  @ApiProperty({ description: 'Porcentaje de acierto obtenido en el bloque', example: 83.33 })
  scorePercentage: number;

  @ApiProperty({ description: 'Indica si superó el umbral pedagógico del 80%', example: true })
  isPassed: boolean;
}

export class DiagnosticResultResponseDto {
  @ApiProperty({ description: 'ID canónico del módulo recomendado de entrada', example: 'py_mod_04' })
  recommendedModuleId: string;

  @ApiProperty({ description: 'Código del módulo de inicio sugerido', example: 'M04' })
  recommendedModuleCode: string;

  @ApiProperty({ description: 'Título del módulo de inicio sugerido', example: 'Condicionales y Decisiones' })
  recommendedModuleTitle: string;

  @ApiProperty({ description: 'Orden numérico del módulo recomendado en la ruta', example: 4 })
  recommendedModuleOrder: number;

  @ApiProperty({ description: 'Puntaje global obtenido de 0 a 100', example: 75 })
  overallScore: number;

  @ApiProperty({ description: 'Total de preguntas del test diagnóstico', example: 12 })
  totalQuestions: number;

  @ApiProperty({ description: 'Total de respuestas correctas', example: 9 })
  totalCorrect: number;

  @ApiProperty({ description: 'Indica si aprobó el Bloque B1 (M01-M03 con >= 80%)', example: true })
  passedBlock1: boolean;

  @ApiProperty({ description: 'Indica si aprobó el Bloque B2 (M04-M06 con >= 80%)', example: false })
  passedBlock2: boolean;

  @ApiProperty({ description: 'Desglose detallado por bloques pedagógicos', type: [BlockScoreDto] })
  blockScores: BlockScoreDto[];

  @ApiProperty({ description: 'Indica si se aplicó contención (clamping) respecto al nivel autodeclarado', example: false })
  clamped: boolean;

  @ApiProperty({ description: 'Justificación pedagógica personalizada generada por Koda 🦊' })
  justification: string;

  @ApiProperty({ description: 'Códigos de módulos desbloqueados automáticamente con 3 estrellas simbólicas', example: ['M01', 'M02', 'M03'] })
  unlockedModules: string[];

  @ApiProperty({ description: 'Nivel autodeclarado por el estudiante', example: 'medium' })
  declaredLevel: string;
}
