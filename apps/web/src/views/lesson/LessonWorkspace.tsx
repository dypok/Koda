'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle as PhosphorCheckCircle,
} from '@phosphor-icons/react';
import { ContentExercise, ContentLesson, ContentModule, loadBank, loadModule } from '@/lib/content';
import { calculateStarsFromAccuracy } from '@/components/lesson/StarRatingDisplay';
import { useRoadmapStore, getStoredCompletedLessons, markCompletedLesson } from '@/stores/roadmap.store';
import { useAuthStore } from '@/stores/auth.store';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { LessonInSituInspectorModal, EditableBlockType, EditableLessonData } from '@/components/admin/LessonInSituInspectorModal';
import { getLessonsDatasetForCourse } from '@/models/roadmap/python-lessons-graph.mock';
import { getSectionAliases } from '@/models/roadmap/section-alias.helper';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { EvaluationService } from '@/services/learning/evaluation.service';

import { parseCourse, findNodeInDataset } from './lesson-workspace.utils';
import { LessonHeader } from './LessonHeader';
import { LessonView } from './LessonView';
import { LessonReviewMode } from './LessonReviewMode';
import { LessonQuizMode } from './LessonQuizMode';
import { LessonDoneScreen } from './LessonDoneScreen';

export interface LessonWorkspaceProps {
  courseId: string;
  sectionRef: string;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({ courseId, sectionRef }) => {
  const parsed = useMemo(() => parseCourse(courseId, sectionRef), [courseId, sectionRef]);
  const [module, setModule] = useState<ContentModule | null>(null);
  const [bank, setBank] = useState<ContentExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [mode, setMode] = useState<'lesson' | 'review' | 'quiz' | 'done'>('lesson');
  const [quizScore, setQuizScore] = useState<{ ok: number; total: number } | null>(null);
  const [failedExercises, setFailedExercises] = useState<ContentExercise[]>([]);
  const completeSectionNode = useRoadmapStore((s) => s.completeSectionNode);

  const lessonsDataset = useRoadmapStore((s) => s.lessonsDataset);
  const courseDataset = useMemo(() => getLessonsDatasetForCourse(courseId), [courseId]);

  const currentNode = useMemo(() => {
    return (
      findNodeInDataset(lessonsDataset, sectionRef, parsed?.moduleSlug) ||
      findNodeInDataset(courseDataset, sectionRef, parsed?.moduleSlug) ||
      null
    );
  }, [lessonsDataset, courseDataset, sectionRef, parsed?.moduleSlug]);

  const isAlreadyCompleted = useMemo(() => {
    return currentNode?.variant === 'completed' || (currentNode?.stars ?? 0) > 0;
  }, [currentNode]);

  const nodeTargetXp = useMemo(() => {
    if (isAlreadyCompleted) return 0;
    if (currentNode?.xp && currentNode.xp > 0) return currentNode.xp;
    if ((module as any)?.xp?.on_pass && (module as any).xp.on_pass > 0) return (module as any).xp.on_pass;
    return 120;
  }, [currentNode?.xp, module, isAlreadyCompleted]);

  const sessionExerciseXpRef = useRef<number>(0);

  const handleExerciseCorrect = useCallback((xp: number) => {
    sessionExerciseXpRef.current += xp;
  }, []);

  // Registro atómico de lecciones completadas
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => new Set());

  // Cargar lecciones completadas aisladas por usuario tras la hidratación
  useEffect(() => {
    const currentUserId = useAuthStore.getState().user?.id;
    setCompletedLessons(getStoredCompletedLessons(currentUserId));
  }, []);

  const completedLessonsRef = useRef(completedLessons);
  useEffect(() => {
    completedLessonsRef.current = completedLessons;
  }, [completedLessons]);

  const handleLessonCompleted = useCallback(
    (lessonId: string) => {
      if (!lessonId) return;

      // Si la lección ya fue registrada como completada, evitar re-renders en bucle
      if (completedLessonsRef.current.has(lessonId)) return;

      const currentUserId = useAuthStore.getState().user?.id;
      markCompletedLesson(lessonId, currentUserId);
      if (sectionRef) {
        markCompletedLesson(sectionRef, currentUserId);
      }

      setCompletedLessons((prev) => {
        const next = new Set(prev);
        next.add(lessonId);
        if (sectionRef) {
          next.add(sectionRef);
          getSectionAliases(sectionRef).forEach((a) => next.add(a));
        }
        return next;
      });

      // Notificar al roadmap store para encender el nodo actual
      completeSectionNode(sectionRef, 3);

      // Sincronizar completitud de la sección en PostgreSQL
      if (parsed) {
        EvaluationService.completeSection(sectionRef, {
          moduleId: parsed.moduleSlug,
          courseId,
          accuracyPercentage: 100,
        }).catch((err) => {
          // Fallback silencioso si el usuario está offline o sin sesión activa
          console.warn('Sync section completion offline fallback:', err?.message);
        });
      }

      // Asegurar que el usuario tenga racha e isActiveToday activos localmente de forma inmediata
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const lastStudyStr = currentUser.lastStudyDate ? currentUser.lastStudyDate.slice(0, 10) : null;
        const isSameDay = lastStudyStr === todayStr;
        const curStreak = isSameDay ? Math.max(1, currentUser.streak) : (currentUser.streak > 0 ? currentUser.streak : 1);
        useAuthStore.getState().updateUserProfile({
          streak: curStreak,
          longestStreak: Math.max(currentUser.longestStreak ?? 1, curStreak),
          isActiveToday: true,
          lastStudyDate: new Date().toISOString(),
        });
      }
    },
    [completeSectionNode, sectionRef, parsed, courseId]
  );

  const handleExerciseFailed = (ex: ContentExercise) => {
    setFailedExercises((prev) => (prev.some((item) => item.id === ex.id) ? prev : [...prev, ex]));
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      if (!parsed) {
        if (alive) setLoading(false);
        return;
      }
      const [mod, questions] = await Promise.all([
        loadModule(parsed.lang, parsed.moduleSlug),
        loadBank(parsed.lang, parsed.moduleSlug),
      ]);
      if (alive) {
        if (mod) {
          setModule(mod);
          setBank(questions);
          setFailedExercises([]);
        } else {
          // Fallback dinámico para módulos o secciones creadas por el administrador
          const adminStore = useAdminCurriculumStore.getState();
          const draftMod = adminStore.draftModules.find((m) => m.slug === parsed.moduleSlug || m.slug === courseId);
          const draftSecs = adminStore.draftSections.filter((s) => s.module_slug === parsed.moduleSlug || s.module_slug === courseId);
          const currentDraftSec = draftSecs.find((s) => s.slug === sectionRef) || draftSecs[0];
          const draftLessons = currentDraftSec
            ? adminStore.draftLessons.filter((l) => l.section_slug === currentDraftSec.slug)
            : [];

          const fallbackTitle = draftMod?.title || (courseId.startsWith('mod-') ? 'Módulo Personalizado' : 'Módulo en Edición');
          const fallbackSectionTitle = currentDraftSec?.title || (sectionRef.startsWith('sec-') || sectionRef.startsWith('les-') ? 'Sección 01' : 'Nueva Sección');

          const initialLesson: ContentLesson = draftLessons[0]
            ? {
                id: draftLessons[0].slug,
                title: draftLessons[0].title,
                slug: draftLessons[0].slug,
                position: 1,
                concept_id: 'concept-init',
                explanation: `${draftLessons[0].theory.step1}\n\n${draftLessons[0].theory.step2}\n\n${draftLessons[0].theory.step3}`,
                is_required: true,
                examples: [
                  {
                    title: 'Código Demostrativo',
                    code: draftLessons[0].theory.code_snippet,
                    output: 'Listo para programar',
                  },
                ],
                exercises: [
                  {
                    id: `ex_${draftLessons[0].slug}`,
                    type: 'single_choice',
                    difficulty: 'easy',
                    prompt: draftLessons[0].item_2_quiz.prompt,
                    answers: draftLessons[0].item_2_quiz.options.map((o) => ({
                      id: o.id,
                      body: o.text,
                      is_correct: o.is_correct,
                    })),
                    correct_answer_ids: draftLessons[0].item_2_quiz.options.filter((o) => o.is_correct).map((o) => o.id),
                    explanation: draftLessons[0].item_2_quiz.options.find((o) => o.is_correct)?.feedback,
                  },
                ],
              }
            : {
                id: `les_${sectionRef}_01`,
                title: 'Lección 01: Introducción y Concepto Clave',
                slug: `${sectionRef}-l01`,
                position: 1,
                concept_id: 'concept-1',
                explanation: 'Paso 1: Frase de anclaje inicial.\n\nPaso 2: Mecánica conceptual explicada con claridad.\n\nPaso 3: Regla práctica obligatoria para evitar errores.',
                is_required: true,
                examples: [
                  {
                    title: 'Código Demostrativo',
                    code: '# Escribe tu código aquí\nprint("Listo para programar")',
                    output: 'Listo para programar',
                  },
                ],
                exercises: [
                  {
                    id: `ex_${sectionRef}`,
                    type: 'single_choice',
                    difficulty: 'easy',
                    prompt: '¿Cuál es el principio central de esta lección?',
                    answers: [
                      { id: 'a', body: 'Permite estructurar instrucciones claras y reproducibles.', is_correct: true },
                      { id: 'b', body: 'Omitir las reglas sintácticas obligatorias.', is_correct: false },
                      { id: 'c', body: 'Escribir bloques de código sin verificación.', is_correct: false },
                      { id: 'd', body: 'Ninguna de las anteriores.', is_correct: false },
                    ],
                    correct_answer_ids: ['a'],
                    explanation: 'La opción A es la correcta.',
                  },
                ],
              };

          const syntheticModule: ContentModule = {
            id: parsed.moduleSlug,
            code: '01',
            slug: parsed.moduleSlug,
            title: fallbackTitle,
            sections: [
              {
                id: sectionRef,
                slug: sectionRef,
                title: fallbackSectionTitle,
                position: 1,
                type: 'standard',
                lessons: [initialLesson],
              },
            ],
          };

          setModule(syntheticModule);
          setBank(questions);
          setFailedExercises([]);
        }
        setMode(parsed.initialMode);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [parsed, courseId, sectionRef]);

  const section = useMemo(() => {
    if (!module) return null;
    const bySlug = module.sections.find((s) => s.slug === sectionRef);
    if (bySlug) return bySlug;
    const m = /^s(\d+)$/.exec(sectionRef);
    if (m) return module.sections[Number(m[1]) - 1] ?? null;
    return module.sections[0] ?? null;
  }, [module, sectionRef]);

  const { user } = useAuthStore();
  const isAdmin = Boolean(user?.role === 'admin' || user?.email?.toLowerCase().includes('admin'));
  const [isEditMode, setIsEditMode] = useState(isAdmin);
  const { isDirty, pendingChangesCount, saveChanges } = useAdminCurriculumStore();

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorBlock, setInspectorBlock] = useState<EditableBlockType>('theory');
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  const lesson = section?.lessons?.[lessonIdx] ?? null;

  const editableLessonData: EditableLessonData = useMemo(() => {
    if (!lesson) {
      return {
        id: '',
        title: '',
        step1: '',
        step2: '',
        step3: '',
        code_snippet: '',
        quiz_prompt: '',
        quiz_options: [],
      };
    }

    const lines = (lesson.explanation || '').split('\n\n');
    const exercise = lesson.exercises[0];
    const quizOptions = exercise?.answers?.map((a) => ({
      id: a.id,
      text: a.body,
      is_correct: Boolean(exercise.correct_answer_ids?.includes(a.id)),
      feedback: a.is_correct ? (exercise.explanation || 'Respuesta correcta.') : 'Opción incorrecta.',
    })) || [
      { id: 'a', text: 'Opción A (Correcta)', is_correct: true, feedback: 'Excelente respuesta.' },
      { id: 'b', text: 'Opción B', is_correct: false, feedback: 'Incorrecto.' },
      { id: 'c', text: 'Opción C', is_correct: false, feedback: 'Incorrecto.' },
      { id: 'd', text: 'Opción D', is_correct: false, feedback: 'Incorrecto.' },
    ];

    return {
      id: lesson.id,
      title: lesson.title,
      step1: lines[0] || lesson.explanation || 'Paso 1: Frase de anclaje inicial.',
      step2: lines[1] || 'Paso 2: Mecánica conceptual explicada con claridad.',
      step3: lines[2] || 'Paso 3: Regla práctica obligatoria para evitar errores.',
      code_snippet: lesson.examples[0]?.code || 'print("Hola, Koda")',
      console_prompt: exercise?.prompt || 'Ejecuta la instrucción print solicitada.',
      initial_code: '# Código inicial\n',
      solution_code: lesson.examples[0]?.code || 'print("Hola, Koda")',
      test_cases: [
        {
          input: '',
          expected_output: (lesson.examples[0]?.output || 'Hola, Koda') + '\n',
          description: 'Salida esperada',
        },
      ],
      quiz_prompt: exercise?.prompt || '¿Cuál es el principio central de esta sesión?',
      quiz_options: quizOptions,
      prediction_prompt: '¿Qué mostrará en consola este comando?',
      prediction_code: lesson.examples[0]?.code || 'print("Koda")',
      prediction_answer: lesson.examples[0]?.output || 'Koda',
      prediction_hint: 'Observa la salida exacta sin comillas.',
    };
  }, [lesson]);

  const handleOpenInspector = useCallback((block: EditableBlockType) => {
    setInspectorBlock(block);
    setInspectorOpen(true);
  }, []);

  const handleApplyInspectorUpdate = useCallback((updated: EditableLessonData) => {
    if (!lesson) return;
    lesson.title = updated.title;
    lesson.explanation = `${updated.step1}\n\n${updated.step2}\n\n${updated.step3}`;
    if (lesson.examples[0]) {
      lesson.examples[0].code = updated.code_snippet;
    } else {
      lesson.examples.push({
        title: 'Código Demostrativo',
        code: updated.code_snippet,
        output: 'OK',
      });
    }

    if (lesson.exercises[0]) {
      lesson.exercises[0].prompt = updated.quiz_prompt;
      lesson.exercises[0].answers = updated.quiz_options.map((o) => ({
        id: o.id,
        body: o.text,
        is_correct: o.is_correct,
      }));
      lesson.exercises[0].correct_answer_ids = updated.quiz_options
        .filter((o) => o.is_correct)
        .map((o) => o.id);
      lesson.exercises[0].explanation = updated.quiz_options.find((o) => o.is_correct)?.feedback;
    }

    useAdminCurriculumStore.setState((s) => ({
      isDirty: true,
      pendingChangesCount: s.pendingChangesCount + 1,
    }));
  }, [lesson]);

  const handleAddNewSession = useCallback(() => {
    if (!section) return;
    const nextIdx = section.lessons.length + 1;
    const newLessonId = `les_custom_${Date.now()}`;
    const newLesson: ContentLesson = {
      id: newLessonId,
      title: `Sesión 0${nextIdx}: Nuevo Concepto Clave`,
      slug: `sesion-${nextIdx}`,
      position: nextIdx,
      concept_id: `concept-${nextIdx}`,
      explanation: `Paso 1: Frase de anclaje explicando el concepto nuevo.\n\nPaso 2: Mecánica conceptual explicada paso a paso sin jerga.\n\nPaso 3: Regla práctica obligatoria de sintaxis.`,
      is_required: true,
      examples: [
        {
          title: 'Código Demostrativo',
          code: '# Demostración en Python\nresultado = "Listo"\nprint(resultado)',
          language: 'python',
          output: 'Listo',
          explanation: 'La instrucción print muestra el texto en consola.',
        },
      ],
      exercises: [
        {
          id: `ex_${newLessonId}`,
          type: 'single_choice',
          difficulty: 'easy',
          prompt: '¿Cuál es la forma correcta de aplicar esta instrucción?',
          answers: [
            { id: 'a', body: 'Declarar la instrucción respetando la regla oficial.', is_correct: true },
            { id: 'b', body: 'Omitir las comillas en cadenas de texto.', is_correct: false },
            { id: 'c', body: 'Escribir las palabras reservadas con mayúsculas.', is_correct: false },
            { id: 'd', body: 'Eliminar la indentación del bloque.', is_correct: false },
          ],
          correct_answer_ids: ['a'],
          explanation: 'La opción A es la correcta porque sigue el estándar del lenguaje.',
        },
      ],
    };

    section.lessons.push(newLesson);
    setLessonIdx(section.lessons.length - 1);

    useAdminCurriculumStore.setState((s) => ({
      isDirty: true,
      pendingChangesCount: s.pendingChangesCount + 1,
    }));

    setAdminNotification('Nueva sesión agregada al stepper siguiendo el orden didáctico canónico.');
    setTimeout(() => setAdminNotification(null), 3000);
  }, [section]);

  const handleSaveAll = useCallback(() => {
    const res = saveChanges();
    setAdminNotification(res.message || 'Cambios guardados con éxito.');
    setTimeout(() => setAdminNotification(null), 3500);
  }, [saveChanges]);

  const handleQuizFinish = useCallback(
    (ok: number, total: number) => {
      setQuizScore({ ok, total });
      setMode('done');
      const accuracy = total > 0 ? Math.round((ok / total) * 100) : 100;
      if (accuracy >= 70) {
        completeSectionNode(sectionRef, calculateStarsFromAccuracy(ok, total));
        const completionReward = isAlreadyCompleted ? 0 : Math.max(30, nodeTargetXp - sessionExerciseXpRef.current);
        if (parsed) {
          EvaluationService.completeSection(sectionRef, {
            moduleId: parsed.moduleSlug,
            courseId,
            accuracyPercentage: accuracy,
            targetXp: completionReward,
          })
            .then((res) => {
              const currentUser = useAuthStore.getState().user;
              if (currentUser) {
                const awardXp = isAlreadyCompleted
                  ? 0
                  : (typeof res.xpAwarded === 'number'
                      ? res.xpAwarded
                      : completionReward);
                const newTotalXp = res.userTotalXp ?? (currentUser.totalXp + awardXp);
                const todayStr = new Date().toLocaleDateString('en-CA');
                const lastStudyStr = currentUser.lastStudyDate ? currentUser.lastStudyDate.slice(0, 10) : null;
                const isSameDay = lastStudyStr === todayStr;
                const newStreak = isSameDay
                  ? Math.max(1, currentUser.streak)
                  : (res.currentStreak ?? (currentUser.streak > 0 ? currentUser.streak : 1));
                useAuthStore.getState().updateUserProfile({
                  totalXp: Math.max(currentUser.totalXp, newTotalXp),
                  streak: newStreak,
                  longestStreak: Math.max(currentUser.longestStreak ?? 1, res.longestStreak ?? newStreak),
                  streakFreezeCount: res.streakFreezeCount ?? currentUser.streakFreezeCount,
                  lastStudyDate: new Date().toISOString(),
                  isActiveToday: true,
                });
              }
            })
            .catch((err) => {
              console.warn('Sync quiz section completion offline fallback:', err?.message);
              const currentUser = useAuthStore.getState().user;
              if (currentUser) {
                const awardXp = isAlreadyCompleted ? 0 : completionReward;
                const todayStr = new Date().toLocaleDateString('en-CA');
                const lastStudyStr = currentUser.lastStudyDate ? currentUser.lastStudyDate.slice(0, 10) : null;
                const isSameDay = lastStudyStr === todayStr;
                const curStreak = isSameDay ? Math.max(1, currentUser.streak) : (currentUser.streak > 0 ? currentUser.streak : 1);
                useAuthStore.getState().updateUserProfile({
                  totalXp: (currentUser.totalXp ?? 0) + awardXp,
                  streak: curStreak,
                  longestStreak: Math.max(currentUser.longestStreak ?? 1, curStreak),
                  lastStudyDate: new Date().toISOString(),
                  isActiveToday: true,
                });
              }
            });
        }
      }
    },
    [completeSectionNode, sectionRef, parsed, courseId, nodeTargetXp, isAlreadyCompleted]
  );

  const handleCompleteCurrent = useCallback(() => {
    if (lesson?.id) {
      handleLessonCompleted(lesson.id);
    }
  }, [lesson?.id, handleLessonCompleted]);

  const handleNext = useCallback(() => {
    if (lesson?.id) {
      handleLessonCompleted(lesson.id);
    }
    if (section && lessonIdx + 1 < section.lessons.length) {
      setLessonIdx((idx) => idx + 1);
    } else if (failedExercises.length > 0) {
      setMode('review');
    } else {
      setMode('quiz');
    }
  }, [lesson?.id, handleLessonCompleted, section, lessonIdx, failedExercises]);

  const handlePrev = useCallback(() => {
    setLessonIdx((idx) => (idx > 0 ? idx - 1 : 0));
  }, []);

  const handleJumpTo = useCallback(
    (idx: number) => {
      if (section && idx >= 0 && idx < section.lessons.length) {
        setLessonIdx(idx);
      }
    },
    [section]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p role="status" className="font-mono text-xs text-orange-400 tracking-widest animate-pulse">
          CARGANDO SECCIÓN…
        </p>
      </div>
    );
  }

  if (!parsed || !module || !section) {
    return (
      <div className="relative isolate min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />
        <p className="font-display text-2xl font-bold text-white">Sección no disponible todavía</p>
        <p className="text-sm text-slate-400 max-w-md">
          Este módulo se encuentra en sincronización. Vuelve al roadmap para continuar con las lecciones activas de Python Specialist.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] hover:brightness-110 active:translate-y-1 active:border-b-0 active:shadow-none transition-all"
        >
          Volver a la ruta
        </Link>
      </div>
    );
  }

  if (mode === 'review') {
    return (
      <LessonReviewMode
        exercises={failedExercises}
        sectionTitle={section.title}
        courseTitle={module.title}
        onFinishReview={() => {
          setFailedExercises([]);
          setMode('quiz');
        }}
      />
    );
  }

  if (mode === 'quiz') {
    const isMiniBoss = sectionRef === 'les-miniboss' || sectionRef === 'py-boss-logic';
    return (
      <LessonQuizMode
        bank={bank}
        sectionTitle={isMiniBoss ? 'Guardián de la Lógica' : section.title}
        courseTitle={module.title}
        isBoss={isMiniBoss}
        onFinish={handleQuizFinish}
      />
    );
  }

  if (mode === 'done' && quizScore) {
    return (
      <LessonDoneScreen
        quizScore={quizScore}
        isAlreadyCompleted={isAlreadyCompleted}
        nodeTargetXp={nodeTargetXp}
        onRetryQuiz={() => {
          setQuizScore(null);
          setMode('quiz');
        }}
      />
    );
  }

  return (
    <div className="relative isolate h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      {/* Header Fijo de Navegación HUD Fullwidth */}
      <LessonHeader
        moduleTitle={module.title}
        sectionTitle={section.title}
        lessons={section.lessons}
        lessonIdx={lessonIdx}
        completedLessons={completedLessons}
        isAdmin={isAdmin}
        isEditMode={isEditMode}
        isDirty={isDirty}
        pendingChangesCount={pendingChangesCount}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onSaveAll={handleSaveAll}
        onAddNewSession={handleAddNewSession}
        onSelectLessonIdx={setLessonIdx}
      />

      {/* Toast de Notificación de Administrador */}
      {adminNotification && (
        <div className="fixed top-20 right-6 z-50 p-3 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2 shadow-2xl animate-fadeIn">
          <PhosphorCheckCircle className="w-4 h-4 text-amber-400" />
          <span>{adminNotification}</span>
        </div>
      )}

      <main className="flex-1 min-h-0 w-full p-2.5 sm:p-4 lg:p-5 overflow-hidden flex flex-col">
        {lesson ? (
          <LessonView
            key={lesson.id}
            lesson={lesson}
            language={parsed.lang}
            isCompleted={completedLessons.has(lesson.id)}
            isAlreadyCompleted={isAlreadyCompleted}
            onComplete={handleCompleteCurrent}
            onExerciseCorrect={handleExerciseCorrect}
            onExerciseFailed={handleExerciseFailed}
            onNext={handleNext}
            onPrev={handlePrev}
            onJumpTo={handleJumpTo}
            currentIndex={lessonIdx}
            totalCount={section.lessons.length}
            isLast={lessonIdx + 1 >= section.lessons.length}
            isEditMode={isAdmin && isEditMode}
            onOpenInspector={handleOpenInspector}
            nodeTargetXp={nodeTargetXp}
          />
        ) : (
          <div className="w-full max-w-md mx-auto my-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 flex flex-col items-center gap-4 text-center shadow-2xl">
            <p className="text-slate-300 text-sm">Esta sección no trae lecciones todavía.</p>
            <button
              type="button"
              onClick={() => setMode('quiz')}
              className="inline-flex min-h-[48px] items-center rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              IR AL QUIZ
            </button>
          </div>
        )}
      </main>

      {/* Modal Inspector In-Situ */}
      {lesson && (
        <LessonInSituInspectorModal
          isOpen={inspectorOpen}
          onClose={() => setInspectorOpen(false)}
          blockType={inspectorBlock}
          lessonData={editableLessonData}
          onUpdate={handleApplyInspectorUpdate}
        />
      )}
    </div>
  );
};

export default LessonWorkspace;
