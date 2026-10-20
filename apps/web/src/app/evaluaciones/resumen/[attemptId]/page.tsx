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

  const [certError, setCertError] = useState<string | null>(null);

  const handleIssueCertificate = async () => {
    setIsIssuingCert(true);
    setCertError(null);
    try {
      const cert = await EvaluationService.issueCertificate('python');
      setCertData(cert);
    } catch (err: any) {
      console.error('Error al emitir certificado:', err);
      setCertError('Error al generar el certificado: ' + (err?.message || 'Intente nuevamente'));
    } finally {
      setIsIssuingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center p-8">
        <div className="text-center font-mono text-sm text-amber-400 animate-pulse">CARGANDO REVISIÓN DEL INTENTO...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="text-rose-400 font-semibold mb-3">Intento no encontrado</div>
          <p className="text-sm text-slate-400 mb-6">No se pudieron encontrar los datos para este intento de evaluación.</p>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 bg-orange-500 text-slate-950 rounded-xl hover:brightness-110 transition font-bold text-sm cursor-pointer"
          >
            Ir al Panel Principal
          </button>
        </div>
      </div>
    );
  }

  const { passed, score, details = [] } = summary;
  const correctCount = details.filter((d) => d.is_correct).length;
  const incorrectCount = details.length - correctCount;

  const filteredDetails = details.filter((d) => {
    if (filter === 'correct') return d.is_correct;
    if (filter === 'incorrect') return !d.is_correct;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`rounded-2xl p-8 text-center mb-8 text-white shadow-xl border ${
            passed
              ? 'bg-emerald-950/60 border-emerald-500/40'
              : 'bg-rose-950/60 border-rose-500/40'
          }`}
        >
          <div className="flex justify-center mb-3">
            <KodaMascot
              state={passed ? 'streak_active' : 'sad'}
              size={96}
              animate={passed ? 'bounce' : 'none'}
              glow
            />
          </div>
          <h1 className="text-3xl font-display font-extrabold mb-2">
            {passed ? '¡Evaluación Aprobada!' : 'Evaluación Reprobada'}
          </h1>
          <p className="text-xl font-mono font-bold text-amber-300">
            Puntuación Obtenida: {score.toFixed(1)}%
          </p>
          {passed && (
            <p className="text-sm mt-2 text-emerald-200">
              Has demostrado dominio sobre los conceptos evaluados.
            </p>
          )}
        </div>

        {passed && (
          <div className="mb-8 p-6 bg-slate-900/80 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl">
                <Certificate weight="duotone" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Certificado de Finalización Koda</h3>
                <p className="text-xs text-slate-400">Generado con firma criptográfica y resguardado en almacenamiento seguro.</p>
                {certError && <p className="text-xs text-rose-400 mt-1">{certError}</p>}
              </div>
            </div>
            <div>
              {certData ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/verificar/${certData.code || certData.verificationCode}`)}
                    className="px-4 py-2 bg-orange-500 text-slate-950 text-xs font-bold rounded-xl hover:brightness-110 transition cursor-pointer"
                  >
                    Ver Certificado
                  </button>
                  <a
                    href={`/api/v1/certificates/${certData.code || certData.verificationCode}/pdf`}
                    download
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition flex items-center gap-1.5"
                  >
                    <DownloadSimple weight="bold" className="w-3.5 h-3.5" /> PDF
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleIssueCertificate}
                  disabled={isIssuingCert}
                  className="px-5 py-2.5 bg-orange-500 text-slate-950 text-xs font-bold rounded-xl hover:brightness-110 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
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
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-orange-500 text-slate-950'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Todas ({details.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              filter === 'correct'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
            }`}
          >
            Aciertos ({correctCount})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              filter === 'incorrect'
                ? 'bg-rose-500 text-white'
                : 'bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40'
            }`}
          >
            Por Mejorar ({incorrectCount})
          </button>
        </div>

        <div className="space-y-4">
          {filteredDetails.map((item, i) => (
            <div
              key={item.question_id || i}
              className={`p-6 bg-slate-900/70 border border-slate-800 border-l-4 rounded-xl shadow-lg ${
                item.is_correct ? 'border-l-emerald-500' : 'border-l-rose-500'
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className="mt-0.5">
                  {item.is_correct ? (
                    <CheckCircle weight="fill" className="text-emerald-400 w-6 h-6" />
                  ) : (
                    <XCircle weight="fill" className="text-rose-400 w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-3">{item.prompt}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Tu respuesta:</div>
                      <div className={`text-sm font-medium ${item.is_correct ? 'text-emerald-300' : 'text-rose-400 line-through'}`}>
                        {item.user_answer || item.user_response?.join(', ') || '(Sin responder)'}
                      </div>
                    </div>

                    {!item.is_correct && item.correct_answer && (
                      <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                        <div className="text-xs font-semibold text-emerald-400 mb-1">Respuesta correcta:</div>
                        <div className="text-sm font-medium text-emerald-200">
                          {Array.isArray(item.correct_answer) ? item.correct_answer.join(', ') : item.correct_answer}
                        </div>
                      </div>
                    )}
                  </div>

                  {(item.explanation || item.feedback_text) && (
                    <div className="bg-cyan-950/30 p-3.5 rounded-lg border border-cyan-500/25">
                      <div className="text-xs font-semibold text-cyan-300 mb-1">Feedback formativo:</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
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
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-slate-950 rounded-xl font-mono text-xs font-black tracking-wider hover:brightness-110 transition shadow-lg cursor-pointer"
            onClick={() => router.push('/')}
          >
            <span>{passed ? 'CONTINUAR AL SIGUIENTE MÓDULO' : 'REPASAR CONCEPTOS CLAVE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
