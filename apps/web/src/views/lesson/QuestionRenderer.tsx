'use client';

import React from 'react';
import { Check } from '@phosphor-icons/react';
import { ContentExercise } from '@/lib/content';
import { cn } from '@/lib/utils';

interface QuestionRendererProps {
  exercise: ContentExercise;
  selectedIds: string[];
  onToggle: (answerId: string) => void;
  disabled?: boolean;
  pressedIndex?: number | null;
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

/** Renderiza por tipo; todo lo basado en opciones comparte interacción y atajos táctiles. */
export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  exercise,
  selectedIds,
  onToggle,
  disabled = false,
  pressedIndex = null,
}) => {
  const multi = exercise.type === 'multiple_choice';
  const options = exercise.answers ?? [];

  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
        Este tipo de ejercicio ({exercise.type}) aún no tiene visor interactivo. Marca como visto para continuar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercise.prompt_code ? (
        <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
          <code>{exercise.prompt_code}</code>
        </pre>
      ) : null}

      <div
        role={multi ? 'group' : 'radiogroup'}
        aria-label="Opciones de respuesta"
        className="space-y-2.5"
      >
        {options.map((opt, i) => {
          const active = selectedIds.includes(opt.id);
          const isPressed = pressedIndex === i;
          const shortcutNum = i + 1;
          const shortcutChar = optionLabel(i);

          return (
            <button
              key={opt.id}
              type="button"
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={active}
              aria-keyshortcuts={`${shortcutNum} ${shortcutChar}`}
              disabled={disabled}
              onClick={() => onToggle(opt.id)}
              className={cn(
                'group relative flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-100 min-h-[52px] select-none',
                isPressed
                  ? 'scale-[0.98] border-amber-400 bg-amber-400/20 text-white shadow-[0_0_16px_rgba(251,191,36,0.35)] ring-2 ring-amber-400/40'
                  : active
                  ? 'border-amber-400/80 bg-amber-400/10 text-white shadow-[0_0_12px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/30'
                  : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-600 hover:bg-slate-900/80',
                disabled && 'opacity-60 cursor-default'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-mono font-bold transition-colors',
                    multi ? 'rounded-md' : 'rounded-lg',
                    isPressed || active
                      ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-sm'
                      : 'border-slate-700 bg-slate-900 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-200'
                  )}
                >
                  {multi && active ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    opt.label ?? shortcutChar
                  )}
                </span>
                <span className="font-mono text-sm leading-snug break-words">{opt.body}</span>
              </div>

              {/* Keycap Badge táctil visible en desktop */}
              <div
                aria-hidden="true"
                className="hidden sm:flex items-center gap-1 shrink-0 text-[11px] font-mono text-slate-500"
              >
                <kbd
                  className={cn(
                    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded border text-[10px] font-mono font-semibold transition-all shadow-sm',
                    isPressed
                      ? 'border-amber-400 bg-amber-400 text-slate-950 translate-y-0.5'
                      : active
                      ? 'border-amber-400/50 bg-amber-400/20 text-amber-300'
                      : 'border-slate-700/80 bg-slate-900/90 text-slate-400 group-hover:border-slate-600 group-hover:text-slate-300'
                  )}
                >
                  {shortcutNum}
                </kbd>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionRenderer;
