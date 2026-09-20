'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DiagnosticService,
  DiagnosticQuestionItem,
  DiagnosticResultResponse,
} from '@/services/learning/diagnostic.service';
import { DiagnosticResultModal } from './DiagnosticResultModal';
import { WipeButton } from '@/components/ui/wipe-button';

interface DiagnosticTestModalProps {
  isOpen: boolean;
  declaredLevel: string;
  languageSlug?: string;
  userToken?: string;
  isMandatory?: boolean;
  onClose: () => void;
  onComplete: (result: DiagnosticResultResponse) => void;
  onSkip?: () => void;
}

export function DiagnosticTestModal({
  isOpen,
  declaredLevel,
  languageSlug = 'python',
  userToken,
  isMandatory = false,
  onClose,
  onComplete,
  onSkip,
}: DiagnosticTestModalProps) {
  const [questions, setQuestions] = useState<DiagnosticQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos formativos
  const [result, setResult] = useState<DiagnosticResultResponse | null>(null);

  // Cargar preguntas calibradas desde la API de NestJS
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    DiagnosticService.getQuestions(languageSlug)
      .then((data) => {
        if (isMounted) {
          setQuestions(data.questions || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'No fue posible cargar el banco de preguntas.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, languageSlug]);

  // Temporizador formativo regresivo
  useEffect(() => {
    if (!isOpen || loading || result || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, loading, result, timeLeft]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = Boolean(selectedOptionId);
  const isLastQuestion = currentIndex === questions.length - 1;

  // Manejador de selección de opción
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

  // Avanzar a la siguiente pregunta
  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  // Retroceder a la pregunta anterior
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Enviar el test para evaluación pedagógica
  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || '',
      }));

      const res = await DiagnosticService.submitDiagnostic(
        {
          declaredLevel,
          languageSlug,
          answers: payloadAnswers,
        },
        userToken
      );

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error al evaluar respuestas del test diagnóstico.');
      setSubmitting(false);
    }
  }, [submitting, questions, answers, declaredLevel, languageSlug, userToken]);

  // Atajos de teclado ergonómicos: 1-4 para opciones, Enter para continuar, Flechas para navegar
  useEffect(() => {
    if (!isOpen || loading || result || !currentQuestion) return;

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
            handleSubmit();
          } else {
            handleNext();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    loading,
    result,
    currentQuestion,
    isAnswered,
    isLastQuestion,
    handleSelectOption,
    handleNext,
    handlePrev,
    handleSubmit,
  ]);

  if (!isOpen) return null;

  // Si ya tenemos resultado evaluado, mostrar el modal de resultados
  if (result) {
    return (
      <DiagnosticResultModal
        result={result}
        onAcceptRecommendation={(modId) => {
          onComplete(result);
          onClose();
        }}
        onStartFromBeginning={() => {
          onComplete({
            ...result,
            recommendedModuleOrder: 1,
            recommendedModuleCode: 'M01',
            recommendedModuleTitle: 'Introducción & Fundamentos',
          });
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] font-mono text-slate-100 overflow-hidden">
        {/* Glow atmosférico */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Barra superior de navegación y progreso */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              {currentQuestion?.moduleCode || 'DIAG'}
            </span>
            <div>
              <div className="text-xs text-slate-400">
                Pregunta {currentIndex + 1} de {questions.length || 12}
              </div>
              <div className="text-[11px] text-slate-500 font-bold truncate max-w-[200px] sm:max-w-xs">
                {currentQuestion?.blockName || 'Evaluación Diagnóstica'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{formattedTime}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
              aria-label="Cerrar test"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Barra de progreso interactiva */}
        <div className="relative z-10 h-1.5 w-full bg-slate-950 mt-3 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / (questions.length || 12)) * 100}%`,
            }}
          />
        </div>

        {/* Contenido principal scrolleable */}
        <div className="relative z-10 my-6 overflow-y-auto pr-1 space-y-6 flex-1">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Cargando preguntas calibradas...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          ) : currentQuestion ? (
            <div className="space-y-5">
              {/* Enunciado */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-amber-400/80 font-bold">
                  {currentQuestion.moduleTitle}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Fragmento de código si existe */}
              {currentQuestion.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 sm:p-4 font-mono text-xs sm:text-sm text-amber-200 overflow-x-auto shadow-inner">
                  <pre className="m-0 leading-relaxed">{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* Opciones de respuesta */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-sans leading-normal">{opt.text}</span>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500'
                            : 'border-slate-700'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Barra inferior de controles */}
        <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0 || loading || submitting}
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>

            {isMandatory ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300">
                ⚡ Test Obligatorio
              </span>
            ) : onSkip ? (
              <button
                type="button"
                onClick={onSkip}
                className="hidden sm:inline-block px-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Omitir test (Módulo 01)
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {isLastQuestion ? (
              <WipeButton
                onClick={handleSubmit}
                disabled={!isAnswered || submitting}
                className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                {submitting ? 'Evaluando...' : 'Finalizar y Calibrar'}
              </WipeButton>
            ) : (
              <WipeButton
                onClick={handleNext}
                disabled={!isAnswered || loading}
                className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                Siguiente →
              </WipeButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
