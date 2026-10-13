'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Terminal,
  Code,
  Cpu,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Lightning,
  CheckCircle,
} from '@phosphor-icons/react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { KodaLogoSvg } from '@/components/landing/KodaLogoSvg';
import { WipeButton } from '@/components/ui/wipe-button';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';
import {
  DiagnosticService,
  DiagnosticQuestionItem,
  DiagnosticResultResponse,
} from '@/services/learning/diagnostic.service';
import { AuthService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

interface LevelOption {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: typeof Terminal;
  tags: string[];
  isBeginner: boolean;
  requiresDiagnostic: boolean;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: 'beginner',
    title: 'Principiante Absoluto',
    subtitle: 'Primera vez escribiendo código. Comenzarás desde la sintaxis básica, variables y salida en consola con retroalimentación inmediata.',
    badge: 'Módulo 01 · Fundamentos',
    icon: Terminal,
    tags: ['variables', 'print()', 'tipos de datos', 'operadores'],
    isBeginner: true,
    requiresDiagnostic: false,
  },
  {
    id: 'elementary',
    title: 'Conocimientos Básicos',
    subtitle: 'Conozco la sintaxis general, tipos de datos y operadores, pero quiero consolidar la lógica con retos estructurados.',
    badge: 'Módulos 01 a 03 · Sintaxis & Tipos',
    icon: Code,
    tags: ['conversión de tipos', 'operadores lógicos', 'strings', 'expresiones'],
    isBeginner: false,
    requiresDiagnostic: true,
  },
  {
    id: 'intermediate',
    title: 'Intermedio / Práctica Previa',
    subtitle: 'Domino condicionales if/else, bucles for/while, definición de funciones modulares y colecciones de datos.',
    badge: 'Módulos 04 a 06 · Control & Modularidad',
    icon: Cpu,
    tags: ['condicionales', 'bucles for/while', 'funciones def', 'colecciones'],
    isBeginner: false,
    requiresDiagnostic: true,
  },
  {
    id: 'advanced',
    title: 'Avanzado / Profesional',
    subtitle: 'Experiencia previa programando en otros lenguajes o en proyectos reales. Deseo validar conocimientos y saltar directo a desafíos complejos.',
    badge: 'Módulo 07+ · Algoritmos & Proyectos',
    icon: Sparkle,
    tags: ['algoritmos', 'estructuras de datos', 'modularidad', 'optimización'],
    isBeginner: false,
    requiresDiagnostic: true,
  },
];

type OnboardingViewMode = 'level_select' | 'diagnostic_test' | 'diagnostic_result';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, token, hasHydrated, initAuth, updateUserProfile } = useAuthStore();

  const [viewMode, setViewMode] = useState<OnboardingViewMode>('level_select');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('beginner');
  const [submittingOnboarding, setSubmittingOnboarding] = useState(false);

  // Diagnostic Test States
  const [questions, setQuestions] = useState<DiagnosticQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluatingTest, setEvaluatingTest] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResultResponse | null>(null);

  // Inicializar estado de autenticación desde almacenamiento local
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Guard: si el usuario ya completó el onboarding, redirigir a /
  useEffect(() => {
    if (hasHydrated && user?.onboardingCompleted) {
      router.replace('/');
      const fallbackTimer = setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return () => clearTimeout(fallbackTimer);
    }
  }, [hasHydrated, user?.onboardingCompleted, router]);

  // Sincronización en segundo plano con el backend en caso de sesión con perfil desactualizado
  useEffect(() => {
    if (!hasHydrated || !token) return;
    let isMounted = true;
    AuthService.verifySession(token)
      .then((session) => {
        if (!isMounted) return;
        if (session.onboardingCompleted && !user?.onboardingCompleted) {
          updateUserProfile({ onboardingCompleted: true });
        }
      })
      .catch(() => null);

    return () => {
      isMounted = false;
    };
  }, [hasHydrated, token, user?.onboardingCompleted, updateUserProfile]);

  // Temporizador para el test diagnóstico
  useEffect(() => {
    if (viewMode !== 'diagnostic_test' || loadingQuestions || evaluatingTest || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [viewMode, loadingQuestions, evaluatingTest, timeLeft]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timeLeft]);

  const selectedOption = LEVEL_OPTIONS.find((opt) => opt.id === selectedLevelId) || LEVEL_OPTIONS[0];
  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = Boolean(selectedOptionId);
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;

  // Iniciar la evaluación diagnóstica
  const handleLaunchDiagnostic = async () => {
    setViewMode('diagnostic_test');
    setLoadingQuestions(true);
    setTestError(null);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(15 * 60);

    try {
      const data = await DiagnosticService.getQuestions('python');
      setQuestions(data.questions || []);
    } catch (err: any) {
      setTestError(err?.message || 'No fue posible cargar el banco de preguntas diagnósticas.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Manejar selección de opción
  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    },
    [currentQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Enviar el test para evaluación
  const handleSubmitDiagnostic = useCallback(async () => {
    if (evaluatingTest) return;
    setEvaluatingTest(true);
    setTestError(null);

    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || '',
      }));

      const res = await DiagnosticService.submitDiagnostic(
        {
          declaredLevel: selectedLevelId,
          languageSlug: 'python',
          answers: payloadAnswers,
        },
        token || undefined
      );

      setDiagnosticResult(res);
      setViewMode('diagnostic_result');
    } catch (err: any) {
      setTestError(err?.message || 'Error al procesar la evaluación diagnóstica.');
    } finally {
      setEvaluatingTest(false);
    }
  }, [evaluatingTest, questions, answers, selectedLevelId, token]);

  // Atajos de teclado en el test (1-4, Enter, Flechas)
  useEffect(() => {
    if (viewMode !== 'diagnostic_test' || loadingQuestions || evaluatingTest || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[optionIndex]) {
          handleSelectOption(currentQuestion.options[optionIndex].id);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isAnswered) {
          if (isLastQuestion) {
            void handleSubmitDiagnostic();
          } else {
            handleNextQuestion();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrevQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    viewMode,
    loadingQuestions,
    evaluatingTest,
    currentQuestion,
    isAnswered,
    isLastQuestion,
    handleSelectOption,
    handleNextQuestion,
    handlePrevQuestion,
    handleSubmitDiagnostic,
  ]);

  // Culminar onboarding y comenzar la ruta
  const handleCompleteOnboardingAndStart = async (targetModuleId?: string) => {
    // Si seleccionó un nivel no básico pero no ha rendido el test diagnóstico, forzar inicio de evaluación
    if (selectedLevelId !== 'beginner' && !diagnosticResult) {
      void handleLaunchDiagnostic();
      return;
    }

    setSubmittingOnboarding(true);

    try {
      if (token) {
        await AuthService.completeOnboarding(
          {
            initialLanguageSlug: 'python',
            experienceLevel: selectedLevelId,
            learningStyle: 'hands-on',
            dailyGoalId: 'regular',
            dailyGoalMinutes: 15,
            displayName: user?.fullName,
          },
          token
        ).catch(() => null);
      }

      updateUserProfile({
        onboardingCompleted: true,
        experienceLevel: selectedLevelId,
        initialLanguageSlug: 'python',
      });
    } finally {
      router.push('/');
    }
  };

  // Si aún no está hidratado o si ya completó onboarding, mostrar pantalla de carga
  if (!hasHydrated || user?.onboardingCompleted || submittingOnboarding) {
    return (
      <KodaLoadingScreen
        title={
          user?.onboardingCompleted
            ? 'Redirigiendo a tu ruta...'
            : submittingOnboarding
            ? 'Guardando tus preferencias...'
            : 'Preparando tu ruta de aprendizaje...'
        }
        subtitle={
          user?.onboardingCompleted
            ? 'Ya has completado tu calibración inicial. Ingresando a la plataforma...'
            : submittingOnboarding
            ? 'Configurando módulos iniciales y entorno pedagógico...'
            : 'Verificando tu perfil y preferencias...'
        }
        terminalHint={
          user?.onboardingCompleted
            ? '> onboarding :: cuenta calibrada -> redirigiendo a /'
            : '> auth :: verificando perfil'
        }
      />
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSkyBackground starCount={140} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* VISTA 1: SELECTOR DE NIVEL Y CALIBRACIÓN (PÁGINA COMPLETA)                */}
      {/* ========================================================================= */}
      {viewMode === 'level_select' && (
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full max-w-6xl mx-auto z-10">
          {/* Header Superior de la Página */}
          <header className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <Link href="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105">
              <KodaLogoSvg className="h-9 w-auto" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Python 3.12 · Ruta Oficial</span>
              </div>

              {selectedOption.isBeginner && (
                <button
                  type="button"
                  onClick={() => void handleCompleteOnboardingAndStart('py_mod_01')}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800/60 hover:border-slate-700 bg-slate-900/40 cursor-pointer"
                >
                  <span>Saltar al M01</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </header>

          {/* Hero Central */}
          <main className="my-8 sm:my-12 space-y-8">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                ¿Cuál es tu nivel de experiencia en código?
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                Calibraremos tus desafíos de programación para recomendarte el punto de inicio ideal y evitar que repitas conceptos que ya dominas.
              </p>
            </div>

            {/* Grid de 4 Niveles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {LEVEL_OPTIONS.map((option) => {
                const isSelected = selectedLevelId === option.id;
                const IconComponent = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedLevelId(option.id)}
                    className={`relative p-6 rounded-2xl border text-left transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" weight={isSelected ? 'bold' : 'regular'} />
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" weight="bold" />}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                        {option.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                        {option.subtitle}
                      </p>
                    </div>

                    {/* Tags temáticos de programación */}
                    <div className="mt-5 pt-3 border-t border-slate-800/60 flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-400">
                      {option.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Banner de Acción Inferior */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-2">
                  <Lightning className="w-4 h-4 text-amber-400" weight="fill" />
                  <span>
                    {selectedOption.isBeginner ? 'Ruta de inicio directo' : 'Evaluación diagnóstica'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {selectedOption.isBeginner
                    ? 'Comenzarás desde el Módulo 01 (Fundamentos y Sintaxis) con conceptos esenciales paso a paso y retroalimentación inmediata en consola.'
                    : 'Has seleccionado un nivel con experiencia previa. Responde 12 preguntas para validar tu nivel y calibrar tu punto de partida.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                {selectedOption.isBeginner ? (
                  <WipeButton
                    onClick={() => void handleCompleteOnboardingAndStart('py_mod_01')}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider font-mono justify-center"
                  >
                    Comenzar Ruta desde M01
                  </WipeButton>
                ) : (
                  <WipeButton
                    onClick={handleLaunchDiagnostic}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider font-mono justify-center"
                  >
                    Iniciar test
                  </WipeButton>
                )}
              </div>
            </div>
          </main>

          {/* Footer sutil */}
          <footer className="pt-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500">
            Koda Academy · Plataforma Interactiva de Aprendizaje de Programación
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: EVALUACIÓN DIAGNÓSTICA INTERACTIVA EN PÁGINA COMPLETA            */}
      {/* ========================================================================= */}
      {viewMode === 'diagnostic_test' && (
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full max-w-5xl mx-auto z-10">
          {/* Header del Test */}
          <header className="space-y-4 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMode('level_select')}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a selección de nivel</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>

            {/* Barra de progreso interactiva */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Reto {currentIndex + 1} de {questions.length || 12}
                </span>
                <span className="text-amber-400 font-bold">
                  {currentQuestion?.moduleCode || 'M01'} · {currentQuestion?.blockName || 'Fundamentos'}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{
                    width: `${questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </header>

          {/* Cuerpo Central de la Pregunta */}
          <main className="my-8 space-y-6 flex-1 flex flex-col justify-center">
            {loadingQuestions && (
              <div className="text-center py-16 space-y-3 font-mono">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Cargando banco de preguntas calibradas...</p>
              </div>
            )}

            {testError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {testError}
              </div>
            )}

            {!loadingQuestions && currentQuestion && (
              <div className="space-y-6 max-w-3xl mx-auto w-full">
                {/* Enunciado */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                    {currentQuestion.moduleTitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentQuestion.prompt}
                  </h2>
                </div>

                {/* Snippet de Código si aplica */}
                {currentQuestion.codeSnippet && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-emerald-300 shadow-inner overflow-x-auto relative">
                    <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-slate-900 text-slate-500 text-[10px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block" />
                      <span className="ml-2">terminal — python 3.12</span>
                    </div>
                    <pre className="leading-relaxed">
                      <code>{currentQuestion.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Opciones Interactivas con Atajos */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;
                    const keyNumber = idx + 1;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300'
                                : 'bg-slate-950 text-slate-400 border-slate-800 group-hover:border-slate-700'
                            }`}
                          >
                            {keyNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-sans font-medium">{option.text}</span>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </main>

          {/* Controles de Navegación Inferior */}
          <footer className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior [←]</span>
            </button>

            {isLastQuestion ? (
              <WipeButton
                onClick={() => void handleSubmitDiagnostic()}
                disabled={!isAnswered || evaluatingTest}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-mono"
              >
                {evaluatingTest ? 'Evaluando...' : 'Finalizar y Evaluar [Enter]'}
              </WipeButton>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Siguiente [Enter]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: RESULTADOS DE LA EVALUACIÓN (PÁGINA COMPLETA)                     */}
      {/* ========================================================================= */}
      {viewMode === 'diagnostic_result' && diagnosticResult && (
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full max-w-4xl mx-auto z-10">
          <header className="pb-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <KodaLogoSvg className="h-9 w-auto" />
            </Link>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" weight="fill" />
              <span>Diagnóstico Completado</span>
            </div>
          </header>

          <main className="my-8 sm:my-12 space-y-8 text-center max-w-2xl mx-auto">
            {/* Mascota y Felicitación */}
            <div className="space-y-4">
              <div className="relative w-28 h-28 mx-auto">
                <Image
                  src="/brand/koda-mascot-cartoon-2d.svg"
                  alt="Mascota Koda"
                  fill
                  className="object-contain animate-bounce duration-1000"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {diagnosticResult.recommendedModuleOrder > 1
                  ? `¡Gran nivel! Saltas a ${diagnosticResult.recommendedModuleCode}`
                  : '¡Punto de partida calibrado con éxito!'}
              </h2>

              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                {diagnosticResult.justification}
              </p>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl font-mono">
              <div className="border-r border-slate-800/80 pr-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Aciertos Totales</div>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  {diagnosticResult.totalCorrect} / {diagnosticResult.totalQuestions}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">({diagnosticResult.overallScore}% de precisión)</div>
              </div>

              <div className="pl-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Módulo Recomendado</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                  {diagnosticResult.recommendedModuleCode}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">{diagnosticResult.recommendedModuleTitle}</div>
              </div>
            </div>

            {/* Desglose por bloques curriculares */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left space-y-4 font-mono">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Rendimiento por Bloques de Código:
              </span>

              <div className="space-y-3">
                {diagnosticResult.blockScores.map((block) => (
                  <div key={block.blockId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className={block.isPassed ? 'text-emerald-400' : 'text-amber-400'}>
                          {block.isPassed ? '✓' : '○'}
                        </span>
                        <span>{block.name}</span>
                        <span className="text-slate-500 text-[10px]">({block.modulesCovered.join(', ')})</span>
                      </span>
                      <span className="font-bold text-slate-300">
                        {block.correctAnswers}/{block.totalQuestions} ({Math.round(block.scorePercentage)}%)
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          block.isPassed ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${block.scorePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {diagnosticResult.unlockedModules.length > 0 && (
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-300 font-mono">
                  <span>⭐⭐⭐</span>
                  <span>Módulos ({diagnosticResult.unlockedModules.join(', ')}) acreditados con maestría.</span>
                </div>
              )}
            </div>

            {/* Botones de Culminación */}
            <div className="space-y-3 pt-2">
              <WipeButton
                onClick={() => void handleCompleteOnboardingAndStart(diagnosticResult.recommendedModuleId)}
                className="w-full py-4 text-xs font-bold uppercase tracking-wider font-mono justify-center"
              >
                Comenzar Ruta en {diagnosticResult.recommendedModuleCode}
              </WipeButton>

              {diagnosticResult.recommendedModuleOrder > 1 && (
                <button
                  type="button"
                  onClick={() => void handleCompleteOnboardingAndStart('py_mod_01')}
                  className="text-xs font-mono text-slate-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Prefiero repasar y empezar desde el inicio (Módulo 01)
                </button>
              )}
            </div>
          </main>

          <footer className="pt-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500">
            Koda Academy · Tu progreso y punto de inicio se sincronizan automáticamente
          </footer>
        </div>
      )}
    </div>
  );
}

