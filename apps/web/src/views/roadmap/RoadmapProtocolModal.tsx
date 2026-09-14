'use client';

import React, { useState } from 'react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { X, Sparkle, Check, Terminal, Play } from '@phosphor-icons/react';

interface RoadmapProtocolModalProps {
  node: GraphNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoadmapProtocolModal({ node, isOpen, onClose }: RoadmapProtocolModalProps) {
  const { simulateCompleteAndUnlockNext } = useRoadmapStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [testRan, setTestRan] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !node) return null;

  const handleSelectOption = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(idx);
    setQuizSubmitted(true);
    if (testPassed && idx === 0) {
      setIsCompleted(true);
    }
  };

  const handleRunCode = () => {
    setTestRan(true);
    setTimeout(() => {
      setTestPassed(true);
      if (selectedAnswer === 0) {
        setIsCompleted(true);
      }
    }, 500);
  };

  const handleFinishMission = () => {
    simulateCompleteAndUnlockNext();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="protocol-modal-title"
        className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 overflow-hidden font-mono flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <header className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span id="protocol-modal-title" className="text-xs uppercase font-bold tracking-widest text-cyan-300">
              PROTOCOLO DE APRENDIZAJE // {node.code}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
              <Sparkle className="w-3.5 h-3.5" />
              <span>+{node.xp || 200} XP</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar Misión"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Modal Split Content: 50% Pedagogía / 50% Terminal de Código */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Panel Izquierdo: Misión Conceptual & Koda Guide */}
          <div className="p-6 space-y-5">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                FASE 1 // EVALUACIÓN CONCEPTUAL
              </span>
              <h2 className="text-xl font-bold font-sans text-white tracking-tight">
                {node.label}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {node.subtitle || 'Domina los fundamentos esenciales para sincronizar el sector.'}
              </p>
            </div>

            {/* Mensaje de la Mascota Guía Koda */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 space-y-1.5 font-sans">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>KODA ASSISTANT // TELEMETRÍA</span>
              </div>
              <p className="leading-relaxed">
                ¡Atención cadete! Para habilitar el flujo de datos de este sector, responde a la pregunta de calibración sintáctica:
              </p>
            </div>

            {/* Pregunta de Quiz Interactivo */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-200">
                ¿Qué instrucción permite imprimir datos en la consola estándar?
              </div>

              <div className="space-y-2">
                {[
                  { text: 'print("Hola mundo")', isCorrect: true },
                  { text: 'echo "Hola mundo"', isCorrect: false },
                  { text: 'System.out.println("Hola mundo")', isCorrect: false },
                ].map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isSubmitted = quizSubmitted;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={quizSubmitted}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSubmitted && option.isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : isSubmitted && isSelected && !option.isCorrect
                            ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                            : isSelected
                              ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono">{option.text}</span>
                      {isSubmitted && option.isCorrect && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel Derecho: Terminal de Código & Auto-test */}
          <div className="p-6 space-y-5 bg-slate-950/40 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>FASE 2 // AUTO-TEST RUNNER</span>
                </span>
                <span className="text-[9px] text-slate-500 font-mono">RUNTIME: SANDBOX</span>
              </div>

              {/* Editor Simulado */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
                <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span>main.py</span>
                </div>
                <div className="p-4 space-y-1 font-mono text-[11px] leading-relaxed">
                  <div className="text-slate-500"># Misión: Asigna 100 a xp y muestra su valor</div>
                  <div className="text-cyan-300">xp = <span className="text-amber-300">100</span></div>
                  <div className="text-cyan-300"><span className="text-emerald-400">print</span>(xp)</div>
                </div>
              </div>

              {/* Botón Ejecutar */}
              <button
                type="button"
                onClick={handleRunCode}
                disabled={testRan && testPassed}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-75"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{testPassed ? 'PRUEBAS VERIFICADAS ✓' : 'EJECUTAR CÓDIGO // RUN TESTS'}</span>
              </button>

              {/* Terminal Output */}
              {testRan && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-[11px] space-y-1.5">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>OUTPUT: 100</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    ✓ Test 1: Asignación de variable superada
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    ✓ Test 2: Salida estándar verificada
                  </div>
                </div>
              )}
            </div>

            {/* Fase 3: Conquista Final */}
            {isCompleted && testPassed && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">¡SECTOR CALIBRADO!</span>
                  <span className="text-amber-400 font-bold">★★★ 3 ESTRELLAS</span>
                </div>
                <button
                  type="button"
                  onClick={handleFinishMission}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  CONQUISTAR SECTOR & CONTINUAR →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
