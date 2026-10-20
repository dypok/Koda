'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EvaluationService, EvaluationQuestion } from '@/services/learning/evaluation.service';

interface QuizPageProps {
  params?: Promise<{ id: string }> | { id: string };
}

export default function QuizPage(props: QuizPageProps) {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  
  // Soporte tanto para useParams() como para props.params
  const [resolvedId, setResolvedId] = useState<string>(() => routeParams?.id || '');

  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveId() {
      if (routeParams?.id) {
        setResolvedId(routeParams.id);
        return;
      }
      if (props.params) {
        const p = await Promise.resolve(props.params);
        if (p?.id) setResolvedId(p.id);
      }
    }
    resolveId();
  }, [props.params, routeParams?.id]);

  useEffect(() => {
    if (!resolvedId) return;

    async function loadQuiz() {
      try {
        setLoading(true);
        setError(null);
        const data = await EvaluationService.getModuleQuiz(resolvedId);
        setQuestions(data.questions || []);
      } catch (err: any) {
        console.error('Error cargando el quiz:', err);
        setError(err?.message || 'Hubo un problema al cargar el quiz');
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [resolvedId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center p-8">
        <div className="text-center font-mono text-sm text-amber-400 animate-pulse">CARGANDO QUIZ...</div>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="text-rose-400 font-semibold mb-3">{error || 'No hay preguntas disponibles'}</div>
          <p className="text-sm text-slate-400 mb-6">No se pudieron cargar las preguntas del módulo seleccionado.</p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-orange-500 text-slate-950 rounded-xl hover:brightness-110 transition font-bold text-sm cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const missing = questions.length - Object.keys(answers).length;
      if (!confirm(`Tienes ${missing} pregunta${missing > 1 ? 's' : ''} sin responder. ¿Estás seguro de enviar el quiz?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await EvaluationService.submitQuizAttempt(resolvedId, answers, 120);
      const attemptId = result.attempt_id || result.attemptId;

      if (attemptId) {
        router.push(`/evaluaciones/resumen/${attemptId}`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Error al calificar el quiz:', err);
      setError('Error al calificar el quiz: ' + (err?.message || 'Intente nuevamente'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">Evaluación</span>
            <h1 className="text-2xl font-display font-bold text-white">Quiz de Módulo</h1>
          </div>
          <div className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
            Pregunta {String(currentIndex + 1).padStart(2, '0')} de {String(questions.length).padStart(2, '0')}
          </div>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">{currentQ.prompt}</h2>
          {currentQ.code_snippet && (
            <pre className="bg-slate-950 border border-slate-800 text-amber-300 p-4 rounded-xl mb-6 overflow-x-auto text-sm font-mono leading-relaxed">
              {currentQ.code_snippet}
            </pre>
          )}

          <div className="space-y-3">
            {currentQ.options?.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all font-medium text-sm flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/15 text-amber-200 shadow-[0_0_15px_rgba(255,106,0,0.15)]'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  <span>{opt.text}</span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ml-3 ${
                      isSelected ? 'border-orange-500 bg-orange-500 text-slate-950 font-bold' : 'border-slate-600'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="px-5 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            ← ANTERIOR
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              className="px-6 py-2.5 bg-orange-500 text-slate-950 font-mono text-xs font-black tracking-wider rounded-xl hover:brightness-110 transition shadow-lg disabled:opacity-50 cursor-pointer"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'EVALUANDO...' : 'ENVIAR QUIZ'}
            </button>
          ) : (
            <button
              className="px-6 py-2.5 bg-orange-500 text-slate-950 font-mono text-xs font-black tracking-wider rounded-xl hover:brightness-110 transition shadow-lg cursor-pointer"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              SIGUIENTE →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
