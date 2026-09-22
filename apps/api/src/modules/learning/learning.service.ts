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
import {
  IProgressRepository,
  PROGRESS_REPOSITORY_TOKEN,
} from '../../domain/repositories/progress.repository';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    @Inject(PROGRESS_REPOSITORY_TOKEN)
    private readonly progressRepository: IProgressRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getRoadmap(languageSlug: string, userId?: string): Promise<RoadmapResponse> {
    const slug = languageSlug.toLowerCase();
    const track = await this.curriculumRepository.findTrackBySlug(slug);

    const targetCourseSlug = slug === 'python' ? 'python-core' : `${slug}-core`;
    const modules = await this.curriculumRepository.findModulesByCourse(targetCourseSlug);

    if (modules.length === 0) {
      throw new NotFoundException(`Ruta curricular para el lenguaje o curso '${languageSlug}' no encontrada en MongoDB.`);
    }

    // Si hay userId, consultamos la persistencia en PostgreSQL en batch (p95 < 40ms)
    const [userStars, userModules] = userId
      ? await Promise.all([
          this.progressRepository.findAllSectionStarsByUser(userId),
          this.progressRepository.findAllModuleProgressByUser(userId),
        ])
      : [[], []];

    const starsMap = new Map(userStars.map((s) => [s.sectionId, s]));
    const moduleProgressMap = new Map(userModules.map((m) => [m.moduleId, m]));

    // Pre-cargar secciones de los módulos en orden determinista
    const modulesWithSections = await Promise.all(
      modules.map(async (mod) => ({
        mod,
        sections: await this.curriculumRepository.findSectionsByModule(mod.slug),
      })),
    );

    let totalStarsEarned = 0;
    let totalSectionsAcrossAll = 0;
    let totalCompletedSectionsAcrossAll = 0;
    let currentModuleId = modules[0]?.slug ?? '';
    let foundCurrentModule = false;
    let prevModuleCompleted = true; // El primer módulo inicia desbloqueado por defecto

    const roadmapModules = modulesWithSections.map(({ mod, sections }, modIndex) => {
      const moduleProgress = moduleProgressMap.get(mod.slug);

      // Desbloqueo progresivo del módulo:
      // - El primer módulo siempre está desbloqueado
      // - Si está explícitamente en progreso o completado en DB, está desbloqueado
      // - Si el módulo anterior fue completado, se desbloquea
      const isModuleUnlocked =
        mod.position === 1 ||
        modIndex === 0 ||
        moduleProgress?.status === 'in_progress' ||
        moduleProgress?.status === 'completed' ||
        prevModuleCompleted;

      let completedSectionsInModule = 0;
      let prevSectionCompleted = isModuleUnlocked;

      const mappedSections = sections.map((sec, secIndex) => {
        const star = starsMap.get(sec.slug);
        const starsEarned = star?.starsEarned ?? 0;
        const isCompleted = star?.isPassed ?? false;

        if (isCompleted) {
          completedSectionsInModule += 1;
          totalCompletedSectionsAcrossAll += 1;
        }
        totalStarsEarned += starsEarned;
        totalSectionsAcrossAll += 1;

        // Desbloqueo progresivo de sección dentro del módulo:
        // Desbloqueada si el módulo está desbloqueado Y (es la primera sección O la sección anterior fue aprobada)
        const isSectionUnlocked = isModuleUnlocked && (secIndex === 0 || prevSectionCompleted);
        prevSectionCompleted = isCompleted;

        return {
          id: sec.slug,
          code: `S${sec.position.toString().padStart(2, '0')}`,
          title: sec.title,
          order_index: sec.position,
          total_lessons: sec.totalLessons,
          is_unlocked: isSectionUnlocked,
          is_completed: isCompleted,
          stars_earned: starsEarned,
          max_stars_earned: 3,
        };
      });

      const isModuleCompleted =
        moduleProgress?.status === 'completed' ||
        (mappedSections.length > 0 && completedSectionsInModule === mappedSections.length);

      prevModuleCompleted = isModuleCompleted;

      if (!foundCurrentModule && isModuleUnlocked && !isModuleCompleted) {
        currentModuleId = mod.slug;
        foundCurrentModule = true;
      }

      const masteryPercentage =
        mappedSections.length > 0
          ? Math.round((completedSectionsInModule / mappedSections.length) * 100)
          : 0;

      return {
        id: mod.slug,
        code: `M${mod.position.toString().padStart(2, '0')}`,
        title: mod.title,
        description: mod.objective,
        order_index: mod.position,
        total_sections: mod.totalSections || mappedSections.length,
        is_unlocked: isModuleUnlocked,
        is_completed: isModuleCompleted,
        mastery_percentage: masteryPercentage,
        sections: mappedSections,
      };
    });

    const overallProgress =
      totalSectionsAcrossAll > 0
        ? Math.round((totalCompletedSectionsAcrossAll / totalSectionsAcrossAll) * 100)
        : 0;

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
      overall_progress_percentage: overallProgress,
      total_stars_earned: totalStarsEarned,
      max_possible_stars: totalSectionsAcrossAll * 3,
      current_module_id: currentModuleId,
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

  async evaluateAnswer(userId: string, submission: LessonAnswerSubmission): Promise<LessonAnswerFeedback> {
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

    const xpEarned = isCorrect ? lesson.xpReward : 0;
    
    // Persist attempt asynchronously using SupabaseService
    const client = this.supabaseService.getClient();
    
    // Attempt record
    const { data: attemptData, error: attemptError } = await client.from('attempts').insert({
      user_id: userId,
      lesson_id: lesson.slug,
      section_id: lesson.sectionSlug,
      module_id: lesson.moduleSlug,
      course_id: lesson.courseSlug,
      language_code: lesson.languageSlug,
      status: 'completed',
      is_passed: isCorrect,
      xp_earned: xpEarned,
      duration_seconds: submission.time_spent_seconds ?? 0,
      mistakes_count: isCorrect ? 0 : 1,
    }).select('id').single();
    
    if (attemptData && !attemptError) {
      await client.from('attempt_answers').insert({
        attempt_id: attemptData.id,
        question_id: lesson.slug + '_q1',
        question_type: 'SINGLE_CHOICE',
        user_response: submission.selected_option_ids,
        is_correct: isCorrect,
        time_spent_seconds: submission.time_spent_seconds ?? 0,
        xp_awarded: xpEarned,
        feedback_text: feedbackText
      });
    }

    // Add to review queue / mistakes notebook if incorrect
    if (!isCorrect) {
      // Usar upsert o verificar si existe
      const { data: existingMistake } = await client.from('user_mistakes_notebook')
        .select('id, fail_count')
        .eq('user_id', userId)
        .eq('question_id', lesson.slug + '_q1')
        .maybeSingle();

      if (existingMistake) {
        await client.from('user_mistakes_notebook').update({
          fail_count: (existingMistake.fail_count || 1) + 1,
          is_resolved: false,
          last_failed_at: new Date().toISOString()
        }).eq('id', existingMistake.id);
      } else {
        await client.from('user_mistakes_notebook').insert({
          user_id: userId,
          question_id: lesson.slug + '_q1',
          lesson_id: lesson.slug,
          section_slug: lesson.sectionSlug,
          module_slug: lesson.moduleSlug,
          course_slug: lesson.courseSlug,
          track_slug: lesson.languageSlug,
          question_type: 'SINGLE_CHOICE',
          question_prompt: lesson.item2Quiz.prompt,
          user_wrong_answer: submission.selected_option_ids,
          correct_answer: [correctOption?.id],
          fail_count: 1,
          is_resolved: false,
          first_failed_at: new Date().toISOString(),
          last_failed_at: new Date().toISOString()
        });
      }
    }

    return {
      is_correct: isCorrect,
      xp_earned: xpEarned,
      feedback_message: feedbackText,
      hint: isCorrect ? undefined : lesson.item3Prediction.hint,
      explanation: isCorrect ? correctOption?.feedback : undefined,
      correct_option_ids: isCorrect ? (correctOption ? [correctOption.id] : []) : undefined,
      added_to_review_queue: !isCorrect,
    };
  }
}
