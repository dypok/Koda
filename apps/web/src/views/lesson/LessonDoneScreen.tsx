'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, ArrowCounterClockwise } from '@phosphor-icons/react';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { StarRatingDisplay } from '@/components/lesson/StarRatingDisplay';

export interface LessonDoneScreenProps {
  quizScore: { ok: number; total: number };
  isAlreadyCompleted: boolean;
  nodeTargetXp: number;
  onRetryQuiz: () => void;
}

export const LessonDoneScreen: React.FC<LessonDoneScreenProps> = ({
  quizScore,
  isAlreadyCompleted,
  nodeTargetXp,
  onRetryQuiz,
}) => {
  const router = useRouter();
  const passed = quizScore.ok / Math.max(1, quizScore.total) >= 0.7;

  // Atajo ergonómico de teclado para la pantalla de sección completada (Enter -> volver a la ruta o reintentar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        if (passed) {
          router.push('/');
        } else {
          onRetryQuiz();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passed, onRetryQuiz, router]);

  return (
    <div className="relative isolate h-screen max-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 px-4 text-center overflow-hidden">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />
      {passed ? (
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_30px_rgba(255,106,0,0.5)] border border-amber-200">
            <Trophy aria-hidden="true" className="w-10 h-10" />
          </div>
        </div>
      ) : null}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
          {passed ? '¡Sección completada!' : 'Casi lo logras'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md">
          Quiz: <span className="font-mono font-bold text-orange-400">{quizScore.ok}/{quizScore.total}</span> aciertos
          {passed
            ? isAlreadyCompleted
              ? ' · +0 XP (Módulo ya dominado)'
              : ` · +${nodeTargetXp} XP de maestría`
            : ' · necesitas 70% de aciertos para avanzar'}
        </p>
      </div>

      {/* Visualización de Estrellas (1⭐ a 3⭐) — EPIC-4 LEARN-04 */}
      <StarRatingDisplay
        correctCount={quizScore.ok}
        totalCount={quizScore.total}
        xpEarned={passed ? 10 : 0}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!passed ? (
          <button
            type="button"
            onClick={onRetryQuiz}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
            <span>REINTENTAR QUIZ</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-orange-600/70 border border-orange-400 text-slate-950 font-bold">↵ Enter</kbd>
          </button>
        ) : null}
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 font-mono text-xs font-bold text-slate-200 hover:border-orange-500/50 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <span>Volver a la ruta</span>
          {passed && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">↵ Enter</kbd>
          )}
        </Link>
      </div>
    </div>
  );
};
