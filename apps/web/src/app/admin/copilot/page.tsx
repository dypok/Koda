'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkle, ArrowRight, Check, Code, FileText } from '@phosphor-icons/react';

export default function AdminCopilotPage() {
  const [promptTopic, setPromptTopic] = useState('Comprension de Listas con Condicional if');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<any | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedDraft({
        title: `Dominando: ${promptTopic}`,
        step1: 'Una comprension de lista te permite transformar o filtrar elementos en una sola linea elegante.',
        step2: 'Al anadir la clausula if al final, seleccionas unicamente los elementos que cumplen la condicion booleana.',
        step3: 'Regla: [expresion for elemento in iterable if condicion]. El if actua como filtro previo.',
        code: 'numeros = [1, 2, 3, 4, 5, 6]\npares = [n for n in numeros if n % 2 == 0]\nprint(pares)  # [2, 4, 6]',
        console_prompt: 'Crea una lista llamada impares con los numeros impares del 1 al 9 usando una comprension.',
        quiz_prompt: 'En que orden evalua Python una comprension con filtro if?',
        quiz_options: [
          'Itera sobre los elementos, aplica el if y si es True evalua la expresion.',
          'Evalua la expresion primero y luego descarta con if.',
          'El if solo funciona si se declara antes del for.',
          'Las comprensiones con if son exclusivas de diccionarios.',
        ],
      });
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 select-none">
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
          <Sparkle className="w-4 h-4" />
          <span>Generador Asistido por Inteligencia Artificial</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Koda Content Copilot (Gemini)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Genera borradores pedagógicos completos que cumplen con la norma oficial de Koda Academy.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-3xl">
        <label className="block text-xs font-mono text-slate-300">
          Tema o Concepto a Desarrollar:
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={promptTopic}
            onChange={(e) => setPromptTopic(e.target.value)}
            placeholder="ej. Manejo de Context Managers con with"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="button"
            disabled={isGenerating || !promptTopic.trim()}
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer shrink-0"
          >
            <Sparkle className="w-4 h-4" />
            <span>{isGenerating ? 'Generando...' : 'Generar Borrador'}</span>
          </button>
        </div>
      </div>

      {generatedDraft && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4 max-w-3xl animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-mono">{generatedDraft.title}</h2>
            <Link
              href="/admin/editor"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono hover:bg-indigo-500/30 transition-colors"
            >
              <span>Abrir en Canva Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-amber-400 font-bold">Paso 1:</div>
              <div className="text-slate-300">{generatedDraft.step1}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-amber-400 font-bold">Paso 2:</div>
              <div className="text-slate-300">{generatedDraft.step2}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-amber-400 font-bold">Paso 3:</div>
              <div className="text-slate-300">{generatedDraft.step3}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-emerald-400 font-bold">Codigo Demostrativo:</div>
              <pre className="text-emerald-300 whitespace-pre-wrap">{generatedDraft.code}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
