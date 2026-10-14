import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  ICurriculumRepository,
  CURRICULUM_REPOSITORY_TOKEN,
} from '@domain/repositories/curriculum.repository';
import { ContentBundleService, BankQuestion } from '../../../infra/content/content-bundle.service';

export interface GeneratedQuestion {
  id: string;
  concept_id?: string;
  type: string;
  difficulty?: string;
  prompt: string;
  options?: Array<{ id: string; text: string }>;
  code_snippet?: string;
  [key: string]: any;
}

export interface GeneratedEvaluationResult {
  evaluation_type: 'quiz' | 'exam';
  module_id: string;
  total_questions: number;
  questions: GeneratedQuestion[];
}

@Injectable()
export class GenerateEvaluationUseCase {
  private readonly logger = new Logger(GenerateEvaluationUseCase.name);

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly contentBundleService: ContentBundleService,
  ) {}

  private sampleQuestions(questions: BankQuestion[], config: Record<string, number>): BankQuestion[] {
    const sampled: BankQuestion[] = [];
    for (const [type, count] of Object.entries(config)) {
      const pool = questions.filter((q) => q.type === type);
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      sampled.push(...shuffled.slice(0, count));
    }

    const totalRequired = Object.values(config).reduce((a, b) => a + b, 0);
    if (sampled.length < totalRequired) {
      const remaining = totalRequired - sampled.length;
      const unused = questions.filter((q) => !sampled.includes(q));
      sampled.push(...[...unused].sort(() => 0.5 - Math.random()).slice(0, remaining));
    }

    return sampled.sort(() => 0.5 - Math.random());
  }

  async execute(
    userId: string,
    moduleSlug: string,
    type: 'quiz' | 'exam',
  ): Promise<GeneratedEvaluationResult> {
    const module = await this.curriculumRepository.findModuleBySlug(moduleSlug);
    if (!module) {
      throw new NotFoundException(`Modulo '${moduleSlug}' no encontrado.`);
    }

    const course = await this.curriculumRepository.findCourseBySlug(module.courseSlug);
    const languageSlug = course?.trackSlug || 'python';

    const compositions = this.contentBundleService.getComposition(languageSlug);
    const config = type === 'quiz' ? compositions?.quiz : compositions?.exam;

    if (!config) {
      throw new BadRequestException(`Configuración de evaluación no encontrada para ${languageSlug}`);
    }

    const bank = this.contentBundleService.getModuleBank(languageSlug, moduleSlug);
    if (!bank || bank.length === 0) {
      throw new BadRequestException('Banco de preguntas vacío para este módulo');
    }

    const selectedQuestions = this.sampleQuestions(bank, config);

    // Ocultar respuestas correctas y pistas antes de enviar al cliente (anti-spoilers)
    const publicQuestions = selectedQuestions.map((q) => {
      const { correct_option_id, hint, ...rest } = q;
      return rest;
    });

    return {
      evaluation_type: type,
      module_id: moduleSlug,
      total_questions: publicQuestions.length,
      questions: publicQuestions,
    };
  }
}
