import { Injectable, Inject, Optional, Logger } from '@nestjs/common';
import {
  PYTHON_DIAGNOSTIC_QUESTIONS,
  BlockEvaluationResult,
  DeclaredExperienceLevel,
} from '@domain/entities/diagnostic.entity';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { PrismaService } from '@infra/database/postgres/prisma.service';
import { SubmitDiagnosticDto } from '../../dto/diagnostic/submit-diagnostic.dto';
import {
  DiagnosticResultResponseDto,
  BlockScoreDto,
} from '../../dto/diagnostic/diagnostic-result-response.dto';

interface ModuleMetadata {
  id: string;
  code: string;
  order: number;
  title: string;
}

const MODULES_MAP: Record<number, ModuleMetadata> = {
  1: { id: 'py_mod_01', code: 'M01', order: 1, title: 'Fundamentos de Python' },
  2: { id: 'py_mod_02', code: 'M02', order: 2, title: 'Variables y Tipos de Datos' },
  3: { id: 'py_mod_03', code: 'M03', order: 3, title: 'Operadores y Expresiones' },
  4: { id: 'py_mod_04', code: 'M04', order: 4, title: 'Condicionales y Decisiones' },
  5: { id: 'py_mod_05', code: 'M05', order: 5, title: 'Bucles e Iteraciones' },
  6: { id: 'py_mod_06', code: 'M06', order: 6, title: 'Funciones y Modularidad' },
  7: { id: 'py_mod_07', code: 'M07', order: 7, title: 'Colecciones y Estructuras de Datos' },
  8: { id: 'py_mod_08', code: 'M08', order: 8, title: 'Manejo de Errores y Excepciones' },
  9: { id: 'py_mod_09', code: 'M09', order: 9, title: 'Programación Orientada a Objetos' },
  10: { id: 'py_mod_10', code: 'M10', order: 10, title: 'Módulos y Paquetes' },
  11: { id: 'py_mod_11', code: 'M11', order: 11, title: 'Archivos y Persistencia' },
  12: { id: 'py_mod_12', code: 'M12', order: 12, title: 'Proyecto Integrador' },
};

@Injectable()
export class EvaluateDiagnosticUseCase {
  private readonly logger = new Logger(EvaluateDiagnosticUseCase.name);

  constructor(
    @Optional()
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository?: IUserRepository,
    @Optional()
    private readonly prisma?: PrismaService,
  ) {}

  async execute(dto: SubmitDiagnosticDto, userId?: string): Promise<DiagnosticResultResponseDto> {
    const normalizedLevel = this.normalizeLevel(dto.declaredLevel);

    // Caso de omisión / autodeclaración Principiante sin preguntas respondidas
    if (normalizedLevel === 'beginner' && (!dto.answers || dto.answers.length === 0)) {
      return this.buildBeginnerDirectResult(dto.declaredLevel);
    }

    // 1. Evaluación de respuestas por preguntas y bloques
    const answerMap = new Map<string, string>(
      (dto.answers || []).map((a) => [a.questionId, a.selectedOptionId]),
    );

    let totalCorrect = 0;
    const b1Questions = PYTHON_DIAGNOSTIC_QUESTIONS.filter((q) => q.blockId === 'B1');
    const b2Questions = PYTHON_DIAGNOSTIC_QUESTIONS.filter((q) => q.blockId === 'B2');

    let b1Correct = 0;
    for (const q of b1Questions) {
      if (answerMap.get(q.id) === q.correctOptionId) {
        b1Correct++;
        totalCorrect++;
      }
    }

    let b2Correct = 0;
    for (const q of b2Questions) {
      if (answerMap.get(q.id) === q.correctOptionId) {
        b2Correct++;
        totalCorrect++;
      }
    }

    const totalQuestions = PYTHON_DIAGNOSTIC_QUESTIONS.length;
    const overallScore = Math.round((totalCorrect / totalQuestions) * 100);
    const b1Score = Math.round((b1Correct / b1Questions.length) * 100);
    const b2Score = Math.round((b2Correct / b2Questions.length) * 100);

    const passedBlock1 = b1Score >= 80;
    const passedBlock2 = b2Score >= 80;

    const blockScores: BlockScoreDto[] = [
      {
        blockId: 'B1',
        name: 'Bloque B1: Fundamentos y Sintaxis (M01-M03)',
        modulesCovered: ['M01', 'M02', 'M03'],
        correctAnswers: b1Correct,
        totalQuestions: b1Questions.length,
        scorePercentage: b1Score,
        isPassed: passedBlock1,
      },
      {
        blockId: 'B2',
        name: 'Bloque B2: Control de Flujo y Modularidad (M04-M06)',
        modulesCovered: ['M04', 'M05', 'M06'],
        correctAnswers: b2Correct,
        totalQuestions: b2Questions.length,
        scorePercentage: b2Score,
        isPassed: passedBlock2,
      },
    ];

    // 2. Determinación de módulo candidato (14 §5.4)
    let candidateOrder = 1;
    if (passedBlock1 && passedBlock2) {
      // Superó B1 y B2 -> Salto a M07
      candidateOrder = 7;
    } else if (passedBlock1 && !passedBlock2) {
      // Superó B1 -> Salto a M04
      candidateOrder = 4;
    } else {
      // No superó B1 -> M01 (Fundamentos)
      candidateOrder = 1;
    }

    // 3. Algoritmo de Clamping por nivel declarado (14 §6.3)
    const { clampedOrder, clamped } = this.applyClamping(candidateOrder, normalizedLevel);

    const recommendedMeta = MODULES_MAP[clampedOrder] || MODULES_MAP[1];

    // 4. Módulos desbloqueados por diagnóstico con 3⭐ simbólicas
    const unlockedModules: string[] = [];
    for (let i = 1; i < clampedOrder; i++) {
      if (MODULES_MAP[i]) {
        unlockedModules.push(MODULES_MAP[i].code);
      }
    }

    // 5. Justificación pedagógica
    const justification = this.generateJustification({
      declaredLevel: dto.declaredLevel,
      normalizedLevel,
      b1Score,
      b2Score,
      overallScore,
      recommendedMeta,
      clamped,
      passedBlock1,
      passedBlock2,
    });

    // 6. Persistencia condicional si el usuario está autenticado
    if (userId && this.prisma && this.userRepository) {
      await this.persistDiagnosticProgress(userId, clampedOrder, normalizedLevel, overallScore);
    }

    return {
      recommendedModuleId: recommendedMeta.id,
      recommendedModuleCode: recommendedMeta.code,
      recommendedModuleTitle: recommendedMeta.title,
      recommendedModuleOrder: recommendedMeta.order,
      overallScore,
      totalQuestions,
      totalCorrect,
      passedBlock1,
      passedBlock2,
      blockScores,
      clamped,
      justification,
      unlockedModules,
      declaredLevel: dto.declaredLevel,
    };
  }

  private normalizeLevel(level: string): 'beginner' | 'medium' | 'semi_professional' | 'professional' {
    const l = (level || '').toLowerCase().trim();
    if (l === 'beginner' || l === 'principiante') return 'beginner';
    if (l === 'medium' || l === 'elementary' || l === 'basico' || l === 'básico') return 'medium';
    if (l === 'semi_professional' || l === 'intermediate' || l === 'intermedio' || l === 'semi_pro')
      return 'semi_professional';
    if (l === 'professional' || l === 'advanced' || l === 'avanzado' || l === 'pro') return 'professional';
    return 'beginner';
  }

  private applyClamping(
    candidateOrder: number,
    level: 'beginner' | 'medium' | 'semi_professional' | 'professional',
  ): { clampedOrder: number; clamped: boolean } {
    let minAllowed = 1;
    let maxAllowed = 12;

    switch (level) {
      case 'beginner':
        minAllowed = 1;
        maxAllowed = 3;
        break;
      case 'medium':
        minAllowed = 1;
        maxAllowed = 6;
        break;
      case 'semi_professional':
        minAllowed = 2;
        maxAllowed = 9;
        break;
      case 'professional':
        minAllowed = 3;
        maxAllowed = 12;
        break;
    }

    const clampedOrder = Math.max(minAllowed, Math.min(maxAllowed, candidateOrder));
    const clamped = clampedOrder !== candidateOrder;

    return { clampedOrder, clamped };
  }

  private generateJustification(params: {
    declaredLevel: string;
    normalizedLevel: string;
    b1Score: number;
    b2Score: number;
    overallScore: number;
    recommendedMeta: ModuleMetadata;
    clamped: boolean;
    passedBlock1: boolean;
    passedBlock2: boolean;
  }): string {
    const { b1Score, b2Score, recommendedMeta, clamped, declaredLevel, passedBlock1, passedBlock2 } =
      params;

    if (clamped && params.normalizedLevel === 'medium' && passedBlock1 && passedBlock2) {
      return `¡Gran desempeño técnico en ambos bloques (${b1Score}% en Fundamentos y ${b2Score}% en Control de Flujo)! Para consolidar tus habilidades y conforme a tu nivel autodeclarado (${declaredLevel}), tu punto de entrada óptimo es el Módulo ${recommendedMeta.order}: ${recommendedMeta.title}. Los módulos M01 a M05 han sido habilitados.`;
    }

    if (passedBlock1 && passedBlock2) {
      return `¡Dominio sobresaliente! Aprobaste con éxito el Bloque 1 (${b1Score}%) y el Bloque 2 (${b2Score}%). Tu punto de entrada recomendado es el Módulo ${recommendedMeta.order}: ${recommendedMeta.title}. Los módulos M01 a M06 han sido exonerados por diagnóstico con 3 estrellas simbólicas ⭐⭐⭐.`;
    }

    if (passedBlock1) {
      return `¡Muy buen avance! Has dominado el Bloque 1 de Fundamentos con ${b1Score}%, lo que te permite saltar directamente al Módulo ${recommendedMeta.order}: ${recommendedMeta.title}. En el Bloque 2 obtuviste ${b2Score}%, por lo que trabajarás en estas competencias durante tu recorrido.`;
    }

    return `Tu desempeño en el Bloque 1 fue de ${b1Score}% y en el Bloque 2 de ${b2Score}%. Te recomendamos comenzar en el Módulo ${recommendedMeta.order}: ${recommendedMeta.title} para cimentar firmemente las bases de la programación en Python antes de avanzar a conceptos complejos.`;
  }

  private buildBeginnerDirectResult(declaredLevel: string): DiagnosticResultResponseDto {
    const meta = MODULES_MAP[1];
    return {
      recommendedModuleId: meta.id,
      recommendedModuleCode: meta.code,
      recommendedModuleTitle: meta.title,
      recommendedModuleOrder: meta.order,
      overallScore: 0,
      totalQuestions: 12,
      totalCorrect: 0,
      passedBlock1: false,
      passedBlock2: false,
      blockScores: [
        {
          blockId: 'B1',
          name: 'Bloque B1: Fundamentos y Sintaxis (M01-M03)',
          modulesCovered: ['M01', 'M02', 'M03'],
          correctAnswers: 0,
          totalQuestions: 6,
          scorePercentage: 0,
          isPassed: false,
        },
        {
          blockId: 'B2',
          name: 'Bloque B2: Control de Flujo y Modularidad (M04-M06)',
          modulesCovered: ['M04', 'M05', 'M06'],
          correctAnswers: 0,
          totalQuestions: 6,
          scorePercentage: 0,
          isPassed: false,
        },
      ],
      clamped: false,
      justification: `Has seleccionado el nivel ${declaredLevel}. Tu aventura de aprendizaje comienza directamente desde el Módulo 01 (${meta.title}) para construir paso a paso tu dominio en Python.`,
      unlockedModules: [],
      declaredLevel,
    };
  }

  private async persistDiagnosticProgress(
    userId: string,
    recommendedOrder: number,
    normalizedLevel: string,
    overallScore: number,
  ): Promise<void> {
    try {
      if (!this.prisma) return;

      // Actualizar experiencia del usuario si existe
      if (this.userRepository) {
        const user = await this.userRepository.findById(userId);
        if (user) {
          user.updateProfile({
            experienceLevel: normalizedLevel === 'medium' ? 'elementary' : (normalizedLevel as any),
          });
          await this.userRepository.update(user);
        }
      }

      this.logger.log(
        `Progreso de diagnóstico guardado para usuario ${userId}: recomendado M0${recommendedOrder} (Score: ${overallScore}%)`,
      );
    } catch (err: any) {
      this.logger.warn(`No se pudo persistir el resultado de diagnóstico para ${userId}: ${err.message}`);
    }
  }
}
