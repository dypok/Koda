'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Key,
  PencilSimple,
  Plus,
  FloppyDisk,
  Eye,
  ShieldCheck,
} from '@phosphor-icons/react';
import { ContentLesson } from '@/lib/content';
import { cn } from '@/lib/utils';

export interface LessonHeaderProps {
  moduleTitle: string;
  sectionTitle: string;
  lessons: ContentLesson[];
  lessonIdx: number;
  completedLessons: Set<string>;
  isAdmin?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;
  pendingChangesCount?: number;
  onToggleEditMode?: () => void;
  onSaveAll?: () => void;
  onAddNewSession?: () => void;
  onSelectLessonIdx: (idx: number) => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  moduleTitle,
  sectionTitle,
  lessons,
  lessonIdx,
  completedLessons,
  isAdmin = false,
  isEditMode = false,
  isDirty = false,
  pendingChangesCount = 0,
  onToggleEditMode,
  onSaveAll,
  onAddNewSession,
  onSelectLessonIdx,
}) => {
  const currentLesson = lessons[lessonIdx];

  return (
    <header className="w-full shrink-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xl">
      <div className="w-full space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(255,106,0,0.3)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la ruta</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 font-semibold">{moduleTitle}</span>
              <span className="text-slate-600">›</span>
              <span className="text-orange-400 font-bold">{sectionTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Controles de Administrador In-Situ en el Header */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>MODO EDITOR</span>
                </div>

                <button
                  type="button"
                  onClick={onToggleEditMode}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                    isEditMode
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                  title={isEditMode ? 'Alternar a vista alumno para resolver' : 'Activar edicion in-situ'}
                >
                  {isEditMode ? <PencilSimple className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isEditMode ? 'Editando' : 'Vista Alumno'}</span>
                </button>

                {isDirty && (
                  <button
                    type="button"
                    onClick={onSaveAll}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs font-mono transition-all shadow-md shadow-amber-500/20 cursor-pointer animate-fadeIn"
                    title="Guardar modificaciones"
                  >
                    <FloppyDisk className="w-3.5 h-3.5" />
                    <span>Guardar ({pendingChangesCount})</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>1-4 · Enter</span>
            </div>
            <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
              {currentLesson ? `${String(lessonIdx + 1).padStart(2, '0')}/${String(lessons.length).padStart(2, '0')}` : ''}
            </span>
          </div>
        </div>

        {/* Stepper horizontal con glow naranja e indicación de completitud */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Progreso de lecciones">
          {lessons.map((l, i) => {
            const isDone = completedLessons.has(l.id);
            const isCurrent = i === lessonIdx;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Lección ${i + 1}: ${l.title} ${isDone ? '(Completada)' : ''}`}
                onClick={() => onSelectLessonIdx(i)}
                className={cn(
                  'h-2 flex-1 rounded-full transition-all duration-300 cursor-pointer relative',
                  isCurrent
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(255,106,0,0.8)] ring-1 ring-orange-400/50'
                    : isDone
                    ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-800/80 hover:bg-slate-700'
                )}
                title={`${String(i + 1).padStart(2, '0')}. ${l.title}${isDone ? ' (✓ Completada)' : ''}`}
              />
            );
          })}

          {/* Botón para añadir sesión siguiendo el orden pedagógico */}
          {isAdmin && isEditMode && onAddNewSession && (
            <button
              type="button"
              onClick={onAddNewSession}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold transition-all shrink-0 cursor-pointer"
              title="Añadir nueva sesion con el mismo orden didactico de las anteriores"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir Sesion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
