'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Code,
  Terminal,
  Question,
  CheckCircle,
  Plus,
  Trash,
  Check,
} from '@phosphor-icons/react';

export type EditableBlockType = 'theory' | 'code' | 'console' | 'quiz' | 'prediction';

export interface EditableLessonData {
  id: string;
  title: string;
  step1: string;
  step2: string;
  step3: string;
  code_snippet: string;
  console_prompt?: string;
  initial_code?: string;
  solution_code?: string;
  test_cases?: Array<{ input: string; expected_output: string; description: string }>;
  quiz_prompt: string;
  quiz_options: Array<{ id: string; text: string; is_correct: boolean; feedback: string }>;
  prediction_prompt?: string;
  prediction_code?: string;
  prediction_answer?: string;
  prediction_hint?: string;
}

interface LessonInSituInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockType: EditableBlockType;
  lessonData: EditableLessonData;
  onUpdate: (updated: EditableLessonData) => void;
}

export const LessonInSituInspectorModal: React.FC<LessonInSituInspectorModalProps> = ({
  isOpen,
  onClose,
  blockType,
  lessonData,
  onUpdate,
}) => {
  const [data, setData] = useState<EditableLessonData>(lessonData);

  React.useEffect(() => {
    setData(lessonData);
  }, [lessonData]);

  if (!isOpen) return null;

  const handleChange = (partial: Partial<EditableLessonData>) => {
    const updated = { ...data, ...partial };
    setData(updated);
    onUpdate(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {blockType === 'theory' && <FileText className="w-4 h-4" />}
              {blockType === 'code' && <Code className="w-4 h-4" />}
              {blockType === 'console' && <Terminal className="w-4 h-4" />}
              {blockType === 'quiz' && <Question className="w-4 h-4" />}
              {blockType === 'prediction' && <CheckCircle className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>Modificar Bloque:</span>
                <span className="text-amber-400 uppercase text-xs">
                  {blockType === 'theory' && 'Enunciado & Teoria (3 Pasos)'}
                  {blockType === 'code' && 'Codigo Demostrativo'}
                  {blockType === 'console' && 'Desafio de Consola (Test Cases)'}
                  {blockType === 'quiz' && 'Quiz de 4 Opciones A, B, C, D'}
                  {blockType === 'prediction' && 'Prediccion de Salida'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                Sesion: {data.title}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* FASE 1: TEORIA Y ENUNCIADO */}
          {blockType === 'theory' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Enunciado / Titulo de la Sesion *
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => handleChange({ title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                  Estructura Didactica Canonica en 3 Pasos
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Paso 1: Frase de Anclaje (Que vas a aprender)
                  </label>
                  <textarea
                    rows={2}
                    value={data.step1}
                    onChange={(e) => handleChange({ step1: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Paso 2: Mecanica Conceptual (Definicion llana)
                  </label>
                  <textarea
                    rows={3}
                    value={data.step2}
                    onChange={(e) => handleChange({ step2: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Paso 3: Regla Practica / Sintaxis Clave
                  </label>
                  <textarea
                    rows={2}
                    value={data.step3}
                    onChange={(e) => handleChange({ step3: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FASE 2: CODIGO DEMOSTRATIVO */}
          {blockType === 'code' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Snippet de Codigo de Ejemplo (Python) *
              </label>
              <textarea
                rows={9}
                value={data.code_snippet}
                onChange={(e) => handleChange({ code_snippet: e.target.value })}
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
              <p className="text-[11px] font-mono text-slate-500">
                Este fragmento se muestra en la terminal de teoria con resaltado de sintaxis.
              </p>
            </div>
          )}

          {/* FASE 3: DESAFIO DE CONSOLA */}
          {blockType === 'console' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Enunciado del Desafio de Consola *
                </label>
                <textarea
                  rows={2}
                  value={data.console_prompt || ''}
                  onChange={(e) => handleChange({ console_prompt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Codigo Inicial (Starter Code)
                  </label>
                  <textarea
                    rows={4}
                    value={data.initial_code || ''}
                    onChange={(e) => handleChange({ initial_code: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Codigo Solucion de Referencia
                  </label>
                  <textarea
                    rows={4}
                    value={data.solution_code || ''}
                    onChange={(e) => handleChange({ solution_code: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Casos de prueba */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                    Casos de Prueba (I/O)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(data.test_cases || []),
                        { input: '', expected_output: 'Resultado\n', description: 'Caso' },
                      ];
                      handleChange({ test_cases: updated });
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Caso</span>
                  </button>
                </div>

                {(data.test_cases || []).map((tc, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Caso #{idx + 1}</span>
                      {(data.test_cases?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (data.test_cases || []).filter((_, i) => i !== idx);
                            handleChange({ test_cases: updated });
                          }}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500">Input (stdin):</span>
                        <input
                          type="text"
                          value={tc.input}
                          onChange={(e) => {
                            const updated = [...(data.test_cases || [])];
                            updated[idx].input = e.target.value;
                            handleChange({ test_cases: updated });
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Salida Esperada (stdout):</span>
                        <input
                          type="text"
                          value={tc.expected_output.replace(/\n$/, '')}
                          onChange={(e) => {
                            const updated = [...(data.test_cases || [])];
                            updated[idx].expected_output = e.target.value + '\n';
                            handleChange({ test_cases: updated });
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FASE 4: QUIZ DE 4 OPCIONES */}
          {blockType === 'quiz' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Enunciado de la Pregunta de Comprension *
                </label>
                <textarea
                  rows={2}
                  value={data.quiz_prompt}
                  onChange={(e) => handleChange({ quiz_prompt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-semibold"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                  4 Opciones de Respuesta (A, B, C, D)
                </div>

                {data.quiz_options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border transition-all ${
                      opt.is_correct
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="quiz_radio"
                          checked={opt.is_correct}
                          onChange={() => {
                            const updated = data.quiz_options.map((o) => ({
                              ...o,
                              is_correct: o.id === opt.id,
                            }));
                            handleChange({ quiz_options: updated });
                          }}
                          className="text-emerald-500 focus:ring-0"
                        />
                        <span className="text-xs font-mono font-bold text-white uppercase">
                          Opcion {opt.id.toUpperCase()}{' '}
                          {opt.is_correct && (
                            <span className="text-[10px] text-emerald-400 font-normal">
                              [CORRECTA]
                            </span>
                          )}
                        </span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...data.quiz_options];
                          updated[idx].text = e.target.value;
                          handleChange({ quiz_options: updated });
                        }}
                        placeholder="Texto de la opcion..."
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />

                      <input
                        type="text"
                        value={opt.feedback}
                        onChange={(e) => {
                          const updated = [...data.quiz_options];
                          updated[idx].feedback = e.target.value;
                          handleChange({ quiz_options: updated });
                        }}
                        placeholder="Feedback explicativo para el estudiante..."
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FASE 5: PREDICCION DE SALIDA */}
          {blockType === 'prediction' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Enunciado del Desafio de Prediccion *
                </label>
                <textarea
                  rows={2}
                  value={data.prediction_prompt || ''}
                  onChange={(e) => handleChange({ prediction_prompt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Codigo a Inspeccionar
                </label>
                <textarea
                  rows={3}
                  value={data.prediction_code || ''}
                  onChange={(e) => handleChange({ prediction_code: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-rose-300 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Respuesta Esperada *
                  </label>
                  <input
                    type="text"
                    value={data.prediction_answer || ''}
                    onChange={(e) => handleChange({ prediction_answer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Pista (Hint)
                  </label>
                  <input
                    type="text"
                    value={data.prediction_hint || ''}
                    onChange={(e) => handleChange({ prediction_hint: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Modificaciones aplicadas en memoria (Borrador)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
