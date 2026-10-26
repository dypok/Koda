'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ArrowCounterClockwise,
  Code,
  PencilSimple,
  Lightbulb,
} from '@phosphor-icons/react';
import { ContentExercise, ContentLesson } from '@/lib/content';
import { QuestionRenderer, getExerciseTypeLabel } from './QuestionRenderer';
import { EditableBlockType } from '@/components/admin/LessonInSituInspectorModal';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { cn } from '@/lib/utils';
import type { useLessonEngine } from './useLessonEngine';

export interface LessonPracticePanelProps {
  lesson: ContentLesson;
  exercise: ContentExercise | null;
  selectedIds: string[];
  result: ReturnType<typeof useLessonEngine>['result'];
  pressedIndex: number | null;
  pressedAction: string | null;
  isAlreadyCompleted: boolean;
  isLast: boolean;
  isEditMode?: boolean;
  currentIndex: number;
  totalCount: number;
  mobileTab: 'concept' | 'practice';
  onOpenInspector?: (block: EditableBlockType) => void;
  onToggleOption: (id: string) => void;
  onCustomChange?: (val: string | string[]) => void;
  onSubmitAnswer: () => void;
  onResetSelection: () => void;
  onNext: () => void;
  onPrev: () => void;
  onCompleteCurrent?: () => void;
}

export const LessonPracticePanel: React.FC<LessonPracticePanelProps> = ({
  lesson,
  exercise,
  selectedIds,
  result,
  pressedIndex,
  pressedAction,
  isAlreadyCompleted,
  isLast,
  isEditMode = false,
  currentIndex,
  totalCount,
  mobileTab,
  onOpenInspector,
  onToggleOption,
  onCustomChange,
  onSubmitAnswer,
  onResetSelection,
  onNext,
  onPrev,
  onCompleteCurrent,
}) => {
  return (
    <section
      role="tabpanel"
      aria-label="Práctica"
      className={cn(
        mobileTab === 'practice' ? 'flex' : 'hidden lg:flex',
        'h-full min-h-0 flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-3.5 sm:p-5 lg:p-6 shadow-2xl overflow-hidden'
      )}
    >
      {!exercise ? (
        <div className="flex flex-col justify-between h-full min-h-0">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
              <span>Lectura Conceptual</span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Has completado los conceptos y ejemplos de esta lección. Cuando estés listo, presiona continuar para avanzar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onCompleteCurrent?.();
              onNext();
            }}
            className={cn(
              'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:tracking-[0.18em] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none select-none',
              pressedAction === 'next' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-amber-400'
            )}
          >
            <span>{isLast ? 'IR AL QUIZ' : 'SIGUIENTE LECCIÓN'}</span>
            <ArrowRight aria-hidden="true" className="w-4 h-4" />
            <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950">
              Enter ↵
            </kbd>
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full min-h-0">
          {/* Cabecera fija de la pregunta */}
          <div className="shrink-0 flex items-center justify-between pb-2.5 border-b border-slate-800/80">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Desafío de Comprensión
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                {getExerciseTypeLabel(exercise.type)}
              </span>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => onOpenInspector?.('quiz')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                  title="Modificar pregunta y opciones A/B/C/D con feedback"
                >
                  <PencilSimple className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modificar Pregunta</span>
                </button>
              )}
            </div>
          </div>

          {/* Area de pregunta y opciones scrolleable */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 py-3 pr-1 sm:pr-2">
            <div
              className={cn(
                'font-bold text-white leading-snug',
                exercise.prompt.length > 180 ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
              )}
            >
              <MarkdownContent content={exercise.prompt} inline />
            </div>

            {exercise.prompt_code && (exercise.type === 'multiple_choice' || exercise.type === 'single_choice' || exercise.type === 'true_false') ? (
              <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm leading-relaxed text-amber-200 shadow-inner max-h-36">
                <code>{exercise.prompt_code}</code>
              </pre>
            ) : null}

            <div className="pt-1">
              <QuestionRenderer
                exercise={exercise}
                selectedIds={selectedIds}
                onToggle={onToggleOption}
                onCustomChange={onCustomChange}
                disabled={Boolean(result)}
                pressedIndex={pressedIndex}
              />
            </div>
          </div>

          {/* Acciones fijas en la parte inferior */}
          <div className="shrink-0 pt-2 border-t border-slate-800/80 space-y-2">
            {!result ? (
              <button
                type="button"
                onClick={onSubmitAnswer}
                disabled={selectedIds.length === 0}
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
                role={result.correct ? 'status' : 'alert'}
                className={cn(
                  'rounded-xl border p-3 space-y-2 transition-all duration-300',
                  result.correct
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold flex items-center gap-2">
                    {result.correct ? <Check aria-hidden="true" className="w-5 h-5 text-emerald-400" /> : null}
                    {result.correct
                      ? isAlreadyCompleted
                        ? '¡Excelente! +0 XP (Repaso)'
                        : `¡Excelente! +${result.xp} XP`
                      : 'Respuesta incorrecta'}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-20 overflow-y-auto pr-1">
                  <MarkdownContent content={result.feedback} />
                </div>
                {result.hint ? (
                  <div className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="font-bold text-amber-300 mr-1">Pista:</strong>
                      <MarkdownContent content={result.hint} inline />
                    </div>
                  </div>
                ) : null}
                <div className="flex gap-2.5 pt-0.5">
                  {!result.correct ? (
                    <button
                      type="button"
                      onClick={onResetSelection}
                      className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-t border-slate-600 border-b-4 border-slate-950 bg-slate-800 px-4 text-xs font-mono font-bold text-slate-200 shadow-[0_4px_0_#020617] hover:border-slate-500 hover:bg-slate-750 hover:text-white active:border-b-0 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    >
                      <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
                      <span>REINTENTAR</span>
                      <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400">
                        Enter ↵
                      </kbd>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={result.correct ? onNext : () => {}}
                    disabled={!result.correct}
                    className={cn(
                      'group relative inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-mono text-xs font-black tracking-wider text-slate-950 border-t-2 border-emerald-200 border-b-4 border-emerald-800 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.45)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
                      pressedAction === 'next' && 'translate-y-1 border-b-0 shadow-none ring-2 ring-emerald-400'
                    )}
                  >
                    <span>{isLast ? 'IR AL QUIZ' : 'SIGUIENTE LECCIÓN'}</span>
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950">
                      Enter ↵
                    </kbd>
                  </button>
                </div>
              </div>
            )}

            {/* Pie de navegación libre entre lecciones independientes */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <button
                type="button"
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Lección anterior
              </button>
              <span className="text-[11px] text-slate-500">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={onNext}
                className="hover:text-orange-400 transition-colors cursor-pointer"
              >
                {isLast ? 'Ir al Quiz →' : 'Saltar / Siguiente →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
