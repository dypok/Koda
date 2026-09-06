'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Check, Terminal, RotateCcw } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  output: string;
  explanation: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'hello',
    title: '1. Tu primer print',
    code: 'print("¡Hola, Koda! 🦊")\nprint("Bienvenido al mundo de Python.")',
    output: '¡Hola, Koda! 🦊\nBienvenido al mundo de Python.',
    explanation: 'La función print() muestra texto en la pantalla. Solo necesitas encerrar tus palabras entre comillas.',
  },
  {
    id: 'vars',
    title: '2. Variables y Tipos',
    code: 'nombre = "Koda"\npuntos_xp = 100\nes_genial = True\n\nprint(f"El zorro {nombre} tiene {puntos_xp} XP!")',
    output: 'El zorro Koda tiene 100 XP!',
    explanation: 'En Python no necesitas declarar tipos complejos. Creas una variable asignándole un valor con el signo igual (=).',
  },
  {
    id: 'logic',
    title: '3. Toma de Decisiones',
    code: 'nivel = 5\n\nif nivel >= 5:\n    print("⭐ ¡Felicidades! Has desbloqueado el Módulo 02.")\nelse:\n    print("Sigue practicando para subir de nivel.")',
    output: '⭐ ¡Felicidades! Has desbloqueado el Módulo 02.',
    explanation: 'Con if/else tu programa toma caminos lógicos. Observa la indentación de 4 espacios que hace a Python tan legible.',
  },
];

export const InteractivePreview: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SNIPPETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    setExecutionTime(null);

    // Simulate instant client execution
    setTimeout(() => {
      setIsRunning(false);
      setOutput(selectedSnippet.output);
      setExecutionTime(Math.floor(Math.random() * 8) + 12); // ~12-20 ms
    }, 350);
  };

  const handleSelect = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setOutput(null);
    setExecutionTime(null);
  };

  return (
    <section id="demo-interactiva" className="py-16 md:py-24 border-y border-slate-800/80 bg-slate-950/60 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
            <Terminal className="w-3.5 h-3.5" />
            Experiencia en Vivo
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Prueba cómo se siente aprender con Koda
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Sin consolas complejas, sin instalar Python, sin trabas. Código limpio, ejecución instantánea y explicaciones directas.
          </p>
        </div>

        {/* Snippet Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {SNIPPETS.map((snippet) => {
            const isSelected = selectedSnippet.id === snippet.id;
            return (
              <button
                key={snippet.id}
                onClick={() => handleSelect(snippet)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                {snippet.title}
              </button>
            );
          })}
        </div>

        {/* Code & Terminal Split Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Left: Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">main.py</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Python 3.12
              </span>
            </div>

            {/* Code Content */}
            <div className="p-5 font-mono text-sm sm:text-base leading-relaxed text-slate-200 overflow-x-auto min-h-[160px] bg-slate-950/40">
              <pre className="text-amber-300/95 font-medium whitespace-pre-wrap selection:bg-amber-500/30">
                {selectedSnippet.code}
              </pre>
            </div>

            {/* Action Bar */}
            <div className="mt-auto p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Haz clic en ejecutar para ver la magia
              </span>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                    Ejecutar Código
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Terminal Console Output (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-slate-950/90 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Salida de Consola</span>
              </div>
              {executionTime && (
                <span className="text-emerald-400 font-semibold">{executionTime} ms</span>
              )}
            </div>

            <div className="flex-1 font-mono text-sm min-h-[140px] flex flex-col justify-center">
              {output ? (
                <div className="space-y-2 animate-fadeIn">
                  <div className="text-emerald-400 whitespace-pre-wrap font-medium bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-xl">
                    {output}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Código ejecutado con éxito sin errores (Return code 0).
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-8 space-y-2">
                  <div className="inline-block p-3 rounded-full bg-slate-900 border border-slate-800">
                    <Play className="w-5 h-5 text-slate-600 ml-0.5" />
                  </div>
                  <p>Presiona el botón verde de "Ejecutar Código" para correr el programa.</p>
                </div>
              )}
            </div>

            {/* Explanation box */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl">
              <strong className="text-amber-400 font-semibold block mb-1">💡 ¿Cómo funciona?</strong>
              {selectedSnippet.explanation}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
