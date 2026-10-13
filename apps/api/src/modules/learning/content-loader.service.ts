import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type {
  ProgrammingLanguage,
  Course,
  RoadmapResponse,
  RoadmapModule,
  RoadmapSection,
  LessonDetail,
  LessonAnswerSubmission,
  LessonAnswerFeedback,
} from '@koda/types';

interface RawManifest {
  id: string;
  code: string;
  slug: string;
  name: string;
  description: string;
  status: 'available' | 'coming_soon' | 'hidden';
  sort_order: number;
  content_version: number;
  is_active: boolean;
  modules: Array<{
    id: string;
    code: string;
    slug: string;
    title: string;
    description: string;
    position: number;
    total_sections: number;
    total_lessons: number;
    status: string;
    path: string;
  }>;
}

interface RawModule {
  id: string;
  code: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  status: string;
  sections: Array<{
    id: string;
    code: string;
    title: string;
    slug: string;
    position: number;
    type: string;
    status: string;
    estimated_minutes?: number;
    lessons: Array<{
      id: string;
      code: string;
      title: string;
      position: number;
      theory_markdown: string;
      code_example: string;
      expected_output?: string;
      tip_markdown?: string;
      exercise?: {
        id: string;
        type: any;
        prompt: string;
        hint?: string;
        options: Array<{ id: string; text: string }>;
        correct_option_id: string;
        explanation: string;
      };
    }>;
  }>;
}

@Injectable()
export class ContentLoaderService implements OnModuleInit {
  private readonly logger = new Logger(ContentLoaderService.name);

  private readonly languagesMap = new Map<string, ProgrammingLanguage>();
  private readonly coursesMap = new Map<string, Course>();
  private readonly modulesMap = new Map<string, RawModule>();
  private readonly lessonsMap = new Map<string, { lesson: LessonDetail; correctOptionId?: string; explanation?: string }>();

  onModuleInit() {
    this.loadAllContent();
  }

  public loadAllContent() {
    // Buscar la ruta de content relativa al directorio del proyecto KODA
    const possiblePaths = [
      path.resolve(process.cwd(), '../../content/languages'),
      path.resolve(process.cwd(), 'content/languages'),
      path.resolve(__dirname, '../../../../../../content/languages'),
    ];

    const contentDir = possiblePaths.find((p) => fs.existsSync(p));

    if (!contentDir) {
      this.logger.warn(`No se encontró el directorio 'content/languages'. Se utilizará fallback.`);
      return;
    }

    this.logger.log(`Cargando contenido pedagógico declarativo desde: ${contentDir}`);

    const languageDirs = fs.readdirSync(contentDir, { withFileTypes: true });

    for (const langDirent of languageDirs) {
      if (!langDirent.isDirectory()) continue;
      const langSlug = langDirent.name;
      const langPath = path.join(contentDir, langSlug);

      // Cargar manifest.json
      const manifestFile = path.join(langPath, 'manifest.json');
      if (!fs.existsSync(manifestFile)) continue;

      try {
        const manifestContent = JSON.parse(fs.readFileSync(manifestFile, 'utf8')) as RawManifest;
        
        // Cargar course.json si existe
        let course: Course | undefined;
        const courseFile = path.join(langPath, 'course.json');
        if (fs.existsSync(courseFile)) {
          course = JSON.parse(fs.readFileSync(courseFile, 'utf8')) as Course;
          this.coursesMap.set(course.slug, course);
        }

        const programmingLanguage: ProgrammingLanguage = {
          id: manifestContent.id,
          slug: manifestContent.slug,
          name: manifestContent.name,
          description: manifestContent.description,
          icon_url: `/icons/${manifestContent.slug}.svg`,
          color: manifestContent.slug === 'python' ? '#3776AB' : manifestContent.slug === 'javascript' ? '#F7DF1E' : '#3178C6',
          total_modules: manifestContent.modules?.length || 1,
          status: manifestContent.status || 'available',
          is_active: manifestContent.is_active ?? true,
          courses: course ? [course] : [],
        };

        this.languagesMap.set(manifestContent.slug, programmingLanguage);

        // Cargar módulos declarados en el manifest
        if (Array.isArray(manifestContent.modules)) {
          for (const modRef of manifestContent.modules) {
            const moduleFile = path.join(langPath, modRef.path, 'module.json');
            if (fs.existsSync(moduleFile)) {
              const rawModule = JSON.parse(fs.readFileSync(moduleFile, 'utf8')) as RawModule;
              this.modulesMap.set(rawModule.id, rawModule);

              // Indexar lecciones y preguntas en memoria
              if (Array.isArray(rawModule.sections)) {
                for (const section of rawModule.sections) {
                  if (Array.isArray(section.lessons)) {
                    for (const lesson of section.lessons) {
                      const lessonDetail: LessonDetail = {
                        id: lesson.id,
                        section_id: section.id,
                        title: lesson.title,
                        order_index: lesson.position,
                        theory_markdown: lesson.theory_markdown,
                        code_example: lesson.code_example,
                        expected_output: lesson.expected_output,
                        tip_markdown: lesson.tip_markdown,
                        question: {
                          id: lesson.exercise?.id || `q_${lesson.id}`,
                          type: lesson.exercise?.type || 'single_choice',
                          prompt: lesson.exercise?.prompt || 'Selecciona la opción correcta:',
                          hint: lesson.exercise?.hint,
                          options: lesson.exercise?.options || [],
                        },
                      };

                      this.lessonsMap.set(lesson.id, {
                        lesson: lessonDetail,
                        correctOptionId: lesson.exercise?.correct_option_id,
                        explanation: lesson.exercise?.explanation,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error procesando lenguaje '${langSlug}': ${error.message}`);
      }
    }

    // Cargar también cursos desde content/courses/ si existen
    this.loadFromCoursesDirectory();

    this.logger.log(`Contenido cargado: ${this.languagesMap.size} lenguajes, ${this.modulesMap.size} módulos, ${this.lessonsMap.size} lecciones indexadas.`);
  }

  private loadFromCoursesDirectory() {
    const possibleRoots = [
      path.resolve(process.cwd(), '../../content'),
      path.resolve(process.cwd(), 'content'),
      path.resolve(__dirname, '../../../../../../content'),
      path.resolve(__dirname, '../../../../content'),
    ];

    const rootDir = possibleRoots.find((p) => fs.existsSync(p) && fs.existsSync(path.join(p, 'courses')));
    if (!rootDir) return;

    const coursesDir = path.join(rootDir, 'courses');
    const courseDirs = fs.readdirSync(coursesDir, { withFileTypes: true });

    for (const d of courseDirs) {
      if (!d.isDirectory()) continue;
      const coursePath = path.join(coursesDir, d.name);
      const lessonsFile = path.join(coursePath, 'lessons.json');

      if (fs.existsSync(lessonsFile)) {
        try {
          const rawLessons = JSON.parse(fs.readFileSync(lessonsFile, 'utf8'));
          if (Array.isArray(rawLessons)) {
            for (const item of rawLessons) {
              const correctOpt = item.item_2_quiz?.options?.find((o: any) => o.is_correct);
              const lessonDetail: LessonDetail = {
                id: item.slug,
                section_id: item.section_slug,
                title: item.title,
                order_index: item.position,
                theory_markdown: item.theory
                  ? `${item.theory.step1}\n\n${item.theory.step2}\n\n${item.theory.step3}`
                  : '',
                code_example: item.theory?.code_snippet || '',
                question: item.item_2_quiz
                  ? {
                      id: `q_${item.slug}`,
                      type: 'single_choice',
                      prompt: item.item_2_quiz.prompt,
                      options: item.item_2_quiz.options || [],
                    }
                  : undefined,
                evaluation_five_phases: {
                  phase_1_theory: item.theory || { step1: '', step2: '', step3: '' },
                  phase_2_code_execution: item.item_1_console,
                  phase_3_multiple_choice: item.item_2_quiz,
                  phase_4_theory: item.item_3_theory,
                  phase_5_prediction: item.item_4_prediction || item.item_3_prediction,
                },
              };

              this.lessonsMap.set(item.slug, {
                lesson: lessonDetail,
                correctOptionId: correctOpt?.id,
                explanation: correctOpt?.feedback,
              });
            }
          }
        } catch (err) {
          this.logger.error(`Error cargando lessons.json de ${d.name}: ${err.message}`);
        }
      }
    }
  }

  getAllLanguages(): ProgrammingLanguage[] {
    return Array.from(this.languagesMap.values());
  }

  getLanguageBySlug(slug: string): ProgrammingLanguage | undefined {
    return this.languagesMap.get(slug);
  }

  getCourseRoadmap(languageSlug: string): RoadmapResponse | null {
    const lang = this.languagesMap.get(languageSlug);
    if (!lang) return null;

    const course = lang.courses?.[0];

    // Recopilar los módulos del lenguaje ordenados por posición
    const modules: RoadmapModule[] = [];
    for (const rawMod of this.modulesMap.values()) {
      if (rawMod.id.startsWith(languageSlug === 'python' ? 'py_' : languageSlug === 'javascript' ? 'js_' : 'ts_')) {
        const sections: RoadmapSection[] = (rawMod.sections || []).map((sec) => ({
          id: sec.id,
          code: sec.code,
          title: sec.title,
          order_index: sec.position,
          total_lessons: sec.lessons?.length || 10,
          is_unlocked: true,
          is_completed: false,
          stars_earned: 0,
          max_stars_earned: 3,
        }));

        modules.push({
          id: rawMod.id,
          course_id: course?.id,
          code: rawMod.code,
          title: rawMod.title,
          description: rawMod.description,
          order_index: rawMod.position,
          total_sections: sections.length,
          is_unlocked: rawMod.position === 1,
          is_completed: false,
          mastery_percentage: 0,
          sections,
        });
      }
    }

    modules.sort((a, b) => a.order_index - b.order_index);

    return {
      language: lang,
      course,
      overall_progress_percentage: 0,
      total_stars_earned: 0,
      max_possible_stars: modules.length * 30,
      current_module_id: modules[0]?.id || '',
      modules,
    };
  }

  getLesson(lessonId: string): LessonDetail | null {
    return this.lessonsMap.get(lessonId)?.lesson || null;
  }

  evaluateAnswer(submission: LessonAnswerSubmission): LessonAnswerFeedback {
    const record = this.lessonsMap.get(submission.lesson_id);
    if (!record || !record.correctOptionId) {
      // Si no existe lección o no tiene respuesta configurada
      return {
        is_correct: false,
        xp_earned: 0,
        feedback_message: 'Ejercicio no encontrado para evaluación.',
        added_to_review_queue: true,
      };
    }

    const isCorrect = submission.selected_option_ids.includes(record.correctOptionId);

    return {
      is_correct: isCorrect,
      xp_earned: isCorrect ? 5 : 0,
      feedback_message: isCorrect
        ? `¡Excelente! Respuesta correcta. +5 XP`
        : `Respuesta incorrecta. Inténtalo de nuevo.`,
      hint: isCorrect ? undefined : record.lesson.question.hint,
      explanation: record.explanation,
      correct_option_ids: isCorrect ? [record.correctOptionId] : undefined,
      added_to_review_queue: !isCorrect,
    };
  }
}
