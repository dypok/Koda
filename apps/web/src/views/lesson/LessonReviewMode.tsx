'use client';

import React, { useMemo, useEffect } from 'react';
import {
  Check,
  ArrowCounterClockwise,
  Code,
  Lightbulb,
  ArrowsClockwise,
  ArrowRight,
} from '@phosphor-icons/react';
import { ContentExercise, shuffled } from '@/lib/content';
import { QuestionRenderer, getExerciseTypeLabel } from './QuestionRenderer';
import { useLessonEngine } from './useLessonEngine';
import { useLessonKeyboardShortcuts } from '@/hooks/useLessonKeyboardShortcuts';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { cn } from '@/lib/utils';

export interface LessonReviewModeProps {
  exercises: ContentExercise[];
  sectionTitle: string;
  courseTitle?: string;
  onFinishReview: () => void;
}

/**
 * Ronda de Repaso Final de Sección (EPIC-5 LESS-04):
 * Presenta las preguntas falladas durante la sección con sus opciones barajadas,
 * otorgando +2 XP de recuperación antes de pasar al Quiz de cierre.
 */
export const LessonReviewMode: React.FC<LessonReviewModeProps> = ({
  exercises,
  sectionTitle,
  courseTitle,
  onFinishReview,
}) => {
  const shuffledReviewExercises = useMemo(
    () =>
      exercises.map((ex, idx) => ({
        ...ex,
        answers: ex.answers ? shuffled(ex.answers, idx * 13 + 19) : [],
      })),
    [exercises]
  );

  const engine = useLessonEngine(shuffledReviewExercises, 99);
  const answered = engine.index;
  const total = engine.total;

  useEffect(() => {
    if (engine.done) {
      onFinishReview();
    }
  }, [engine.done, onFinishReview]);

  const { pressedIndex, pressedAction } = useLessonKeyboardShortcuts({
    optionsCount: engine.current?.answers?.length ?? 0,
    onSelectOption: (idx) => {
      const opt = engine.current?.answers[idx];
      if (opt && !engine.result) engine.toggle(opt.id);
    },
    onSubmit: () => {
      if (!engine.result && engine.selected.length > 0) engine.check();
    },
    onNext: () => {
      if (engine.result) {
        if (engine.result.correct) {
          engine.next();
        } else {
          engine.resetSelection();
        }
      }
    },
    isSubmitted: Boolean(engine.result),
    canSubmit: Boolean(!engine.result && engine.selected.length > 0),
  });

  return (
    <div className="relative isolate h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      <header className="w-full shrink-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xl">
        <div className="w-full max-w-5xl mx-auto space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">{courseTitle ?? 'Curso'}</span>
              <span className="text-slate-600">›</span>
              <span className="text-amber-400 font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <ArrowsClockwise className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>Ronda de Repaso · {sectionTitle}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-amber-300 tabular-nums bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                {String(Math.min(answered + 1, total)).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
              style={{ width: `${(answered / Math.max(1, total)) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full p-2.5 sm:p-4 lg:p-6 flex items-center justify-center overflow-hidden">
        {engine.current ? (
          <div className="w-full max-w-4xl h-full max-h-[86vh] rounded-2xl border border-amber-500/30 bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="shrink-0 space-y-3 pb-2.5 border-b border-slate-800/80">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 sm:p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-amber-200 font-semibold">
                  <ArrowsClockwise className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>¡Casi listo! Vamos a repasar los conceptos que te desafiaron</span>
                </div>
                <span className="shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  +2 XP recuperación
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Repaso Focalizado · {getExerciseTypeLabel(engine.current.type)}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Progreso {answered + 1} de {total}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 py-3 pr-1 sm:pr-2">
              <div className="text-base sm:text-xl font-bold text-white leading-snug">
                <MarkdownContent content={engine.current.prompt} inline />
              </div>

              <QuestionRenderer
                exercise={engine.current}
                selectedIds={engine.selected}
                onToggle={engine.toggle}
                onCustomChange={engine.setCustomAnswer}
                disabled={Boolean(engine.result)}
                pressedIndex={pressedIndex}
              />
            </div>

            <div className="shrink-0 pt-2 border-t border-slate-800/80">
              {!engine.result ? (
                <button
                  type="button"
                  onClick={() => {
                    engine.check();
                  }}
                  disabled={engine.selected.length === 0}
                  className={cn(
                    'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed select-none',
                    pressedAction === 'submit' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
                  )}
                >
                  <Code aria-hidden="true" className="w-4 h-4" />
                  <span>C O M P R O B A R</span>
                </button>
              ) : (
                <div
                  role={engine.result.correct ? 'status' : 'alert'}
                  className={cn(
                    'rounded-xl border p-3.5 space-y-2.5 transition-all duration-300',
                    engine.result.correct
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  )}
                >
                  <p className="text-sm font-bold flex items-center gap-2">
                    {engine.result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                    {engine.result.correct
                      ? '¡Concepto dominado! +2 XP de recuperación'
                      : 'Todavía no. Revisa la pista e inténtalo de nuevo.'}
                  </p>
                  {engine.result.hint ? (
                    <div className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="font-bold text-amber-300 mr-1">Pista:</strong>
                        <MarkdownContent content={engine.result.hint} inline />
                      </div>
                    </div>
                  ) : null}
                  {engine.result.correct ? (
                    <button
                      type="button"
                      onClick={() => engine.next()}
                      className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 hover:brightness-110 transition-all cursor-pointer"
                    >
                      <span>CONTINUAR</span>
                      <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={engine.resetSelection}
                      className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
                      <span>REINTENTAR</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
