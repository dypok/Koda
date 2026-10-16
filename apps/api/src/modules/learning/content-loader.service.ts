import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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
    lessons: Array<any>;
  }>;
}

interface IndexedLessonRecord {
  lesson: LessonDetail;
  correctOptionId?: string;
  correctOptionIds?: string[];
  explanation?: string;
}

const LANGUAGE_COLOR_MAP: Record<string, string> = {
  python: '#3776AB',
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  lua: '#8FA8FF',
  html: '#E34F26',
  css: '#1572B6',
};

const LANGUAGE_PREFIX_MAP: Record<string, string> = {
  python: 'py_',
  lua: 'lua_',
  javascript: 'js_',
  typescript: 'ts_',
  html: 'html_',
  css: 'css_',
};

@Injectable()
export class ContentLoaderService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ContentLoaderService.name);

  private readonly languagesMap = new Map<string, ProgrammingLanguage>();
  private readonly coursesMap = new Map<string, Course>();
  private readonly modulesMap = new Map<string, RawModule>();
  private readonly moduleLanguageMap = new Map<string, string>();
  private readonly lessonsMap = new Map<string, IndexedLessonRecord>();

  private watcher?: fs.FSWatcher;
  private subWatchers: fs.FSWatcher[] = [];
  private reloadTimeout?: NodeJS.Timeout;

  onModuleInit() {
    this.loadAllContent();
    if (process.env.NODE_ENV !== 'test') {
      this.setupContentWatcher();
    }
  }

  onModuleDestroy() {
    this.closeWatchers();
  }

  private resolveContentDir(): string | undefined {
    const possiblePaths = [
      path.resolve(process.cwd(), '../../content/languages'),
      path.resolve(process.cwd(), 'content/languages'),
      path.resolve(__dirname, '../../../../../../content/languages'),
    ];
    return possiblePaths.find((p) => fs.existsSync(p));
  }

  public closeWatchers() {
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
      this.reloadTimeout = undefined;
    }
    if (this.watcher) {
      try {
        this.watcher.close();
      } catch {
        // Ignore close errors
      }
      this.watcher = undefined;
    }
    for (const sw of this.subWatchers) {
      try {
        sw.close();
      } catch {
        // Ignore close errors
      }
    }
    this.subWatchers = [];
  }

  public setupContentWatcher(customDir?: string) {
    this.closeWatchers();
    const contentDir = customDir || this.resolveContentDir();
    if (!contentDir || !fs.existsSync(contentDir)) return;

    const triggerReload = (filename?: string | Buffer | null) => {
      if (filename && !String(filename).endsWith('.json')) return;
      if (this.reloadTimeout) {
        clearTimeout(this.reloadTimeout);
      }
      this.reloadTimeout = setTimeout(() => {
        this.logger.log(`Cambio detectado en content/ (${filename || 'json'}). Recargando contenido...`);
        this.loadAllContent();
      }, 300);
    };

    try {
      this.watcher = fs.watch(contentDir, { recursive: true }, (_event, filename) => {
        triggerReload(filename);
      });
    } catch {
      // Fallback for OS kernels where recursive fs.watch is not supported
      try {
        const langDirs = fs.readdirSync(contentDir, { withFileTypes: true });
        for (const d of langDirs) {
          if (d.isDirectory()) {
            const subPath = path.join(contentDir, d.name);
            const sw = fs.watch(subPath, (_event, filename) => triggerReload(filename));
            this.subWatchers.push(sw);
          }
        }
      } catch (err: any) {
        this.logger.warn(`No se pudo iniciar fs.watch en content/: ${err?.message || err}`);
      }
    }
  }

  public loadAllContent() {
    const contentDir = this.resolveContentDir();

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
          color: LANGUAGE_COLOR_MAP[manifestContent.slug] || '#3178C6',
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
              this.moduleLanguageMap.set(rawModule.id, manifestContent.slug);

              // Indexar lecciones y preguntas en memoria (soportando dialecto canónico y legado)
              if (Array.isArray(rawModule.sections)) {
                for (const section of rawModule.sections) {
                  if (Array.isArray(section.lessons)) {
                    for (const lesson of section.lessons) {
                      const rawEx =
                        lesson.exercise ||
                        (Array.isArray(lesson.exercises) && lesson.exercises.length > 0
                          ? lesson.exercises[0]
                          : undefined);

                      const normalizedOptions = Array.isArray(rawEx?.options)
                        ? rawEx.options.map((o: any) => ({
                            id: String(o.id),
                            text: o.text ?? o.body ?? o.label ?? '',
                          }))
                        : Array.isArray(rawEx?.answers)
                          ? rawEx.answers.map((a: any) => ({
                              id: String(a.id),
                              text: a.body ?? a.text ?? a.label ?? '',
                            }))
                          : [];

                      let correctOptionIds: string[] = [];
                      if (Array.isArray(rawEx?.correct_answer_ids) && rawEx.correct_answer_ids.length > 0) {
                        correctOptionIds = rawEx.correct_answer_ids.map(String);
                      } else if (rawEx?.correct_option_id !== undefined && rawEx?.correct_option_id !== null) {
                        correctOptionIds = [String(rawEx.correct_option_id)];
                      } else if (Array.isArray(rawEx?.answers)) {
                        correctOptionIds = rawEx.answers
                          .filter((a: any) => a?.is_correct)
                          .map((a: any) => String(a.id));
                      } else if (Array.isArray(rawEx?.options)) {
                        correctOptionIds = rawEx.options
                          .filter((o: any) => o?.is_correct)
                          .map((o: any) => String(o.id));
                      } else if (Array.isArray(rawEx?.accepted_answers) && rawEx.accepted_answers.length > 0) {
                        correctOptionIds = rawEx.accepted_answers.map(String);
                      }

                      const correctOptionId = correctOptionIds[0];
                      const hint =
                        rawEx?.hint ??
                        (Array.isArray(rawEx?.hints) && rawEx.hints.length > 0
                          ? rawEx.hints[0]
                          : undefined);
                      const explanation =
                        rawEx?.explanation ??
                        (Array.isArray(rawEx?.answers)
                          ? rawEx.answers.find((a: any) => a?.is_correct)?.explanation
                          : undefined) ??
                        hint;

                      const theoryMarkdown =
                        lesson.theory_markdown || lesson.explanation || lesson.summary || '';
                      const codeExample =
                        lesson.code_example ||
                        lesson.examples?.[0]?.code ||
                        lesson.syntax_blocks?.[0]?.code ||
                        '';
                      const expectedOutput =
                        lesson.expected_output ?? lesson.examples?.[0]?.output;
                      const tipMarkdown =
                        lesson.tip_markdown ??
                        (Array.isArray(lesson.micro_tips) && lesson.micro_tips.length > 0
                          ? lesson.micro_tips.join('\n')
                          : lesson.examples?.[0]?.explanation);

                      const lessonDetail: LessonDetail = {
                        id: lesson.id,
                        section_id: section.id,
                        title: lesson.title,
                        order_index: lesson.position,
                        theory_markdown: theoryMarkdown,
                        code_example: codeExample,
                        expected_output: expectedOutput,
                        tip_markdown: tipMarkdown,
                        question: {
                          id: rawEx?.id || `q_${lesson.id}`,
                          type: rawEx?.type || 'single_choice',
                          prompt: rawEx?.prompt || 'Selecciona la opción correcta:',
                          hint,
                          options: normalizedOptions,
                        },
                      };

                      const record: IndexedLessonRecord = {
                        lesson: lessonDetail,
                        correctOptionId,
                        correctOptionIds,
                        explanation,
                      };

                      this.lessonsMap.set(lesson.id, record);
                      if (lesson.slug && lesson.slug !== lesson.id) {
                        this.lessonsMap.set(lesson.slug, record);
                      }
                      if (lesson.code) {
                        this.lessonsMap.set(lesson.code, record);
                        this.lessonsMap.set(String(lesson.code).toLowerCase(), record);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error: any) {
        this.logger.error(`Error procesando lenguaje '${langSlug}': ${error.message}`);
      }
    }

    // Cargar también cursos desde content/courses/ si existen
    this.loadFromCoursesDirectory();

    this.logger.log(
      `Contenido cargado: ${this.languagesMap.size} lenguajes, ${this.modulesMap.size} módulos, ${this.lessonsMap.size} lecciones indexadas.`,
    );
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
                correctOptionIds: correctOpt?.id ? [String(correctOpt.id)] : [],
                explanation: correctOpt?.feedback,
              });
            }
          }
        } catch (err: any) {
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
    const expectedPrefix = LANGUAGE_PREFIX_MAP[languageSlug] || `${languageSlug}_`;

    // Recopilar los módulos del lenguaje ordenados por posición
    const modules: RoadmapModule[] = [];
    for (const rawMod of this.modulesMap.values()) {
      const mappedLang = this.moduleLanguageMap.get(rawMod.id);
      const belongsToLanguage =
        mappedLang === languageSlug || rawMod.id.startsWith(expectedPrefix);

      if (belongsToLanguage) {
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
    const correctIds =
      record?.correctOptionIds && record.correctOptionIds.length > 0
        ? record.correctOptionIds
        : record?.correctOptionId
          ? [record.correctOptionId]
          : [];

    if (!record || correctIds.length === 0) {
      return {
        is_correct: false,
        xp_earned: 0,
        feedback_message: 'Ejercicio no encontrado para evaluación.',
        added_to_review_queue: true,
      };
    }

    const selected = submission.selected_option_ids || [];
    const isCorrect =
      correctIds.length === 1
        ? selected.includes(correctIds[0])
        : selected.length === correctIds.length && correctIds.every((id) => selected.includes(id));

    return {
      is_correct: isCorrect,
      xp_earned: isCorrect ? 5 : 0,
      feedback_message: isCorrect
        ? `¡Excelente! Respuesta correcta. +5 XP`
        : `Respuesta incorrecta. Inténtalo de nuevo.`,
      hint: isCorrect ? undefined : record.lesson.question?.hint,
      explanation: record.explanation,
      correct_option_ids: isCorrect ? correctIds : undefined,
      added_to_review_queue: !isCorrect,
    };
  }
}
