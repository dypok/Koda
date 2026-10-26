'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Check,
  Code,
  Shield,
  Key,
  ArrowRight,
} from '@phosphor-icons/react';
import { ContentExercise } from '@/lib/content';
import { QuestionRenderer, getExerciseTypeLabel } from './QuestionRenderer';
import { useLessonEngine } from './useLessonEngine';
import { useLessonKeyboardShortcuts } from '@/hooks/useLessonKeyboardShortcuts';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { sampleQuiz } from './lesson-workspace.utils';
import { cn } from '@/lib/utils';

export interface LessonQuizModeProps {
  bank: ContentExercise[];
  sectionTitle: string;
  courseTitle?: string;
  isBoss?: boolean;
  onFinish: (ok: number, total: number) => void;
}

export const LessonQuizMode: React.FC<LessonQuizModeProps> = ({
  bank,
  sectionTitle,
  courseTitle,
  isBoss = false,
  onFinish,
}) => {
  const questions = useMemo(
    () => sampleQuiz(bank, sectionTitle.length * 7 + 3),
    [bank, sectionTitle]
  );
  const engine = useLessonEngine(questions, 7);
  const [okCount, setOkCount] = useState(0);
  const answered = engine.index;
  const total = engine.total;

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const hasFinishedRef = useRef(false);
  useEffect(() => {
    if (engine.done && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinishRef.current(okCount, total);
    }
  }, [engine.done, okCount, total]);

  // Hook de atajos de teclado para Quiz
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
        if (engine.result.correct) setOkCount((c) => c + 1);
        engine.next();
      }
    },
    onPrev: () => {
      if (engine.index > 0) {
        engine.prev();
      }
    },
    isSubmitted: Boolean(engine.result),
    canSubmit: Boolean(!engine.result && engine.selected.length > 0),
  });

  if (questions.length === 0) {
    return (
      <div className="relative isolate h-screen max-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center overflow-hidden">
        <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />
        <p className="font-display text-2xl font-bold text-white">Quiz en camino</p>
        <p className="text-sm text-slate-400">Esta sección aún no tiene banco de preguntas.</p>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          Volver a la ruta
        </Link>
      </div>
    );
  }

  return (
    <div className="relative isolate h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      <header className="w-full shrink-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xl">
        <div className="w-full max-w-5xl mx-auto space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">{courseTitle ?? 'Curso'}</span>
              <span className="text-slate-600">›</span>
              <span className="text-orange-400 font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                {isBoss && <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />}
                <span>Quiz · {sectionTitle}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1-4 · Enter</span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                {String(Math.min(answered + 1, total)).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,106,0,0.8)]"
              style={{ width: `${(answered / Math.max(1, total)) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full p-2.5 sm:p-4 lg:p-6 flex items-center justify-center overflow-hidden">
        {engine.current ? (
          <div className="w-full max-w-4xl h-full max-h-[86vh] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="shrink-0 flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Pregunta del Quiz · {getExerciseTypeLabel(engine.current.type)}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                Progreso {answered + 1} de {total}
              </span>
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

            <div className="shrink-0 pt-2.5 border-t border-slate-800/80">
              {!engine.result ? (
                <button
                  type="button"
                  onClick={() => engine.check()}
                  disabled={engine.selected.length === 0}
                  className={cn(
                    'group relative inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.25em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
                    pressedAction === 'submit' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
                  )}
                >
                  <Code aria-hidden="true" className="w-4 h-4" />
                  <span>C O M P R O B A R</span>
                  <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950 group-disabled:opacity-40">
                    Enter ↵
                  </kbd>
                </button>
              ) : (
                <div
                  role={engine.result.correct ? 'status' : 'alert'}
                  className={cn(
                    'rounded-xl border p-3.5 space-y-2.5 transition-all duration-300',
                    engine.result.correct
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-bold flex items-center gap-2',
                      engine.result.correct ? 'text-emerald-300' : 'text-rose-200'
                    )}
                  >
                    {engine.result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                    {engine.result.correct ? '¡Correcto!' : 'Anotado para repaso. Continuemos.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (engine.result?.correct) setOkCount((c) => c + 1);
                      engine.next();
                    }}
                    className={cn(
                      'group relative inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.45)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none select-none',
                      pressedAction === 'next' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-emerald-400'
                    )}
                  >
                    <span>SIGUIENTE PREGUNTA</span>
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950">
                      Enter ↵
                    </kbd>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
