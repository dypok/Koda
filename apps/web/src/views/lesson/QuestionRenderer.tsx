'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { ContentExercise } from '@/lib/content';
import { cn } from '@/lib/utils';

interface QuestionRendererProps {
  exercise: ContentExercise;
  selectedIds: string[];
  onToggle: (answerId: string) => void;
  disabled?: boolean;
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

/** Renderiza por tipo; todo lo basado en opciones comparte interacción. */
export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  exercise,
  selectedIds,
  onToggle,
  disabled = false,
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
    <div>
      {exercise.prompt_code ? (
        <pre className="mb-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-sm leading-relaxed text-slate-200">
          <code>{exercise.prompt_code}</code>
        </pre>
      ) : null}
      <div role={multi ? 'group' : 'radiogroup'} aria-label="Opciones de respuesta" className="space-y-2">
        {options.map((opt, i) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={active}
              disabled={disabled}
              onClick={() => onToggle(opt.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-all min-h-[48px]',
                active
                  ? 'border-amber-400/60 bg-amber-400/10 text-white'
                  : 'border-slate-700/80 bg-slate-950/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800/60',
                disabled && 'opacity-60 cursor-default'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] font-bold',
                  multi ? 'rounded-md' : 'rounded-full',
                  active ? 'border-amber-400/60 text-amber-300' : 'border-slate-600 text-slate-400'
                )}
              >
                {multi && active ? <Check className="w-3.5 h-3.5" /> : (opt.label ?? optionLabel(i))}
              </span>
              <span className="font-mono">{opt.body}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionRenderer;
