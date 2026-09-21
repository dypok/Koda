'use client';

import React from 'react';
import Image from 'next/image';
import { WipeButton } from '@/components/ui/wipe-button';
import { DiagnosticResultResponse } from '@/services/learning/diagnostic.service';

interface DiagnosticResultModalProps {
  result: DiagnosticResultResponse;
  onAcceptRecommendation: (moduleId: string) => void;
  onStartFromBeginning: () => void;
}

export function DiagnosticResultModal({
  result,
  onAcceptRecommendation,
  onStartFromBeginning,
}: DiagnosticResultModalProps) {
  const isAdvanced = result.recommendedModuleOrder > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden font-mono text-slate-100">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header con Mascota */}
        <div className="relative z-10 text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/brand/koda-mascot-cartoon-2d.svg"
              alt="Mascota Koda"
              fill
              className="object-contain animate-bounce duration-1000"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>Diagnóstico Completado</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {isAdvanced
              ? `¡Excelente nivel! Saltas a ${result.recommendedModuleCode}`
              : '¡Punto de partida calibrado!'}
          </h2>

          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {result.justification}
          </p>
        </div>

        {/* Tarjeta de Métricas */}
        <div className="relative z-10 my-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-800/60 pb-4">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Puntaje Global</div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                {result.overallScore}%
              </div>
              <div className="text-[10px] text-slate-500">
                {result.totalCorrect} de {result.totalQuestions} aciertos
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Módulo Sugerido</div>
              <div className="text-lg font-black text-emerald-400 mt-1 truncate px-1">
                {result.recommendedModuleCode}: {result.recommendedModuleTitle}
              </div>
              <div className="text-[10px] text-slate-500">
                {isAdvanced ? 'Módulos previos exonerados' : 'Ruta desde el inicio'}
              </div>
            </div>
          </div>

          {/* Desglose por bloques pedagógicos */}
          <div className="space-y-2.5">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Desempeño por Bloques Curriculares:
            </div>

            {result.blockScores.map((block) => (
              <div key={block.blockId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className={block.isPassed ? 'text-emerald-400' : 'text-amber-400'}>
                      {block.isPassed ? '✓' : '○'}
                    </span>
                    {block.name} ({block.modulesCovered.join(', ')})
                  </span>
                  <span className="font-bold text-slate-300">
                    {block.correctAnswers}/{block.totalQuestions} ({Math.round(block.scorePercentage)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
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

          {/* Módulos exonerados con 3 estrellas */}
          {result.unlockedModules.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-xs text-amber-300/90">
              <span className="text-base">⭐⭐⭐</span>
              <span>
                Módulos acreditados ({result.unlockedModules.join(', ')}) con 3 estrellas de maestría.
              </span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="relative z-10 space-y-2.5 pt-2">
          <WipeButton
            onClick={() => onAcceptRecommendation(result.recommendedModuleId)}
            className="w-full justify-center py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider"
          >
            {isAdvanced
              ? `Aceptar recomendación (${result.recommendedModuleCode})`
              : 'Comenzar mi ruta'}
          </WipeButton>

          {isAdvanced && (
            <button
              type="button"
              onClick={onStartFromBeginning}
              className="w-full text-center py-2.5 text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Prefiero repasar y empezar desde el inicio (Módulo 01)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
