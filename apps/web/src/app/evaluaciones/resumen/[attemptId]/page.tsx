'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  EvaluationService,
  AttemptSummaryResponse,
  IssueCertificateResponse,
} from '@/services/learning/evaluation.service';
import { CheckCircle, XCircle, ArrowRight, Certificate, DownloadSimple } from '@phosphor-icons/react';
import { KodaMascot } from '@/components/brand/KodaMascot';

interface AttemptReviewScreenProps {
  params?: Promise<{ attemptId: string }> | { attemptId: string };
}

export default function AttemptReviewScreen(props: AttemptReviewScreenProps) {
  const router = useRouter();
  const routeParams = useParams<{ attemptId: string }>();

  const [resolvedAttemptId, setResolvedAttemptId] = useState<string>(() => routeParams?.attemptId || '');
  const [summary, setSummary] = useState<AttemptSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [isIssuingCert, setIsIssuingCert] = useState(false);
  const [certData, setCertData] = useState<IssueCertificateResponse | null>(null);

  useEffect(() => {
    async function resolveId() {
      if (routeParams?.attemptId) {
        setResolvedAttemptId(routeParams.attemptId);
        return;
      }
      if (props.params) {
        const p = await Promise.resolve(props.params);
        if (p?.attemptId) setResolvedAttemptId(p.attemptId);
      }
    }
    resolveId();
  }, [props.params, routeParams?.attemptId]);

  useEffect(() => {
    if (!resolvedAttemptId) return;

    async function loadSummary() {
      try {
        setLoading(true);
        const data = await EvaluationService.getAttemptSummary(resolvedAttemptId);
        setSummary(data);
      } catch (e) {
        console.error('Error cargando resumen:', e);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [resolvedAttemptId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const handleIssueCertificate = async () => {
    setIsIssuingCert(true);
    try {
      // Usar slug python por defecto si no está especificado
      const cert = await EvaluationService.issueCertificate('python');
      setCertData(cert);
    } catch (err: any) {
      console.error('Error al emitir certificado:', err);
      alert('Error al generar el certificado: ' + (err?.message || 'Intente nuevamente'));
    } finally {
      setIsIssuingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="text-center font-medium text-slate-600 animate-pulse">Cargando revisión del intento...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-md mx-auto p-8 mt-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="text-red-500 font-semibold mb-3">Intento no encontrado</div>
        <p className="text-sm text-slate-500 mb-6">No se pudieron encontrar los datos para este intento de evaluación.</p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-medium text-sm"
        >
          Ir al Panel Principal
        </button>
      </div>
    );
  }

  const { passed, score, details = [] } = summary;
  const correctCount = details.filter(d => d.is_correct).length;
  const incorrectCount = details.length - correctCount;

  const filteredDetails = details.filter(d => {
    if (filter === 'correct') return d.is_correct;
    if (filter === 'incorrect') return !d.is_correct;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className={`rounded-2xl p-8 text-center mb-8 text-white shadow-md ${passed ? 'bg-emerald-600' : 'bg-rose-500'}`}>
        <div className="flex justify-center mb-3">
          <KodaMascot
            state={passed ? 'streak_active' : 'sad'}
            size={96}
            animate={passed ? 'bounce' : 'none'}
            glow
          />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">
          {passed ? '¡Evaluación Aprobada!' : 'Evaluación Reprobada'}
        </h1>
        <p className="text-xl font-medium opacity-95">
          Puntuación Obtenida: {score.toFixed(1)}%
        </p>
        {passed && (
          <p className="text-sm mt-2 text-emerald-100">
            Has demostrado dominio sobre los conceptos evaluados.
          </p>
        )}
      </div>

      {passed && (
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-xl">
              <Certificate weight="duotone" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-950 text-base">Certificado de Finalización Koda</h3>
              <p className="text-xs text-indigo-700">Generado con firma criptográfica y resguardado en almacenamiento seguro.</p>
            </div>
          </div>
          <div>
            {certData ? (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/verificar/${certData.code || certData.verificationCode}`)}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
                >
                  Ver Certificado
                </button>
                <a
                  href={`/api/v1/certificates/${certData.code || certData.verificationCode}/pdf`}
                  download
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <DownloadSimple weight="bold" className="w-3.5 h-3.5" /> PDF
                </a>
              </div>
            ) : (
              <button
                onClick={handleIssueCertificate}
                disabled={isIssuingCert}
                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Certificate weight="bold" className="w-4 h-4" />
                {isIssuingCert ? 'Generando PDF...' : 'Obtener Certificado Oficial'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Todas ({details.length})
        </button>
        <button
          onClick={() => setFilter('correct')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filter === 'correct' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Aciertos ({correctCount})
        </button>
        <button
          onClick={() => setFilter('incorrect')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filter === 'incorrect' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Por Mejorar ({incorrectCount})
        </button>
      </div>

      <div className="space-y-4">
        {filteredDetails.map((item, i) => (
          <div
            key={item.question_id || i}
            className={`p-6 bg-white border border-slate-200 border-l-4 rounded-xl shadow-sm ${
              item.is_correct ? 'border-l-emerald-500' : 'border-l-rose-500'
            }`}
          >
            <div className="flex gap-4 items-start">
              <div className="mt-0.5">
                {item.is_correct ? (
                  <CheckCircle weight="fill" className="text-emerald-500 w-6 h-6" />
                ) : (
                  <XCircle weight="fill" className="text-rose-500 w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800 mb-3">{item.prompt}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 mb-1">Tu respuesta:</div>
                    <div className={`text-sm font-medium ${item.is_correct ? 'text-emerald-700' : 'text-rose-600 line-through'}`}>
                      {item.user_answer || item.user_response?.join(', ') || '(Sin responder)'}
                    </div>
                  </div>

                  {!item.is_correct && item.correct_answer && (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <div className="text-xs font-semibold text-emerald-600 mb-1">Respuesta correcta:</div>
                      <div className="text-sm font-medium text-emerald-800">
                        {Array.isArray(item.correct_answer) ? item.correct_answer.join(', ') : item.correct_answer}
                      </div>
                    </div>
                  )}
                </div>

                {(item.explanation || item.feedback_text) && (
                  <div className="bg-blue-50/80 p-3.5 rounded-lg border border-blue-100">
                    <div className="text-xs font-semibold text-blue-800 mb-1">Feedback formativo:</div>
                    <p className="text-xs text-blue-900 leading-relaxed">
                      {item.explanation || item.feedback_text || 'Revisa la teoría correspondiente a este concepto.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center pb-12">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition shadow-sm"
          onClick={() => router.push('/')}
        >
          <span>{passed ? 'Continuar al siguiente módulo' : 'Repasar conceptos clave'}</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">↵ Enter</kbd>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
