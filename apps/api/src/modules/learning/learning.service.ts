import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type {
  RoadmapResponse,
  LessonDetail,
  LessonAnswerSubmission,
  LessonAnswerFeedback,
  FourOptionsQuestion,
  QuestionOption,
} from '@koda/types';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../domain/repositories/curriculum.repository';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  async getRoadmap(languageSlug: string): Promise<RoadmapResponse> {
    const slug = languageSlug.toLowerCase();
    const track = await this.curriculumRepository.findTrackBySlug(slug);

    const targetCourseSlug = slug === 'python' ? 'python-core' : `${slug}-core`;
    const modules = await this.curriculumRepository.findModulesByCourse(targetCourseSlug);

    if (modules.length === 0) {
      throw new NotFoundException(`Ruta curricular para el lenguaje o curso '${languageSlug}' no encontrada en MongoDB.`);
    }

    const roadmapModules = await Promise.all(
      modules.map(async (mod) => {
        const sections = await this.curriculumRepository.findSectionsByModule(mod.slug);
        return {
          id: mod.slug,
          code: `M${mod.position.toString().padStart(2, '0')}`,
          title: mod.title,
          description: mod.objective,
          order_index: mod.position,
          total_sections: mod.totalSections,
          is_unlocked: mod.position === 1,
          is_completed: false,
          mastery_percentage: mod.position === 1 ? 25 : 0,
          sections: sections.map((sec) => ({
            id: sec.slug,
            code: `S${sec.position.toString().padStart(2, '0')}`,
            title: sec.title,
            order_index: sec.position,
            total_lessons: sec.totalLessons,
            is_unlocked: mod.position === 1 && sec.position === 1,
            is_completed: false,
            stars_earned: 0,
            max_stars_earned: 3,
          })),
        };
      }),
    );

    return {
      language: {
        id: track?.slug ?? 'python',
        slug: track?.slug ?? 'python',
        name: track?.name ?? 'Python 3.12',
        description: track?.description ?? 'Fundamentos y desarrollo moderno.',
        icon_url: '/icons/python.svg',
        color: track?.color ?? '#38BDF8',
        total_modules: modules.length,
        is_active: true,
      },
      overall_progress_percentage: 10,
      total_stars_earned: 0,
      max_possible_stars: modules.length * 24,
      current_module_id: modules[0]?.slug ?? '',
      modules: roadmapModules,
    };
  }

  async getLesson(lessonId: string): Promise<LessonDetail> {
    const lesson = await this.curriculumRepository.findLessonBySlug(lessonId);
    if (!lesson) {
      throw new NotFoundException(`Micro-lección '${lessonId}' no encontrada en MongoDB.`);
    }

    const correctOption = lesson.item2Quiz.options.find((o) => o.isCorrect);

    // Mapeo seguro a tupla de 4 opciones exigida por @koda/types
    const quizOptions: [QuestionOption, QuestionOption, QuestionOption, QuestionOption] = [
      { id: lesson.item2Quiz.options[0]?.id ?? 'a', text: lesson.item2Quiz.options[0]?.text ?? '' },
      { id: lesson.item2Quiz.options[1]?.id ?? 'b', text: lesson.item2Quiz.options[1]?.text ?? '' },
      { id: lesson.item2Quiz.options[2]?.id ?? 'c', text: lesson.item2Quiz.options[2]?.text ?? '' },
      { id: lesson.item2Quiz.options[3]?.id ?? 'd', text: lesson.item2Quiz.options[3]?.text ?? '' },
    ];

    const fourOptionsQuestion: FourOptionsQuestion = {
      type: 'SINGLE_CHOICE',
      prompt: lesson.item2Quiz.prompt,
      options: quizOptions,
      correct_option_id: correctOption?.id,
      explanation: correctOption?.feedback,
    };

    return {
      id: lesson.slug,
      section_id: lesson.sectionSlug,
      title: lesson.title,
      order_index: lesson.position,
      theory_markdown: `${lesson.theory.step1}\n\n${lesson.theory.step2}\n\n${lesson.theory.step3}`,
      code_example: lesson.theory.codeSnippet ?? '',
      expected_output: lesson.item1Console.solutionCode,
      tip_markdown: lesson.item3Prediction.hint,
      evaluation_triad: {
        item_1_console: {
          type: 'CONSOLE_CHALLENGE',
          instruction: lesson.item1Console.prompt,
          starter_code: lesson.item1Console.initialCode,
          solution_code: lesson.item1Console.solutionCode,
          test_cases: lesson.item1Console.testCases.map((tc) => ({
            input: tc.input,
            expected_output: tc.expectedOutput,
            is_hidden: false,
          })),
          timeout_ms: 2500,
        },
        item_2_options: fourOptionsQuestion,
        item_3_prediction: {
          type: lesson.item3Prediction.targetType === 'bug_hunt' ? 'BUG_HUNT' : 'PREDICT_OUTPUT',
          prompt: lesson.item3Prediction.prompt,
          code_snippet: lesson.item3Prediction.codeSnippet,
          expected_output: lesson.item3Prediction.expectedAnswer,
          explanation: lesson.item3Prediction.hint,
        },
      },
    };
  }

  async evaluateAnswer(submission: LessonAnswerSubmission): Promise<LessonAnswerFeedback> {
    const lesson = await this.curriculumRepository.findLessonBySlug(submission.lesson_id);
    if (!lesson) {
      throw new NotFoundException(`Lección '${submission.lesson_id}' no encontrada en MongoDB.`);
    }

    const correctOption = lesson.item2Quiz.options.find((o) => o.isCorrect);
    const isCorrect = Boolean(
      correctOption && submission.selected_option_ids.includes(correctOption.id),
    );

    const feedbackText = isCorrect
      ? (correctOption?.feedback || '¡Respuesta correcta! Has asimilado el concepto clave.')
      : (lesson.item2Quiz.options.find((o) => submission.selected_option_ids.includes(o.id))?.feedback ||
         'Respuesta incorrecta. Revisa la teoría y vuelve a intentarlo.');

    return {
      is_correct: isCorrect,
      xp_earned: isCorrect ? lesson.xpReward : 0,
      feedback_message: feedbackText,
      hint: isCorrect ? undefined : lesson.item3Prediction.hint,
      explanation: isCorrect ? correctOption?.feedback : undefined,
      correct_option_ids: isCorrect ? (correctOption ? [correctOption.id] : []) : undefined,
      added_to_review_queue: !isCorrect,
    };
  }
}
