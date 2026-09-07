'use client';

import React, { useState } from 'react';
import {
  IconPlayerPlay,
  IconSparkles,
  IconCheck,
  IconTerminal2,
  IconRotateClockwise,
} from '@tabler/icons-react';

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
    title: '1. Salida en Pantalla',
    code: 'print("¡Hola, KodaAcademy! 🔥")\nprint("Aprende a programar paso a paso.")',
    output: '¡Hola, KodaAcademy! 🔥\nAprende a programar paso a paso.',
    explanation: 'La instrucción básica de salida permite al programa comunicarse con el usuario mostrando resultados en la consola.',
  },
  {
    id: 'vars',
    title: '2. Variables y Datos',
    code: 'usuario = "Koda"\npuntos_xp = 100\nes_activo = True\n\nprint(f"{usuario} tiene {puntos_xp} XP acumulados.")',
    output: 'Koda tiene 100 XP acumulados.',
    explanation: 'Las variables almacenan información en memoria. Comprender tipos de datos (texto, enteros y booleanos) es universal en cualquier lenguaje.',
  },
  {
    id: 'logic',
    title: '3. Control de Flujo',
    code: 'nivel = 5\n\nif nivel >= 5:\n    print("⭐ Desafío completado con éxito.")\nelse:\n    print("Continúa practicando para avanzar.")',
    output: '⭐ Desafío completado con éxito.',
    explanation: 'Las estructuras condicionales permiten que tu programa tome decisiones lógicas basadas en condiciones evaluadas.',
  },
];

export const InteractivePreview: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SNIPPETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);

    // Instant execution simulation
    setTimeout(() => {
      setIsRunning(false);
      setOutput(selectedSnippet.output);
    }, 250);
  };

  const handleSelect = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setOutput(null);
  };

  return (
    <section id="demo-interactiva" className="py-16 md:py-24 border-y border-slate-800/80 bg-slate-950/60 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Escribe y ejecuta código real. Sin instalar nada.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Experimenta el aprendizaje activo de KodaAcademy: interactividad en tu navegador, ejecución inmediata y conceptos claros. Demostración sobre el track piloto:
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
                    ? 'bg-amber-500 text-slate-950 scale-[1.02]'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                {snippet.title}
              </button>
            );
          })}
        </div>

        {/* Code & Terminal Split Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden backdrop-blur-xl">
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
                Track Piloto: Python 3.12
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
                <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
                Presiona ejecutar para probar la salida
              </span>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <IconRotateClockwise className="w-4 h-4 animate-spin text-slate-950" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <IconPlayerPlay className="w-4 h-4 fill-slate-950 text-slate-950" />
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
                <IconTerminal2 className="w-4 h-4 text-emerald-400" />
                <span>Salida Estándar (stdout)</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">Python 3.12 Runtime</span>
            </div>

            <div className="flex-1 font-mono text-sm min-h-[140px] flex flex-col justify-center">
              {output ? (
                <div className="space-y-2 animate-fadeIn">
                  <div className="text-emerald-400 whitespace-pre-wrap font-medium bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-xl">
                    {output}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Ejecución completada exitosamente (Exit code 0).
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-8 space-y-2">
                  <div className="inline-block p-3 rounded-full bg-slate-900 border border-slate-800">
                    <IconPlayerPlay className="w-5 h-5 text-slate-600 ml-0.5" />
                  </div>
                  <p>Presiona "Ejecutar Código" para ver el resultado en vivo.</p>
                </div>
              )}
            </div>

            {/* Explanation box */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl">
              <strong className="text-amber-400 font-semibold block mb-1">💡 Fundamento Teórico:</strong>
              {selectedSnippet.explanation}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
