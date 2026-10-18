'use client';

import React from 'react';
import { Check } from '@phosphor-icons/react';
import { ContentExercise } from '@/lib/content';
import { cn } from '@/lib/utils';
import { renderMarkdownInline } from '@/components/ui/markdown-content';

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
                'group relative flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200 min-h-[54px] select-none cursor-pointer',
                isPressed
                  ? 'scale-[0.98] border-orange-500 bg-orange-500/25 text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] ring-2 ring-orange-500/60 translate-x-1.5'
                  : active
                  ? 'border-orange-500/90 bg-orange-500/15 text-white shadow-[0_0_22px_rgba(255,106,0,0.35)] ring-1 ring-orange-500/50 translate-x-1.5'
                  : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-orange-500/60 hover:bg-slate-900/90 hover:translate-x-1.5 hover:shadow-[0_0_16px_rgba(255,106,0,0.2)]',
                disabled && 'opacity-60 cursor-default hover:translate-x-0 hover:shadow-none'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-mono font-bold transition-all duration-200',
                    multi ? 'rounded-md' : 'rounded-lg',
                    isPressed || active
                      ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-sm'
                      : 'border-slate-700 bg-slate-900 text-slate-400 group-hover:border-orange-400 group-hover:text-orange-300 group-hover:bg-orange-500/10'
                  )}
                >
                  {multi && active ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    opt.label ?? shortcutChar
                  )}
                </span>
                <span className="font-mono text-xs sm:text-sm leading-snug break-words group-hover:text-white transition-colors">
                  {renderMarkdownInline(opt.body)}
                </span>
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
                      ? 'border-orange-400 bg-orange-400 text-slate-950 translate-y-0.5'
                      : active
                      ? 'border-orange-400 bg-orange-400 text-slate-950 translate-y-0.5'
                      : 'border-slate-700 bg-slate-800 text-slate-400 group-hover:border-orange-400/60 group-hover:text-amber-200'
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
