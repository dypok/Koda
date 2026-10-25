'use client';

import React from 'react';
import { WarningCircle, Clock, Sparkle, ArrowRight, Code } from '@phosphor-icons/react';
import type { MistakesNotebookItem } from '@koda/types';

interface MistakeCardProps {
  mistake: MistakesNotebookItem;
  onRemediate: (mistake: MistakesNotebookItem) => void;
}

export const MistakeCard: React.FC<MistakeCardProps> = ({ mistake, onRemediate }) => {
  const isDueToday = !mistake.next_review_at || new Date(mistake.next_review_at) <= new Date();

  const formattedDate = mistake.last_failed_at
    ? new Date(mistake.last_failed_at).toLocaleDateString('es-CO', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-amber-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]">
      {/* Glow de acento superior */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Cabecera de la tarjeta: Módulo y badges de estado */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
              {mistake.module_slug || 'Python'}
            </span>
            {isDueToday ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-[10px] font-mono font-bold text-rose-300 uppercase tracking-wider animate-pulse">
                <Clock className="w-3 h-3" />
                <span>Repasar Hoy</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] font-mono text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>En {mistake.interval_days ?? 1}d</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-400">
            <WarningCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Fallo: {mistake.error_count} {mistake.error_count === 1 ? 'vez' : 'veces'}</span>
          </div>
        </div>

        {/* Título de la lección */}
        <h3 className="mt-3 text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
          {mistake.lesson_title}
        </h3>

        {/* Enunciado del reto o pregunta */}
        <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-3">
          {mistake.prompt || 'Ejercicio interactivo pendiente de consolidación conceptual.'}
        </p>

        {/* Contexto de código si aplica */}
        {mistake.code_context ? (
          <div className="mt-3 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-wider">
              <Code className="w-3 h-3" />
              <span>Código Base</span>
            </div>
            <pre className="text-slate-300">{mistake.code_context}</pre>
          </div>
        ) : null}
      </div>

      {/* Footer con fecha y botón de acción */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          {formattedDate ? `Detectado: ${formattedDate}` : 'Pendiente de remediación'}
        </span>

        <button
          type="button"
          onClick={() => onRemediate(mistake)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:shadow-[0_0_18px_rgba(245,158,11,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkle className="w-3.5 h-3.5 fill-current" />
          <span>Remediar (+5 XP)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
