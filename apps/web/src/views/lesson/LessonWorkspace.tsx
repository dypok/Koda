'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ArrowCounterClockwise,
  Trophy,
  Key,
  Code,
  BookOpen,
  Lightning,
  ArrowsClockwise,
  Shield,
  Lightbulb,
  Target,
  WarningCircle,
  Sparkle,
} from '@phosphor-icons/react';
import { ContentExercise, ContentLesson, ContentModule, isModuleAvailable, loadBank, loadModule, shuffled } from '@/lib/content';
import { QuestionRenderer, getExerciseTypeLabel } from './QuestionRenderer';
import { useLessonEngine } from './useLessonEngine';
import { useLessonKeyboardShortcuts } from '@/hooks/useLessonKeyboardShortcuts';
import { InteractiveCodeConsole } from '@/components/lesson/InteractiveCodeConsole';
import { StarRatingDisplay, calculateStarsFromAccuracy } from '@/components/lesson/StarRatingDisplay';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';
import { getLessonsDatasetForCourse } from '@/models/roadmap/python-lessons-graph.mock';
import type { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { getSectionAliases } from '@/models/roadmap/section-alias.helper';

import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { EvaluationService } from '@/services/learning/evaluation.service';
import { useAuthStore } from '@/stores/auth.store';
import { MarkdownContent, renderMarkdownInline } from '@/components/ui/markdown-content';

interface LessonWorkspaceProps {
  courseId: string;
  sectionRef: string;
}

const NODE_TO_SLUG_MAP: Record<string, { moduleSlug: string; initialMode?: 'lesson' | 'quiz' }> = {
  // Python 1: Fundamentos (IDs emitidos por Backend / API)
  'py-m01': { moduleSlug: 'fundamentos-de-python' },
  'py-m02': { moduleSlug: 'variables-y-tipos-de-datos' },
  'py-m03': { moduleSlug: 'operadores-y-expresiones' },
  'py-m04': { moduleSlug: 'condicionales' },
  'py-boss-logic': { moduleSlug: 'condicionales', initialMode: 'quiz' },
  'py-m05': { moduleSlug: 'bucles-for' },
  'py-m06': { moduleSlug: 'bucles-while' },
  'py-apex-1': { moduleSlug: 'funciones-fundamentales', initialMode: 'quiz' },

  // Python 1: Fundamentos (IDs canónicos de dataset mock frontend)
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

  // Python 2: Intermedio (IDs Backend / API)
  'py2-m01': { moduleSlug: 'comprensiones' },
  'py2-m02': { moduleSlug: 'funciones-avanzadas' },
  'py2-m03': { moduleSlug: 'modulos-y-paquetes' },
  'py2-m04': { moduleSlug: 'manejo-de-excepciones' },
  'py2-m05': { moduleSlug: 'archivos-txt-csv-json' },

  // Python 2: Intermedio (IDs dataset mock frontend)
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

  // Python 3: Avanzado (IDs Backend / API)
  'py3-m01': { moduleSlug: 'iteradores-y-generadores' },
  'py3-m02': { moduleSlug: 'decoradores' },
  'py3-m03': { moduleSlug: 'context-managers' },
  'py3-m04': { moduleSlug: 'type-hints-y-dataclasses' },
  'py3-m05': { moduleSlug: 'programacion-funcional' },

  // Python 3: Avanzado (IDs dataset mock frontend)
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

  // FastAPI (IDs Backend y Mock)
  'fa-m01': { moduleSlug: 'fastapi-http-rest' },
  'fa-m02': { moduleSlug: 'fastapi-pydantic' },
  'fa-m03': { moduleSlug: 'fastapi-sqlalchemy-alembic' },
  'fa-m04': { moduleSlug: 'fastapi-auth-jwt' },
  'fa-01': { moduleSlug: 'fastapi-http-rest' },
  'fa-02': { moduleSlug: 'fastapi-pydantic' },
  'fa-03': { moduleSlug: 'fastapi-sqlalchemy-alembic' },
  'fa-04': { moduleSlug: 'fastapi-auth-jwt' },
  'fa-05': { moduleSlug: 'fastapi-docker-deploy' },

  // Django (IDs Backend y Mock)
  'dj-m01': { moduleSlug: 'django-mtv-routing' },
  'dj-m02': { moduleSlug: 'django-orm-models' },
  'dj-m03': { moduleSlug: 'django-forms-admin' },
  'dj-m04': { moduleSlug: 'django-rest-framework' },
  'dj-01': { moduleSlug: 'django-mtv-routing' },
  'dj-02': { moduleSlug: 'django-orm-models' },
  'dj-03': { moduleSlug: 'django-forms-admin' },
  'dj-04': { moduleSlug: 'django-rest-framework' },
  'dj-05': { moduleSlug: 'django-auth-security-deploy' },

  // Data Analytics (IDs Backend y Mock)
  'data-analytics-s01': { moduleSlug: 'numpy-fundamentos' },
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

  // AI Agents (IDs Backend y Mock)
  'ai-agents-s01': { moduleSlug: 'ia-llms-y-prompts' },
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

  // Apex (IDs Backend y Mock)
  'python-apex-s01': { moduleSlug: 'apex-master-gate' },
  'apex-01': { moduleSlug: 'apex-master-gate' },
  'apex-02': { moduleSlug: 'apex-master-gate' },
  'apex-03': { moduleSlug: 'apex-master-gate', initialMode: 'quiz' },
};

const COURSE_DEFAULT_SLUGS: Record<string, string> = {
  'python-1': 'fundamentos-de-python',
  'python-2': 'comprensiones',
  'python-3': 'iteradores-y-generadores',
  'fastapi-async': 'fastapi-http-rest',
  'django-enterprise': 'django-mtv-routing',
  'data-analytics': 'numpy-fundamentos',
  'ai-agents': 'ia-llms-y-prompts',
  'python-apex': 'apex-master-gate',
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

  // 2. Si sectionRef es directamente un slug de módulo conocido y disponible
  if (isModuleAvailable(lang, sectionRef)) {
    const isQuizMode = sectionRef.includes('boss') || sectionRef.includes('quiz') || sectionRef.includes('exam');
    return {
      lang,
      moduleSlug: sectionRef,
      initialMode: isQuizMode ? 'quiz' : 'lesson',
    };
  }

  // 3. Fallback inteligente según curso para evitar que un ID de sección no mapeado rompa el workspace
  const defaultSlug = COURSE_DEFAULT_SLUGS[courseId] || 'fundamentos-de-python';
  const isQuizMode = sectionRef.includes('boss') || sectionRef.includes('quiz') || sectionRef.includes('exam');

  return {
    lang,
    moduleSlug: defaultSlug,
    initialMode: isQuizMode ? 'quiz' : 'lesson',
  };
}

const QUIZ_COMPOSITION: Record<string, number> = {
  single_choice: 2,
  multiple_choice: 1,
  true_false: 1,
  predict_output: 1,
  fill_blank: 1,
  find_error: 1,
  select_code: 1,
  order_lines: 1,
  matching: 1,
};

function sampleQuiz(bank: ContentExercise[], seed: number): ContentExercise[] {
  if (bank.length === 0) return [];
  // Si el banco trae <= 10 preguntas, barajarlas todas
  if (bank.length <= 10) return shuffled(bank, seed);
  const picked: ContentExercise[] = [];
  const pickedIds = new Set<string>();

  Object.entries(QUIZ_COMPOSITION).forEach(([type, n], ti) => {
    const pool = shuffled(
      bank.filter((q) => q.type === type),
      seed + ti
    );
    for (const q of pool.slice(0, n)) {
      if (!pickedIds.has(q.id)) {
        picked.push(q);
        pickedIds.add(q.id);
      }
    }
  });

  if (picked.length < 10) {
    const remaining = shuffled(
      bank.filter((q) => !pickedIds.has(q.id)),
      seed + 55
    );
    picked.push(...remaining.slice(0, 10 - picked.length));
  }

  return shuffled(picked, seed + 99);
}

function findNodeInDataset(
  dataset: GraphDataset | null | undefined,
  sectionRef: string,
  moduleSlug?: string
): GraphNode | null {
  if (!dataset?.nodes?.length) return null;

  const sRefLower = sectionRef.toLowerCase();

  // 1. Coincidencia directa por ID exacto (ej. 'py-m04', 'les-05', 'py-boss-logic', 'py2-01')
  const direct = dataset.nodes.find((n) => n.id.toLowerCase() === sRefLower);
  if (direct) return direct;

  // 2. Coincidencia por mapeo canónico de slug en NODE_TO_SLUG_MAP
  if (moduleSlug) {
    const targetSlugLower = moduleSlug.toLowerCase();
    const bySlug = dataset.nodes.find((n) => {
      const nodeSlug = NODE_TO_SLUG_MAP[n.id]?.moduleSlug;
      return nodeSlug && nodeSlug.toLowerCase() === targetSlugLower;
    });
    if (bySlug) return bySlug;
  }

  // 3. Coincidencia por código numérico de lección (ej. '04', '4', 'm04', 'les-04')
  const codeMatch = sectionRef.match(/(?:m|les-?)0?(\d+)/i);
  if (codeMatch) {
    const num = codeMatch[1].padStart(2, '0');
    const byCode = dataset.nodes.find((n) => n.code === num);
    if (byCode) return byCode;
  }

  // 4. Coincidencia por similitud de tokens en label
  if (moduleSlug) {
    const slugTokens = moduleSlug.toLowerCase().split('-');
    const byToken = dataset.nodes.find((n) => {
      const labelLower = n.label.toLowerCase();
      return slugTokens.some((t) => t.length > 3 && labelLower.includes(t));
    });
    if (byToken) return byToken;
  }

  return null;
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
  const router = useRouter();

  // Atajo ergonómico de teclado para la pantalla de sección completada (Enter -> volver a la ruta)
  useEffect(() => {
    if (mode !== 'done') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        const passed = quizScore ? quizScore.ok / Math.max(1, quizScore.total) >= 0.7 : true;
        if (passed) {
          router.push('/');
        } else {
          setQuizScore(null);
          setMode('quiz');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, quizScore, router]);

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

  // Registro atomico de lecciones completadas
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
        const next = new Set(prev);
        next.add(lessonId);
        if (sectionRef) {
          next.add(sectionRef);
          getSectionAliases(sectionRef).forEach((a) => next.add(a));
        }
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
        setModule(mod);
        setBank(questions);
        setFailedExercises([]);
        setMode(parsed.initialMode);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [parsed]);

  const section = useMemo(() => {
    if (!module) return null;
    const bySlug = module.sections.find((s) => s.slug === sectionRef);
    if (bySlug) return bySlug;
    const m = /^s(\d+)$/.exec(sectionRef);
    if (m) return module.sections[Number(m[1]) - 1] ?? null;
    return module.sections[0] ?? null;
  }, [module, sectionRef]);

  const lesson = section?.lessons?.[lessonIdx] ?? null;

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
      <ReviewMode
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
      <QuizMode
        bank={bank}
        sectionTitle={isMiniBoss ? 'Guardián de la Lógica' : section.title}
        courseTitle={module.title}
        isBoss={isMiniBoss}
        onFinish={handleQuizFinish}
      />
    );
  }

  if (mode === 'done' && quizScore) {
    const passed = quizScore.ok / Math.max(1, quizScore.total) >= 0.7;
    return (
      <div className="relative isolate h-screen max-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 px-4 text-center overflow-hidden">
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
            {passed
              ? isAlreadyCompleted
                ? ' · +0 XP (Módulo ya dominado)'
                : ` · +${nodeTargetXp} XP de maestría`
              : ' · necesitas 70% de aciertos para avanzar'}
          </p>
        </div>

        {/* Visualización de Estrellas (1⭐ a 3⭐) — EPIC-4 LEARN-04 */}
        <StarRatingDisplay
          correctCount={quizScore.ok}
          totalCount={quizScore.total}
          xpEarned={passed ? 10 : 0}
        />

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
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-orange-600/70 border border-orange-400 text-slate-950 font-bold">↵ Enter</kbd>
            </button>
          ) : null}
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 font-mono text-xs font-bold text-slate-200 hover:border-orange-500/50 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <span>Volver a la ruta</span>
            {passed && (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">↵ Enter</kbd>
            )}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      {/* Header Fijo de Navegación HUD Fullwidth */}
      <header className="w-full shrink-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xl">
        <div className="w-full space-y-2">
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
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1-4 · Enter</span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                {lesson ? `${String(lessonIdx + 1).padStart(2, '0')}/${String(section.lessons.length).padStart(2, '0')}` : ''}
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
                  title={`${String(i + 1).padStart(2, '0')}. ${l.title}${isDone ? ' (✓ Completada)' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </header>

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
    </div>
  );
};

function LessonView({
  lesson,
  language = 'python',
  isCompleted,
  isAlreadyCompleted = false,
  onComplete,
  onExerciseFailed,
  onExerciseCorrect,
  onNext,
  onPrev,
  onJumpTo: _onJumpTo,
  currentIndex = 0,
  totalCount = 1,
  isLast,
  nodeTargetXp = 120,
}: {
  lesson: ContentLesson;
  language?: string;
  isCompleted?: boolean;
  isAlreadyCompleted?: boolean;
  onComplete?: () => void;
  onExerciseFailed?: (exercise: ContentExercise) => void;
  onExerciseCorrect?: (xp: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo?: (idx: number) => void;
  currentIndex?: number;
  totalCount?: number;
  isLast: boolean;
  nodeTargetXp?: number;
}) {
  const totalSteps = totalCount + 1; // Las N lecciones de la sección + el Quiz de cierre
  const baseStepXp = isAlreadyCompleted ? 0 : Math.max(5, Math.floor(nodeTargetXp / totalSteps));
  const exerciseCount = Math.max(1, lesson.exercises?.length ?? 1);
  const questionXp = isAlreadyCompleted ? 0 : Math.max(1, Math.round(baseStepXp / exerciseCount));

  const exercise = lesson.exercises[0] ?? null;
  const engine = useLessonEngine(exercise ? [exercise] : [], lesson.position, questionXp);
  const [mobileTab, setMobileTab] = useState<'concept' | 'practice'>('concept');

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const onExerciseFailedRef = useRef(onExerciseFailed);
  useEffect(() => {
    onExerciseFailedRef.current = onExerciseFailed;
  }, [onExerciseFailed]);

  // Guardia con ref para disparar completitud exactamente UNA vez por lección
  const hasNotifiedRef = useRef(false);
  useEffect(() => {
    hasNotifiedRef.current = false;
  }, [lesson.id]);

  useEffect(() => {
    if (engine.result?.correct && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onCompleteRef.current?.();
    } else if (engine.result && !engine.result.correct && exercise) {
      // Ronda de Repaso Final (LESS-04): registrar el ejercicio fallado
      onExerciseFailedRef.current?.(exercise);
    }
  }, [engine.result, exercise]);

  // Hook de atajos ergonómicos por teclado
  const { pressedIndex, pressedAction } = useLessonKeyboardShortcuts({
    optionsCount: exercise?.answers?.length ?? 0,
    onSelectOption: (idx) => {
      const opt = exercise?.answers[idx];
      if (opt && !engine.result) engine.toggle(opt.id);
    },
    onSubmit: () => {
      if (!engine.result && engine.selected.length > 0) {
        const checkRes = engine.check();
        if (checkRes?.correct && checkRes.xp > 0) {
          onExerciseCorrect?.(checkRes.xp);
          const curUser = useAuthStore.getState().user;
          if (curUser) {
            const todayStr = new Date().toLocaleDateString('en-CA');
            const lastStudyStr = curUser.lastStudyDate ? curUser.lastStudyDate.slice(0, 10) : null;
            const isSameDay = lastStudyStr === todayStr;
            const curStreak = isSameDay ? Math.max(1, curUser.streak) : (curUser.streak > 0 ? curUser.streak : 1);
            useAuthStore.getState().updateUserProfile({
              totalXp: (curUser.totalXp ?? 0) + checkRes.xp,
              streak: curStreak,
              longestStreak: Math.max(curUser.longestStreak ?? 1, curStreak),
              isActiveToday: true,
              lastStudyDate: new Date().toISOString(),
            });
          }
        }
        if (lesson?.id) {
          EvaluationService.evaluateLessonAnswer(lesson.id, {
            selected_option_ids: engine.selected,
            xp_earned: checkRes?.xp,
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

  const isLongTitle = lesson.title.length > 40;
  const isLongExplanation = (lesson.explanation?.length ?? 0) > 650;

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-2 sm:gap-3 overflow-hidden">
      {/* Tabs responsivos en móvil (< lg) para alternar entre Concepto y Práctica — LESS-01 */}
      <div
        role="tablist"
        aria-label="Secciones de la lección en móvil"
        className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 lg:hidden shrink-0"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'concept'}
          onClick={() => setMobileTab('concept')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer',
            mobileTab === 'concept'
              ? 'bg-orange-500 text-slate-950 shadow-[0_0_12px_rgba(255,106,0,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>Concepto</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'practice'}
          onClick={() => setMobileTab('practice')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer',
            mobileTab === 'practice'
              ? 'bg-orange-500 text-slate-950 shadow-[0_0_12px_rgba(255,106,0,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Lightning className="w-4 h-4" />
          <span>Práctica</span>
        </button>
      </div>

      <div className="w-full h-full min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 overflow-hidden">
        {/* Columna Izquierda: Teoría & Consola Interactiva Pyodide (LESS-01, LESS-06) */}
        <section
          role="tabpanel"
          aria-label="Teoría"
          className={cn(
            mobileTab === 'concept' ? 'flex' : 'hidden lg:flex',
            'h-full min-h-0 flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-3.5 sm:p-5 lg:p-6 shadow-2xl overflow-hidden'
          )}
        >
          {/* Cabecera fija de la teoría */}
          <div className="shrink-0 space-y-2 pb-3 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-300 uppercase tracking-wider">
                <span>Lección {String(lesson.position ?? 1).padStart(2, '0')}</span>
              </div>
              {isCompleted ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Completada</span>
                </div>
              ) : null}
              {lesson.objective ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-medium text-cyan-300 truncate max-w-full">
                  <Target className="w-3 h-3 text-cyan-400 shrink-0" aria-hidden="true" />
                  <span className="truncate">{lesson.objective}</span>
                </div>
              ) : null}
            </div>
            <h1
              className={cn(
                'font-display font-black text-white tracking-tight leading-snug',
                isLongTitle ? 'text-lg sm:text-xl lg:text-2xl' : 'text-xl sm:text-2xl lg:text-3xl'
              )}
            >
              <MarkdownContent content={lesson.title} inline />
            </h1>
          </div>

          {/* Cuerpo scrolleable con teoría, errores comunes y consola interactiva */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 sm:space-y-4 pr-1 sm:pr-2 pt-3">
            <div
              className={cn(
                'leading-relaxed text-slate-200',
                isLongExplanation ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
              )}
            >
              <MarkdownContent content={lesson.explanation} />
            </div>

            {lesson.common_errors ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 space-y-1.5 text-xs text-rose-200">
                <div className="flex items-center gap-1.5 font-bold font-mono text-rose-300 uppercase tracking-wider text-[10px]">
                  <WarningCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" aria-hidden="true" />
                  <span>Cuidado habitual</span>
                </div>
                <div className="leading-relaxed text-slate-300">
                  <MarkdownContent content={lesson.common_errors} />
                </div>
              </div>
            ) : null}

            {/* Consola Interactiva Pyodide / Sandbox en vivo */}
            {lesson.examples.length > 0 ? (
              <div className="space-y-3">
                {lesson.examples.map((ex, i) => (
                  <InteractiveCodeConsole
                    key={`${lesson.id}-${i}`}
                    initialCode={ex.code}
                    expectedOutput={ex.output}
                    explanation={ex.explanation}
                    title={ex.title}
                    language={ex.language || language}
                  />
                ))}
              </div>
            ) : null}

            {lesson.key_takeaways && lesson.key_takeaways.length > 0 ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold font-mono text-amber-300 uppercase tracking-wider text-[10px]">
                  <Sparkle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                  <span>Puntos Clave</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {lesson.key_takeaways.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <MarkdownContent content={point} inline />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Botón de acceso rápido a Práctica sólo en pantallas móviles */}
            <button
              type="button"
              onClick={() => setMobileTab('practice')}
              className="lg:hidden inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 font-mono text-xs font-bold text-orange-300 hover:bg-orange-500/20 transition-colors cursor-pointer"
            >
              <span>Ir al Desafío Práctico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Columna Derecha: Práctica & Desafío de Comprensión */}
        <section
          role="tabpanel"
          aria-label="Práctica"
          className={cn(
            mobileTab === 'practice' ? 'flex' : 'hidden lg:flex',
            'h-full min-h-0 flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-3.5 sm:p-5 lg:p-6 shadow-2xl overflow-hidden'
          )}
        >
          {!exercise ? (
            <div className="flex flex-col justify-between h-full min-h-0">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  <span>Lectura Conceptual</span>
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
            <div className="flex flex-col justify-between h-full min-h-0">
              {/* Cabecera fija de la pregunta */}
              <div className="shrink-0 flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Desafío de Comprensión
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                  {getExerciseTypeLabel(exercise.type)}
                </span>
              </div>

              {/* Area de pregunta y opciones scrolleable */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 py-3 pr-1 sm:pr-2">
                <div
                  className={cn(
                    'font-bold text-white leading-snug',
                    exercise.prompt.length > 180 ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                  )}
                >
                  <MarkdownContent content={exercise.prompt} inline />
                </div>

                {exercise.prompt_code && (exercise.type === 'multiple_choice' || exercise.type === 'single_choice' || exercise.type === 'true_false') ? (
                  <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm leading-relaxed text-amber-200 shadow-inner max-h-36">
                    <code>{exercise.prompt_code}</code>
                  </pre>
                ) : null}

                <div className="pt-1">
                  <QuestionRenderer
                    exercise={exercise}
                    selectedIds={engine.selected}
                    onToggle={engine.toggle}
                    onCustomChange={engine.setCustomAnswer}
                    disabled={Boolean(engine.result)}
                    pressedIndex={pressedIndex}
                  />
                </div>
              </div>

              {/* Acciones fijas en la parte inferior */}
              <div className="shrink-0 pt-2 border-t border-slate-800/80 space-y-2">
                {!engine.result ? (
                  <button
                    type="button"
                    onClick={() => {
                      const checkRes = engine.check();
                      if (checkRes?.correct && checkRes.xp > 0) {
                        onExerciseCorrect?.(checkRes.xp);
                        const curUser = useAuthStore.getState().user;
                        if (curUser) {
                          const todayStr = new Date().toLocaleDateString('en-CA');
                          const lastStudyStr = curUser.lastStudyDate ? curUser.lastStudyDate.slice(0, 10) : null;
                          const isSameDay = lastStudyStr === todayStr;
                          const curStreak = isSameDay ? Math.max(1, curUser.streak) : (curUser.streak > 0 ? curUser.streak : 1);
                          useAuthStore.getState().updateUserProfile({
                            totalXp: (curUser.totalXp ?? 0) + checkRes.xp,
                            streak: curStreak,
                            longestStreak: Math.max(curUser.longestStreak ?? 1, curStreak),
                            isActiveToday: true,
                            lastStudyDate: new Date().toISOString(),
                          });
                        }
                      }
                      if (lesson?.id) {
                        EvaluationService.evaluateLessonAnswer(lesson.id, {
                          selected_option_ids: engine.selected,
                          xp_earned: checkRes?.xp,
                        }).catch((err) => {
                          console.warn('Backend lesson answer sync fallback:', err?.message);
                        });
                      }
                    }}
                    disabled={engine.selected.length === 0}
                    className={cn(
                      'group relative inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.25em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
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
                      'rounded-xl border p-3 space-y-2 transition-all duration-300',
                      engine.result.correct
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold flex items-center gap-2">
                        {engine.result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                        {engine.result.correct
                          ? isAlreadyCompleted
                            ? '¡Excelente! +0 XP (Repaso)'
                            : `¡Excelente! +${engine.result.xp} XP`
                          : 'Respuesta incorrecta'}
                      </p>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-20 overflow-y-auto pr-1">
                      <MarkdownContent content={engine.result.feedback} />
                    </div>
                    {engine.result.hint ? (
                      <div className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <strong className="font-bold text-amber-300 mr-1">Pista:</strong>
                          <MarkdownContent content={engine.result.hint} inline />
                        </div>
                      </div>
                    ) : null}
                    <div className="flex gap-2.5 pt-0.5">
                      {!engine.result.correct ? (
                        <button
                          type="button"
                          onClick={engine.resetSelection}
                          className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-t border-slate-600 border-b-4 border-slate-950 bg-slate-800 px-4 text-xs font-mono font-bold text-slate-200 shadow-[0_4px_0_#020617] hover:border-slate-500 hover:bg-slate-750 hover:text-white active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
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
                          'group relative inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.45)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
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

                {/* Pie de navegación libre entre lecciones independientes */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                  <button
                    type="button"
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ← Lección anterior
                  </button>
                  <span className="text-[11px] text-slate-500">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
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
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/**
 * Ronda de Repaso Final de Sección (EPIC-5 LESS-04):
 * Presenta las preguntas falladas durante la sección con sus opciones barajadas,
 * otorgando +2 XP de recuperación antes de pasar al Quiz de cierre.
 */
function ReviewMode({
  exercises,
  sectionTitle,
  courseTitle,
  onFinishReview,
}: {
  exercises: ContentExercise[];
  sectionTitle: string;
  courseTitle?: string;
  onFinishReview: () => void;
}) {
  const shuffledReviewExercises = useMemo(
    () =>
      exercises.map((ex, idx) => ({
        ...ex,
        answers: ex.answers ? shuffled(ex.answers, idx * 13 + 19) : [],
      })),
    [exercises]
  );

  const engine = useLessonEngine(shuffledReviewExercises, 99);
  const answered = engine.index;
  const total = engine.total;

  useEffect(() => {
    if (engine.done) {
      onFinishReview();
    }
  }, [engine.done, onFinishReview]);

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
        if (engine.result.correct) {
          engine.next();
        } else {
          engine.resetSelection();
        }
      }
    },
    isSubmitted: Boolean(engine.result),
    canSubmit: Boolean(!engine.result && engine.selected.length > 0),
  });

  return (
    <div className="relative isolate h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      <header className="w-full shrink-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xl">
        <div className="w-full max-w-5xl mx-auto space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">{courseTitle ?? 'Curso'}</span>
              <span className="text-slate-600">›</span>
              <span className="text-amber-400 font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <ArrowsClockwise className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>Ronda de Repaso · {sectionTitle}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-amber-300 tabular-nums bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                {String(Math.min(answered + 1, total)).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
              style={{ width: `${(answered / Math.max(1, total)) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full p-2.5 sm:p-4 lg:p-6 flex items-center justify-center overflow-hidden">
        {engine.current ? (
          <div className="w-full max-w-4xl h-full max-h-[86vh] rounded-2xl border border-amber-500/30 bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="shrink-0 space-y-3 pb-2.5 border-b border-slate-800/80">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 sm:p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-amber-200 font-semibold">
                  <ArrowsClockwise className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>¡Casi listo! Vamos a repasar los conceptos que te desafiaron</span>
                </div>
                <span className="shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  +2 XP recuperación
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Repaso Focalizado · {getExerciseTypeLabel(engine.current.type)}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Progreso {answered + 1} de {total}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 py-3 pr-1 sm:pr-2">
              <div className="text-base sm:text-xl font-bold text-white leading-snug">
                <MarkdownContent content={engine.current.prompt} inline />
              </div>

              <QuestionRenderer
                exercise={engine.current}
                selectedIds={engine.selected}
                onToggle={engine.toggle}
                onCustomChange={engine.setCustomAnswer}
                disabled={Boolean(engine.result)}
                pressedIndex={pressedIndex}
              />
            </div>

            <div className="shrink-0 pt-2 border-t border-slate-800/80">
              {!engine.result ? (
                <button
                  type="button"
                  onClick={() => {
                    engine.check();
                  }}
                  disabled={engine.selected.length === 0}
                  className={cn(
                    'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed select-none',
                    pressedAction === 'submit' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
                  )}
                >
                  <Code aria-hidden="true" className="w-4 h-4" />
                  <span>C O M P R O B A R</span>
                </button>
              ) : (
                <div
                  role={engine.result.correct ? 'status' : 'alert'}
                  className={cn(
                    'rounded-xl border p-3.5 space-y-2.5 transition-all duration-300',
                    engine.result.correct
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  )}
                >
                  <p className="text-sm font-bold flex items-center gap-2">
                    {engine.result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                    {engine.result.correct
                      ? '¡Concepto dominado! +2 XP de recuperación'
                      : 'Todavía no. Revisa la pista e inténtalo de nuevo.'}
                  </p>
                  {engine.result.hint ? (
                    <div className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="font-bold text-amber-300 mr-1">Pista:</strong>
                        <MarkdownContent content={engine.result.hint} inline />
                      </div>
                    </div>
                  ) : null}
                  {engine.result.correct ? (
                    <button
                      type="button"
                      onClick={() => engine.next()}
                      className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 hover:brightness-110 transition-all cursor-pointer"
                    >
                      <span>CONTINUAR</span>
                      <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={engine.resetSelection}
                      className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
                      <span>REINTENTAR</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function QuizMode({
  bank,
  sectionTitle,
  courseTitle,
  isBoss,
  onFinish,
}: {
  bank: ContentExercise[];
  sectionTitle: string;
  courseTitle?: string;
  isBoss?: boolean;
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
      <div className="relative isolate h-screen max-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center overflow-hidden">
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
    <div className="relative isolate h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      <header className="w-full shrink-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xl">
        <div className="w-full max-w-5xl mx-auto space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">{courseTitle ?? 'Curso'}</span>
              <span className="text-slate-600">›</span>
              <span className="text-orange-400 font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                {isBoss && <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />}
                <span>Quiz · {sectionTitle}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1-4 · Enter</span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                {String(Math.min(answered + 1, total)).padStart(2, '0')}/{String(total).padStart(2, '0')}
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

      <main className="flex-1 min-h-0 w-full p-2.5 sm:p-4 lg:p-6 flex items-center justify-center overflow-hidden">
        {engine.current ? (
          <div className="w-full max-w-4xl h-full max-h-[86vh] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="shrink-0 flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Pregunta del Quiz · {getExerciseTypeLabel(engine.current.type)}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                Progreso {answered + 1} de {total}
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 py-3 pr-1 sm:pr-2">
              <div className="text-base sm:text-xl font-bold text-white leading-snug">
                <MarkdownContent content={engine.current.prompt} inline />
              </div>

              <QuestionRenderer
                exercise={engine.current}
                selectedIds={engine.selected}
                onToggle={engine.toggle}
                onCustomChange={engine.setCustomAnswer}
                disabled={Boolean(engine.result)}
                pressedIndex={pressedIndex}
              />
            </div>

            <div className="shrink-0 pt-2.5 border-t border-slate-800/80">
              {!engine.result ? (
                <button
                  type="button"
                  onClick={() => engine.check()}
                  disabled={engine.selected.length === 0}
                  className={cn(
                    'group relative inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.25em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
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
                    'rounded-xl border p-3.5 space-y-2.5 transition-all duration-300',
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
                      'group relative inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.45)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none select-none',
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


