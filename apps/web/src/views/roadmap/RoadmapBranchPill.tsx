'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CaretDown, Plus, Trash, PencilSimple, Check, CodeSimple } from '@phosphor-icons/react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { KodaLogoSvg } from '@/components/landing/KodaLogoSvg';
import { cn } from '@/lib/utils';

interface RoadmapBranchPillProps {
  isAdmin?: boolean;
  onOpenAddRoute?: () => void;
  onOpenDeleteRoute?: () => void;
}

/** Píldora flotante: marca Koda + selector de rama de carrera + gestion de rutas para administradores. */
export const RoadmapBranchPill: React.FC<RoadmapBranchPillProps> = ({
  isAdmin,
  onOpenAddRoute,
  onOpenDeleteRoute,
}) => {
  const { activeBranchId, setBranch, isLoading } = useRoadmapStore();
  const { draftTracks, updateTrack } = useAdminCurriculumStore();
  const [open, setOpen] = useState(false);
  const [editingTrackSlug, setEditingTrackSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  const allBranches = useMemo(() => {
    const list = [...CAREER_BRANCHES];
    const canonicalIds = new Set(CAREER_BRANCHES.map((b) => b.id));

    draftTracks.forEach((dt) => {
      if (!canonicalIds.has(dt.slug)) {
        list.push({
          id: dt.slug,
          title: dt.name,
          tagline: dt.description || 'Ruta formativa personalizada',
          technologies: dt.badge || 'Desarrollo de Software',
          icon: CodeSimple,
          color: dt.color || '#F59E0B',
          progressPercent: 0,
          earnedStars: 0,
          totalStars: 30,
          completedCourses: 0,
          totalCourses: 1,
          dataset: {
            sectorTitle: dt.name.toUpperCase(),
            progressPercent: 0,
            nodes: [],
            connections: [],
          },
        });
      }
    });

    return list;
  }, [draftTracks]);

  const activeBranch = useMemo(
    () => allBranches.find((b) => b.id === activeBranchId) || allBranches[0] || CAREER_BRANCHES[0],
    [allBranches, activeBranchId]
  );
  const BranchIcon = activeBranch.icon || CodeSimple;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingTrackSlug(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const pick = (id: CareerBranchId) => {
    setBranch(id);
    setOpen(false);
    setEditingTrackSlug(null);
  };

  const handleStartEdit = (e: React.MouseEvent, slug: string, currentName: string) => {
    e.stopPropagation();
    setEditingTrackSlug(slug);
    setEditName(currentName);
  };

  const handleSaveEdit = (slug: string) => {
    if (editName.trim()) {
      updateTrack(slug, { name: editName.trim() });
    }
    setEditingTrackSlug(null);
  };

  return (
    <div ref={boxRef} className="absolute left-2 sm:left-4 top-2 sm:top-4 z-20">
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-2 sm:px-2.5 py-1 sm:py-1.5 backdrop-blur-xl shadow-xl">
        <div
          aria-label="Koda"
          className="flex items-center select-none px-1 sm:px-1.5 py-0.5"
        >
          <KodaLogoSvg className="h-4 sm:h-5 w-auto select-none" />
        </div>
        <div className="h-3.5 sm:h-4 w-px bg-slate-700/60" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={isLoading}
          aria-expanded={open}
          aria-label={`Rama activa: ${activeBranch.title}. Cambiar de rama`}
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 transition-colors hover:bg-slate-800/60 cursor-pointer"
        >
          <span className="shrink-0 flex items-center justify-center" style={{ color: activeBranch.color }}>
            <BranchIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          </span>
          <span className="hidden md:block max-w-36 truncate font-mono text-xs font-bold text-white">
            {activeBranch.title}
          </span>
          <CaretDown className={cn('h-3 sm:h-3.5 w-3 sm:w-3.5 text-slate-400 transition-transform', open && 'rotate-180 text-slate-200')} />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 sm:w-80 space-y-2 rounded-2xl border border-slate-700/60 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl animate-fadeIn">
          <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Especialidades y Rutas
            </span>
            {isAdmin && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                ADMIN
              </span>
            )}
          </div>

          <div className="space-y-1">
            {allBranches.map((b) => {
              const Icon = b.icon || CodeSimple;
              const current = b.id === activeBranchId;
              const isEditing = editingTrackSlug === b.id;

              return (
                <div
                  key={b.id}
                  className={cn(
                    'group/track relative flex items-center gap-2 rounded-xl p-2 transition-colors',
                    current ? 'bg-orange-500/15 border border-orange-500/30 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => pick(b.id)}
                    aria-current={current || undefined}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left cursor-pointer"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${b.color}20`, color: b.color }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(b.id);
                            if (e.key === 'Escape') setEditingTrackSlug(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-0.5 rounded bg-slate-950 border border-amber-500/60 font-mono text-xs text-white focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="block truncate font-mono text-xs font-bold">{b.title}</span>
                          <span className="block truncate font-mono text-[10px] text-slate-500">{b.progressPercent}% completado</span>
                        </>
                      )}
                    </span>
                    {current && !isEditing && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
                    )}
                  </button>

                  {/* Acciones de Edicion Rapida para Admin */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover/track:opacity-100 transition-opacity">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(b.id)}
                          className="p-1 rounded text-amber-300 hover:bg-amber-500/20"
                          title="Guardar nombre"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(e, b.id, b.title)}
                          className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                          title="Renombrar especialidad"
                        >
                          <PencilSimple className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Espacio Administrativo: Añadir Nueva Ruta, Modificar y Eliminar */}
          {isAdmin && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <p className="px-2 font-mono text-[9px] uppercase tracking-wider text-amber-400/90 font-bold">
                Gestion de Rutas
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenAddRoute?.();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                  title="Añadir una nueva ruta curricular"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>Añadir Ruta</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenDeleteRoute?.();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                  title="Eliminar rutas formativas"
                >
                  <Trash className="w-3 h-3" />
                  <span>Eliminar Ruta</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapBranchPill;
