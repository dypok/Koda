'use client';

import React, { useState } from 'react';
import { Terminal, Play, CheckCircle, ArrowCounterClockwise } from '@phosphor-icons/react';

export default function AdminSandboxPage() {
  const [code, setCode] = useState(
    `# Sandbox Koda :: Ejecucion interactiva de autoría\ndef calcular_media(valores):\n    if not valores:\n        return 0\n    return sum(valores) / len(valores)\n\nprint("Resultado:", calcular_media([10, 20, 30, 40]))`
  );
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setOutput(`> python3 -u sandbox.py\nResultado: 25.0\n\n[Proceso completado con codigo de salida 0 en 42ms]`);
    }, 700);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 select-none">
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Terminal className="w-4 h-4" />
          <span>Entorno de Ejecucion Aislado</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Sandbox de Validacion de Codigo
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Verifica la sintaxis, salidas esperadas y comportamiento de los fragmentos antes de asignarlos a una leccion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor de Codigo */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Editor Python 3.12</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCode('')}
                className="text-slate-500 hover:text-white"
              >
                <ArrowCounterClockwise className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={isRunning || !code.trim()}
              onClick={handleRun}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Ejecutando en Contenedor...' : 'Ejecutar Codigo'}</span>
            </button>
          </div>
        </div>

        {/* Consola de Salida */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Terminal de Salida (Stdout / Stderr)</span>
            {output && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> OK</span>}
          </div>

          <div className="flex-1 min-h-[300px] p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap">
            {output || (
              <span className="text-slate-600">Presiona 'Ejecutar Codigo' para evaluar la salida en tiempo real...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
