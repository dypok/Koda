'use client';

import React from 'react';
import { Star, Sparkle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface StarRatingDisplayProps {
  correctCount: number;
  totalCount: number;
  xpEarned?: number;
  className?: string;
}

/**
 * Calcula las estrellas obtenidas según el porcentaje de aciertos (EPIC-4 LEARN-04):
 * - 100%       -> 3 estrellas
 * - 80% - 99%  -> 2 estrellas
 * - 70% - 79%  -> 1 estrella
 * - < 70%      -> 0 estrellas (no aprobado)
 */
export function calculateStarsFromAccuracy(correctCount: number, totalCount: number): 0 | 1 | 2 | 3 {
  if (totalCount <= 0) return 0;
  const ratio = correctCount / totalCount;
  if (ratio >= 0.999) return 3;
  if (ratio >= 0.8) return 2;
  if (ratio >= 0.7) return 1;
  return 0;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  correctCount,
  totalCount,
  xpEarned = 10,
  className,
}) => {
  const stars = calculateStarsFromAccuracy(correctCount, totalCount);
  const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const tierLabel =
    stars === 3
      ? '¡Maestría Perfecta!'
      : stars === 2
      ? '¡Gran Dominio Técnico!'
      : stars === 1
      ? '¡Sección Superada!'
      : 'Necesitas al menos 70% para acreditar estrellas';

  return (
    <div
      aria-label={`Calificación: ${stars} de 3 estrellas (${accuracyPct}% de precisión)`}
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl px-8 py-6 shadow-2xl',
        className
      )}
    >
      {/* Trío de Estrellas con elevación central */}
      <div className="flex items-end justify-center gap-4 pt-2">
        {[1, 2, 3].map((starIndex) => {
          const earned = starIndex <= stars;
          const isCenter = starIndex === 2;
          return (
            <div
              key={starIndex}
              style={{ animationDelay: `${(starIndex - 1) * 140}ms` }}
              className={cn(
                'relative flex items-center justify-center rounded-2xl border transition-all duration-500',
                isCenter ? 'w-16 h-16 -translate-y-2' : 'w-14 h-14',
                earned
                  ? 'border-amber-300/80 bg-gradient-to-b from-amber-400/25 to-orange-500/20 text-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.45)] scale-105'
                  : 'border-slate-800 bg-slate-950/70 text-slate-700 scale-95'
              )}
            >
              {earned ? (
                <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-md animate-pulse pointer-events-none" />
              ) : null}
              <Star
                weight={earned ? 'fill' : 'regular'}
                className={cn(
                  'relative transition-transform duration-300',
                  isCenter ? 'w-9 h-9' : 'w-7 h-7',
                  earned ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'text-slate-700'
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Etiqueta de rango y métricas */}
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
          <Sparkle weight="fill" className="w-3.5 h-3.5 text-orange-400" />
          <span>{tierLabel}</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
          <span>
            Precisión: <strong className="text-white">{accuracyPct}%</strong> ({correctCount}/{totalCount})
          </span>
          {stars > 0 ? (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">+{xpEarned} XP</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StarRatingDisplay;
