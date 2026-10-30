import { Inject, Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LessonAnsweredEvent } from '../../domain/events/lesson-answered.event';
import { ContentLoaderService } from './content-loader.service';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    @Inject(PROGRESS_REPOSITORY_TOKEN)
    private readonly progressRepository: IProgressRepository,
    @Optional()
    private readonly eventEmitter?: EventEmitter2,
    @Optional()
    private readonly contentLoaderService?: ContentLoaderService,
  ) {}

  async getRoadmap(languageSlug: string, userId?: string): Promise<RoadmapResponse> {
    const slug = languageSlug.toLowerCase();

    try {
      const track = await this.curriculumRepository.findTrackBySlug(slug);
      const targetCourseSlug = slug === 'python' ? 'python-1' : `${slug}-core`;
      let modules = await this.curriculumRepository.findModulesByCourse(targetCourseSlug);
      if (modules.length === 0 && slug === 'python') {
        modules = await this.curriculumRepository.findModulesByCourse('python-core');
      }

      if (modules.length === 0) {
        if (this.contentLoaderService) {
          const fallback = this.contentLoaderService.getCourseRoadmap(slug);
          if (fallback) return fallback;
        }
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
      const modulesProgressMap = new Map(userModules.map((m) => [m.moduleId, m]));

      let totalStarsEarned = 0;
      let totalCompletedSectionsAcrossAll = 0;
      let totalSectionsAcrossAll = 0;
      let currentModuleId = modules[0]?.slug ?? '';
      let foundCurrentModule = false;
      let prevModuleCompleted = true;

      // Batch fetch all sections across all modules in 1 single MongoDB query ($in)
      const moduleSlugs = modules.map((m) => m.slug);
      const sectionsByModule = new Map<string, any[]>();

      if (typeof this.curriculumRepository.findSectionsByModuleSlugs === 'function') {
        const allSections = await this.curriculumRepository.findSectionsByModuleSlugs(moduleSlugs);
        for (const sec of allSections) {
          const mSlug = sec.moduleSlug || (sec as any).module_slug;
          const list = sectionsByModule.get(mSlug) || [];
          list.push(sec);
          sectionsByModule.set(mSlug, list);
        }
      } else {
        const sectionsNested = await Promise.all(
          modules.map((mod) => this.curriculumRepository.findSectionsByModule(mod.slug)),
        );
        modules.forEach((mod, idx) => {
          sectionsByModule.set(mod.slug, sectionsNested[idx] || []);
        });
      }

      const mappedModules = modules.map((mod, modIndex) => {
        const sections = sectionsByModule.get(mod.slug) || [];
        const moduleProgress = modulesProgressMap.get(mod.slug);

          const isModuleUnlocked =
            modIndex === 0 ||
            moduleProgress?.isUnlocked ||
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

      const maxPossibleStars = totalSectionsAcrossAll * 3;
      const overallProgressPercentage =
        totalSectionsAcrossAll > 0
          ? Math.round((totalCompletedSectionsAcrossAll / totalSectionsAcrossAll) * 100)
          : 0;

      return {
        language: {
          id: track?.slug ?? slug,
          name: track?.name ?? languageSlug,
          slug,
          description: track?.description ?? '',
          color: track?.color ?? '#38BDF8',
          icon_url: track?.icon ?? 'code',
          total_modules: modules.length,
          is_active: true,
        },
        overall_progress_percentage: overallProgressPercentage,
        total_stars_earned: totalStarsEarned,
        max_possible_stars: maxPossibleStars,
        current_module_id: currentModuleId,
        modules: mappedModules,
      };
    } catch (err) {
      if (this.contentLoaderService) {
        const fallback = this.contentLoaderService.getCourseRoadmap(slug);
        if (fallback) return fallback;
      }
      throw err;
    }
  }

  async getLesson(lessonId: string): Promise<LessonDetail> {
    try {
      const lesson = await this.curriculumRepository.findLessonBySlug(lessonId);
      if (lesson) {
        const correctOption = lesson.item2Quiz.options.find((o) => o.isCorrect);

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
    } catch {
      // Fallback a ContentLoaderService
    }

    if (this.contentLoaderService) {
      const fallback = this.contentLoaderService.getLesson(lessonId);
      if (fallback) return fallback;
    }

    throw new NotFoundException(`Micro-lección '${lessonId}' no encontrada.`);
  }

  async evaluateAnswer(userId: string, submission: LessonAnswerSubmission): Promise<LessonAnswerFeedback> {
    try {
      const lesson = await this.curriculumRepository.findLessonBySlug(submission.lesson_id);
      if (lesson) {
        const section = await this.curriculumRepository.findSectionBySlug(lesson.sectionSlug);
        const module = section ? await this.curriculumRepository.findModuleBySlug(section.moduleSlug) : null;
        const course = module ? await this.curriculumRepository.findCourseBySlug(module.courseSlug) : null;

        const moduleSlug = module?.slug || '';
        const courseSlug = course?.slug || '';
        const languageSlug = course?.trackSlug || '';

        const correctOption = lesson.item2Quiz.options.find((o) => o.isCorrect);
        const isCorrect = Boolean(
          correctOption && submission.selected_option_ids.includes(correctOption.id),
        );

        const feedbackText = isCorrect
          ? (correctOption?.feedback || '¡Respuesta correcta! Has asimilado el concepto clave.')
          : (lesson.item2Quiz.options.find((o) => submission.selected_option_ids.includes(o.id))?.feedback ||
             'Respuesta incorrecta. Revisa la teoría y vuelve a intentarlo.');

        let isSectionAlreadyPassed = false;
        try {
          if (userId && this.progressRepository) {
            const star = await this.progressRepository.findSectionStars(userId, lesson.sectionSlug);
            if (star && star.isPassed) {
              isSectionAlreadyPassed = true;
            }
          }
        } catch {
          // Continuar con evaluacion normal si falla la consulta
        }

        const xpEarned = isCorrect && !isSectionAlreadyPassed
          ? (typeof submission.xp_earned === 'number' && submission.xp_earned > 0
              ? submission.xp_earned
              : lesson.xpReward)
          : 0;

        // Desacoplamiento hexagonal: emitir evento de dominio asíncrono
        if (this.eventEmitter) {
          this.eventEmitter.emit(
            'lesson.answered',
            new LessonAnsweredEvent({
              userId,
              lessonId: lesson.slug,
              sectionSlug: lesson.sectionSlug,
              moduleSlug,
              courseSlug,
              languageSlug,
              prompt: lesson.item2Quiz.prompt,
              selectedOptionIds: submission.selected_option_ids,
              correctOptionId: correctOption?.id,
              isCorrect,
              xpEarned,
              timeSpentSeconds: submission.time_spent_seconds ?? 0,
              feedbackText,
            }),
          );
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
    } catch {
      // Fallback a ContentLoaderService
    }

    if (this.contentLoaderService) {
      const fallbackFeedback = this.contentLoaderService.evaluateAnswer(submission);
      const finalFallbackXp = fallbackFeedback.is_correct
        ? (typeof submission.xp_earned === 'number' && submission.xp_earned > 0
            ? submission.xp_earned
            : fallbackFeedback.xp_earned)
        : 0;

      if (this.eventEmitter) {
        this.eventEmitter.emit(
          'lesson.answered',
          new LessonAnsweredEvent({
            userId,
            lessonId: submission.lesson_id,
            sectionSlug: '',
            moduleSlug: '',
            courseSlug: '',
            languageSlug: '',
            prompt: 'Ejercicio de lección',
            selectedOptionIds: submission.selected_option_ids,
            correctOptionId: fallbackFeedback.correct_option_ids?.[0],
            isCorrect: fallbackFeedback.is_correct,
            xpEarned: finalFallbackXp,
            timeSpentSeconds: submission.time_spent_seconds ?? 0,
            feedbackText: fallbackFeedback.feedback_message,
          }),
        );
      }
      return {
        ...fallbackFeedback,
        xp_earned: finalFallbackXp,
      };
    }

    throw new NotFoundException(`Lección '${submission.lesson_id}' no encontrada.`);
  }
}
