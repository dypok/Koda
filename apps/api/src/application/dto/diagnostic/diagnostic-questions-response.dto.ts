import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DiagnosticOptionDto {
  @ApiProperty({ description: 'Identificador único de la opción', example: 'opt_1a' })
  id: string;

  @ApiProperty({ description: 'Texto descriptivo o de código de la opción', example: 'print("¡Hola Koda!")' })
  text: string;
}

export class DiagnosticQuestionItemDto {
  @ApiProperty({ description: 'Identificador único de la pregunta', example: 'diag-py-01' })
  id: string;

  @ApiProperty({ description: 'Número de orden secuencial en el test (1 a 12)', example: 1 })
  order: number;

  @ApiProperty({ description: 'Identificador del bloque temático (B1 o B2)', example: 'B1' })
  blockId: string;

  @ApiProperty({ description: 'Nombre descriptivo del bloque temático', example: 'Fundamentos y Sintaxis' })
  blockName: string;

  @ApiProperty({ description: 'Código del módulo curricular cubierto', example: 'M01' })
  moduleCode: string;

  @ApiProperty({ description: 'Título del módulo evaluado', example: 'Fundamentos de Python' })
  moduleTitle: string;

  @ApiProperty({ description: 'Enunciado de la pregunta diagnóstica' })
  prompt: string;

  @ApiPropertyOptional({ description: 'Fragmento de código opcional a analizar', example: 'resultado = type(42.0)' })
  codeSnippet?: string;

  @ApiProperty({ description: 'Lista de opciones de respuesta barajadas', type: [DiagnosticOptionDto] })
  options: DiagnosticOptionDto[];
}

export class DiagnosticQuestionsResponseDto {
  @ApiProperty({ description: 'Lenguaje tecnológico evaluado', example: 'python' })
  languageSlug: string;

  @ApiProperty({ description: 'Total de preguntas calibradas del test diagnóstico', example: 12 })
  totalQuestions: number;

  @ApiProperty({ description: 'Tiempo sugerido en minutos para completar el test', example: 15 })
  suggestedDurationMinutes: number;

  @ApiProperty({ description: 'Lista de preguntas calibradas sin respuestas correctas', type: [DiagnosticQuestionItemDto] })
  questions: DiagnosticQuestionItemDto[];
}
