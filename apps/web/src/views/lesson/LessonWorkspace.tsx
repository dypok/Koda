'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ArrowCounterClockwise, Trophy, Key, Code, PencilSimple, Plus, FloppyDisk, Eye, EyeSlash, ShieldCheck, CheckCircle as PhosphorCheckCircle, Lightbulb } from '@phosphor-icons/react';
import { ContentExercise, ContentLesson, ContentModule, loadBank, loadModule, shuffled } from '@/lib/content';
import { QuestionRenderer } from './QuestionRenderer';
import { useLessonEngine } from './useLessonEngine';
import { useLessonKeyboardShortcuts } from '@/hooks/useLessonKeyboardShortcuts';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useAuthStore } from '@/stores/auth.store';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { LessonInSituInspectorModal, EditableBlockType, EditableLessonData } from '@/components/admin/LessonInSituInspectorModal';
import { cn } from '@/lib/utils';

import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { EvaluationService } from '@/services/learning/evaluation.service';

interface LessonWorkspaceProps {
  courseId: string;
  sectionRef: string;
}

const NODE_TO_SLUG_MAP: Record<string, { moduleSlug: string; initialMode?: 'lesson' | 'quiz' }> = {
  // Python 1: Fundamentos
  'les-01': { moduleSlug: 'fundamentos-de-python' },
  'les-02': { moduleSlug: 'variables-y-tipos-de-datos' },
  'les-03': { moduleSlug: 'operadores-y-expresiones' },
  'les-04': { moduleSlug: 'entrada-salida-y-strings' },
  'les-05': { moduleSlug: 'condicionales' },
  'les-miniboss': { moduleSlug: 'condicionales', initialMode: 'quiz' },
  'les-06': { moduleSlug: 'bucles-for' },
  'les-07': { moduleSlug: 'bucles-while' },
  'les-08': { moduleSlug: 'listas-y-tuplas' },
  'les-09': { moduleSlug: 'diccionarios-y-sets' },
  'les-10': { moduleSlug: 'funciones-fundamentales' },
  'les-boss': { moduleSlug: 'funciones-fundamentales', initialMode: 'quiz' },

  // Python 2: Intermedio
  'py2-01': { moduleSlug: 'comprensiones' },
  'py2-02': { moduleSlug: 'funciones-avanzadas' },
  'py2-03': { moduleSlug: 'modulos-y-paquetes' },
  'py2-04': { moduleSlug: 'manejo-de-excepciones' },
  'py2-05': { moduleSlug: 'archivos-txt-csv-json' },
  'py2-miniboss': { moduleSlug: 'archivos-txt-csv-json', initialMode: 'quiz' },
  'py2-06': { moduleSlug: 'poo-clases-y-objetos' },
  'py2-07': { moduleSlug: 'poo-herencia-y-polimorfismo' },
  'py2-08': { moduleSlug: 'datetime-y-regex' },
  'py2-09': { moduleSlug: 'pip-entornos-y-git' },
  'py2-10': { moduleSlug: 'testing-con-pytest' },
  'py2-boss': { moduleSlug: 'testing-con-pytest', initialMode: 'quiz' },

  // Python 3: Avanzado
  'py3-01': { moduleSlug: 'iteradores-y-generadores' },
  'py3-02': { moduleSlug: 'decoradores' },
  'py3-03': { moduleSlug: 'context-managers' },
  'py3-04': { moduleSlug: 'type-hints-y-dataclasses' },
  'py3-05': { moduleSlug: 'programacion-funcional' },
  'py3-miniboss': { moduleSlug: 'programacion-funcional', initialMode: 'quiz' },
  'py3-06': { moduleSlug: 'concurrencia-asyncio' },
  'py3-07': { moduleSlug: 'buenas-practicas-pep8' },
  'py3-08': { moduleSlug: 'logging-y-empaquetado' },
  'py3-09': { moduleSlug: 'rendimiento-y-profiling' },
  'py3-10': { moduleSlug: 'patrones-de-diseno' },
  'py3-boss': { moduleSlug: 'patrones-de-diseno', initialMode: 'quiz' },

  // FastAPI
  'fa-01': { moduleSlug: 'fastapi-http-rest' },
  'fa-02': { moduleSlug: 'fastapi-pydantic' },
  'fa-03': { moduleSlug: 'fastapi-sqlalchemy-alembic' },
  'fa-04': { moduleSlug: 'fastapi-auth-jwt' },
  'fa-05': { moduleSlug: 'fastapi-docker-deploy' },

  // Django
  'dj-01': { moduleSlug: 'django-mtv-routing' },
  'dj-02': { moduleSlug: 'django-orm-models' },
  'dj-03': { moduleSlug: 'django-forms-admin' },
  'dj-04': { moduleSlug: 'django-rest-framework' },
  'dj-05': { moduleSlug: 'django-auth-security-deploy' },

  // Data Analytics
  'da-01': { moduleSlug: 'numpy-fundamentos' },
  'da-02': { moduleSlug: 'pandas-series-dataframes' },
  'da-03': { moduleSlug: 'pandas-limpieza-transformacion' },
  'da-04': { moduleSlug: 'pandas-agrupaciones-merges' },
  'da-05': { moduleSlug: 'matplotlib-seaborn' },
  'da-miniboss': { moduleSlug: 'matplotlib-seaborn', initialMode: 'quiz' },
  'da-06': { moduleSlug: 'plotly-interactivo' },
  'da-07': { moduleSlug: 'analisis-exploratorio-eda' },
  'da-08': { moduleSlug: 'sql-con-python' },
  'da-09': { moduleSlug: 'scikit-learn-intro-ml' },
  'da-10': { moduleSlug: 'streamlit-dashboards' },
  'da-boss': { moduleSlug: 'streamlit-dashboards', initialMode: 'quiz' },

  // AI Agents
  'ia-01': { moduleSlug: 'ia-llms-y-prompts' },
  'ia-02': { moduleSlug: 'ia-apis-modelos' },
  'ia-03': { moduleSlug: 'ia-salidas-estructuradas' },
  'ia-04': { moduleSlug: 'ia-function-calling' },
  'ia-miniboss': { moduleSlug: 'ia-function-calling', initialMode: 'quiz' },
  'ia-05': { moduleSlug: 'ia-memoria-y-contexto' },
  'ia-06': { moduleSlug: 'ia-embeddings-vector-dbs' },
  'ia-07': { moduleSlug: 'ia-rag-recuperacion' },
  'ia-08': { moduleSlug: 'ia-agentes-bucle-react' },
  'ia-09': { moduleSlug: 'ia-guardrails-y-evaluacion' },
  'ia-10': { moduleSlug: 'ia-proyecto-agente-completo' },

  // Apex Master Gate
  'apex-01': { moduleSlug: 'apex-master-gate' },
  'apex-02': { moduleSlug: 'apex-master-gate' },
  'apex-03': { moduleSlug: 'apex-master-gate', initialMode: 'quiz' },
};

function parseCourse(courseId: string, sectionRef: string): { lang: string; moduleSlug: string; initialMode: 'lesson' | 'quiz' } {
  const lang = 'python';

  // 1. Verificación por mapa directo de IDs de nodos del roadmap
  const mapped = NODE_TO_SLUG_MAP[sectionRef];
  if (mapped) {
    return {
      lang,
      moduleSlug: mapped.moduleSlug,
      initialMode: mapped.initialMode || (sectionRef.includes('boss') ? 'quiz' : 'lesson'),
    };
  }

  // 2. Si el sectionRef es directamente un slug de módulo conocido
  const isDirectSlug = sectionRef.includes('-');
  const isQuizMode = sectionRef.includes('boss') || sectionRef.includes('quiz') || sectionRef.includes('exam');

  return {
    lang,
    moduleSlug: isDirectSlug ? sectionRef : 'fundamentos-de-python',
    initialMode: isQuizMode ? 'quiz' : 'lesson',
  };
}

const QUIZ_COMPOSITION: Record<string, number> = {
  single_choice: 3,
  true_false: 2,
  predict_output: 2,
  fill_blank: 1,
  find_error: 1,
  select_code: 1,
};

function sampleQuiz(bank: ContentExercise[], seed: number): ContentExercise[] {
  if (bank.length === 0) return [];
  // Si el banco trae preguntas de cualquier tipo, asegurar al menos una selección variada
  if (bank.length <= 10) return shuffled(bank, seed);
  const picked: ContentExercise[] = [];
  Object.entries(QUIZ_COMPOSITION).forEach(([type, n], ti) => {
    const pool = shuffled(
      bank.filter((q) => q.type === type),
      seed + ti
    );
    picked.push(...pool.slice(0, n));
  });
  if (picked.length === 0) return shuffled(bank, seed).slice(0, 5);
  return shuffled(picked, seed + 99);
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({ courseId, sectionRef }) => {
  const parsed = useMemo(() => parseCourse(courseId, sectionRef), [courseId, sectionRef]);
  const [module, setModule] = useState<ContentModule | null>(null);
  const [bank, setBank] = useState<ContentExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [mode, setMode] = useState<'lesson' | 'quiz' | 'done'>('lesson');
  const [quizScore, setQuizScore] = useState<{ ok: number; total: number } | null>(null);
  const completeSectionNode = useRoadmapStore((s) => s.completeSectionNode);

  // Registro atómico de lecciones completadas
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    try {
      const saved = window.localStorage.getItem('koda_completed_lessons');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const completedLessonsRef = useRef(completedLessons);
  useEffect(() => {
    completedLessonsRef.current = completedLessons;
  }, [completedLessons]);

  const handleLessonCompleted = useCallback(
    (lessonId: string) => {
      if (!lessonId) return;

      // Si la lección ya fue registrada como completada, evitar re-renders en bucle
      if (completedLessonsRef.current.has(lessonId)) return;

      setCompletedLessons((prev) => {
        if (prev.has(lessonId)) return prev;
        const next = new Set(prev).add(lessonId);
        try {
          window.localStorage.setItem('koda_completed_lessons', JSON.stringify(Array.from(next)));
        } catch {}
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
    },
    [completeSectionNode, sectionRef, parsed, courseId]
  );

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
        } else {
          // Fallback dinamico para modulos o secciones creadas por el administrador
          const adminStore = useAdminCurriculumStore.getState();
          const draftMod = adminStore.draftModules.find((m) => m.slug === parsed.moduleSlug || m.slug === courseId);
          const draftSecs = adminStore.draftSections.filter((s) => s.module_slug === parsed.moduleSlug || s.module_slug === courseId);
          const currentDraftSec = draftSecs.find((s) => s.slug === sectionRef) || draftSecs[0];
          const draftLessons = currentDraftSec
            ? adminStore.draftLessons.filter((l) => l.section_slug === currentDraftSec.slug)
            : [];

          const fallbackTitle = draftMod?.title || (courseId.startsWith('mod-') ? 'Modulo Personalizado' : 'Modulo en Edicion');
          const fallbackSectionTitle = currentDraftSec?.title || (sectionRef.startsWith('sec-') || sectionRef.startsWith('les-') ? 'Seccion 01' : 'Nueva Seccion');

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
                    title: 'Codigo Demostrativo',
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
                title: 'Leccion 01: Introduccion y Concepto Clave',
                slug: `${sectionRef}-l01`,
                position: 1,
                concept_id: 'concept-1',
                explanation: 'Paso 1: Frase de anclaje inicial.\n\nPaso 2: Mecanica conceptual explicada con claridad.\n\nPaso 3: Regla practica obligatoria para evitar errores.',
                is_required: true,
                examples: [
                  {
                    title: 'Codigo Demostrativo',
                    code: '# Escribe tu codigo aqui\nprint("Listo para programar")',
                    output: 'Listo para programar',
                  },
                ],
                exercises: [
                  {
                    id: `ex_${sectionRef}`,
                    type: 'single_choice',
                    difficulty: 'easy',
                    prompt: 'Cual es el principio central de esta leccion?',
                    answers: [
                      { id: 'a', body: 'Permite estructurar instrucciones claras y reproducibles.', is_correct: true },
                      { id: 'b', body: 'Omitir las reglas sintacticas obligatorias.', is_correct: false },
                      { id: 'c', body: 'Escribir bloques de codigo sin verificacion.', is_correct: false },
                      { id: 'd', body: 'Ninguna de las anteriores.', is_correct: false },
                    ],
                    correct_answer_ids: ['a'],
                    explanation: 'La opcion A es la correcta.',
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
      feedback: a.is_correct ? (exercise.explanation || 'Respuesta correcta.') : 'Opcion incorrecta.',
    })) || [
      { id: 'a', text: 'Opcion A (Correcta)', is_correct: true, feedback: 'Excelente respuesta.' },
      { id: 'b', text: 'Opcion B', is_correct: false, feedback: 'Incorrecto.' },
      { id: 'c', text: 'Opcion C', is_correct: false, feedback: 'Incorrecto.' },
      { id: 'd', text: 'Opcion D', is_correct: false, feedback: 'Incorrecto.' },
    ];

    return {
      id: lesson.id,
      title: lesson.title,
      step1: lines[0] || lesson.explanation || 'Paso 1: Frase de anclaje inicial.',
      step2: lines[1] || 'Paso 2: Mecanica conceptual explicada con claridad.',
      step3: lines[2] || 'Paso 3: Regla practica obligatoria para evitar errores.',
      code_snippet: lesson.examples[0]?.code || 'print("Hola, Koda")',
      console_prompt: exercise?.prompt || 'Ejecuta la instruccion print solicitada.',
      initial_code: '# Codigo inicial\n',
      solution_code: lesson.examples[0]?.code || 'print("Hola, Koda")',
      test_cases: [
        {
          input: '',
          expected_output: (lesson.examples[0]?.output || 'Hola, Koda') + '\n',
          description: 'Salida esperada',
        },
      ],
      quiz_prompt: exercise?.prompt || 'Cual es el principio central de esta sesion?',
      quiz_options: quizOptions,
      prediction_prompt: 'Que mostrara en consola este comando?',
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
        title: 'Codigo Demostrativo',
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
      title: `Sesion 0${nextIdx}: Nuevo Concepto Clave`,
      slug: `sesion-${nextIdx}`,
      position: nextIdx,
      concept_id: `concept-${nextIdx}`,
      explanation: `Paso 1: Frase de anclaje explicando el concepto nuevo.\n\nPaso 2: Mecanica conceptual explicada paso a paso sin jerga.\n\nPaso 3: Regla practica obligatoria de sintaxis.`,
      is_required: true,
      examples: [
        {
          title: 'Codigo Demostrativo',
          code: '# Demostracion en Python\nresultado = "Listo"\nprint(resultado)',
          language: 'python',
          output: 'Listo',
          explanation: 'La instruccion print muestra el texto en consola.',
        },
      ],
      exercises: [
        {
          id: `ex_${newLessonId}`,
          type: 'single_choice',
          difficulty: 'easy',
          prompt: 'Cual es la forma correcta de aplicar esta instruccion?',
          answers: [
            { id: 'a', body: 'Declarar la instruccion respetando la regla oficial.', is_correct: true },
            { id: 'b', body: 'Omitir las comillas en cadenas de texto.', is_correct: false },
            { id: 'c', body: 'Escribir las palabras reservadas con mayusculas.', is_correct: false },
            { id: 'd', body: 'Eliminar la indentacion del bloque.', is_correct: false },
          ],
          correct_answer_ids: ['a'],
          explanation: 'La opcion A es la correcta porque sigue el estandar del lenguaje.',
        },
      ],
    };

    section.lessons.push(newLesson);
    setLessonIdx(section.lessons.length - 1);

    useAdminCurriculumStore.setState((s) => ({
      isDirty: true,
      pendingChangesCount: s.pendingChangesCount + 1,
    }));

    setAdminNotification('Nueva sesion agregada al stepper siguiendo el orden didactico canonico.');
    setTimeout(() => setAdminNotification(null), 3000);
  }, [section]);

  const handleSaveAll = useCallback(() => {
    const res = saveChanges();
    setAdminNotification(res.message || 'Cambios guardados con exito.');
    setTimeout(() => setAdminNotification(null), 3500);
  }, [saveChanges]);

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
    } else {
      setMode('quiz');
    }
  }, [lesson?.id, handleLessonCompleted, section, lessonIdx]);

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

  const handleQuizFinish = useCallback(
    (ok: number, total: number) => {
      setQuizScore({ ok, total });
      setMode('done');
      const accuracy = Math.round((ok / Math.max(1, total)) * 100);
      if (accuracy >= 70) {
        completeSectionNode(sectionRef, ok === total ? 3 : 2);
        if (parsed) {
          EvaluationService.completeSection(sectionRef, {
            moduleId: parsed.moduleSlug,
            courseId,
            accuracyPercentage: accuracy,
          }).catch((err) => {
            console.warn('Sync quiz section completion offline fallback:', err?.message);
          });
        }
      }
    },
    [completeSectionNode, sectionRef, parsed, courseId]
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

  if (mode === 'quiz') {
    return (
      <QuizMode
        bank={bank}
        sectionTitle={parsed.initialMode === 'quiz' && (sectionRef === 'les-miniboss' || sectionRef === 'py-boss-logic') ? 'El Centinela de la Logica' : section.title}
        courseTitle={module.title}
        onFinish={handleQuizFinish}
      />
    );
  }

  if (mode === 'done' && quizScore) {
    const passed = quizScore.ok / Math.max(1, quizScore.total) >= 0.7;
    return (
      <div className="relative isolate min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />
        {passed ? (
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_30px_rgba(255,106,0,0.5)] border border-amber-200">
              <Trophy aria-hidden="true" className="w-10 h-10" />
            </div>
          </div>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            {passed ? '¡Sección completada!' : 'Casi lo logras'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md">
            Quiz: <span className="font-mono font-bold text-orange-400">{quizScore.ok}/{quizScore.total}</span> aciertos
            {passed ? ' · +10 XP de maestría' : ' · necesitas 70% de aciertos para avanzar'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!passed ? (
            <button
              type="button"
              onClick={() => {
                setQuizScore(null);
                setMode('quiz');
              }}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
              <span>REINTENTAR QUIZ</span>
            </button>
          ) : null}
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-6 font-mono text-xs font-bold text-slate-200 hover:border-orange-500/50 hover:bg-slate-800 transition-colors shadow-lg"
          >
            Volver a la ruta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      {/* Header Fijo de Navegación HUD */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 py-3 shadow-2xl">
        <div className="mx-auto max-w-6xl space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(255,106,0,0.3)] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la ruta</span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 font-semibold">{module.title}</span>
                <span className="text-slate-600">›</span>
                <span className="text-orange-400 font-bold">{section.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Controles de Administrador In-Situ en el Header */}
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>MODO EDITOR</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                      isEditMode
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                    title={isEditMode ? 'Alternar a vista alumno para resolver' : 'Activar edicion in-situ'}
                  >
                    {isEditMode ? <PencilSimple className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isEditMode ? 'Editando' : 'Vista Alumno'}</span>
                  </button>

                  {isDirty && (
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs font-mono transition-all shadow-md shadow-amber-500/20 cursor-pointer animate-fadeIn"
                      title="Guardar modificaciones"
                    >
                      <FloppyDisk className="w-3.5 h-3.5" />
                      <span>Guardar ({pendingChangesCount})</span>
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1-4 · Enter</span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                {lesson ? `0${lessonIdx + 1}/0${section.lessons.length}` : ''}
              </span>
            </div>
          </div>

          {/* Stepper horizontal con glow naranja e indicación de completitud */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Progreso de lecciones">
            {section.lessons.map((l, i) => {
              const isDone = completedLessons.has(l.id);
              const isCurrent = i === lessonIdx;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Lección ${i + 1}: ${l.title} ${isDone ? '(Completada)' : ''}`}
                  onClick={() => setLessonIdx(i)}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-all duration-300 cursor-pointer relative',
                    isCurrent
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(255,106,0,0.8)] ring-1 ring-orange-400/50'
                      : isDone
                      ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-800/80 hover:bg-slate-700'
                  )}
                  title={`0${i + 1}. ${l.title}${isDone ? ' (Completada)' : ''}`}
                />
              );
            })}

            {/* Botón para añadir sesión siguiendo el orden pedagógico */}
            {isAdmin && isEditMode && (
              <button
                type="button"
                onClick={handleAddNewSession}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold transition-all shrink-0 cursor-pointer"
                title="Añadir nueva sesion con el mismo orden didactico de las anteriores"
              >
                <Plus className="w-3 h-3" />
                <span>Añadir Sesion</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toast de Notificación de Administrador */}
      {adminNotification && (
        <div className="fixed top-20 right-6 z-50 p-3 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2 shadow-2xl animate-fadeIn">
          <PhosphorCheckCircle className="w-4 h-4 text-amber-400" />
          <span>{adminNotification}</span>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        {lesson ? (
          <LessonView
            key={lesson.id}
            lesson={lesson}
            isCompleted={completedLessons.has(lesson.id)}
            onComplete={handleCompleteCurrent}
            onNext={handleNext}
            onPrev={handlePrev}
            onJumpTo={handleJumpTo}
            currentIndex={lessonIdx}
            totalCount={section.lessons.length}
            isLast={lessonIdx + 1 >= section.lessons.length}
            isEditMode={isAdmin && isEditMode}
            onOpenInspector={handleOpenInspector}
          />
        ) : (
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 flex flex-col items-center gap-4 text-center shadow-2xl">
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

function LessonView({
  lesson,
  isCompleted,
  onComplete,
  onNext,
  onPrev,
  onJumpTo: _onJumpTo,
  currentIndex = 0,
  totalCount = 1,
  isLast,
  isEditMode,
  onOpenInspector,
}: {
  lesson: ContentLesson;
  isCompleted?: boolean;
  onComplete?: () => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo?: (idx: number) => void;
  currentIndex?: number;
  totalCount?: number;
  isLast: boolean;
  isEditMode?: boolean;
  onOpenInspector?: (block: EditableBlockType) => void;
}) {
  const exercise = lesson.exercises[0] ?? null;
  const engine = useLessonEngine(exercise ? [exercise] : [], lesson.position);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Guardia con ref para disparar completitud exactamente UNA vez por lección
  const hasNotifiedRef = useRef(false);
  useEffect(() => {
    hasNotifiedRef.current = false;
  }, [lesson.id]);

  useEffect(() => {
    if (engine.result?.correct && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onCompleteRef.current?.();
    }
  }, [engine.result?.correct]);

  // Hook de atajos ergonómicos por teclado
  const { pressedIndex, pressedAction } = useLessonKeyboardShortcuts({
    optionsCount: exercise?.answers?.length ?? 0,
    onSelectOption: (idx) => {
      const opt = exercise?.answers[idx];
      if (opt && !engine.result) engine.toggle(opt.id);
    },
    onSubmit: () => {
      if (!engine.result && engine.selected.length > 0) {
        engine.check();
        if (lesson?.id) {
          EvaluationService.evaluateLessonAnswer(lesson.id, {
            selected_option_ids: engine.selected,
          }).catch((err) => {
            console.warn('Backend lesson answer sync fallback:', err?.message);
          });
        }
      }
    },
    onNext: () => {
      if (engine.result) {
        if (engine.result.correct) {
          onComplete?.();
          onNext();
        } else {
          engine.resetSelection();
        }
      } else if (!exercise) {
        onComplete?.();
        onNext();
      }
    },
    onPrev: () => {
      onPrev();
    },
    isSubmitted: Boolean(engine.result),
    canSubmit: Boolean(!engine.result && engine.selected.length > 0),
  });

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Columna Izquierda: Teoría & Terminal */}
      <section aria-label="Teoría" className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-300 uppercase tracking-wider">
                <span>Lección 0{lesson.position ?? 1}</span>
              </div>
              {isCompleted ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Completada</span>
                </div>
              ) : null}
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={() => onOpenInspector?.('theory')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Modificar Enunciado y Teoria en 3 pasos"
              >
                <PencilSimple className="w-3.5 h-3.5 text-amber-400" />
                <span>Modificar Enunciado</span>
              </button>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {lesson.title}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lesson.explanation}
          </p>
        </div>

        {/* Terminal interactiva */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-mono select-none"># Ejemplo interactivo</span>
            {isEditMode && (
              <button
                type="button"
                onClick={() => onOpenInspector?.('code')}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Modificar codigo demostrativo"
              >
                <PencilSimple className="w-3 h-3 text-amber-400" />
                <span>Modificar Codigo</span>
              </button>
            )}
          </div>
          {lesson.examples.map((ex, i) => (
            <div key={i} className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
                <span className="text-slate-500 select-none"># Ejemplo interactivo</span>
                <div className="text-amber-300 pt-1">
                  <code>{ex.code}</code>
                </div>
              </div>
              {ex.output ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  <span className="text-emerald-500 font-bold">$</span>
                  <span>{ex.output}</span>
                </div>
              ) : null}
              {ex.explanation ? (
                <p className="text-[11px] text-slate-400 leading-normal pl-1">{ex.explanation}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Columna Derecha: Práctica & Desafío de Comprensión */}
      <section aria-label="Práctica" className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
        {!exercise ? (
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  <span>Lectura Conceptual</span>
                </div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => onOpenInspector?.('quiz')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                    title="Añadir pregunta y opciones"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Añadir Pregunta</span>
                  </button>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Has completado los conceptos y ejemplos de esta lección. Cuando estés listo, presiona continuar para avanzar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onComplete?.();
                onNext();
              }}
              className={cn(
                'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.18em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none select-none',
                pressedAction === 'next' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
              )}
            >
              <span>{isLast ? 'IR AL QUIZ' : 'SIGUIENTE LECCIÓN'}</span>
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
              <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950">
                Enter ↵
              </kbd>
            </button>
          </div>
        ) : (
          <div className="space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Desafío de Comprensión
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                    {exercise.type === 'multiple_choice' ? 'Opción múltiple' : 'Opción única'}
                  </span>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => onOpenInspector?.('quiz')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                      title="Modificar pregunta y opciones A/B/C/D con feedback"
                    >
                      <PencilSimple className="w-3.5 h-3.5 text-amber-400" />
                      <span>Modificar Pregunta</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-base sm:text-lg font-bold text-white leading-snug">
                {exercise.prompt}
              </p>

              <div className="pt-2">
                <QuestionRenderer
                  exercise={exercise}
                  selectedIds={engine.selected}
                  onToggle={engine.toggle}
                  disabled={Boolean(engine.result)}
                  pressedIndex={pressedIndex}
                />
              </div>
            </div>

            {/* Acciones de Evaluación */}
            <div className="pt-3">
              {!engine.result ? (
                <button
                  type="button"
                  onClick={() => {
                    engine.check();
                    if (lesson?.id) {
                      EvaluationService.evaluateLessonAnswer(lesson.id, {
                        selected_option_ids: engine.selected,
                      }).catch((err) => {
                        console.warn('Backend lesson answer sync fallback:', err?.message);
                      });
                    }
                  }}
                  disabled={engine.selected.length === 0}
                  className={cn(
                    'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.25em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
                    pressedAction === 'submit' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
                  )}
                >
                  <Code aria-hidden="true" className="w-4 h-4" />
                  <span>C O M P R O B A R</span>
                  <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950 group-disabled:opacity-40">
                    Enter ↵
                  </kbd>
                </button>
              ) : (
                <div
                  role={engine.result.correct ? 'status' : 'alert'}
                  className={cn(
                    'rounded-xl border p-4 space-y-3 transition-all duration-300',
                    engine.result.correct
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold flex items-center gap-2">
                      {engine.result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                      {engine.result.correct ? `¡Excelente! +${engine.result.xp} XP` : 'Respuesta incorrecta'}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {engine.result.feedback}
                  </p>
                  {engine.result.hint ? (
                    <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Pista:</strong> {engine.result.hint}</span>
                    </p>
                  ) : null}
                  <div className="flex gap-2.5 pt-1">
                    {!engine.result.correct ? (
                      <button
                        type="button"
                        onClick={engine.resetSelection}
                        className="group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border-t border-slate-600 border-b-4 border-slate-950 bg-slate-800 px-4 text-xs font-mono font-bold text-slate-200 shadow-[0_4px_0_#020617] hover:border-slate-500 hover:bg-slate-750 hover:text-white active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                      >
                        <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
                        <span>REINTENTAR</span>
                        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400">
                          Enter ↵
                        </kbd>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={engine.result.correct ? onNext : () => {}}
                      disabled={!engine.result.correct}
                      className={cn(
                        'group relative inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.45)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
                        pressedAction === 'next' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-emerald-400'
                      )}
                    >
                      <span>{isLast ? 'IR AL QUIZ' : 'SIGUIENTE LECCIÓN'}</span>
                      <ArrowRight aria-hidden="true" className="w-4 h-4" />
                      <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950">
                        Enter ↵
                      </kbd>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pie de navegación libre entre lecciones independientes */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <button
                type="button"
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Lección anterior
              </button>
              <span className="text-[11px] text-slate-500">
                0{currentIndex + 1} / 0{totalCount}
              </span>
              <button
                type="button"
                onClick={onNext}
                className="hover:text-orange-400 transition-colors cursor-pointer"
              >
                {isLast ? 'Ir al Quiz →' : 'Saltar / Siguiente →'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function QuizMode({
  bank,
  sectionTitle,
  courseTitle,
  onFinish,
}: {
  bank: ContentExercise[];
  sectionTitle: string;
  courseTitle?: string;
  onFinish: (ok: number, total: number) => void;
}) {
  const questions = useMemo(
    () => sampleQuiz(bank, sectionTitle.length * 7 + 3),
    [bank, sectionTitle]
  );
  const engine = useLessonEngine(questions, 7);
  const [okCount, setOkCount] = useState(0);
  const answered = engine.index;
  const total = engine.total;

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const hasFinishedRef = useRef(false);
  useEffect(() => {
    if (engine.done && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinishRef.current(okCount, total);
    }
  }, [engine.done, okCount, total]);

  // Hook de atajos de teclado para Quiz
  const { pressedIndex, pressedAction } = useLessonKeyboardShortcuts({
    optionsCount: engine.current?.answers?.length ?? 0,
    onSelectOption: (idx) => {
      const opt = engine.current?.answers[idx];
      if (opt && !engine.result) engine.toggle(opt.id);
    },
    onSubmit: () => {
      if (!engine.result && engine.selected.length > 0) engine.check();
    },
    onNext: () => {
      if (engine.result) {
        if (engine.result.correct) setOkCount((c) => c + 1);
        engine.next();
      }
    },
    onPrev: () => {
      if (engine.index > 0) {
        engine.prev();
      }
    },
    isSubmitted: Boolean(engine.result),
    canSubmit: Boolean(!engine.result && engine.selected.length > 0),
  });

  if (questions.length === 0) {
    return (
      <div className="relative isolate min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />
        <p className="font-display text-2xl font-bold text-white">Quiz en camino</p>
        <p className="text-sm text-slate-400">Esta sección aún no tiene banco de preguntas.</p>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          Volver a la ruta
        </Link>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 py-3 shadow-2xl">
        <div className="mx-auto max-w-4xl space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">{courseTitle ?? 'Curso'}</span>
              <span className="text-slate-600">›</span>
              <span className="text-orange-400 font-bold uppercase tracking-wider">Quiz · {sectionTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1-4 · Enter</span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                0{Math.min(answered + 1, total)}/0{total}
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,106,0,0.8)]"
              style={{ width: `${(answered / Math.max(1, total)) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        {engine.current ? (
          <div className="w-full max-w-3xl rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Pregunta del Quiz
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                Progreso {answered + 1} de {total}
              </span>
            </div>

            <p className="text-lg sm:text-xl font-bold text-white leading-snug">
              {engine.current.prompt}
            </p>

            <QuestionRenderer
              exercise={engine.current}
              selectedIds={engine.selected}
              onToggle={engine.toggle}
              disabled={Boolean(engine.result)}
              pressedIndex={pressedIndex}
            />

            <div className="pt-2">
              {!engine.result ? (
                <button
                  type="button"
                  onClick={() => engine.check()}
                  disabled={engine.selected.length === 0}
                  className={cn(
                    'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.25em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
                    pressedAction === 'submit' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
                  )}
                >
                  <Code aria-hidden="true" className="w-4 h-4" />
                  <span>C O M P R O B A R</span>
                  <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950 group-disabled:opacity-40">
                    Enter ↵
                  </kbd>
                </button>
              ) : (
                <div
                  role={engine.result.correct ? 'status' : 'alert'}
                  className={cn(
                    'rounded-xl border p-4 space-y-3 transition-all duration-300',
                    engine.result.correct
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-bold flex items-center gap-2',
                      engine.result.correct ? 'text-emerald-300' : 'text-rose-200'
                    )}
                  >
                    {engine.result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                    {engine.result.correct ? '¡Correcto!' : 'Anotado para repaso. Continuemos.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (engine.result?.correct) setOkCount((c) => c + 1);
                      engine.next();
                    }}
                    className={cn(
                      'group relative inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.45)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none select-none',
                      pressedAction === 'next' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-emerald-400'
                    )}
                  >
                    <span>SIGUIENTE PREGUNTA</span>
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950">
                      Enter ↵
                    </kbd>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default LessonWorkspace;

