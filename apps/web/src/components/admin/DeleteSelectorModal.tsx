'use client';

import React, { useState } from 'react';
import {
  X,
  Trash,
  Warning,
  ArrowLeft,
  Compass,
  Cube,
  Check,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';

interface DeleteSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeleteType = 'route' | 'module' | null;

export const DeleteSelectorModal: React.FC<DeleteSelectorModalProps> = ({ isOpen, onClose }) => {
  const {
    draftTracks,
    draftModules,
    draftSections,
    draftLessons,
    deleteTrack,
    deleteModule,
  } = useAdminCurriculumStore();

  const [deleteType, setDeleteType] = useState<DeleteType>(null);
  const [selectedTargetSlug, setSelectedTargetSlug] = useState('');
  const [confirmSlugInput, setConfirmSlugInput] = useState('');
  const [archiveOnly, setArchiveOnly] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setDeleteType(null);
    setSelectedTargetSlug('');
    setConfirmSlugInput('');
    setArchiveOnly(false);
    onClose();
  };

  // Calculo de impacto para Ruta
  const trackImpact = React.useMemo(() => {
    if (deleteType !== 'route' || !selectedTargetSlug) return null;
    const modules = draftModules.filter((m) => m.course_slug === selectedTargetSlug);
    const moduleSlugs = modules.map((m) => m.slug);
    const sections = draftSections.filter((s) => moduleSlugs.includes(s.module_slug));
    const sectionSlugs = sections.map((s) => s.slug);
    const lessons = draftLessons.filter((l) => sectionSlugs.includes(l.section_slug));

    return {
      modulesCount: modules.length,
      sectionsCount: sections.length,
      lessonsCount: lessons.length,
    };
  }, [deleteType, selectedTargetSlug, draftModules, draftSections, draftLessons]);

  // Calculo de impacto para Modulo
  const moduleImpact = React.useMemo(() => {
    if (deleteType !== 'module' || !selectedTargetSlug) return null;
    const sections = draftSections.filter((s) => s.module_slug === selectedTargetSlug);
    const sectionSlugs = sections.map((s) => s.slug);
    const lessons = draftLessons.filter((l) => sectionSlugs.includes(l.section_slug));

    return {
      sectionsCount: sections.length,
      lessonsCount: lessons.length,
    };
  }, [deleteType, selectedTargetSlug, draftSections, draftLessons]);

  const canExecute = confirmSlugInput.trim() === selectedTargetSlug && selectedTargetSlug.length > 0;

  const handleExecute = () => {
    if (!canExecute) return;

    if (deleteType === 'route') {
      deleteTrack(selectedTargetSlug);
    } else if (deleteType === 'module') {
      deleteModule(selectedTargetSlug);
    }

    handleReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white font-mono">
              {deleteType === null && 'Eliminar Elemento Curricular'}
              {deleteType === 'route' && 'Eliminar Ruta Formativa'}
              {deleteType === 'module' && 'Eliminar Modulo'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          {/* PASO 1: SELECCION ENTRE MODULOS Y RUTAS */}
          {deleteType === null && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Selecciona la categoria del elemento que necesitas dar de baja:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteType('module');
                    setSelectedTargetSlug(draftModules[0]?.slug || '');
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Cube className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Eliminar Modulo</span>
                      <span className="text-[10px] font-mono font-normal text-rose-400 px-2 py-0.2 bg-rose-500/10 rounded border border-rose-500/20">
                        Destructivo
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Remueve un modulo especifico y sus secciones subordinadas.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteType('route');
                    setSelectedTargetSlug(draftTracks[0]?.slug || '');
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Eliminar Ruta</span>
                      <span className="text-[10px] font-mono font-normal text-rose-400 px-2 py-0.2 bg-rose-500/10 rounded border border-rose-500/20">
                        Alto Impacto
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Remueve un track de carrera completo con todos sus modulos y cursos asociados.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: CONFIRMACION DE BORRADO DE MODULO */}
          {deleteType === 'module' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Selecciona el Modulo a Eliminar *
                </label>
                <select
                  value={selectedTargetSlug}
                  onChange={(e) => {
                    setSelectedTargetSlug(e.target.value);
                    setConfirmSlugInput('');
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {draftModules.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.title} ({m.slug})
                    </option>
                  ))}
                </select>
              </div>

              {moduleImpact && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono space-y-1.5 text-rose-200">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <Warning className="w-4 h-4 shrink-0" />
                    <span>Analisis de Impacto en Cascada:</span>
                  </div>
                  <div className="pl-5 space-y-0.5 text-slate-300">
                    <div>• Secciones afectadas: {moduleImpact.sectionsCount}</div>
                    <div>• Lecciones asociadas: {moduleImpact.lessonsCount}</div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Para confirmar el borrado, escribe el slug exacto:{' '}
                  <span className="text-amber-400 font-bold">{selectedTargetSlug}</span>
                </label>
                <input
                  type="text"
                  value={confirmSlugInput}
                  onChange={(e) => setConfirmSlugInput(e.target.value)}
                  placeholder={selectedTargetSlug}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteType(null);
                    setConfirmSlugInput('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atras</span>
                </button>

                <button
                  type="button"
                  disabled={!canExecute}
                  onClick={handleExecute}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-600/20"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>Confirmar Eliminacion</span>
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: CONFIRMACION DE BORRADO DE RUTA */}
          {deleteType === 'route' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Selecciona la Ruta a Eliminar *
                </label>
                <select
                  value={selectedTargetSlug}
                  onChange={(e) => {
                    setSelectedTargetSlug(e.target.value);
                    setConfirmSlugInput('');
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {draftTracks.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name} ({t.slug})
                    </option>
                  ))}
                </select>
              </div>

              {trackImpact && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono space-y-1.5 text-rose-200">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <Warning className="w-4 h-4 shrink-0" />
                    <span>Analisis de Impacto de Ruta Completa:</span>
                  </div>
                  <div className="pl-5 space-y-0.5 text-slate-300">
                    <div>• Modulos hijos a remover: {trackImpact.modulesCount}</div>
                    <div>• Secciones totales a remover: {trackImpact.sectionsCount}</div>
                    <div>• Lecciones totales asociadas: {trackImpact.lessonsCount}</div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Para confirmar el borrado, escribe el slug exacto:{' '}
                  <span className="text-amber-400 font-bold">{selectedTargetSlug}</span>
                </label>
                <input
                  type="text"
                  value={confirmSlugInput}
                  onChange={(e) => setConfirmSlugInput(e.target.value)}
                  placeholder={selectedTargetSlug}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteType(null);
                    setConfirmSlugInput('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atras</span>
                </button>

                <button
                  type="button"
                  disabled={!canExecute}
                  onClick={handleExecute}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-600/20"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>Confirmar Eliminacion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
