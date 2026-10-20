'use client';

import React, { useEffect, useState } from 'react';
import {
  Play,
  ArrowCounterClockwise,
  TerminalWindow,
  WarningCircle,
  CheckCircle,
  Cpu,
} from '@phosphor-icons/react';
import { usePyodideRunner } from '@/hooks/usePyodideRunner';
import { cn } from '@/lib/utils';

export interface InteractiveCodeConsoleProps {
  initialCode: string;
  expectedOutput?: string;
  explanation?: string;
  title?: string;
  language?: string;
}

export const InteractiveCodeConsole: React.FC<InteractiveCodeConsoleProps> = ({
  initialCode,
  expectedOutput,
  explanation,
  title,
  language = 'python',
}) => {
  const [code, setCode] = useState(initialCode);
  const { runCode, isRunning, lastResult, clearOutput } = usePyodideRunner(language);

  useEffect(() => {
    setCode(initialCode);
    clearOutput();
  }, [initialCode, clearOutput]);

  const handleRun = async () => {
    await runCode(code, code.trim() === initialCode.trim() ? expectedOutput : undefined);
  };

  const handleReset = () => {
    setCode(initialCode);
    clearOutput();
  };

  const displayStdout = lastResult ? lastResult.stdout : expectedOutput;
  const displayError = lastResult?.pedagogicalError ?? null;

  return (
    <div className="space-y-2.5">
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-inner">
        {/* Barra superior de la consola interactiva */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/70 px-3.5 py-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </span>
            <TerminalWindow className="w-3.5 h-3.5 text-orange-400 ml-1" />
            <span className="font-bold text-slate-200">
              {title || `Sandbox ${language.toUpperCase()}`}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700/60">
              <Cpu className="w-3 h-3 text-amber-400" />
              {language === 'python' ? 'Pyodide WASM · 3s' : 'Runtime Local'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {code !== initialCode ? (
              <button
                type="button"
                onClick={handleReset}
                disabled={isRunning}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
                title="Restaurar código original"
              >
                <ArrowCounterClockwise className="w-3.5 h-3.5" />
                <span>RESTAURAR</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1 text-[11px] font-mono font-black tracking-wider text-slate-950 border-t border-amber-300 border-b-2 border-orange-800 shadow-[0_2px_10px_rgba(255,106,0,0.35)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50'
              )}
            >
              <Play weight="fill" className="w-3 h-3" />
              <span>{isRunning ? 'EJECUTANDO…' : 'EJECUTAR'}</span>
            </button>
          </div>
        </div>

        {/* Editor de código editable */}
        <div className="p-3.5">
          <span className="block text-[11px] font-mono text-slate-500 select-none pb-1.5">
            // Edita y ejecuta este ejemplo libremente en tiempo real
          </span>
          <textarea
            aria-label="Consola interactiva de código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={Math.min(10, Math.max(3, code.split('\n').length))}
            spellCheck={false}
            className="w-full bg-transparent font-mono text-xs sm:text-sm leading-relaxed text-amber-300 focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Salida estándar o error pedagógico */}
      {displayError ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3.5 py-2.5 text-xs font-mono text-rose-200 space-y-1"
        >
          <div className="flex items-center justify-between text-[11px] text-rose-400 font-bold">
            <span className="inline-flex items-center gap-1.5">
              <WarningCircle className="w-4 h-4" />
              Diagnóstico de Ejecución
            </span>
            {lastResult ? <span>{lastResult.executionTimeMs} ms</span> : null}
          </div>
          <p className="leading-relaxed">{displayError}</p>
        </div>
      ) : displayStdout ? (
        <div
          role="status"
          className="flex items-start justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300"
        >
          <div className="flex items-start gap-2 min-w-0">
            <span className="text-emerald-500 font-bold select-none">$</span>
            <pre className="whitespace-pre-wrap break-words font-mono">{displayStdout}</pre>
          </div>
          {lastResult ? (
            <span className="inline-flex items-center gap-1 shrink-0 text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" />
              {lastResult.executionTimeMs} ms
            </span>
          ) : null}
        </div>
      ) : null}

      {explanation ? (
        <p className="text-[11px] text-slate-400 leading-normal pl-1">{explanation}</p>
      ) : null}
    </div>
  );
};

export default InteractiveCodeConsole;
