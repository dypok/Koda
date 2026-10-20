'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  TerminalWindow,
  Bug,
  Code,
  ArrowsDownUp,
  ArrowUp,
  ArrowDown,
  X,
  LinkSimple,
  TextAa,
  Sparkle,
  ListChecks,
} from '@phosphor-icons/react';
import { ContentExercise, shuffled } from '@/lib/content';
import { cn } from '@/lib/utils';
import { renderMarkdownInline } from '@/components/ui/markdown-content';

interface QuestionRendererProps {
  exercise: ContentExercise;
  selectedIds: string[];
  onToggle: (answerId: string) => void;
  onCustomChange?: (val: string | string[]) => void;
  disabled?: boolean;
  pressedIndex?: number | null;
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function getExerciseTypeLabel(type: string): string {
  switch (type) {
    case 'single_choice':
      return 'Opción única';
    case 'multiple_choice':
      return 'Opción múltiple';
    case 'true_false':
      return 'Verdadero / Falso';
    case 'fill_blank':
      return 'Completar código';
    case 'predict_output':
      return 'Predecir salida';
    case 'find_error':
      return 'Detectar error';
    case 'order_lines':
      return 'Ordenar bloques';
    case 'matching':
      return 'Emparejar conceptos';
    case 'select_code':
      return 'Seleccionar código';
    case 'write_code':
      return 'Escribir código';
    case 'small_problem':
      return 'Micro-problema';
    default:
      return 'Ejercicio interactivo';
  }
}

const PAIR_COLORS = [
  'border-orange-500/80 bg-orange-500/15 text-orange-200 ring-1 ring-orange-500/40',
  'border-amber-400/80 bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40',
  'border-emerald-500/80 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/40',
  'border-sky-500/80 bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/40',
  'border-purple-500/80 bg-purple-500/15 text-purple-200 ring-1 ring-purple-500/40',
  'border-rose-500/80 bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/40',
];

/**
 * Renderiza los 11 tipos de pregunta canónicos del contrato JSON (29_QUESTION_JSON_CONTRACT.md §4):
 * single_choice, multiple_choice, true_false, fill_blank, predict_output,
 * find_error, order_lines, matching, select_code, write_code, small_problem.
 */
export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  exercise,
  selectedIds,
  onToggle,
  onCustomChange,
  disabled = false,
  pressedIndex = null,
}) => {
  const type = exercise.type || 'single_choice';
  const multi = type === 'multiple_choice';
  const options = exercise.answers ?? [];
  const isLongOptions = options.some((o) => (o.body?.length ?? 0) > 70);

  const updateCustom = (val: string | string[]) => {
    if (disabled) return;
    if (onCustomChange) {
      onCustomChange(val);
    } else if (typeof val === 'string') {
      onToggle(val);
    }
  };

  // Estado local para inputs de texto / código sincronizado con selectedIds
  const [textValue, setTextValue] = useState<string>(() => {
    if (selectedIds[0]) return selectedIds[0];
    if (type === 'write_code' && exercise.starter_code) return exercise.starter_code;
    return '';
  });

  useEffect(() => {
    if (selectedIds.length === 0) {
      if (type === 'write_code' && exercise.starter_code) {
        setTextValue(exercise.starter_code);
      } else {
        setTextValue('');
      }
    } else if (selectedIds.length === 1 && typeof selectedIds[0] === 'string') {
      // No sobrescribir si es un ID de opción en fill_blank con chips
      const isOptionId = options.some((o) => o.id === selectedIds[0]);
      if (!isOptionId) {
        setTextValue(selectedIds[0]);
      }
    }
  }, [exercise.id, selectedIds, type, exercise.starter_code, options]);

  // Estado local para matching: columna izquierda activa
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  useEffect(() => {
    setActiveLeftId(null);
  }, [exercise.id]);

  // Barajado determinista para bloques de order_lines y columna derecha de matching
  const shuffledBlocks = useMemo(() => {
    if (!exercise.blocks || exercise.blocks.length === 0) return [];
    const seed = exercise.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 17);
    return shuffled(exercise.blocks, seed);
  }, [exercise.id, exercise.blocks]);

  const shuffledRightPairs = useMemo(() => {
    if (!exercise.pairs || exercise.pairs.length === 0) return [];
    const seed = exercise.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 31);
    return shuffled(
      exercise.pairs.map((p) => p.right),
      seed
    );
  }, [exercise.id, exercise.pairs]);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. VISOR: ORDER_LINES (Parsons Problem)
  // ─────────────────────────────────────────────────────────────────────────
  if (type === 'order_lines' && shuffledBlocks.length > 0) {
    const blockById = new Map(shuffledBlocks.map((b) => [b.id, b]));
    const availableBlocks = shuffledBlocks.filter((b) => !selectedIds.includes(b.id));
    const orderedBlocks = selectedIds
      .map((id) => blockById.get(id))
      .filter((b): b is NonNullable<typeof b> => Boolean(b));

    const handleAddBlock = (id: string) => {
      if (disabled || selectedIds.includes(id)) return;
      updateCustom([...selectedIds, id]);
    };

    const handleRemoveBlock = (id: string) => {
      if (disabled) return;
      updateCustom(selectedIds.filter((item) => item !== id));
    };

    const handleMoveBlock = (idx: number, direction: -1 | 1) => {
      if (disabled) return;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= selectedIds.length) return;
      const next = [...selectedIds];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      updateCustom(next);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <ArrowsDownUp className="w-4 h-4" />
            Haz clic en los bloques para construir la secuencia en orden
          </span>
          {selectedIds.length > 0 && !disabled ? (
            <button
              type="button"
              onClick={() => updateCustom([])}
              className="text-[11px] text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
            >
              Reiniciar orden
            </button>
          ) : null}
        </div>

        {/* Zona de secuencia construida */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-2 min-h-[120px]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Tu secuencia ordenada ({orderedBlocks.length}/{shuffledBlocks.length})
          </div>
          {orderedBlocks.length === 0 ? (
            <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-slate-800 text-xs font-mono text-slate-500">
              Selecciona bloques de abajo para añadirlos aquí…
            </div>
          ) : (
            <div className="space-y-2">
              {orderedBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-orange-500/50 bg-orange-500/10 px-3 py-2.5 font-mono text-xs sm:text-sm text-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-orange-500 text-slate-950 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <code className="break-all text-amber-200">{block.body}</code>
                  </div>
                  {!disabled ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label="Mover arriba"
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, -1)}
                        className="p-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:border-orange-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Mover abajo"
                        disabled={idx === orderedBlocks.length - 1}
                        onClick={() => handleMoveBlock(idx, 1)}
                        className="p-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:border-orange-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Quitar bloque"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="p-1 rounded border border-slate-700 bg-slate-900 text-rose-300 hover:border-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bloques disponibles */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Bloques disponibles
          </div>
          <div className="grid grid-cols-1 gap-2">
            {availableBlocks.map((block) => (
              <button
                key={block.id}
                type="button"
                disabled={disabled}
                onClick={() => handleAddBlock(block.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-left font-mono text-xs sm:text-sm text-slate-200 hover:border-orange-500/60 hover:bg-slate-900 hover:translate-x-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <code>{block.body}</code>
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider shrink-0">
                  + Añadir
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. VISOR: MATCHING (Emparejar columnas)
  // ─────────────────────────────────────────────────────────────────────────
  if (type === 'matching' && exercise.pairs && exercise.pairs.length > 0) {
    const pairs = exercise.pairs;
    // Mapas de emparejamiento actual desde selectedIds ("leftId:rightId")
    const leftToRight = new Map<string, string>();
    const rightToLeft = new Map<string, string>();
    const pairIndexByLeft = new Map<string, number>();

    selectedIds.forEach((entry, idx) => {
      const [l, r] = entry.split(':');
      if (l && r) {
        leftToRight.set(l, r);
        rightToLeft.set(r, l);
        pairIndexByLeft.set(l, idx);
      }
    });

    const handleLeftClick = (leftId: string) => {
      if (disabled) return;
      if (leftToRight.has(leftId)) {
        // Desemparejar si ya estaba vinculado
        updateCustom(selectedIds.filter((s) => !s.startsWith(`${leftId}:`)));
        setActiveLeftId(leftId);
        return;
      }
      setActiveLeftId((prev) => (prev === leftId ? null : leftId));
    };

    const handleRightClick = (rightId: string) => {
      if (disabled) return;
      if (!activeLeftId) {
        // Si hace clic en uno de la derecha ya emparejado, lo desempareja
        if (rightToLeft.has(rightId)) {
          updateCustom(selectedIds.filter((s) => !s.endsWith(`:${rightId}`)));
        }
        return;
      }
      // Limpiar vínculos previos de activeLeftId o rightId y agregar el nuevo par
      const filtered = selectedIds.filter(
        (s) => !s.startsWith(`${activeLeftId}:`) && !s.endsWith(`:${rightId}`)
      );
      updateCustom([...filtered, `${activeLeftId}:${rightId}`]);
      setActiveLeftId(null);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <LinkSimple className="w-4 h-4" />
            Selecciona un elemento izquierdo y luego su pareja a la derecha ({selectedIds.length}/{pairs.length})
          </span>
          {selectedIds.length > 0 && !disabled ? (
            <button
              type="button"
              onClick={() => {
                updateCustom([]);
                setActiveLeftId(null);
              }}
              className="text-[11px] text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
            >
              Limpiar pares
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Columna Izquierda */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Concepto / Código
            </div>
            {pairs.map((p) => {
              const isSelectedLeft = activeLeftId === p.left.id;
              const isPaired = leftToRight.has(p.left.id);
              const pIdx = pairIndexByLeft.get(p.left.id) ?? 0;
              const colorClass = PAIR_COLORS[pIdx % PAIR_COLORS.length];

              return (
                <button
                  key={p.left.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleLeftClick(p.left.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left font-mono text-xs sm:text-sm transition-all cursor-pointer min-h-[52px]',
                    isSelectedLeft
                      ? 'border-orange-500 bg-orange-500/20 text-white ring-2 ring-orange-500/50 shadow-[0_0_15px_rgba(255,106,0,0.3)]'
                      : isPaired
                      ? colorClass
                      : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-orange-500/50 hover:bg-slate-900'
                  )}
                >
                  <span className="break-words">{renderMarkdownInline(p.left.body)}</span>
                  {isPaired ? (
                    <span className="shrink-0 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono font-bold">
                      #{pIdx + 1}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Columna Derecha */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Definición / Resultado
            </div>
            {shuffledRightPairs.map((rightItem) => {
              const linkedLeftId = rightToLeft.get(rightItem.id);
              const isPaired = Boolean(linkedLeftId);
              const pIdx = linkedLeftId ? pairIndexByLeft.get(linkedLeftId) ?? 0 : 0;
              const colorClass = PAIR_COLORS[pIdx % PAIR_COLORS.length];

              return (
                <button
                  key={rightItem.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRightClick(rightItem.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left font-mono text-xs sm:text-sm transition-all cursor-pointer min-h-[52px]',
                    isPaired
                      ? colorClass
                      : activeLeftId
                      ? 'border-amber-500/40 bg-slate-900/90 text-slate-100 hover:border-orange-400 hover:bg-orange-500/10'
                      : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700'
                  )}
                >
                  <span className="break-words">{renderMarkdownInline(rightItem.body)}</span>
                  {isPaired ? (
                    <span className="shrink-0 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono font-bold">
                      #{pIdx + 1}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. VISOR: WRITE_CODE (Editor de código interactivo)
  // ─────────────────────────────────────────────────────────────────────────
  if (type === 'write_code' && options.length < 2) {
    return (
      <div className="space-y-3">
        {exercise.prompt_code ? (
          <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
            <code>{exercise.prompt_code}</code>
          </pre>
        ) : null}

        <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/70 px-3.5 py-2 text-[11px] font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-orange-300 font-bold">
              <Code className="w-3.5 h-3.5" />
              Editor de Solución
            </span>
            {exercise.starter_code && !disabled ? (
              <button
                type="button"
                onClick={() => {
                  setTextValue(exercise.starter_code || '');
                  updateCustom(exercise.starter_code || '');
                }}
                className="text-[10px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                Restaurar plantilla
              </button>
            ) : null}
          </div>
          <textarea
            aria-label="Editor de código de respuesta"
            disabled={disabled}
            rows={5}
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              updateCustom(e.target.value);
            }}
            placeholder="# Escribe tu código aquí..."
            className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-amber-200 placeholder:text-slate-600 focus:outline-none resize-y leading-relaxed"
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. RENDERIZADO DEL BLOQUE DE CÓDIGO CONTEXTUAL (prompt_code)
  //    Con soporte especial para find_error (líneas numeradas) y fill_blank (hueco inline)
  // ─────────────────────────────────────────────────────────────────────────
  const renderPromptCode = () => {
    if (!exercise.prompt_code) return null;

    if (type === 'find_error') {
      const lines = exercise.prompt_code.split('\n');
      return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-3.5 py-1.5 text-[11px] font-mono text-rose-300">
            <span className="inline-flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5 text-rose-400" />
              Inspección de código {exercise.line_number ? `· Revisa la línea ${exercise.line_number}` : ''}
            </span>
          </div>
          <div className="p-3 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isTargetLine = exercise.line_number === lineNum;
              return (
                <div
                  key={lineNum}
                  className={cn(
                    'flex items-start gap-3 px-2 py-0.5 rounded',
                    isTargetLine
                      ? 'bg-rose-500/15 border-l-2 border-rose-500 text-rose-100'
                      : 'text-slate-200'
                  )}
                >
                  <span className="w-5 shrink-0 select-none text-right text-xs text-slate-600">
                    {lineNum}
                  </span>
                  <code className="whitespace-pre">{line || ' '}</code>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === 'fill_blank' && /_{3,}/.test(exercise.prompt_code)) {
      const activeOpt = options.find((o) => o.id === selectedIds[0]);
      const filledText = activeOpt ? activeOpt.body : selectedIds[0] || '_____';
      const parts = exercise.prompt_code.split(/_{3,}/);

      return (
        <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
          <code>
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i < parts.length - 1 ? (
                  <span
                    className={cn(
                      'inline-flex items-center rounded px-2 py-0.5 mx-1 font-mono font-bold border transition-all',
                      selectedIds.length > 0
                        ? 'border-orange-500 bg-orange-500/20 text-amber-300 shadow-[0_0_10px_rgba(255,106,0,0.3)]'
                        : 'border-dashed border-slate-600 bg-slate-900 text-slate-400'
                    )}
                  >
                    {renderMarkdownInline(filledText)}
                  </span>
                ) : null}
              </React.Fragment>
            ))}
          </code>
        </pre>
      );
    }

    if (type === 'predict_output' || type === 'small_problem') {
      return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-3.5 py-1.5 text-[11px] font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-amber-300">
              <TerminalWindow className="w-3.5 h-3.5" />
              {type === 'predict_output' ? 'Terminal · ¿Qué imprime este código?' : 'Contexto del problema'}
            </span>
            {typeof exercise.epsilon === 'number' ? (
              <span className="text-[10px] text-slate-500">Tolerancia ±{exercise.epsilon}</span>
            ) : null}
          </div>
          <pre className="overflow-x-auto p-3.5 font-mono text-sm leading-relaxed text-amber-200">
            <code>{exercise.prompt_code}</code>
          </pre>
        </div>
      );
    }

    return (
      <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
        <code>{exercise.prompt_code}</code>
      </pre>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 5. VISORES CON ENTRADA DE TEXTO DIRECTA (fill_blank, predict_output, small_problem sin opciones múltiples)
  // ─────────────────────────────────────────────────────────────────────────
  if (
    options.length < 2 &&
    (type === 'fill_blank' || type === 'predict_output' || type === 'small_problem')
  ) {
    return (
      <div className="space-y-3.5">
        {renderPromptCode()}

        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-2">
          <label className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-orange-300">
              <TextAa className="w-3.5 h-3.5" />
              {type === 'fill_blank'
                ? 'Completa el fragmento faltante'
                : type === 'predict_output'
                ? 'Salida esperada en consola'
                : 'Tu respuesta'}
            </span>
            {exercise.case_sensitive ? (
              <span className="text-[10px] text-amber-400/80">Sensible a mayúsculas</span>
            ) : null}
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900 px-3 py-2.5 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
            <span className="font-mono text-xs font-bold text-orange-400 select-none">$</span>
            <input
              type="text"
              disabled={disabled}
              value={textValue}
              onChange={(e) => {
                setTextValue(e.target.value);
                updateCustom(e.target.value);
              }}
              placeholder={
                type === 'fill_blank'
                  ? 'Escribe el código que va en _____'
                  : 'Escribe el resultado exacto...'
              }
              className="w-full bg-transparent font-mono text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback si un ejercicio no tiene opciones ni visores especiales
  if (options.length === 0) {
    return (
      <div className="space-y-3">
        {renderPromptCode()}
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-2">
          <input
            type="text"
            disabled={disabled}
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              updateCustom(e.target.value);
            }}
            placeholder="Escribe tu respuesta..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VISORES BASADOS EN OPCIONES TÁCTILES:
  //    single_choice, multiple_choice, true_false, find_error, select_code,
  //    y fill_blank / predict_output / small_problem cuando traen opciones.
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {renderPromptCode()}

      {multi ? (
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
          <ListChecks className="w-3.5 h-3.5" />
          <span>Selecciona todas las respuestas correctas</span>
        </div>
      ) : null}

      {type === 'select_code' ? (
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md">
          <Sparkle className="w-3.5 h-3.5" />
          <span>Elige el bloque de código con la sintaxis correcta</span>
        </div>
      ) : null}

      <div
        role={multi ? 'group' : 'radiogroup'}
        aria-label="Opciones de respuesta"
        className={cn(
          type === 'fill_blank' && options.length >= 2
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'
            : 'space-y-2.5'
        )}
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
                'group relative flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 min-h-[44px] select-none cursor-pointer',
                isPressed
                  ? 'scale-[0.98] border-orange-500 bg-orange-500/25 text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] ring-2 ring-orange-500/60 translate-x-1.5'
                  : active
                  ? 'border-orange-500/90 bg-orange-500/15 text-white shadow-[0_0_22px_rgba(255,106,0,0.35)] ring-1 ring-orange-500/50 translate-x-1.5'
                  : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-orange-500/60 hover:bg-slate-900/90 hover:translate-x-1.5 hover:shadow-[0_0_16px_rgba(255,106,0,0.2)]',
                disabled && 'opacity-60 cursor-default hover:translate-x-0 hover:shadow-none'
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center border text-xs font-mono font-bold transition-all duration-200',
                    multi ? 'rounded-md' : 'rounded-lg',
                    isPressed || active
                      ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-sm'
                      : 'border-slate-700 bg-slate-900 text-slate-400 group-hover:border-orange-400 group-hover:text-orange-300 group-hover:bg-orange-500/10'
                  )}
                >
                  {multi && active ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    opt.label ?? shortcutChar
                  )}
                </span>
                {type === 'select_code' ? (
                  <div className="flex-1 min-w-0 rounded-lg border border-slate-800/90 bg-slate-950/90 px-3 py-2 font-mono text-xs sm:text-sm text-amber-200 overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      <code>{opt.body}</code>
                    </pre>
                  </div>
                ) : (
                  <span
                    className={cn(
                      'font-mono leading-snug break-words group-hover:text-white transition-colors',
                      isLongOptions ? 'text-xs sm:text-[13px]' : 'text-xs sm:text-sm'
                    )}
                  >
                    {renderMarkdownInline(opt.body)}
                  </span>
                )}
              </div>

              {/* Keycap Badge táctil visible en desktop */}
              <div
                aria-hidden="true"
                className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-slate-500"
              >
                {type === 'select_code' && opt.language ? (
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 uppercase">
                    {opt.language}
                  </span>
                ) : null}
                <kbd
                  className={cn(
                    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded border text-[10px] font-mono font-semibold transition-all shadow-sm',
                    isPressed || active
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
