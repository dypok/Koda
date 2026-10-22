'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Cube,
  FileText,
  Plus,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { AddSelectorModal } from '@/components/admin/AddSelectorModal';
import { DeleteSelectorModal } from '@/components/admin/DeleteSelectorModal';

export default function AdminRutasPage() {
  const {
    draftTracks,
    draftModules,
    draftSections,
    selectedTrackSlug,
    selectTrack,
    selectModule,
    selectSection,
    updateTrack,
    updateModule,
  } = useAdminCurriculumStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const activeTrack = draftTracks.find((t) => t.slug === selectedTrackSlug) || draftTracks[0];
  const trackModules = draftModules.filter((m) => m.course_slug === activeTrack?.slug);

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-950 text-slate-100 select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Gestion de Topologia Curricular</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Rutas, Modulos y Secciones
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organiza las secuencias de aprendizaje y gestiona los estados de disponibilidad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-mono text-xs transition-all cursor-pointer"
          >
            <Trash className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      {/* Selector de Rutas en Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-2">
          Rutas Disponibles:
        </span>
        {draftTracks.map((track) => {
          const isSelected = track.slug === activeTrack?.slug;
          return (
            <button
              key={track.slug}
              type="button"
              onClick={() => selectTrack(track.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: track.color }} />
              <span>{track.name}</span>
            </button>
          );
        })}
      </div>

      {/* Informacion de la Ruta Seleccionada */}
      {activeTrack && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {activeTrack.badge}
                </span>
                <h2 className="text-lg font-bold text-white">{activeTrack.name}</h2>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">{activeTrack.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateTrack(activeTrack.slug, { is_active: !activeTrack.is_active })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  activeTrack.is_active
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {activeTrack.is_active ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Publicada</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pausada</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Listado de Modulos y Secciones */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Modulos Curriculares ({trackModules.length})
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {trackModules.map((module) => {
                const moduleSections = draftSections.filter((s) => s.module_slug === module.slug);

                return (
                  <div
                    key={module.slug}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            Posicion #{module.position}
                          </span>
                          <span className="text-sm font-bold text-white">{module.title}</span>
                        </div>
                        <p className="text-xs text-slate-400">{module.objective}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/app/curso/${module.course_slug || 'py-basic'}/seccion/${module.slug}`}
                          onClick={() => selectModule(module.slug)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors"
                        >
                          <PencilSimple className="w-3 h-3" />
                          <span>Editar In-Situ</span>
                        </Link>
                      </div>
                    </div>

                    {/* Subsecciones */}
                    <div className="pl-4 border-l-2 border-slate-800 space-y-1.5">
                      {moduleSections.map((sec) => (
                        <div
                          key={sec.slug}
                          className="flex items-center justify-between text-xs py-1 text-slate-300 hover:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{sec.title}</span>
                            <span className="text-[10px] font-mono text-slate-500">({sec.slug})</span>
                          </div>

                          <Link
                            href={`/app/curso/${module.course_slug || 'py-basic'}/seccion/${sec.slug}`}
                            onClick={() => {
                              selectModule(module.slug);
                              selectSection(sec.slug);
                            }}
                            className="text-[11px] font-mono text-slate-400 hover:text-amber-300"
                          >
                            Tocar para editar
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      <AddSelectorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <DeleteSelectorModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
}
