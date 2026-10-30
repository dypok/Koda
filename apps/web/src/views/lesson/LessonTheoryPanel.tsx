'use client';

import React from 'react';
import {
  Check,
  PencilSimple,
  WarningCircle,
  Sparkle,
  ArrowRight,
} from '@phosphor-icons/react';
import { ContentLesson } from '@/lib/content';
import { InteractiveCodeConsole } from '@/components/lesson/InteractiveCodeConsole';
import { EditableBlockType } from '@/components/admin/LessonInSituInspectorModal';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { cn } from '@/lib/utils';

export interface LessonTheoryPanelProps {
  lesson: ContentLesson;
  language?: string;
  isCompleted?: boolean;
  isEditMode?: boolean;
  mobileTab: 'concept' | 'practice';
  onOpenInspector?: (block: EditableBlockType) => void;
  onSwitchToPractice: () => void;
}

export const LessonTheoryPanel: React.FC<LessonTheoryPanelProps> = ({
  lesson,
  language = 'python',
  isCompleted = false,
  isEditMode = false,
  mobileTab,
  onOpenInspector,
  onSwitchToPractice,
}) => {
  const isLongTitle = lesson.title.length > 40;
  const isLongExplanation = (lesson.explanation?.length ?? 0) > 650;

  return (
    <section
      role="tabpanel"
      aria-label="Teoría"
      className={cn(
        mobileTab === 'concept' ? 'flex' : 'hidden lg:flex',
        'h-full min-h-0 flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-3.5 sm:p-5 lg:p-6 shadow-2xl overflow-hidden'
      )}
    >
      {/* Cabecera fija de la teoría */}
      <div className="shrink-0 space-y-2 pb-3 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-300 uppercase tracking-wider">
              <span>Lección {String(lesson.position ?? 1).padStart(2, '0')}</span>
            </div>
            {isCompleted ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Completada</span>
              </div>
            ) : null}
          </div>

          {isEditMode && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenInspector?.('theory')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Modificar Enunciado y Teoria en 3 pasos"
              >
                <PencilSimple className="w-3.5 h-3.5 text-amber-400" />
                <span>Modificar Enunciado</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenInspector?.('code')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Modificar codigo demostrativo"
              >
                <PencilSimple className="w-3 h-3 text-amber-400" />
                <span>Modificar Codigo</span>
              </button>
            </div>
          )}
        </div>
        <h1
          className={cn(
            'font-display font-black text-white tracking-tight leading-snug',
            isLongTitle ? 'text-lg sm:text-xl lg:text-2xl' : 'text-xl sm:text-2xl lg:text-3xl'
          )}
        >
          <MarkdownContent content={lesson.title} inline />
        </h1>
      </div>

      {/* Cuerpo scrolleable con teoría, errores comunes y consola interactiva */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 sm:space-y-4 pr-1 sm:pr-2 pt-3">
        <div
          className={cn(
            'leading-relaxed text-slate-200',
            isLongExplanation ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
          )}
        >
          <MarkdownContent content={lesson.explanation} />
        </div>

        {lesson.common_errors ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 space-y-1.5 text-xs text-rose-200">
            <div className="flex items-center gap-1.5 font-bold font-mono text-rose-300 uppercase tracking-wider text-[10px]">
              <WarningCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" aria-hidden="true" />
              <span>Cuidado habitual</span>
            </div>
            <div className="leading-relaxed text-slate-300">
              <MarkdownContent content={lesson.common_errors} />
            </div>
          </div>
        ) : null}

        {/* Consola Interactiva Pyodide / Sandbox en vivo */}
        {lesson.examples.length > 0 ? (
          <div className="space-y-3">
            {lesson.examples.map((ex, i) => (
              <InteractiveCodeConsole
                key={`${lesson.id}-${i}`}
                initialCode={ex.code}
                expectedOutput={ex.output}
                explanation={ex.explanation}
                title={ex.title}
                language={ex.language || language}
              />
            ))}
          </div>
        ) : null}

        {lesson.key_takeaways && lesson.key_takeaways.length > 0 ? (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold font-mono text-amber-300 uppercase tracking-wider text-[10px]">
              <Sparkle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>Puntos Clave</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {lesson.key_takeaways.map((point, idx) => (
                <li key={idx} className="leading-relaxed">
                  <MarkdownContent content={point} inline />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Botón de acceso rápido a Práctica sólo en pantallas móviles */}
        <button
          type="button"
          onClick={onSwitchToPractice}
          className="lg:hidden inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 font-mono text-xs font-bold text-orange-300 hover:bg-orange-500/20 transition-colors cursor-pointer"
        >
          <span>Ir al Desafío Práctico</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
