'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, ArrowCounterClockwise, TerminalWindow } from '@phosphor-icons/react';
import { ContentExercise } from '@/lib/content';
import { preloadPython } from '@/lib/python-runner';
import { cn } from '@/lib/utils';
import type { AnswerResult } from './useLessonEngine';

interface ConsoleExerciseProps {
  exercise: ContentExercise;
  result: AnswerResult | null;
  onSubmit: (code: string) => Promise<AnswerResult | null>;
  onReset: () => void;
}

/**
 * Ejercicio de consola (`write_code`): el alumno escribe Python, lo ejecuta
 * en el navegador y ve la salida real. La validación la hace el motor, así
 * que el componente solo muestra el editor, la salida y los botones.
 */
export function ConsoleExercise({ exercise, result, onSubmit, onReset }: ConsoleExerciseProps) {
  const [code, setCode] = useState(exercise.starter_code ?? '');
  const [running, setRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Descarga e inicializa Pyodide mientras el alumno lee y escribe.
    preloadPython();
  }, []);

  useEffect(() => {
    setCode(exercise.starter_code ?? '');
  }, [exercise.id, exercise.starter_code]);

  const lineCount = useMemo(() => Math.max(1, code.split('\n').length), [code]);
  const locked = Boolean(result?.correct);
  const output = result?.output ?? '';
  const error = result?.error ?? '';

  const handleRun = async () => {
    if (running || locked || !code.trim()) return;
    setRunning(true);
    try {
      await onSubmit(code);
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setCode(exercise.starter_code ?? '');
    onReset();
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 shadow-inner">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/70 px-3 py-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            <TerminalWindow aria-hidden className="h-3.5 w-3.5" />
            python 3.12 · consola
          </span>
        </div>

        <div className="max-h-[40vh] overflow-y-auto overscroll-contain">
          <div className="flex">
            <div
              aria-hidden
              className="select-none border-r border-slate-800/70 bg-slate-900/40 px-2 py-3 text-right font-mono text-xs leading-6 text-slate-600"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              disabled={locked}
              rows={Math.max(4, lineCount)}
              placeholder="# Escribe tu código aquí"
              aria-label="Editor de código Python"
              className="min-h-[112px] w-full resize-none overflow-hidden bg-transparent px-3 py-3 font-mono text-sm leading-6 text-amber-200 outline-none placeholder:text-slate-600 disabled:opacity-70"
            />
          </div>
        </div>
      </div>

      {running ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 font-mono text-xs text-slate-300">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400/40 border-t-amber-400" />
          <span>Ejecutando Python…</span>
        </div>
      ) : null}

      {!running && (output || error || result) ? (
        <div className="max-h-[28vh] overflow-y-auto overscroll-contain rounded-lg border border-slate-800 bg-black/60 p-3 font-mono text-xs leading-relaxed">
          <div className="mb-1 text-slate-500">$ python script.py</div>
          {output ? <pre className="whitespace-pre-wrap text-emerald-300">{output}</pre> : null}
          {error ? <pre className="whitespace-pre-wrap text-rose-300">{error}</pre> : null}
          {!output && !error ? <span className="text-slate-500">(sin salida)</span> : null}
        </div>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-2 flex gap-2 bg-slate-900/85 px-2 pt-2 backdrop-blur-md">
        <button
          type="button"
          onClick={handleRun}
          disabled={running || locked || !code.trim()}
          className={cn(
            'group inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 font-mono text-xs font-black tracking-widest text-slate-950 border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_20px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed select-none'
          )}
        >
          <Play aria-hidden className="h-4 w-4" weight="fill" />
          <span>{running ? 'EJECUTANDO…' : 'EJECUTAR'}</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={running || locked}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border-t border-slate-600 border-b-4 border-slate-950 bg-slate-800 px-4 text-xs font-mono font-bold text-slate-200 shadow-[0_4px_0_#020617] transition-all cursor-pointer hover:border-slate-500 hover:text-white active:border-b-0 active:translate-y-1 active:shadow-none disabled:opacity-40"
        >
          <ArrowCounterClockwise aria-hidden className="h-4 w-4" />
          <span>REINICIAR</span>
        </button>
      </div>
    </div>
  );
}

export default ConsoleExercise;
