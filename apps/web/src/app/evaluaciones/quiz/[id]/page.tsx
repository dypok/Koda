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
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="text-center font-medium text-slate-600 animate-pulse">Cargando Quiz...</div>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="max-w-md mx-auto p-8 mt-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="text-red-500 font-semibold mb-3">{error || 'No hay preguntas disponibles'}</div>
        <p className="text-sm text-slate-500 mb-6">No se pudieron cargar las preguntas del módulo seleccionado.</p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-medium text-sm"
        >
          Volver
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
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

      if (result.passed) {
        alert(`¡Felicidades! Aprobaste con un ${result.score.toFixed(1)}% y ganaste ${result.xp_earned ?? result.xpEarned ?? 25} XP`);
      } else {
        alert(`Obtuviste ${result.score.toFixed(1)}%. Necesitas 70% para aprobar.`);
      }

      if (attemptId) {
        router.push(`/evaluaciones/resumen/${attemptId}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Error al calificar el quiz:', err);
      alert('Error al calificar el quiz: ' + (err?.message || 'Intente nuevamente'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Evaluación</span>
          <h1 className="text-2xl font-bold text-slate-900">Quiz de Módulo</h1>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
      </div>

      <div className="w-full bg-slate-200 h-2.5 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">{currentQ.prompt}</h2>
        {currentQ.code_snippet && (
          <pre className="bg-slate-900 text-green-400 p-4 rounded-xl mb-6 overflow-x-auto text-sm font-mono leading-relaxed">
            {currentQ.code_snippet}
          </pre>
        )}

        <div className="space-y-3">
          {currentQ.options?.map(opt => {
            const isSelected = answers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{opt.text}</span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                  isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          Anterior
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Evaluando...' : 'Enviar Quiz'}
          </button>
        ) : (
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm"
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}
