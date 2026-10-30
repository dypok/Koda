'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Lightning } from '@phosphor-icons/react';
import { ContentExercise, ContentLesson } from '@/lib/content';
import { useLessonEngine } from './useLessonEngine';
import { useLessonKeyboardShortcuts } from '@/hooks/useLessonKeyboardShortcuts';
import { useAuthStore } from '@/stores/auth.store';
import { EvaluationService } from '@/services/learning/evaluation.service';
import { EditableBlockType } from '@/components/admin/LessonInSituInspectorModal';
import { LessonTheoryPanel } from './LessonTheoryPanel';
import { LessonPracticePanel } from './LessonPracticePanel';
import { cn } from '@/lib/utils';

export interface LessonViewProps {
  lesson: ContentLesson;
  language?: string;
  isCompleted?: boolean;
  isAlreadyCompleted?: boolean;
  onComplete?: () => void;
  onExerciseFailed?: (exercise: ContentExercise) => void;
  onExerciseCorrect?: (xp: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo?: (idx: number) => void;
  currentIndex?: number;
  totalCount?: number;
  isLast: boolean;
  isEditMode?: boolean;
  onOpenInspector?: (block: EditableBlockType) => void;
  nodeTargetXp?: number;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  language = 'python',
  isCompleted = false,
  isAlreadyCompleted = false,
  onComplete,
  onExerciseFailed,
  onExerciseCorrect,
  onNext,
  onPrev,
  onJumpTo: _onJumpTo,
  currentIndex = 0,
  totalCount = 1,
  isLast,
  isEditMode = false,
  onOpenInspector,
  nodeTargetXp = 120,
}) => {
  const totalSteps = totalCount + 1; // Las N lecciones de la sección + el Quiz de cierre
  const baseStepXp = isAlreadyCompleted ? 0 : Math.max(5, Math.floor(nodeTargetXp / totalSteps));
  const exerciseCount = Math.max(1, lesson.exercises?.length ?? 1);
  const questionXp = isAlreadyCompleted ? 0 : Math.max(1, Math.round(baseStepXp / exerciseCount));

  const exercise = lesson.exercises[0] ?? null;
  const engine = useLessonEngine(exercise ? [exercise] : [], lesson.position, questionXp);
  const [mobileTab, setMobileTab] = useState<'concept' | 'practice'>('concept');

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const onExerciseFailedRef = useRef(onExerciseFailed);
  useEffect(() => {
    onExerciseFailedRef.current = onExerciseFailed;
  }, [onExerciseFailed]);

  // Guardia con ref para disparar completitud exactamente UNA vez por lección
  const hasNotifiedRef = useRef(false);
  useEffect(() => {
    hasNotifiedRef.current = false;
  }, [lesson.id]);

  useEffect(() => {
    if (engine.result?.correct && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onCompleteRef.current?.();
    } else if (engine.result && !engine.result.correct && exercise) {
      // Ronda de Repaso Final (LESS-04): registrar el ejercicio fallado
      onExerciseFailedRef.current?.(exercise);
    }
  }, [engine.result, exercise]);

  const handleSubmitAnswer = () => {
    if (!engine.result && engine.selected.length > 0) {
      const checkRes = engine.check();
      if (checkRes?.correct && checkRes.xp > 0) {
        onExerciseCorrect?.(checkRes.xp);
        const curUser = useAuthStore.getState().user;
        if (curUser) {
          const todayStr = new Date().toLocaleDateString('en-CA');
          const lastStudyStr = curUser.lastStudyDate ? curUser.lastStudyDate.slice(0, 10) : null;
          const isSameDay = lastStudyStr === todayStr;
          const curStreak = isSameDay ? Math.max(1, curUser.streak) : (curUser.streak > 0 ? curUser.streak : 1);
          useAuthStore.getState().updateUserProfile({
            totalXp: (curUser.totalXp ?? 0) + checkRes.xp,
            streak: curStreak,
            longestStreak: Math.max(curUser.longestStreak ?? 1, curStreak),
            isActiveToday: true,
            lastStudyDate: new Date().toISOString(),
          });
        }
      }
      if (lesson?.id) {
        EvaluationService.evaluateLessonAnswer(lesson.id, {
          selected_option_ids: engine.selected,
          xp_earned: checkRes?.xp,
        }).catch((err) => {
          console.warn('Backend lesson answer sync fallback:', err?.message);
        });
      }
    }
  };

  // Hook de atajos ergonómicos por teclado
  const { pressedIndex, pressedAction } = useLessonKeyboardShortcuts({
    optionsCount: exercise?.answers?.length ?? 0,
    onSelectOption: (idx) => {
      const opt = exercise?.answers[idx];
      if (opt && !engine.result) engine.toggle(opt.id);
    },
    onSubmit: handleSubmitAnswer,
    onNext: () => {
      if (engine.result) {
        if (engine.result.correct) {
          onComplete?.();
          onNext();
        } else {
          engine.resetSelection();
        }
      } else if (!exercise) {
        onComplete?.();
        onNext();
      }
    },
    onPrev: () => {
      onPrev();
    },
    isSubmitted: Boolean(engine.result),
    canSubmit: Boolean(!engine.result && engine.selected.length > 0),
  });

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-2 sm:gap-3 overflow-hidden">
      {/* Tabs responsivos en móvil (< lg) para alternar entre Concepto y Práctica — LESS-01 */}
      <div
        role="tablist"
        aria-label="Secciones de la lección en móvil"
        className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 lg:hidden shrink-0"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'concept'}
          onClick={() => setMobileTab('concept')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer',
            mobileTab === 'concept'
              ? 'bg-orange-500 text-slate-950 shadow-[0_0_12px_rgba(255,106,0,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>Concepto</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'practice'}
          onClick={() => setMobileTab('practice')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer',
            mobileTab === 'practice'
              ? 'bg-orange-500 text-slate-950 shadow-[0_0_12px_rgba(255,106,0,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Lightning className="w-4 h-4" />
          <span>Práctica</span>
        </button>
      </div>

      <div className="w-full h-full min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 overflow-hidden">
        {/* Columna Izquierda: Teoría & Consola Interactiva Pyodide (LESS-01, LESS-06) */}
        <LessonTheoryPanel
          lesson={lesson}
          language={language}
          isCompleted={isCompleted}
          isEditMode={isEditMode}
          mobileTab={mobileTab}
          onOpenInspector={onOpenInspector}
          onSwitchToPractice={() => setMobileTab('practice')}
        />

        {/* Columna Derecha: Práctica & Desafío de Comprensión */}
        <LessonPracticePanel
          lesson={lesson}
          exercise={exercise}
          selectedIds={engine.selected}
          result={engine.result}
          pressedIndex={pressedIndex}
          pressedAction={pressedAction}
          isAlreadyCompleted={isAlreadyCompleted}
          isLast={isLast}
          isEditMode={isEditMode}
          currentIndex={currentIndex}
          totalCount={totalCount}
          mobileTab={mobileTab}
          onOpenInspector={onOpenInspector}
          onToggleOption={engine.toggle}
          onCustomChange={engine.setCustomAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onResetSelection={engine.resetSelection}
          onNext={onNext}
          onPrev={onPrev}
          onCompleteCurrent={onComplete}
        />
      </div>
    </div>
  );
};
