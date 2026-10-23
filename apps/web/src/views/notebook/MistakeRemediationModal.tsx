'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Code,
  ArrowsClockwise,
  WarningCircle,
} from '@phosphor-icons/react';
import type { MistakesNotebookItem } from '@koda/types';
import { useNotebookStore } from '@/stores/notebook.store';

interface MistakeRemediationModalProps {
  mistake: MistakesNotebookItem | null;
  onClose: () => void;
}

export const MistakeRemediationModal: React.FC<MistakeRemediationModalProps> = ({
  mistake,
  onClose,
}) => {
  const { resolveMistake, isResolving } = useNotebookStore();
  const [userSolution, setUserSolution] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (mistake) {
      setUserSolution(mistake.code_context || '');
      setStatus('idle');
      setFeedback(null);
    }
  }, [mistake]);

  if (!mistake) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userSolution.trim()) {
      setStatus('error');
      setFeedback('Ingresa una solución o respuesta para verificar.');
      return;
    }

    try {
      const res = await resolveMistake(mistake.question_id);
      if (res.success) {
        setStatus('success');
        setFeedback('¡Excelente! Has remediado este error y consolidado el concepto.');
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setStatus('error');
      setFeedback(err?.message || 'Hubo un inconveniente al validar. Inténtalo de nuevo.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop desenfocado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Sparkle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Sesión de Remediación SM-2 · +5 XP
                </span>
                <h2 className="text-base font-bold text-white">{mistake.lesson_title}</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Enunciado del Reto */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Pregunta / Desafío</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 leading-relaxed font-sans">
              {mistake.prompt}
            </div>
          </div>

          {/* Formulario de Remediación */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span>Tu Código o Respuesta</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">Corrige el fallo conceptual</span>
              </div>

              <textarea
                value={userSolution}
                onChange={(e) => {
                  setUserSolution(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                disabled={status === 'success' || isResolving}
                rows={4}
                placeholder="Escribe aquí la solución o código corregido..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-cyan-300 placeholder-slate-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/60 transition-all resize-none disabled:opacity-60"
              />
            </div>

            {/* Mensajes de feedback */}
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono font-bold text-emerald-300"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{feedback} · +5 XP Sumados</span>
              </motion.div>
            ) : status === 'error' ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-300"
              >
                <WarningCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{feedback}</span>
              </motion.div>
            ) : null}

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isResolving}
                className="rounded-xl px-4 py-2 font-mono text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isResolving || status === 'success'}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-mono text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:shadow-[0_0_20px_rgba(245,158,11,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:scale-100"
              >
                {isResolving ? (
                  <>
                    <ArrowsClockwise className="w-4 h-4 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-slate-950" />
                    <span>¡Remediado!</span>
                  </>
                ) : (
                  <>
                    <Sparkle className="w-4 h-4 fill-current" />
                    <span>Remediar y Ganar +5 XP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
