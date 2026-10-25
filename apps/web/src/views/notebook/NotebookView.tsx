'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Sparkle,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import { useNotebookStore } from '@/stores/notebook.store';
import { MistakeCard } from './MistakeCard';
import { MistakeRemediationModal } from './MistakeRemediationModal';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';

export const NotebookView: React.FC = () => {
  const {
    mistakes,
    isLoading,
    filter,
    setFilter,
    fetchMistakes,
    activeMistake,
    openRemediation,
    closeRemediation,
    getPendingCount,
    getDueTodayCount,
    getXpRecoveredTotal,
  } = useNotebookStore();

  useEffect(() => {
    fetchMistakes();
  }, [fetchMistakes]);

  const pendingCount = getPendingCount();
  const dueTodayCount = getDueTodayCount();
  const xpRecovered = getXpRecoveredTotal();

  const filteredMistakes = mistakes.filter((m) => {
    if (m.is_resolved) return false;
    if (filter === 'due') {
      if (!m.next_review_at) return true;
      return new Date(m.next_review_at) <= new Date();
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Fondo estelar sutil */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <OrbitFieldBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabecera superior con navegación */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors shadow-sm"
              title="Volver al Roadmap"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <BookOpen className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-display">
                  Cuaderno de Errores
                </h1>
                <p className="text-xs font-mono text-slate-400">
                  Repaso adaptativo SuperMemo SM-2 · Remediar otorga +5 XP
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchMistakes()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-mono font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowsClockwise className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </header>

        {/* Tarjetas resumen de métricas */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <WarningCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Errores Pendientes
              </span>
              <p className="text-xl font-black text-white font-mono">{pendingCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Repaso Sugerido Hoy
              </span>
              <p className="text-xl font-black text-amber-300 font-mono">{dueTodayCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Sparkle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                XP Recuperado
              </span>
              <p className="text-xl font-black text-emerald-400 font-mono">+{xpRecovered} XP</p>
            </div>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todos los errores ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter('due')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                filter === 'due'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Prioridad SM-2 Hoy ({dueTodayCount})
            </button>
          </div>
        </div>

        {/* Lista de Tarjetas o Estado Vacío */}
        <div className="mt-6">
          {isLoading && mistakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-amber-400 animate-spin" />
              <p className="font-mono text-xs text-amber-300 tracking-wider">
                Consultando cuaderno de errores...
              </p>
            </div>
          ) : filteredMistakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-900/40 py-16 px-6 text-center backdrop-blur-xl">
              <div className="relative mb-4 h-24 w-24">
                <Image
                  src="/brand/koda-mascot-cartoon-2d.svg"
                  alt="Mascota Koda"
                  fill
                  className="object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                />
              </div>
              <h2 className="text-lg font-bold text-white">¡Tu cuaderno de errores está limpio!</h2>
              <p className="mt-2 max-w-md text-xs text-slate-400 leading-relaxed font-sans">
                {filter === 'due'
                  ? 'No tienes repasos programados para el día de hoy según el algoritmo SM-2.'
                  : 'No tienes retos pendientes por remediar. Cada vez que falles un ejercicio en lecciones o quizzes, se registrará aquí para que puedas repasarlo y ganar +5 XP.'}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-mono text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Volver al Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filteredMistakes.map((mistake) => (
                  <motion.div
                    key={mistake.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MistakeCard mistake={mistake} onRemediate={openRemediation} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modal de remediación rápida */}
      <MistakeRemediationModal mistake={activeMistake} onClose={closeRemediation} />
    </div>
  );
};
